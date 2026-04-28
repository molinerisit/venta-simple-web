"""
Rutas exclusivas para superadmin — visibilidad global de todos los tenants.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from datetime import datetime, timedelta, timezone
from ..database import get_db
from ..dependencies import require_superadmin
from ..schemas.auth import TokenPayload
from ..utils.security import hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
def stats_globales(
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=10)
    row = db.execute(
        text("""
            SELECT
                (SELECT COUNT(*) FROM tenants)                              AS total,
                (SELECT COUNT(*) FROM tenants WHERE activo = TRUE)          AS activos,
                (SELECT COUNT(*) FROM tenants WHERE last_seen_at > :cutoff) AS online,
                (SELECT COALESCE(SUM(total), 0) FROM ventas WHERE fecha >= NOW() - INTERVAL '30 days' AND estado != 'anulada') AS ventas_30d,
                (SELECT COUNT(*) FROM ventas WHERE fecha >= NOW() - INTERVAL '30 days' AND estado != 'anulada') AS cantidad_ventas_30d,
                (SELECT COUNT(*) FROM productos WHERE activo = TRUE AND deleted_at IS NULL) AS total_productos,
                (SELECT COUNT(*) FROM clientes  WHERE activo = TRUE AND deleted_at IS NULL) AS total_clientes
        """),
        {"cutoff": cutoff},
    ).mappings().fetchone()
    return dict(row)


@router.get("/tenants")
def listar_tenants(
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
    q: Optional[str] = None,
    plan: Optional[str] = None,
):
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=10)
    query = """
        SELECT t.*,
               (t.last_seen_at IS NOT NULL AND t.last_seen_at > :cutoff) AS online,
               (SELECT COUNT(*) FROM ventas v WHERE v.tenant_id = t.id AND v.fecha >= NOW() - INTERVAL '30 days') AS ventas_mes
        FROM tenants t
        WHERE 1=1
    """
    params: dict = {"cutoff": cutoff}
    if q:
        query += " AND (t.nombre_negocio ILIKE :q OR t.email ILIKE :q)"
        params["q"] = f"%{q}%"
    if plan:
        query += " AND t.plan = :plan"
        params["plan"] = plan
    query += " ORDER BY t.created_at DESC"
    return [dict(r) for r in db.execute(text(query), params).mappings().fetchall()]


@router.get("/tenants/{tenant_id}")
def obtener_tenant(
    tenant_id: str,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    tenant = db.execute(
        text("SELECT * FROM tenants WHERE id = :id"),
        {"id": tenant_id},
    ).mappings().fetchone()
    if not tenant:
        raise HTTPException(404, "Tenant no encontrado")

    features = db.execute(
        text("SELECT nombre, habilitado FROM feature_flags WHERE tenant_id = :tid"),
        {"tid": tenant_id},
    ).mappings().fetchall()

    result = dict(tenant)
    result["features"] = {r["nombre"]: r["habilitado"] for r in features}
    return result


@router.put("/tenants/{tenant_id}")
def actualizar_tenant(
    tenant_id: str,
    body: dict,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    allowed = {"nombre_negocio", "plan", "plan_expires_at", "activo"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        raise HTTPException(400, "Sin campos permitidos para actualizar")
    set_clause = ", ".join(f"{k} = :{k}" for k in updates)
    updates["id"] = tenant_id
    db.execute(text(f"UPDATE tenants SET {set_clause} WHERE id = :id"), updates)
    db.commit()
    return {"ok": True}


@router.put("/tenants/{tenant_id}/features/{nombre}")
def set_feature(
    tenant_id: str,
    nombre: str,
    body: dict,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    habilitado = body.get("habilitado", True)
    db.execute(
        text("""
            INSERT INTO feature_flags (tenant_id, nombre, habilitado)
            VALUES (:tid, :nombre, :hab)
            ON CONFLICT (tenant_id, nombre) DO UPDATE SET habilitado = :hab
        """),
        {"tid": tenant_id, "nombre": nombre, "hab": habilitado},
    )
    db.commit()
    return {"ok": True}


@router.get("/tenants/{tenant_id}/metricas")
def metricas_tenant(
    tenant_id: str,
    dias: int = Query(30, ge=1, le=365),
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    row = db.execute(
        text("""
            SELECT
                COALESCE(SUM(total), 0) AS total_ventas,
                COUNT(*)                AS cantidad_ventas,
                COALESCE(AVG(total), 0) AS ticket_promedio
            FROM ventas
            WHERE tenant_id = :tid AND fecha >= NOW() - INTERVAL ':dias days' AND estado != 'anulada'
        """),
        {"tid": tenant_id, "dias": dias},
    ).mappings().fetchone()
    return dict(row) if row else {}


class ActivarLicenciaIn(BaseModel):
    plan: str = "PRO"


@router.post("/tenants/{tenant_id}/licencia")
def admin_activar_licencia(
    tenant_id: str,
    body: ActivarLicenciaIn,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    plan = body.plan.upper()
    if plan not in ("FREE", "BASIC", "PRO", "ENTERPRISE"):
        raise HTTPException(400, "Plan inválido")

    exists = db.execute(
        text("SELECT 1 FROM tenants WHERE id = :tid"),
        {"tid": tenant_id},
    ).fetchone()
    if not exists:
        raise HTTPException(404, "Negocio no encontrado")

    from ..routers.licencias import crear_licencia_para_tenant

    clave = crear_licencia_para_tenant(db, tenant_id, plan)
    db.execute(
        text("""
            UPDATE tenants
            SET plan = :plan, email_verified = TRUE, activo = TRUE,
                plan_expires_at = CASE WHEN :plan != 'FREE'
                    THEN NOW() + INTERVAL '365 days'
                    ELSE plan_expires_at END
            WHERE id = :tid
        """),
        {"plan": plan, "tid": tenant_id},
    )
    db.commit()
    return {"clave": clave, "plan": plan, "ok": True}


@router.post("/admins", status_code=201)
def crear_admin(
    body: dict,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    email = body.get("email")
    password = body.get("password")
    nombre = body.get("nombre", email)
    rol = body.get("rol", "admin")
    if not email or not password:
        raise HTTPException(400, "email y password son requeridos")
    hashed = hash_password(password)
    db.execute(
        text("INSERT INTO panel_admins (email, nombre, password_hash, rol) VALUES (:e, :n, :p, :r)"),
        {"e": email, "n": nombre, "p": hashed, "r": rol},
    )
    db.commit()
    return {"ok": True}
