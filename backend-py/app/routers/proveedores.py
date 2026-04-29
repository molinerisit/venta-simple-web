import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from ..database import get_db
from ..dependencies import get_current_user
from ..schemas.auth import TokenPayload
from ..schemas.proveedor import ProveedorCreate, ProveedorUpdate

router = APIRouter(prefix="/api/proveedores", tags=["proveedores"])


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
):
    query = "SELECT * FROM proveedores WHERE tenant_id = :tid AND deleted_at IS NULL AND activo = TRUE"
    params: dict = {"tid": tenant_id}
    if q:
        query += " AND nombre ILIKE :q"
        params["q"] = f"%{q}%"
    query += " ORDER BY nombre ASC"
    return [dict(r) for r in db.execute(text(query), params).mappings().fetchall()]


@router.post("", status_code=201)
def crear(body: ProveedorCreate, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            INSERT INTO proveedores (tenant_id, nombre, email, telefono, direccion, cuit, notas, local_id)
            VALUES (:tid, :nombre, :email, :tel, :dir, :cuit, :notas, :local_id)
            RETURNING *
        """),
        {"tid": tenant_id, "nombre": body.nombre, "email": body.email,
         "tel": body.telefono, "dir": body.direccion, "cuit": body.cuit,
         "notas": body.notas, "local_id": body.local_id},
    )
    row = dict(result.mappings().fetchone())
    db.execute(
        text("""
            INSERT INTO sync_log (tenant_id, tabla, registro_id, local_id, operacion, datos, origen)
            VALUES (:tid, 'proveedores', :rid, :local_id, 'INSERT', :datos::jsonb, 'web')
        """),
        {
            "tid": tenant_id, "rid": row["id"], "local_id": body.local_id,
            "datos": json.dumps({
                "nombre": body.nombre, "email": body.email,
                "telefono": body.telefono, "direccion": body.direccion,
                "cuit": body.cuit, "notas": body.notas,
            }),
        },
    )
    db.commit()
    return row


@router.get("/{proveedor_id}")
def obtener(proveedor_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    row = db.execute(
        text("SELECT * FROM proveedores WHERE id = :id AND tenant_id = :tid AND deleted_at IS NULL"),
        {"id": proveedor_id, "tid": tenant_id},
    ).mappings().fetchone()
    if not row:
        raise HTTPException(404, "Proveedor no encontrado")
    return dict(row)


@router.put("/{proveedor_id}")
def actualizar(
    proveedor_id: str,
    body: ProveedorUpdate,
    tenant_id: str = Depends(_tenant),
    db: Session = Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "Sin campos para actualizar")
    set_clause = ", ".join(f"{k} = :{k}" for k in updates)
    updates["id"] = proveedor_id
    updates["tid"] = tenant_id
    result = db.execute(
        text(f"UPDATE proveedores SET {set_clause}, updated_at = NOW() WHERE id = :id AND tenant_id = :tid RETURNING *"),
        updates,
    )
    db.commit()
    row = result.mappings().fetchone()
    if not row:
        raise HTTPException(404, "Proveedor no encontrado")
    row_dict = dict(row)
    log_datos = {k: v for k, v in updates.items() if k not in ("id", "tid")}
    db.execute(
        text("""
            INSERT INTO sync_log (tenant_id, tabla, registro_id, local_id, operacion, datos, origen)
            VALUES (:tid, 'proveedores', :rid, :local_id, 'UPDATE', :datos::jsonb, 'web')
        """),
        {
            "tid": tenant_id, "rid": proveedor_id,
            "local_id": row_dict.get("local_id"),
            "datos": json.dumps(log_datos),
        },
    )
    db.commit()
    return row_dict


@router.delete("/{proveedor_id}", status_code=204)
def eliminar(proveedor_id: str, tenant_id: str = Depends(_tenant), db: Session = Depends(get_db)):
    row = db.execute(
        text("SELECT local_id FROM proveedores WHERE id = :id AND tenant_id = :tid"),
        {"id": proveedor_id, "tid": tenant_id},
    ).mappings().fetchone()
    db.execute(
        text("UPDATE proveedores SET deleted_at = NOW(), activo = FALSE WHERE id = :id AND tenant_id = :tid"),
        {"id": proveedor_id, "tid": tenant_id},
    )
    db.execute(
        text("""
            INSERT INTO sync_log (tenant_id, tabla, registro_id, local_id, operacion, datos, origen)
            VALUES (:tid, 'proveedores', :rid, :local_id, 'DELETE', '{}', 'web')
        """),
        {"tid": tenant_id, "rid": proveedor_id, "local_id": row["local_id"] if row else None},
    )
    db.commit()
