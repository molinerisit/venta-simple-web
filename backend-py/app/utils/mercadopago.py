"""
Wrapper HTTP para la API de Mercado Pago (preapproval / suscripciones).
No depende del SDK oficial; usa httpx directamente contra la API REST.
"""

import httpx
from typing import Optional
from ..config import get_settings

MP_BASE = "https://api.mercadopago.com"


def _headers() -> dict:
    token = get_settings().mp_access_token
    if not token:
        raise RuntimeError("MP_ACCESS_TOKEN no configurado")
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


def _notification_url() -> Optional[str]:
    base = get_settings().webhook_public_url.rstrip("/")
    if base and base.startswith("https://"):
        return f"{base}/api/suscripciones/webhook"
    return None


async def create_preapproval(
    *,
    tenant_id: str,
    plan: str,           # "BASIC" | "PRO" | "ENTERPRISE"
    payer_email: str,
    amount: float,
    currency: str = "ARS",
    back_url: Optional[str] = None,
) -> dict:
    """
    Crea una suscripción recurrente mensual.
    Devuelve {"preapproval_id": str, "init_point": str}.
    """
    payload: dict = {
        "reason": f"VentaSimple · Plan {plan}",
        "external_reference": str(tenant_id),
        "payer_email": payer_email,
        "auto_recurring": {
            "frequency": 1,
            "frequency_type": "months",
            "transaction_amount": float(amount),
            "currency_id": currency.upper(),
        },
    }

    if back_url and back_url.startswith("https://"):
        payload["back_url"] = back_url

    notif = _notification_url()
    if notif:
        payload["notification_url"] = notif

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{MP_BASE}/preapproval",
            headers=_headers(),
            json=payload,
        )

    body = resp.json() if resp.content else {}
    if not resp.is_success:
        raise ValueError(body.get("message", f"MP error {resp.status_code}"))

    preapproval_id = body.get("id")
    init_point = body.get("init_point")
    if not preapproval_id or not init_point:
        raise ValueError("Respuesta inesperada de Mercado Pago")

    return {"preapproval_id": preapproval_id, "init_point": init_point}


async def get_preapproval(preapproval_id: str) -> dict:
    """Obtiene el estado actual de una suscripción."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"{MP_BASE}/preapproval/{preapproval_id}",
            headers=_headers(),
        )
    body = resp.json() if resp.content else {}
    if not resp.is_success:
        raise ValueError(body.get("message", f"MP error {resp.status_code}"))
    return body


async def _update_preapproval_status(preapproval_id: str, status: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.put(
            f"{MP_BASE}/preapproval/{preapproval_id}",
            headers=_headers(),
            json={"status": status},
        )
    body = resp.json() if resp.content else {}
    if not resp.is_success:
        raise ValueError(body.get("message", f"MP error {resp.status_code}"))
    return body


async def cancel_preapproval(preapproval_id: str) -> dict:
    return await _update_preapproval_status(preapproval_id, "cancelled")


async def pause_preapproval(preapproval_id: str) -> dict:
    return await _update_preapproval_status(preapproval_id, "paused")


async def resume_preapproval(preapproval_id: str) -> dict:
    return await _update_preapproval_status(preapproval_id, "authorized")
