"""
Mercado Pago OAuth para negocios clientes.
Completamente separado de /api/suscripciones (que usa el token de VentaSimple).

Flujo:
  1. Frontend llama GET /mercadopago/oauth/start  → recibe {auth_url}
  2. Frontend redirige el browser a auth_url
  3. MP redirige a GET /mercadopago/oauth/callback?code=...&state=...
  4. Backend intercambia code → tokens, encripta, guarda en DB
  5. Redirige al frontend /dashboard/integraciones?mp_connected=1
"""

from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import text

from ..config import get_settings
from ..database import SessionLocal
from ..dependencies import get_current_user, require_owner_or_superadmin
from ..schemas.auth import TokenPayload
from ..utils.mp_encryption import decrypt_token, encrypt_token
from ..utils.mp_connect import (
    MP_AUTH_URL,
    create_qr_order,
    delete_qr_order,
    ensure_store_and_pos,
    exchange_code_for_tokens,
    get_payment,
    get_payments,
    refresh_access_token,
)

router = APIRouter(prefix="/mercadopago", tags=["mercadopago-negocio"])


# ── CSRF state (JWT de 10 min con claim type="mp_state") ──────────────────────

def _make_state(business_id: str, platform: str = "web") -> str:
    s = get_settings()
    return jwt.encode(
        {
            "sub": business_id,
            "type": "mp_state",
            "platform": platform,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
        },
        s.secret_key,
        algorithm="HS256",
    )


def _parse_state(state: str) -> tuple[str, str]:
    """Devuelve (business_id, platform) o lanza 400."""
    s = get_settings()
    try:
        payload = jwt.decode(state, s.secret_key, algorithms=["HS256"])
        if payload.get("type") != "mp_state":
            raise ValueError
        return payload["sub"], payload.get("platform", "web")
    except (JWTError, ValueError, KeyError):
        raise HTTPException(status_code=400, detail="State OAuth inválido o expirado")


# ── DB helpers ────────────────────────────────────────────────────────────────

def _get_account(db, business_id: str) -> Optional[dict]:
    row = db.execute(
        text("""
            SELECT id, business_id, mp_user_id,
                   access_token_encrypted, refresh_token_encrypted,
                   public_key, expires_at, scope,
                   mp_store_id, mp_external_pos_id,
                   connected_at, disconnected_at, status
            FROM business_mercadopago_accounts
            WHERE business_id = :bid
        """),
        {"bid": business_id},
    ).mappings().fetchone()
    return dict(row) if row else None


def _save_account(db, business_id: str, **fields) -> None:
    if _get_account(db, business_id):
        set_clause = ", ".join(f"{k} = :{k}" for k in fields)
        db.execute(
            text(
                f"UPDATE business_mercadopago_accounts "
                f"SET {set_clause} WHERE business_id = :business_id"
            ),
            {"business_id": business_id, **fields},
        )
    else:
        cols = ["business_id"] + list(fields.keys())
        vals = [":business_id"] + [f":{k}" for k in fields]
        db.execute(
            text(
                f"INSERT INTO business_mercadopago_accounts "
                f"({', '.join(cols)}) VALUES ({', '.join(vals)})"
            ),
            {"business_id": business_id, **fields},
        )
    db.commit()


async def _valid_token(db, business_id: str) -> tuple[str, int]:
    """
    Devuelve (access_token_plaintext, mp_user_id).
    Auto-renueva si faltan menos de 7 días para expirar.
    """
    acc = _get_account(db, business_id)
    if not acc or acc["status"] != "connected":
        raise HTTPException(
            status_code=400,
            detail="Mercado Pago no está conectado para este negocio",
        )

    access_token = decrypt_token(acc["access_token_encrypted"])
    mp_user_id = int(acc["mp_user_id"])

    expires_at = acc.get("expires_at")
    if expires_at:
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        time_left = (expires_at - datetime.now(timezone.utc)).total_seconds()
        if time_left < 7 * 86400:  # renovar si quedan menos de 7 días
            try:
                new = await refresh_access_token(
                    decrypt_token(acc["refresh_token_encrypted"])
                )
                access_token = new["access_token"]
                new_exp = datetime.now(timezone.utc) + timedelta(
                    seconds=new.get("expires_in", 15552000)
                )
                _save_account(
                    db,
                    business_id,
                    access_token_encrypted=encrypt_token(access_token),
                    refresh_token_encrypted=encrypt_token(
                        new.get("refresh_token", decrypt_token(acc["refresh_token_encrypted"]))
                    ),
                    expires_at=new_exp.isoformat(),
                )
            except Exception:
                pass  # usar token actual si el refresh falla

    return access_token, mp_user_id


