"""
Router: /api/suscripciones
Gestión de suscripciones Mercado Pago (preapproval) para los tenants.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
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

router = APIRouter(prefix="/api/suscripciones", tags=["suscripciones"])

# Precios en ARS por plan
PLAN_PRICES: dict[str, float] = {
    "BASIC":      2999,
    "PRO":        4499,
    "ENTERPRISE": 8999,
}


# ── Schemas ───────────────────────────────────────────────────────────────────

class CrearSuscripcionIn(BaseModel):
    plan: str
    payer_email: Optional[str] = None
    back_url: Optional[str] = None


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
    db = SessionLocal()
    try:
        tenant = _get_tenant_row(db, tenant_id)
        preapproval_id = tenant.get("mp_preapproval_id")

        if not preapproval_id:
            return {"plan": tenant["plan"], "mp_status": None, "preapproval_id": None}

        mp_data = await get_preapproval(preapproval_id)
        return {
            "plan": tenant["plan"],
            "mp_status": mp_data.get("status"),
            "preapproval_id": preapproval_id,
            "next_payment_date": mp_data.get("next_payment_date"),
            "last_modified": mp_data.get("last_modified"),
        }
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
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
async def webhook_mp(request: Request):
    """
    Recibe notificaciones IPN/Webhook de Mercado Pago.
    Actualiza el plan del tenant según el estado de la preapproval.
    """
    body = await request.json()

    # MP envía type=subscription_preapproval y data.id
    event_type = body.get("type", "")
    resource_id = body.get("data", {}).get("id") or body.get("id")

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
