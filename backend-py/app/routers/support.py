"""
Chat de soporte interno — Fase 1
POST /api/support/conversations          — crear/iniciar conversación
POST /api/support/messages               — enviar mensaje
GET  /api/support/messages/{conv_id}     — polling de mensajes (desktop)
GET  /api/support/conversations          — listar conversaciones (panel soporte, auth)
PATCH /api/support/conversations/{id}    — marcar resuelta (panel soporte, auth)
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timezone
from ..database import get_db
from ..dependencies import get_current_user, require_support

router = APIRouter(prefix="/api/support", tags=["support"])

# ── DDL idempotente ──────────────────────────────────────────────────────────
_DDL = [
    """
    CREATE TABLE IF NOT EXISTS support_conversations (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id     TEXT NOT NULL,
        business_name TEXT,
        app_version   TEXT,
        context       JSONB,
        status        TEXT NOT NULL DEFAULT 'active',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_sup_conv_client  ON support_conversations(client_id)",
    "CREATE INDEX IF NOT EXISTS idx_sup_conv_status  ON support_conversations(status)",
    """
    CREATE TABLE IF NOT EXISTS support_messages (
        id              BIGSERIAL PRIMARY KEY,
        conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
        sender          TEXT NOT NULL,
        text            TEXT NOT NULL,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_sup_msg_conv ON support_messages(conversation_id, created_at)",
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

class ConversationCreate(BaseModel):
    client_id: str
    business_name: Optional[str] = None
    app_version: Optional[str] = None
    context: Optional[dict] = None

class MessageCreate(BaseModel):
    conversation_id: str
    sender: str   # 'user' | 'support' | 'system'
    text: str

class ConversationPatch(BaseModel):
    status: str   # 'resolved' | 'active'


# ── Endpoints públicos (desktop) ─────────────────────────────────────────────

@router.post("/conversations")
def create_conversation(body: ConversationCreate, db: Session = Depends(get_db)):
    _ensure_tables(db)
    row = db.execute(
        text("""
            INSERT INTO support_conversations (client_id, business_name, app_version, context)
            VALUES (:client_id, :business_name, :app_version, CAST(:context AS jsonb))
            RETURNING id, created_at
        """),
        {
            "client_id":     body.client_id,
            "business_name": body.business_name,
            "app_version":   body.app_version,
            "context":       __import__('json').dumps(body.context or {}),
        }
    ).fetchone()
    db.commit()
    return {"conversation_id": str(row.id), "created_at": row.created_at.isoformat()}


@router.post("/messages")
def send_message(body: MessageCreate, db: Session = Depends(get_db)):
    _ensure_tables(db)
    # Verify conversation exists
    conv = db.execute(
        text("SELECT id FROM support_conversations WHERE id = :id"),
        {"id": body.conversation_id}
    ).fetchone()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversación no encontrada")

    row = db.execute(
        text("""
            INSERT INTO support_messages (conversation_id, sender, text)
            VALUES (:conv_id, :sender, :text)
            RETURNING id, created_at
        """),
        {"conv_id": body.conversation_id, "sender": body.sender, "text": body.text}
    ).fetchone()

    # Update conversation updated_at
    db.execute(
        text("UPDATE support_conversations SET updated_at = NOW() WHERE id = :id"),
        {"id": body.conversation_id}
    )
    db.commit()
    return {"id": row.id, "created_at": row.created_at.isoformat()}


@router.get("/messages/{conversation_id}")
def get_messages(
    conversation_id: str,
    since: Optional[str] = Query(None, description="ISO timestamp — sólo mensajes posteriores"),
    db: Session = Depends(get_db)
):
    _ensure_tables(db)
    if since:
        rows = db.execute(
            text("""
                SELECT id, sender, text, created_at
                FROM support_messages
                WHERE conversation_id = :conv_id AND created_at > :since
                ORDER BY created_at ASC
            """),
            {"conv_id": conversation_id, "since": since}
        ).fetchall()
    else:
        rows = db.execute(
            text("""
                SELECT id, sender, text, created_at
                FROM support_messages
                WHERE conversation_id = :conv_id
                ORDER BY created_at ASC
            """),
            {"conv_id": conversation_id}
        ).fetchall()

    return [
        {"id": r.id, "sender": r.sender, "text": r.text, "created_at": r.created_at.isoformat()}
        for r in rows
    ]


# ── Endpoints del panel de soporte (requieren auth) ──────────────────────────

@router.get("/conversations")
def list_conversations(
    status: Optional[str] = Query("active"),
    db: Session = Depends(get_db),
    _user = Depends(require_support),
):
    _ensure_tables(db)
    rows = db.execute(
        text("""
            SELECT c.id, c.client_id, c.business_name, c.app_version,
                   c.status, c.created_at, c.updated_at,
                   (SELECT COUNT(*) FROM support_messages m WHERE m.conversation_id = c.id) AS msg_count,
                   (SELECT text FROM support_messages m
                    WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message
            FROM support_conversations c
            WHERE (:status IS NULL OR c.status = :status)
            ORDER BY c.updated_at DESC
            LIMIT 100
        """),
        {"status": status if status != "all" else None}
    ).fetchall()

    return [
        {
            "id":            str(r.id),
            "client_id":     r.client_id,
            "business_name": r.business_name,
            "app_version":   r.app_version,
            "status":        r.status,
            "created_at":    r.created_at.isoformat(),
            "updated_at":    r.updated_at.isoformat(),
            "msg_count":     r.msg_count,
            "last_message":  r.last_message,
        }
        for r in rows
    ]


@router.patch("/conversations/{conversation_id}")
def update_conversation(
    conversation_id: str,
    body: ConversationPatch,
    db: Session = Depends(get_db),
    _user = Depends(require_support),
):
    _ensure_tables(db)
    db.execute(
        text("UPDATE support_conversations SET status = :status, updated_at = NOW() WHERE id = :id"),
        {"status": body.status, "id": conversation_id}
    )
    db.commit()
    return {"ok": True}