# ── Endpoints OAuth ───────────────────────────────────────────────────────────

@router.get("/oauth/start")
async def oauth_start(
    platform: str = Query("web", description="'desktop' para deep link de vuelta, 'web' para frontend"),
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """
    Genera la URL de autorización de Mercado Pago.
    El frontend/desktop redirige el browser a `auth_url`.
    platform=desktop → callback redirige a ventasimple://mp_oauth?ok=1
    platform=web     → callback redirige a /dashboard/integraciones?mp_connected=1
    """
    s = get_settings()
    if not s.mp_client_id:
        raise HTTPException(status_code=503, detail="MP_CLIENT_ID no configurado")

    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    state = _make_state(business_id, platform=platform)
    auth_url = (
        f"{MP_AUTH_URL}"
        f"?client_id={s.mp_client_id}"
        f"&response_type=code"
        f"&platform_id=mp"
        f"&redirect_uri={s.mp_redirect_uri}"
        f"&state={state}"
    )
    return {"auth_url": auth_url}


@router.get("/oauth/callback")
async def oauth_callback(
    code: Optional[str] = Query(None),
    state: str = Query(...),
    error: Optional[str] = Query(None),
):
    """
    Callback de Mercado Pago. Recibe code, intercambia tokens y redirige al frontend.
    No requiere JWT — el state firmado actúa como prueba de origen.
    """
    s = get_settings()
    frontend = s.frontend_url

    business_id, platform = _parse_state(state)

    def _error_redirect(reason: str) -> RedirectResponse:
        if platform == "desktop":
            return RedirectResponse(
                url=f"ventasimple://mp_oauth?error={reason}", status_code=302
            )
        return RedirectResponse(
            url=f"{frontend}/dashboard/integraciones?mp_error={reason}",
            status_code=302,
        )

    if error:
        return _error_redirect(error)
    if not code:
        return _error_redirect("no_code")

    try:
        tokens = await exchange_code_for_tokens(code)
    except ValueError:
        return _error_redirect("exchange_failed")

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(seconds=tokens.get("expires_in", 15552000))
    ).isoformat()

    db = SessionLocal()
    try:
        _save_account(
            db,
            business_id,
            mp_user_id=tokens.get("user_id"),
            access_token_encrypted=encrypt_token(tokens.get("access_token", "")),
            refresh_token_encrypted=encrypt_token(tokens.get("refresh_token", "")),
            public_key=tokens.get("public_key", ""),
            expires_at=expires_at,
            scope=tokens.get("scope", ""),
            status="connected",
            connected_at=datetime.now(timezone.utc).isoformat(),
            disconnected_at=None,
        )
    finally:
        db.close()

    if platform == "desktop":
        return RedirectResponse(url="ventasimple://mp_oauth?ok=1", status_code=302)
    return RedirectResponse(
        url=f"{frontend}/dashboard/integraciones?mp_connected=1",
        status_code=302,
    )


