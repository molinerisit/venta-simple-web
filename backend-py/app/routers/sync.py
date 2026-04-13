"""
Endpoints para sincronización del desktop Electron con la nube.
"""
import gzip
import json
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timezone
from ..database import get_db
from ..dependencies import get_current_user
from ..schemas.auth import TokenPayload

router = APIRouter(prefix="/api/sync", tags=["sync"])

ALLOWED_TABLES = {"productos", "proveedores", "clientes", "ventas"}


@router.post("/push")
async def push(
    request: Request,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Recibe un batch de cambios del desktop. Soporta body gzip."""
    if current_user.rol not in ("owner", "superadmin"):
        raise HTTPException(403, "Acceso denegado")

    tenant_id = current_user.tenant_id
    body_bytes = await request.body()

    # Descomprimir si viene gzip
    if request.headers.get("content-encoding") == "gzip":
        body_bytes = gzip.decompress(body_bytes)

    payload = json.loads(body_bytes)
    batch = payload.get("batch", [])
    results = []

    for item in batch:
        tabla     = item.get("tabla")
        operacion = item.get("operacion")
        datos     = item.get("datos", {})
        local_id  = item.get("local_id")
        server_id = item.get("server_id")

        if tabla not in ALLOWED_TABLES:
            results.append({"local_id": local_id, "error": "tabla no permitida"})
            continue

        try:
            new_server_id = _apply_change(db, tenant_id, tabla, operacion, datos, local_id, server_id)
            # Registrar en sync_log
            db.execute(
                text("""
                    INSERT INTO sync_log (tenant_id, tabla, registro_id, local_id, operacion, datos, origen)
                    VALUES (:tid, :tabla, :rid, :lid, :op, :datos::jsonb, 'desktop')
                """),
                {
                    "tid": tenant_id, "tabla": tabla, "rid": new_server_id,
                    "lid": local_id, "op": operacion, "datos": json.dumps(datos),
                },
            )
            results.append({"local_id": local_id, "server_id": str(new_server_id)})
        except Exception as e:
            results.append({"local_id": local_id, "error": str(e)})

    db.commit()
    return {"results": results, "processed": len(results)}


def _apply_change(db, tenant_id, tabla, operacion, datos, local_id, server_id):
    # Siempre scope al tenant
    datos["tenant_id"] = tenant_id

    if operacion == "DELETE":
        if server_id:
            db.execute(
                text(f"UPDATE {tabla} SET deleted_at = NOW() WHERE id = :id AND tenant_id = :tid"),
                {"id": server_id, "tid": tenant_id},
            )
        return server_id

    if operacion == "UPDATE" and server_id:
        allowed_cols = {k: v for k, v in datos.items() if k not in ("id", "tenant_id")}
        set_clause   = ", ".join(f"{k} = :{k}" for k in allowed_cols)
        allowed_cols["id"] = server_id
        allowed_cols["tid"] = tenant_id
        db.execute(
            text(f"UPDATE {tabla} SET {set_clause}, updated_at = NOW() WHERE id = :id AND tenant_id = :tid"),
            allowed_cols,
        )
        return server_id

    # INSERT — verificar si ya existe por local_id
    existing = db.execute(
        text(f"SELECT id FROM {tabla} WHERE local_id = :lid AND tenant_id = :tid"),
        {"lid": local_id, "tid": tenant_id},
    ).fetchone()
    if existing:
        return str(existing[0])

    cols = ", ".join(datos.keys()) + ", local_id"
    vals = ", ".join(f":{k}" for k in datos.keys()) + ", :__local_id"
    datos["__local_id"] = local_id
    result = db.execute(
        text(f"INSERT INTO {tabla} ({cols}) VALUES ({vals}) RETURNING id"),
        datos,
    )
    return str(result.fetchone()[0])


@router.get("/pull")
def pull(
    since: str = Query(..., description="ISO8601 timestamp del último sync"),
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Devuelve cambios hechos en el servidor desde `since` (hechos en el panel web)."""
    if current_user.rol not in ("owner", "superadmin"):
        raise HTTPException(403, "Acceso denegado")
    tenant_id = current_user.tenant_id
    rows = db.execute(
        text("""
            SELECT tabla, registro_id, local_id, operacion, datos, aplicado_at
            FROM sync_log
            WHERE tenant_id = :tid AND origen = 'web' AND aplicado_at > :since
            ORDER BY aplicado_at ASC LIMIT 500
        """),
        {"tid": tenant_id, "since": since},
    ).mappings().fetchall()
    return [dict(r) for r in rows]
