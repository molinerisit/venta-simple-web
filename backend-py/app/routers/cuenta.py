"""
Router: /api/cuenta — endpoints para el tenant autenticado.
Incluye: licencia activa, token de activación desktop.
"""
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import get_db
from ..dependencies import get_current_user
from ..schemas.auth import TokenPayload
from ..utils.security import create_access_token
from ..config import get_settings

router = APIRouter(prefix="/api/cuenta", tags=["cuenta"])


@router.get("/licencia")
def get_licencia(
    current: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Devuelve la licencia activa del tenant autenticado."""
    if not current.tenant_id:
        raise HTTPException(403, "Solo disponible para tenants")

    lic = db.execute(
        text("""
            SELECT clave, plan, estado, activada_at, expira_at
            FROM licencias
            WHERE tenant_id = :tid AND estado = 'ACTIVA'
            ORDER BY activada_at DESC NULLS LAST
            LIMIT 1
        """),
        {"tid": current.tenant_id},
    ).mappings().fetchone()

    if not lic:
        return {"licencia": None}

    return {
        "licencia": {
            "clave": lic["clave"],
            "plan": lic["plan"],
            "estado": lic["estado"],
            "activada_at": str(lic["activada_at"]) if lic["activada_at"] else None,
            "expira_at": str(lic["expira_at"]) if lic["expira_at"] else None,
        }
    }


@router.post("/desktop-activation-token")
def generar_token_activacion(
    current: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Genera un JWT de corta duración (5 min, un solo uso conceptual)
    para que el desktop lo intercambie por una sesión completa.
    El desktop llama a GET /api/auth/desktop-callback?token=<JWT>
    """
    if not current.tenant_id:
        raise HTTPException(403, "Solo disponible para tenants")

    tenant = db.execute(
        text("SELECT nombre_negocio, plan, activo FROM tenants WHERE id = :id"),
        {"id": current.tenant_id},
    ).mappings().fetchone()

    if not tenant or not tenant["activo"]:
        raise HTTPException(403, "Cuenta suspendida")

    # Token de activación: tipo especial, expira en 5 minutos
    activation_token = create_access_token(
        {
            "sub": current.sub,
            "tenant_id": current.tenant_id,
            "rol": "owner",
            "type": "desktop_activation",
        },
        expires_delta=timedelta(minutes=5),
    )

    settings = get_settings()
    # URL del protocolo custom que abre el desktop
    deep_link = f"ventasimple://activate?token={activation_token}"

    return {
        "activation_token": activation_token,
        "deep_link": deep_link,
        "expires_in": 300,  # segundos
    }
