"""
Router: /api/suscripciones
Gestión de suscripciones Mercado Pago (preapproval) para los tenants.
"""

import hashlib
import hmac
import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy import text
from typing import Optional

from ..database import SessionLocal
from ..dependencies import get_current_user, TokenPayload
from ..utils.mercadopago import (
    create_preapproval,
    get_preapproval,
    cancel_preapproval,
    pause_preapproval,
    resume_preapproval,
)
from ..config import get_settings

logger = logging.getLogger(__name__)


def _verify_mp_webhook_signature(
    x_signature: str,
    x_request_id: str,
    data_id: str,
    secret: str,
) -> bool:
    """
    Verifica la firma X-Signature de los webhooks de Mercado Pago.
    Formato: ts=TIMESTAMP,v1=HMAC_SHA256
    Template: "id:{data_id};request-id:{x_request_id};ts:{ts}"
    """
    parts = {}
    for part in x_signature.split(","):
        if "=" in part:
            k, v = part.split("=", 1)
            parts[k.strip()] = v.strip()

    ts = parts.get("ts", "")
    received = parts.get("v1", "")
    if not ts or not received:
        return False

    signed_template = f"id:{data_id};request-id:{x_request_id};ts:{ts}"
    expected = hmac.new(
        secret.encode("utf-8"),
        signed_template.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, received)

router = APIRouter(prefix="/api/suscripciones", tags=["suscripciones"])

# Precios en ARS por plan
PLAN_PRICES: dict[str, float] = {
    "BASIC":      30000,
    "PRO":        55000,
    "ENTERPRISE": 120000,
}

# Cupones de descuento: código (uppercase) → porcentaje de descuento (0-1)
CUPONES: dict[str, float] = {
    "MILICO": 0.90,
}


# ── Schemas ───────────────────────────────────────────────────────────────────

class CrearSuscripcionIn(BaseModel):
    plan: str
    payer_email: Optional[str] = None
    back_url: Optional[str] = None
    cupon: Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_tenant_row(db, tenant_id: str) -> dict:
    row = db.execute(
        text("SELECT id, email, plan, mp_preapproval_id, activo FROM tenants WHERE id = :id"),
        {"id": tenant_id},
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Tenant no encontrado")
    return row._mapping


def _update_tenant_mp(db, tenant_id: str, **fields) -> None:
    set_clause = ", ".join(f"{k} = :{k}" for k in fields)
    db.execute(
        text(f"UPDATE tenants SET {set_clause} WHERE id = :id"),
        {"id": tenant_id, **fields},
    )
    db.commit()


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/crear")
async def crear_suscripcion(
    body: CrearSuscripcionIn,
    current_user: TokenPayload = Depends(get_current_user),
):
    """
    Crea una preapproval en Mercado Pago y devuelve la init_point para
    que el frontend redirija al usuario a completar el pago.
    Solo owners pueden suscribirse (no superadmin).
    """
    if current_user.rol == "superadmin":
        raise HTTPException(status_code=403, detail="Superadmin no requiere suscripción")

    plan = body.plan.upper()
    if plan not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail=f"Plan inválido. Opciones: {list(PLAN_PRICES)}")

    amount = PLAN_PRICES[plan]
    descuento = 0.0
    cupon_usado = None
    if body.cupon:
        descuento = CUPONES.get(body.cupon.upper(), 0.0)
        if descuento == 0.0:
            raise HTTPException(status_code=400, detail="Cupón inválido o expirado")
        amount = round(amount * (1 - descuento), 2)
        cupon_usado = body.cupon.upper()
    tenant_id = current_user.tenant_id

    db = SessionLocal()
    try:
        tenant = _get_tenant_row(db, tenant_id)
        payer_email = body.payer_email or tenant["email"]

        settings = get_settings()
        back_url = body.back_url or f"{settings.frontend_url}/cuenta?retorno=1"

        result = await create_preapproval(
            tenant_id=tenant_id,
            plan=plan,
            payer_email=str(payer_email),
            amount=amount,
            currency="ARS",
            back_url=back_url,
        )

        # Guardar id de preapproval en el tenant para seguimiento
        _update_tenant_mp(db, tenant_id, mp_preapproval_id=result["preapproval_id"])

        return {
            "init_point": result["init_point"],
            "preapproval_id": result["preapproval_id"],
            "plan": plan,
            "amount": amount,
            "cupon": cupon_usado,
            "descuento": descuento,
        }
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