@router.post("/oauth/disconnect")
async def oauth_disconnect(
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """Desconecta la cuenta de MP del negocio y elimina los tokens del servidor."""
    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        acc = _get_account(db, business_id)
        if not acc:
            raise HTTPException(status_code=404, detail="Cuenta MP no encontrada")

        _save_account(
            db,
            business_id,
            status="disconnected",
            disconnected_at=datetime.now(timezone.utc).isoformat(),
            access_token_encrypted="",
            refresh_token_encrypted="",
            mp_store_id=None,
            mp_external_pos_id=None,
        )
        return {"ok": True}
    finally:
        db.close()


@router.get("/status/{business_id}")
async def mp_status(
    business_id: str,
    current_user: TokenPayload = Depends(get_current_user),
):
    """Estado de la conexión MP del negocio. Owner solo puede ver su propia cuenta."""
    if current_user.rol == "owner" and current_user.tenant_id != business_id:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    db = SessionLocal()
    try:
        acc = _get_account(db, business_id)
        connected = bool(acc and acc["status"] == "connected")
        if not connected:
            return {"connected": False}
        return {
            "connected": True,
            "mp_user_id": acc["mp_user_id"],
            "scope": acc["scope"],
            "public_key": acc["public_key"],
            "connected_at": acc["connected_at"],
            "expires_at": acc["expires_at"],
            "has_pos": bool(acc.get("mp_external_pos_id")),
        }
    finally:
        db.close()


# ── Transacciones ─────────────────────────────────────────────────────────────

@router.get("/transactions")
async def list_transactions(
    offset: int = 0,
    limit: int = 20,
    date_from: Optional[str] = Query(None, description="ISO 8601, ej: 2026-01-01T00:00:00Z"),
    date_to: Optional[str] = Query(None),
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """Lista los cobros del negocio desde su propia cuenta de MP."""
    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        access_token, _ = await _valid_token(db, business_id)
        data = await get_payments(
            access_token, offset=offset, limit=limit,
            date_from=date_from, date_to=date_to,
        )
        results = data.get("results", [])
        return {
            "total": data.get("paging", {}).get("total", 0),
            "offset": offset,
            "limit": limit,
            "results": [
                {
                    "id": p.get("id"),
                    "status": p.get("status"),
                    "status_detail": p.get("status_detail"),
                    "amount": p.get("transaction_amount"),
                    "net_amount": p.get("transaction_details", {}).get("net_received_amount"),
                    "currency": p.get("currency_id"),
                    "payment_method": p.get("payment_method_id"),
                    "payment_type": p.get("payment_type_id"),
                    "external_reference": p.get("external_reference"),
                    "description": p.get("description"),
                    "date_created": p.get("date_created"),
                    "date_approved": p.get("date_approved"),
                    "payer_email": p.get("payer", {}).get("email"),
                    "installments": p.get("installments"),
                }
                for p in results
            ],
        }
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


@router.get("/payment/{payment_id}")
async def payment_detail(
    payment_id: str,
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """Detalle completo de un pago."""
    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        access_token, _ = await _valid_token(db, business_id)
        return await get_payment(access_token, payment_id)
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


# ── QR Dinámico ───────────────────────────────────────────────────────────────

class QRItem(BaseModel):
    title: str
    quantity: int
    unit_price: float
    unit_measure: str = "unit"
    total_amount: float


class QRCreateIn(BaseModel):
    external_reference: str
    title: str
    total_amount: float
    items: list[QRItem]
    expiration_minutes: int = 30


@router.post("/qr/create")
async def qr_create(
    body: QRCreateIn,
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """
    Crea una orden de cobro con QR dinámico en Mercado Pago.
    Auto-crea store + POS en MP la primera vez (se guarda para usos futuros).
    Devuelve qr_data (string EMV que el frontend codifica como imagen QR).
    """
    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        access_token, mp_user_id = await _valid_token(db, business_id)
        acc = _get_account(db, business_id)

        external_pos_id = acc.get("mp_external_pos_id")
        if not external_pos_id:
            external_pos_id = f"VS_{business_id[:8].upper()}"
            store_id = await ensure_store_and_pos(access_token, mp_user_id, external_pos_id)
            _save_account(
                db, business_id,
                mp_external_pos_id=external_pos_id,
                mp_store_id=store_id,
            )

        s = get_settings()
        notif_url = (
            f"{s.webhook_public_url}/mercadopago/qr/webhook"
            if s.webhook_public_url
            else None
        )

        result = await create_qr_order(
            access_token,
            mp_user_id,
            external_pos_id,
            external_reference=body.external_reference,
            title=body.title,
            total_amount=body.total_amount,
            items=[item.model_dump() for item in body.items],
            notification_url=notif_url,
            expiration_minutes=body.expiration_minutes,
        )
        return {
            "qr_data": result.get("qr_data"),
            "in_store_order_id": result.get("in_store_order_id"),
            "external_pos_id": external_pos_id,
        }
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


@router.delete("/qr/cancel")
async def qr_cancel(
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """Cancela la orden activa del QR (el QR queda vacío hasta la próxima venta)."""
    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        access_token, mp_user_id = await _valid_token(db, business_id)
        acc = _get_account(db, business_id)
        pos_id = acc.get("mp_external_pos_id")
        if not pos_id:
            raise HTTPException(status_code=400, detail="Sin POS configurado")

        await delete_qr_order(access_token, mp_user_id, pos_id)
        return {"ok": True}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    finally:
        db.close()


# ── Webhook QR ────────────────────────────────────────────────────────────────

@router.get("/tokens")
async def get_tokens(
    current_user: TokenPayload = Depends(require_owner_or_superadmin),
):
    """
    Devuelve los tokens desencriptados para que el desktop los guarde localmente.
    Si el POS no existe aún en MP, lo crea automáticamente.
    Solo accesible desde el proceso principal del desktop (no desde el renderer).
    """
    business_id = current_user.tenant_id
    if not business_id:
        raise HTTPException(status_code=400, detail="Sin tenant_id en token")

    db = SessionLocal()
    try:
        acc = _get_account(db, business_id)
        if not acc or acc["status"] != "connected":
            raise HTTPException(status_code=400, detail="Mercado Pago no está conectado")

        access_token = decrypt_token(acc["access_token_encrypted"])
        mp_user_id = int(acc["mp_user_id"])

        pos_id = acc.get("mp_external_pos_id")
        if not pos_id:
            pos_id = f"VS_{business_id[:8].upper()}"
            try:
                store_id = await ensure_store_and_pos(access_token, mp_user_id, pos_id)
                _save_account(db, business_id, mp_external_pos_id=pos_id, mp_store_id=store_id)
            except Exception:
                pos_id = None  # POS creation failed, return without it

        return {
            "access_token": access_token,
            "user_id": mp_user_id,
            "pos_id": pos_id,
        }
    finally:
        db.close()


@router.post("/qr/webhook")
async def qr_webhook(
    request: Request,
    x_signature: Optional[str] = Query(None, alias="x-signature", include_in_schema=False),
    x_request_id: Optional[str] = Query(None, alias="x-request-id", include_in_schema=False),
):
    """
    Recibe notificaciones de pagos/órdenes del QR y Point del negocio.
    Verifica firma cuando MP_QR_WEBHOOK_SECRET está configurado.
    El desktop pollea /payment/:id para confirmar — este endpoint es el receptor oficial.
    """
    import hashlib, hmac as _hmac, logging
    from fastapi import Header as _Header

    s = get_settings()
    body = await request.json()

    # Verificación de firma
    if s.mp_qr_webhook_secret:
        sig_header  = request.headers.get("x-signature", "")
        req_id      = request.headers.get("x-request-id", "")
        data_id     = str(body.get("data", {}).get("id") or body.get("id") or "")
        if sig_header and req_id and data_id:
            parts = dict(p.split("=", 1) for p in sig_header.split(",") if "=" in p)
            ts       = parts.get("ts", "")
            received = parts.get("v1", "")
            template = f"id:{data_id};request-id:{req_id};ts:{ts}"
            expected = _hmac.new(
                s.mp_qr_webhook_secret.encode(),
                template.encode(),
                hashlib.sha256,
            ).hexdigest()
            if not _hmac.compare_digest(expected, received):
                logging.getLogger(__name__).warning("[qr_webhook] Firma inválida — rechazado")
                raise HTTPException(status_code=400, detail="Firma del webhook inválida")

    # El desktop pollea /mercadopago/payment/:id para confirmar el estado.
    # Aquí podríamos emitir un evento futuro (WebSocket/SSE) si se necesita push.
    return {"received": True}
