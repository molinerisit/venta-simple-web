from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from datetime import datetime, date
from ..database import get_db
from ..dependencies import get_current_user
from ..schemas.auth import TokenPayload
from ..schemas.venta import VentaCreate

router = APIRouter(prefix="/api/ventas", tags=["ventas"])


def _tenant(
    tenant_id: Optional[str] = Query(None),
    current_user: TokenPayload = Depends(get_current_user),
) -> str:
    if current_user.rol == "superadmin":
        if not tenant_id:
            raise HTTPException(400, "Superadmin debe proveer tenant_id")
        return tenant_id
    return current_user.tenant_id


@router.get("")
def listar(
    tenant_id: str = Depends(_tenant),
    db: Session = Depends(get_db),
    desde: Optional[date] = None,
    hasta: Optional[date] = None,
    metodo_pago: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    query = "SELECT v.*, c.nombre as cliente_nombre FROM ventas v LEFT JOIN clientes c ON v.cliente_id = c.id WHERE v.tenant_id = :tid"
    params: dict = {"tid": tenant_id}
    if desde:
        query += " AND v.fecha >= :desde"
        params["desde"] = desde
    if hasta:
        query += " AND v.fecha < :hasta + INTERVAL '1 day'"
        params["hasta"] = hasta
    if metodo_pago:
        query += " AND v.metodo_pago = :mp"
        params["mp"] = metodo_pago
    query += " ORDER BY v.fecha DESC LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset
    return [dict(r) for r in db.execute(text(query), params).mappings().fetchall()]


@router.post("", status_code=201)
def crear_venta(
    body: VentaCreate,
    tenant_id: str = Depends(_tenant),
    db: Session = Depends(get_db),
):
    fecha = body.fecha or datetime.utcnow()
    result = db.execute(
        text("""
            INSERT INTO ventas (tenant_id, cliente_id, total, descuento, metodo_pago, estado, notas, fecha, local_id)
            VALUES (:tid, :cid, :total, :desc, :mp, :estado, :notas, :fecha, :local_id)
            RETURNING id
        """),
        {
            "tid": tenant_id, "cid": body.cliente_id, "total": body.total,
            "desc": body.descuento, "mp": body.metodo_pago, "estado": body.estado,
            "notas": body.notas, "fecha": fecha, "local_id": body.local_id,
        },
    )
    venta_id = result.fetchone()[0]

    for item in body.items:
        db.execute(
            text("""
                INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
                VALUES (:vid, :pid, :nombre, :cant, :precio, :sub)
            """),
            {
                "vid": str(venta_id), "pid": item.producto_id,
                "nombre": item.nombre_producto, "cant": item.cantidad,
                "precio": item.precio_unitario, "sub": item.subtotal,
            },
        )
        # Descontar stock
        if item.producto_id:
            db.execute(
                text("UPDATE productos SET stock = GREATEST(0, stock - :cant) WHERE id = :pid AND tenant_id = :tid"),
                {"cant": item.cantidad, "pid": item.producto_id, "tid": tenant_id},
            )

    db.commit()
    return {"id": str(venta_id)}


@router.get("/{venta_id}")
def obtener_venta(venta_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    venta = db.execute(
        text("SELECT * FROM ventas WHERE id = :id AND tenant_id = :tid"),
        {"id": venta_id, "tid": tenant_id},
    ).mappings().fetchone()
    if not venta:
        raise HTTPException(404, "Venta no encontrada")
    items = db.execute(
        text("SELECT * FROM detalle_ventas WHERE venta_id = :vid"),
        {"vid": venta_id},
    ).mappings().fetchall()
    result = dict(venta)
    result["items"] = [dict(i) for i in items]
    return result


@router.delete("/{venta_id}", status_code=204)
def anular_venta(venta_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    # Revertir stock
    items = db.execute(
        text("SELECT * FROM detalle_ventas WHERE venta_id = :vid"),
        {"vid": venta_id},
    ).mappings().fetchall()
    for item in items:
        if item["producto_id"]:
            db.execute(
                text("UPDATE productos SET stock = stock + :cant WHERE id = :pid AND tenant_id = :tid"),
                {"cant": item["cantidad"], "pid": item["producto_id"], "tid": tenant_id},
            )
    db.execute(
        text("UPDATE ventas SET estado = 'anulada' WHERE id = :id AND tenant_id = :tid"),
        {"id": venta_id, "tid": tenant_id},
    )
    db.commit()