@router.get("/estado")
async def estado_suscripcion(
    current_user: TokenPayload = Depends(get_current_user),
):
    """
    Devuelve el estado actual de la suscripción del tenant autenticado.
    Consulta directamente a Mercado Pago si hay un preapproval_id.
    """
    if current_user.rol == "superadmin":
        raise HTTPException(status_code=403, detail="Sin suscripción para superadmin")

    tenant_id = current_user.tenant_id
    if not tenant_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        tenant = _get_tenant_row(db, tenant_id)

        # mp_preapproval_id puede no existir en DBs antiguas — fallback a None
        try:
            preapproval_id = tenant.get("mp_preapproval_id")
        except Exception:
            preapproval_id = None

        if not preapproval_id:
            return {"plan": tenant["plan"], "mp_status": None, "preapproval_id": None}

        try:
            mp_data = await get_preapproval(preapproval_id)
        except Exception as mp_err:
            logger.warning("[estado_suscripcion] error consultando MP: %s", mp_err)
            return {
                "plan": tenant["plan"],
                "mp_status": None,
                "preapproval_id": preapproval_id,
            }

        return {
            "plan": tenant["plan"],
            "mp_status": mp_data.get("status"),
            "preapproval_id": preapproval_id,
            "next_payment_date": mp_data.get("next_payment_date"),
            "last_modified": mp_data.get("last_modified"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("[estado_suscripcion] error inesperado: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Error al obtener el estado de la suscripción")
    finally:
        db.close()


@router.post("/cancelar")
async def cancelar_suscripcion(
    current_user: TokenPayload = Depends(get_current_user),
):
    tenant_id = current_user.tenant_id
    db = SessionLocal()
    try:
        tenant = _get_tenant_row(db, tenant_id)
        pid = tenant.get("mp_preapproval_id")
        if not pid:
            raise HTTPException(status_code=400, detail="Sin suscripción activa")

        await cancel_preapproval(pid)
        _update_tenant_mp(db, tenant_id, plan="FREE", plan_expires_at=None)
        return {"ok": True, "status": "cancelled"}
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


@router.post("/pausar")
async def pausar_suscripcion(
    current_user: TokenPayload = Depends(get_current_user),
):
    tenant_id = current_user.tenant_id
    db = SessionLocal()
    try:
        tenant = _get_tenant_row(db, tenant_id)
        pid = tenant.get("mp_preapproval_id")
        if not pid:
            raise HTTPException(status_code=400, detail="Sin suscripción activa")

        await pause_preapproval(pid)
        return {"ok": True, "status": "paused"}
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


@router.post("/reanudar")
async def reanudar_suscripcion(
    current_user: TokenPayload = Depends(get_current_user),
):
    tenant_id = current_user.tenant_id
    db = SessionLocal()
    try:
        tenant = _get_tenant_row(db, tenant_id)
        pid = tenant.get("mp_preapproval_id")
        if not pid:
            raise HTTPException(status_code=400, detail="Sin suscripción activa")

        await resume_preapproval(pid)
        return {"ok": True, "status": "authorized"}
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


@router.post("/webhook")
async def webhook_mp(
    request: Request,
    x_signature: Optional[str] = Header(None, alias="x-signature"),
    x_request_id: Optional[str] = Header(None, alias="x-request-id"),
):
    """
    Recibe notificaciones IPN/Webhook de Mercado Pago.
    Actualiza el plan del tenant según el estado de la preapproval.
    Verifica la firma X-Signature cuando MP_WEBHOOK_SECRET está configurado.
    """
    s = get_settings()
    body = await request.json()

    # MP envía type=subscription_preapproval y data.id
    event_type = body.get("type", "")
    resource_id = body.get("data", {}).get("id") or body.get("id")

    # ── Verificación de firma ────────────────────────────────────────────────
    if s.mp_webhook_secret:
        if not x_signature or not x_request_id or not resource_id:
            logger.warning("[webhook_mp] Firma MP ausente o incompleta — rechazado")
            raise HTTPException(status_code=400, detail="Firma del webhook inválida")
        if not _verify_mp_webhook_signature(
            x_signature, x_request_id, str(resource_id), s.mp_webhook_secret
        ):
            logger.warning("[webhook_mp] Firma MP inválida — rechazado (posible webhook falso)")
            raise HTTPException(status_code=400, detail="Firma del webhook inválida")
    else:
        logger.warning("[webhook_mp] MP_WEBHOOK_SECRET no configurado — verificación de firma deshabilitada")

    if event_type != "subscription_preapproval" or not resource_id:
        return {"received": True}

    db = SessionLocal()
    try:
        mp_data = await get_preapproval(str(resource_id))

        preapproval_id = mp_data.get("id")
        mp_status = mp_data.get("status")            # authorized | paused | cancelled | pending
        external_ref = mp_data.get("external_reference")  # tenant_id

        if not external_ref:
            return {"received": True}

        # Determinar plan desde reason
        reason: str = mp_data.get("reason", "").upper()
        plan = "FREE"
        for p in PLAN_PRICES:
            if p in reason:
                plan = p
                break

        # Calcular fecha de vencimiento (30 días desde hoy si activa)
        expires_sql = (
            "NOW() + INTERVAL '30 days'" if mp_status == "authorized" else "NULL"
        )

        final_plan = plan if mp_status == "authorized" else "FREE"
        db.execute(
            text(
                f"""
                UPDATE tenants
                SET plan = :plan,
                    mp_preapproval_id = :pid,
                    plan_expires_at = {expires_sql},
                    activo = CASE WHEN :mp_status = 'cancelled' THEN FALSE ELSE TRUE END
                WHERE id = :tid
                """
            ),
            {"plan": final_plan, "pid": preapproval_id,
             "mp_status": mp_status, "tid": external_ref},
        )
        db.commit()

        # Si el plan se activó, generar/actualizar licencia y notificar por email
        if mp_status == "authorized":
            try:
                from ..routers.licencias import crear_licencia_para_tenant
                from ..utils.email import send_plan_activated
                from ..config import get_settings as _gs
                from datetime import datetime as _dt, timezone as _tz, timedelta as _td
                tenant_row = db.execute(
                    text("SELECT email, nombre_negocio FROM tenants WHERE id = :tid"),
                    {"tid": external_ref},
                ).mappings().fetchone()
                if tenant_row:
                    s = _gs()
                    crear_licencia_para_tenant(db, external_ref, final_plan)
                    db.commit()
                    renews_at = (_dt.now(_tz.utc) + _td(days=30)).strftime("%d/%m/%Y")
                    cuenta_url = f"{s.frontend_url}/cuenta"
                    send_plan_activated(
                        tenant_row["email"], tenant_row["nombre_negocio"],
                        final_plan, renews_at, cuenta_url,
                    )
            except Exception:
                pass

    except Exception:
        # Nunca devolver error a MP (sino reintenta infinitamente)
        pass
    finally:
        db.close()

    return {"received": True}
