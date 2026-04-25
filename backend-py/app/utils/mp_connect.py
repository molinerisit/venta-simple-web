"""
HTTP helpers para la API de Mercado Pago usando el token del NEGOCIO CLIENTE.
Completamente separado de utils/mercadopago.py (que usa el token de VentaSimple
para gestionar suscripciones).
"""

from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx

from ..config import get_settings

MP_BASE = "https://api.mercadopago.com"
MP_OAUTH_URL = f"{MP_BASE}/oauth/token"
MP_AUTH_URL = "https://auth.mercadopago.com/authorization"


def _headers(access_token: str) -> dict:
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }


# ── OAuth ─────────────────────────────────────────────────────────────────────

async def exchange_code_for_tokens(code: str) -> dict:
    """Intercambia el authorization code por access_token + refresh_token."""
    s = get_settings()
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            MP_OAUTH_URL,
            data={
                "client_id": s.mp_client_id,
                "client_secret": s.mp_client_secret,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": s.mp_redirect_uri,
            },
        )
    body = resp.json() if resp.content else {}
    if not resp.is_success:
        raise ValueError(body.get("message", f"MP OAuth error {resp.status_code}"))
    return body


async def refresh_access_token(refresh_token: str) -> dict:
    """Renueva el access_token usando el refresh_token."""
    s = get_settings()
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            MP_OAUTH_URL,
            data={
                "client_id": s.mp_client_id,
                "client_secret": s.mp_client_secret,
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
            },
        )
    body = resp.json() if resp.content else {}
    if not resp.is_success:
        raise ValueError(body.get("message", f"MP refresh error {resp.status_code}"))
    return body


# ── Pagos / Transacciones ─────────────────────────────────────────────────────

async def get_payments(
    access_token: str,
    offset: int = 0,
    limit: int = 20,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
) -> dict:
    """Busca cobros del negocio en MP."""
    params: dict = {
        "offset": offset,
        "limit": limit,
        "sort": "date_created",
        "criteria": "desc",
    }
    if date_from:
        params["begin_date"] = date_from
    if date_to:
        params["end_date"] = date_to

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{MP_BASE}/v1/payments/search",
            headers=_headers(access_token),
            params=params,
        )
    if not resp.is_success:
        raise ValueError(f"MP payments error {resp.status_code}")
    return resp.json()


async def get_payment(access_token: str, payment_id: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"{MP_BASE}/v1/payments/{payment_id}",
            headers=_headers(access_token),
        )
    if not resp.is_success:
        raise ValueError(f"MP payment {payment_id} error {resp.status_code}")
    return resp.json()


# ── Instore QR ────────────────────────────────────────────────────────────────

async def ensure_store_and_pos(
    access_token: str,
    mp_user_id: int,
    external_pos_id: str,
) -> int:
    """
    Garantiza que exista un store + POS en MP para este usuario.
    Reutiliza los existentes si ya fueron creados.
    Devuelve el mp_store_id (ID interno de MP).
    """
    # ── 1. ¿Ya existe el POS? ─────────────────────────────────
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            f"{MP_BASE}/pos",
            headers=_headers(access_token),
            params={"external_id": external_pos_id},
        )
    if r.is_success:
        results = r.json().get("results", [])
        if results:
            return int(results[0].get("store_id", 0))

    # ── 2. Buscar store existente ─────────────────────────────
    store_id: Optional[int] = None
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            f"{MP_BASE}/users/{mp_user_id}/stores/search",
            headers=_headers(access_token),
            params={"limit": 1},
        )
    if r.is_success:
        data = r.json()
        results = data.get("results", [])
        if results:
            store_id = int(results[0]["id"])

    # ── 3. Crear store si no existe ───────────────────────────
    if not store_id:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                f"{MP_BASE}/users/{mp_user_id}/stores",
                headers=_headers(access_token),
                json={
                    "name": "VentaSimple",
                    "business_hours": {
                        day: [{"open": "00:00", "close": "23:59"}]
                        for day in (
                            "monday", "tuesday", "wednesday",
                            "thursday", "friday", "saturday", "sunday",
                        )
                    },
                    "location": {
                        "street_number": "0",
                        "street_name": "Sin dirección",
                        "city_name": "Ciudad",
                        "state_id": "AR-B",
                        "latitude": -34.6037,
                        "longitude": -58.3816,
                        "reference": "VentaSimple POS",
                    },
                },
            )
        if not r.is_success:
            body = r.json() if r.content else {}
            raise ValueError(f"No se pudo crear tienda en MP: {body.get('message', r.status_code)}")
        store_id = int(r.json()["id"])

    # ── 4. Crear POS ──────────────────────────────────────────
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            f"{MP_BASE}/pos",
            headers=_headers(access_token),
            json={
                "name": "VentaSimple - Caja 1",
                "external_id": external_pos_id,
                "store_id": store_id,
                "category": 621102,
            },
        )
    if not r.is_success:
        body = r.json() if r.content else {}
        raise ValueError(f"No se pudo crear POS en MP: {body.get('message', r.status_code)}")

    return store_id


async def create_qr_order(
    access_token: str,
    mp_user_id: int,
    external_pos_id: str,
    *,
    external_reference: str,
    title: str,
    total_amount: float,
    items: list,
    notification_url: Optional[str] = None,
    expiration_minutes: int = 30,
) -> dict:
    """
    Crea una orden en el QR dinámico del POS.
    Devuelve {"qr_data": str, "in_store_order_id": str}.
    """
    expires = (
        datetime.now(timezone.utc) + timedelta(minutes=expiration_minutes)
    ).strftime("%Y-%m-%dT%H:%M:%S.000-03:00")

    payload: dict = {
        "external_reference": external_reference,
        "title": title,
        "total_amount": float(total_amount),
        "items": items,
        "expiration_date": expires,
    }
    if notification_url:
        payload["notification_url"] = notification_url

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.put(
            f"{MP_BASE}/instore/orders/qr/seller/collectors"
            f"/{mp_user_id}/pos/{external_pos_id}/qrs",
            headers=_headers(access_token),
            json=payload,
        )
    if not resp.is_success:
        body = resp.json() if resp.content else {}
        raise ValueError(body.get("message", f"MP QR error {resp.status_code}"))
    return resp.json()


async def delete_qr_order(
    access_token: str, mp_user_id: int, external_pos_id: str
) -> None:
    """Elimina la orden activa del QR (el QR vuelve a estado vacío)."""
    async with httpx.AsyncClient(timeout=10) as client:
        await client.delete(
            f"{MP_BASE}/instore/orders/qr/seller/collectors"
            f"/{mp_user_id}/pos/{external_pos_id}/qrs",
            headers=_headers(access_token),
        )
