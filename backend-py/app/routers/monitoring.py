"""
Monitoreo de negocios activos — heartbeat + horarios comerciales

POST  /api/tenants/me/ping          — desktop pinga al iniciar/cada hora
GET   /api/tenants/me/hours         — obtener horarios del negocio
PUT   /api/tenants/me/hours         — guardar horarios (7 días)
GET   /api/support/tenants          — panel soporte: lista tenants con estado
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..dependencies import get_current_user, require_support

router = APIRouter(tags=["monitoring"])

# ── DDL idempotente ──────────────────────────────────────────────────────────

_DDL = [
    """
    CREATE TABLE IF NOT EXISTS business_hours (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        day        SMALLINT NOT NULL,
        open_time  TIME NOT NULL DEFAULT '09:00',
        close_time TIME NOT NULL DEFAULT '18:00',
        is_open    BOOLEAN NOT NULL DEFAULT TRUE,
        UNIQUE(tenant_id, day)
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_bh_tenant ON business_hours(tenant_id)",
]

_ddl_done = False

def _ensure_tables(db: Session):
    global _ddl_done
    if _ddl_done:
        return
    for stmt in _DDL:
        db.execute(text(stmt))
    db.commit()
    _ddl_done = True


# ── Schemas ──────────────────────────────────────────────────────────────────

class PingPayload(BaseModel):
    cpu_pct:     Optional[float] = None
    ram_pct:     Optional[float] = None
    disk_pct:    Optional[float] = None
    ram_free_mb: Optional[int]   = None
    db_ok:       Optional[bool]  = None
    version_app: Optional[str]   = None

class DayHours(BaseModel):
    day: int          # 0=Lunes … 6=Domingo
    open_time: str    # "HH:MM"
    close_time: str   # "HH:MM"
    is_open: bool

class HoursBulk(BaseModel):
    hours: List[DayHours]


# ── Endpoints de tenant ──────────────────────────────────────────────────────

@router.post("/api/tenants/me/ping")
def ping(body: PingPayload = PingPayload(), db: Session = Depends(get_db), user=Depends(get_current_user)):
    """El desktop pinga con métricas del sistema."""
    _ensure_tables(db)
    import json
    diag = {k: v for k, v in body.model_dump().items() if v is not None and k != "version_app"}
    updates = ["last_seen_at = NOW()", "last_diagnostic = CAST(:diag AS jsonb)"]
    params: dict = {"id": user.tenant_id, "diag": json.dumps(diag)}
    if body.version_app:
        updates.append("version_app = :ver")
        params["ver"] = body.version_app
    db.execute(text(f"UPDATE tenants SET {', '.join(updates)} WHERE id = :id"), params)
    db.commit()
    return {"ok": True}


@router.get("/api/tenants/me/hours")
def get_hours(db: Session = Depends(get_db), user=Depends(get_current_user)):
    _ensure_tables(db)
    rows = db.execute(
        text("SELECT day, open_time, close_time, is_open FROM business_hours WHERE tenant_id = :tid ORDER BY day"),
        {"tid": user.tenant_id}
    ).fetchall()
    return [
        {
            "day":        r.day,
            "open_time":  str(r.open_time)[:5],
            "close_time": str(r.close_time)[:5],
            "is_open":    r.is_open,
        }
        for r in rows
    ]


@router.put("/api/tenants/me/hours")
def set_hours(body: HoursBulk, db: Session = Depends(get_db), user=Depends(get_current_user)):
    _ensure_tables(db)
    for dh in body.hours:
        db.execute(
            text("""
                INSERT INTO business_hours (tenant_id, day, open_time, close_time, is_open)
                VALUES (:tid, :day, :open, :close, :is_open)
                ON CONFLICT (tenant_id, day)
                DO UPDATE SET open_time = EXCLUDED.open_time,
                              close_time = EXCLUDED.close_time,
                              is_open = EXCLUDED.is_open
            """),
            {
                "tid":     user.tenant_id,
                "day":     dh.day,
                "open":    dh.open_time,
                "close":   dh.close_time,
                "is_open": dh.is_open,
            }
        )
    db.commit()
    return {"ok": True}


# ── Endpoints del panel de soporte ───────────────────────────────────────────

@router.get("/api/support/tenants")
def list_tenants(db: Session = Depends(get_db), _user=Depends(require_support)):
    """
    Devuelve todos los tenants con su último ping y horarios del día actual.
    El frontend calcula si debe alertar.
    """
    _ensure_tables(db)

    # Día actual en Argentina (UTC-3)
    rows = db.execute(text("""
        SELECT
            t.id,
            t.nombre_negocio,
            t.email,
            t.plan,
            t.activo,
            t.last_seen_at,
            t.version_app,
            t.created_at,
            t.last_diagnostic,
            bh.day,
            bh.open_time,
            bh.close_time,
            bh.is_open AS day_open
        FROM tenants t
        LEFT JOIN business_hours bh
            ON bh.tenant_id = t.id
            AND bh.day = EXTRACT(DOW FROM NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires')::int % 7
        WHERE t.activo = TRUE
        ORDER BY t.nombre_negocio
    """)).fetchall()

    return [
        {
            "id":             str(r.id),
            "nombre_negocio": r.nombre_negocio,
            "email":          r.email,
            "plan":           r.plan,
            "last_seen_at":   r.last_seen_at.isoformat() if r.last_seen_at else None,
            "version_app":    r.version_app,
            "created_at":     r.created_at.isoformat(),
            "diagnostic":     r.last_diagnostic or {},
            "hours": {
                "configured": r.day is not None,
                "is_open":    r.day_open,
                "open_time":  str(r.open_time)[:5] if r.open_time else None,
                "close_time": str(r.close_time)[:5] if r.close_time else None,
            }
        }
        for r in rows
    ]
