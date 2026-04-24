"""
Sistema de comandos remotos seguros — soporte → desktop

POST   /api/support/commands/{tenant_id}     — soporte envía comando
GET    /api/tenants/me/commands              — desktop polling (comandos pendientes)
PATCH  /api/tenants/me/commands/{cmd_id}     — desktop reporta resultado
GET    /api/support/commands/{tenant_id}     — historial para el panel
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta
import uuid

from ..database import get_db
from ..dependencies import get_current_user, require_support

router = APIRouter(tags=["remote_commands"])

# ── Whitelist de comandos permitidos ─────────────────────────────────────────
ALLOWED_COMMANDS = {
    "KILL_PORT":       "Liberar un puerto bloqueado (termina el proceso que lo ocupa)",
    "CLEAR_TEMP":      "Limpiar archivos temporales de Windows y la app",
    "CLEAR_LOG":       "Limpiar logs internos de la app (>50MB)",
    "RESTART_SYNC":    "Reiniciar el módulo de sincronización",
    "CHECK_DB":        "Ejecutar VACUUM + integridad en la DB SQLite local",
    "REPORT_FULL":     "Enviar diagnóstico completo inmediato",
    "NOTIFY":          "Mostrar una notificación al usuario (mensaje de soporte)",
}

# ── DDL ───────────────────────────────────────────────────────────────────────
_DDL = ["""
    CREATE TABLE IF NOT EXISTS support_commands (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        command_type TEXT NOT NULL,
        params       JSONB NOT NULL DEFAULT '{}',
        status       TEXT NOT NULL DEFAULT 'pending',
        created_by   TEXT NOT NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        executed_at  TIMESTAMPTZ,
        result       JSONB
    )
""",
    "CREATE INDEX IF NOT EXISTS idx_sc_tenant  ON support_commands(tenant_id, status)",
    "CREATE INDEX IF NOT EXISTS idx_sc_created ON support_commands(created_at DESC)",
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


# ── Schemas ───────────────────────────────────────────────────────────────────

class CommandCreate(BaseModel):
    command_type: str
    params: dict = {}

class CommandResult(BaseModel):
    status: str          # "ok" | "error" | "skipped"
    message: Optional[str] = None
    data: Optional[dict] = None


# ── Endpoints soporte ─────────────────────────────────────────────────────────

@router.post("/api/support/commands/{tenant_id}")
def send_command(
    tenant_id: str,
    body: CommandCreate,
    db: Session = Depends(get_db),
    user=Depends(require_support),
):
    _ensure_tables(db)

    if body.command_type not in ALLOWED_COMMANDS:
        raise HTTPException(400, f"Comando no permitido. Válidos: {list(ALLOWED_COMMANDS)}")

    # Verificar que el tenant existe
    t = db.execute(text("SELECT id FROM tenants WHERE id = :id"), {"id": tenant_id}).fetchone()
    if not t:
        raise HTTPException(404, "Tenant no encontrado")

    row = db.execute(
        text("""
            INSERT INTO support_commands (tenant_id, command_type, params, created_by)
            VALUES (:tid, :cmd, CAST(:params AS jsonb), :by)
            RETURNING id, created_at
        """),
        {
            "tid":    tenant_id,
            "cmd":    body.command_type,
            "params": __import__("json").dumps(body.params),
            "by":     user.sub,
        }
    ).fetchone()
    db.commit()

    return {"id": str(row.id), "created_at": row.created_at.isoformat(), "status": "pending"}


@router.get("/api/support/commands/{tenant_id}")
def get_command_history(
    tenant_id: str,
    db: Session = Depends(get_db),
    _user=Depends(require_support),
):
    _ensure_tables(db)
    rows = db.execute(
        text("""
            SELECT id, command_type, params, status, created_by, created_at, executed_at, result
            FROM support_commands
            WHERE tenant_id = :tid
            ORDER BY created_at DESC
            LIMIT 50
        """),
        {"tid": tenant_id}
    ).fetchall()

    return [
        {
            "id":           str(r.id),
            "command_type": r.command_type,
            "description":  ALLOWED_COMMANDS.get(r.command_type, ""),
            "params":       r.params,
            "status":       r.status,
            "created_by":   r.created_by,
            "created_at":   r.created_at.isoformat(),
            "executed_at":  r.executed_at.isoformat() if r.executed_at else None,
            "result":       r.result,
        }
        for r in rows
    ]


@router.get("/api/support/commands-catalog")
def get_catalog(_user=Depends(require_support)):
    return [{"type": k, "description": v} for k, v in ALLOWED_COMMANDS.items()]


# ── Endpoints desktop ─────────────────────────────────────────────────────────

@router.get("/api/tenants/me/commands")
def poll_commands(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Desktop polling: devuelve comandos pendientes de los últimos 10 minutos."""
    _ensure_tables(db)
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=10)
    rows = db.execute(
        text("""
            SELECT id, command_type, params, created_at
            FROM support_commands
            WHERE tenant_id = :tid
              AND status = 'pending'
              AND created_at > :cutoff
            ORDER BY created_at ASC
        """),
        {"tid": user.tenant_id, "cutoff": cutoff}
    ).fetchall()

    return [
        {
            "id":           str(r.id),
            "command_type": r.command_type,
            "params":       r.params,
            "created_at":   r.created_at.isoformat(),
        }
        for r in rows
    ]


@router.patch("/api/tenants/me/commands/{cmd_id}")
def report_result(
    cmd_id: str,
    body: CommandResult,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Desktop reporta el resultado de un comando ejecutado."""
    _ensure_tables(db)
    db.execute(
        text("""
            UPDATE support_commands
            SET status = :status, executed_at = NOW(),
                result = CAST(:result AS jsonb)
            WHERE id = :id AND tenant_id = :tid AND status = 'pending'
        """),
        {
            "id":     cmd_id,
            "tid":    user.tenant_id,
            "status": "done" if body.status == "ok" else "error",
            "result": __import__("json").dumps({
                "status":  body.status,
                "message": body.message,
                "data":    body.data,
            }),
        }
    )
    db.commit()
    return {"ok": True}
