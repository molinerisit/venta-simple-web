from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from ..database import get_db
from ..dependencies import get_current_user
from ..schemas.auth import TokenPayload
from ..schemas.cliente import ClienteCreate, ClienteUpdate

router = APIRouter(prefix="/api/clientes", tags=["clientes"])


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
    q: Optional[str] = None,
    con_deuda: bool = False,
):
    query = "SELECT * FROM clientes WHERE tenant_id = :tid AND deleted_at IS NULL AND activo = TRUE"
    params: dict = {"tid": tenant_id}
    if q:
        query += " AND (nombre ILIKE :q OR telefono ILIKE :q OR dni ILIKE :q)"
        params["q"] = f"%{q}%"
    if con_deuda:
        query += " AND deuda > 0"
    query += " ORDER BY nombre ASC"
    return [dict(r) for r in db.execute(text(query), params).mappings().fetchall()]


@router.post("", status_code=201)
def crear(body: ClienteCreate, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            INSERT INTO clientes (tenant_id, nombre, email, telefono, direccion, dni, deuda, notas, local_id)
            VALUES (:tid, :nombre, :email, :tel, :dir, :dni, :deuda, :notas, :local_id)
            RETURNING *
        """),
        {"tid": tenant_id, "nombre": body.nombre, "email": body.email,
         "tel": body.telefono, "dir": body.direccion, "dni": body.dni,
         "deuda": body.deuda, "notas": body.notas, "local_id": body.local_id},
    )
    db.commit()
    return dict(result.mappings().fetchone())


@router.get("/{cliente_id}")
def obtener(cliente_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    row = db.execute(
        text("SELECT * FROM clientes WHERE id = :id AND tenant_id = :tid AND deleted_at IS NULL"),
        {"id": cliente_id, "tid": tenant_id},
    ).mappings().fetchone()
    if not row:
        raise HTTPException(404, "Cliente no encontrado")
    return dict(row)


@router.put("/{cliente_id}")
def actualizar(
    cliente_id: str,
    body: ClienteUpdate,
    tenant_id: str = Depends(_tenant),
    db: Session = Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "Sin campos para actualizar")
    set_clause = ", ".join(f"{k} = :{k}" for k in updates)
    updates["id"] = cliente_id
    updates["tid"] = tenant_id
    result = db.execute(
        text(f"UPDATE clientes SET {set_clause}, updated_at = NOW() WHERE id = :id AND tenant_id = :tid RETURNING *"),
        updates,
    )
    db.commit()
    row = result.mappings().fetchone()
    if not row:
        raise HTTPException(404, "Cliente no encontrado")
    return dict(row)


@router.delete("/{cliente_id}", status_code=204)
def eliminar(cliente_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    db.execute(
        text("UPDATE clientes SET deleted_at = NOW(), activo = FALSE WHERE id = :id AND tenant_id = :tid"),
        {"id": cliente_id, "tid": tenant_id},
    )
    db.commit()


@router.get("/{cliente_id}/ventas")
def historial_ventas(cliente_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    rows = db.execute(
        text("SELECT * FROM ventas WHERE cliente_id = :cid AND tenant_id = :tid ORDER BY fecha DESC LIMIT 50"),
        {"cid": cliente_id, "tid": tenant_id},
    ).mappings().fetchall()
    return [dict(r) for r in rows]
