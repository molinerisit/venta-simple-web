from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from ..database import get_db
from ..dependencies import get_current_user, resolve_tenant_id
from ..schemas.auth import TokenPayload
from ..schemas.producto import ProductoCreate, ProductoUpdate, ProductoOut, StockAjuste

router = APIRouter(prefix="/api/productos", tags=["productos"])


def _get_tenant(
    tenant_id: Optional[str] = Query(None),
    current_user: TokenPayload = Depends(get_current_user),
) -> str:
    from ..dependencies import resolve_tenant_id as r
    # inline resolution
    if current_user.rol == "superadmin":
        if not tenant_id:
            raise HTTPException(400, "Superadmin debe proveer tenant_id")
        return tenant_id
    return current_user.tenant_id


@router.get("")
def listar_productos(
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
    q: Optional[str] = None,
    categoria: Optional[str] = None,
    solo_activos: bool = True,
):
    query = "SELECT * FROM productos WHERE tenant_id = :tid AND deleted_at IS NULL"
    params: dict = {"tid": tenant_id}
    if solo_activos:
        query += " AND activo = TRUE"
    if q:
        query += " AND (nombre ILIKE :q OR codigo ILIKE :q)"
        params["q"] = f"%{q}%"
    if categoria:
        query += " AND categoria = :cat"
        params["cat"] = categoria
    query += " ORDER BY nombre ASC"
    rows = db.execute(text(query), params).mappings().fetchall()
    return [dict(r) for r in rows]


@router.post("", status_code=201)
def crear_producto(
    body: ProductoCreate,
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
):
    result = db.execute(
        text("""
            INSERT INTO productos
              (tenant_id, nombre, codigo, precio, precio_costo, stock, stock_minimo,
               categoria, descripcion, unidad, local_id)
            VALUES
              (:tid, :nombre, :codigo, :precio, :precio_costo, :stock, :stock_min,
               :cat, :desc, :unidad, :local_id)
            RETURNING *
        """),
        {
            "tid": tenant_id, "nombre": body.nombre, "codigo": body.codigo,
            "precio": body.precio, "precio_costo": body.precio_costo,
            "stock": body.stock, "stock_min": body.stock_minimo,
            "cat": body.categoria, "desc": body.descripcion,
            "unidad": body.unidad, "local_id": body.local_id,
        },
    )
    db.commit()
    return dict(result.mappings().fetchone())


@router.get("/{producto_id}")
def obtener_producto(
    producto_id: str,
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
):
    row = db.execute(
        text("SELECT * FROM productos WHERE id = :id AND tenant_id = :tid AND deleted_at IS NULL"),
        {"id": producto_id, "tid": tenant_id},
    ).mappings().fetchone()
    if not row:
        raise HTTPException(404, "Producto no encontrado")
    return dict(row)


@router.put("/{producto_id}")
def actualizar_producto(
    producto_id: str,
    body: ProductoUpdate,
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "Sin campos para actualizar")
    set_clause = ", ".join(f"{k} = :{k}" for k in updates)
    updates["id"] = producto_id
    updates["tid"] = tenant_id
    result = db.execute(
        text(f"UPDATE productos SET {set_clause}, updated_at = NOW() WHERE id = :id AND tenant_id = :tid RETURNING *"),
        updates,
    )
    db.commit()
    row = result.mappings().fetchone()
    if not row:
        raise HTTPException(404, "Producto no encontrado")
    return dict(row)


@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(
    producto_id: str,
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
):
    db.execute(
        text("UPDATE productos SET deleted_at = NOW(), activo = FALSE WHERE id = :id AND tenant_id = :tid"),
        {"id": producto_id, "tid": tenant_id},
    )
    db.commit()


@router.post("/{producto_id}/stock")
def ajustar_stock(
    producto_id: str,
    body: StockAjuste,
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
):
    """Ajuste de stock por delta (positivo = entrada, negativo = salida)."""
    result = db.execute(
        text("""
            UPDATE productos
            SET stock = stock + :delta, updated_at = NOW()
            WHERE id = :id AND tenant_id = :tid
            RETURNING stock, nombre
        """),
        {"delta": body.delta, "id": producto_id, "tid": tenant_id},
    ).mappings().fetchone()
    if not result:
        raise HTTPException(404, "Producto no encontrado")
    tipo = "entrada" if body.delta >= 0 else "salida"
    db.execute(
        text("""
            INSERT INTO movimientos_stock (tenant_id, producto_id, tipo, cantidad, motivo)
            VALUES (:tid, :pid, :tipo, :cant, :motivo)
        """),
        {"tid": tenant_id, "pid": producto_id, "tipo": tipo,
         "cant": abs(body.delta), "motivo": body.motivo},
    )
    db.commit()
    return {"stock_nuevo": result["stock"], "nombre": result["nombre"]}


@router.get("/categorias/lista")
def listar_categorias(
    tenant_id: str = Depends(_get_tenant),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        text("SELECT DISTINCT categoria FROM productos WHERE tenant_id = :tid AND categoria IS NOT NULL ORDER BY categoria"),
        {"tid": tenant_id},
    ).fetchall()
    return [r[0] for r in rows]
