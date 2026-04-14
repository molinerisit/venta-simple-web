import logging
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text

logger = logging.getLogger(__name__)

from ..database import get_db
from ..schemas.auth import LoginRequest, LoginResponse, RegisterRequest
from ..utils.security import verify_password, hash_password, create_access_token
from ..config import get_settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    # panel_admin (superadmin / admin) — sin verificación de email
    admin = db.execute(
        text("SELECT * FROM panel_admins WHERE email = :email"),
        {"email": body.email},
    ).mappings().fetchone()

    if admin and verify_password(body.password, admin["password_hash"]):
        token = create_access_token({
            "sub": admin["email"],
            "rol": admin["rol"],
            "tenant_id": None,
        })
        return LoginResponse(token=token, nombre=admin["nombre"], rol=admin["rol"])

    # Tenant (dueño de negocio)
    tenant = db.execute(
        text("SELECT * FROM tenants WHERE email = :email AND activo = TRUE"),
        {"email": body.email},
    ).mappings().fetchone()

    if tenant and verify_password(body.password, tenant["password_hash"]):
        if not tenant["email_verified"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="EMAIL_NOT_VERIFIED",
            )
        token = create_access_token({
            "sub": tenant["email"],
            "rol": "owner",
            "tenant_id": str(tenant["id"]),
        })
        return LoginResponse(
            token=token,
            nombre=tenant["nombre_negocio"],
            rol="owner",
            tenant_id=str(tenant["id"]),
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas.",
    )


# ── Register ──────────────────────────────────────────────────────────────────

@router.post("/register", status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.execute(
        text("SELECT id, email_verified FROM tenants WHERE email = :email"),
        {"email": body.email},
    ).mappings().fetchone()

    if existing:
        if not existing["email_verified"]:
            # Cuenta sin verificar: reenviar email de verificación
            _send_verification_email(body.email, body.nombre_negocio)
            raise HTTPException(
                status_code=409,
                detail="EMAIL_PENDING_VERIFICATION",
            )
        raise HTTPException(status_code=409, detail="El email ya está registrado.")

    hashed = hash_password(body.password)
    result = db.execute(
        text("""
            INSERT INTO tenants (nombre_negocio, email, password_hash, plan, email_verified)
            VALUES (:nombre, :email, :pass, 'FREE', FALSE)
            RETURNING id
        """),
        {"nombre": body.nombre_negocio, "email": body.email, "pass": hashed},
    )
    tenant_id = result.fetchone()[0]
    db.commit()

    # Feature flags por defecto
    default_features = [
        ("productos", True), ("clientes", True), ("proveedores", True),
        ("ventas", True), ("metricas", True), ("ofertas", False),
        ("lotes", False), ("remoto", False),
    ]
    for nombre, habilitado in default_features:
        db.execute(
            text("""
                INSERT INTO feature_flags (tenant_id, nombre, habilitado)
                VALUES (:tid, :nombre, :hab) ON CONFLICT DO NOTHING
            """),
            {"tid": str(tenant_id), "nombre": nombre, "hab": habilitado},
        )
    db.commit()

    _send_verification_email(body.email, body.nombre_negocio)

    return {"message": "Cuenta creada. Revisá tu email para verificar tu cuenta.", "tenant_id": str(tenant_id)}


def _send_verification_email(email: str, nombre: str):
    settings = get_settings()
    token = create_access_token(
        {"sub": email, "type": "email_verification"},
        expires_delta=timedelta(hours=24),
    )
    verify_url = f"{settings.frontend_url}/verify-email?token={token}"
    from ..utils.email import send_verification
    try:
        send_verification(email, nombre, verify_url)
    except Exception as exc:
        logger.error("Error enviando email de verificación a %s: %s", email, exc, exc_info=True)


# ── Verificar email ───────────────────────────────────────────────────────────

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise HTTPException(status_code=400, detail="El link es inválido o ya expiró.")

    if payload.get("type") != "email_verification":
        raise HTTPException(status_code=400, detail="Token inválido.")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Token inválido.")

    tenant = db.execute(
        text("SELECT * FROM tenants WHERE email = :email AND activo = TRUE"),
        {"email": email},
    ).mappings().fetchone()

    if not tenant:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada.")

    if not tenant["email_verified"]:
        db.execute(
            text("UPDATE tenants SET email_verified = TRUE WHERE email = :email"),
            {"email": email},
        )
        db.commit()

        # Generar licencia FREE y enviar email de bienvenida con la clave
        try:
            from ..routers.licencias import crear_licencia_para_tenant
            from ..utils.email import send_license_activated
            settings = get_settings()
            clave = crear_licencia_para_tenant(db, str(tenant["id"]), tenant["plan"] or "FREE")
            db.commit()
            download_url = f"{settings.frontend_url}/descargar"
            send_license_activated(
                email, tenant["nombre_negocio"], clave,
                tenant["plan"] or "FREE", download_url,
            )
        except Exception as exc:
            logger.error("Error post-verificación (licencia/email bienvenida): %s", exc, exc_info=True)

    access_token = create_access_token({
        "sub": tenant["email"],
        "rol": "owner",
        "tenant_id": str(tenant["id"]),
    })
    return {
        "token": access_token,
        "nombre": tenant["nombre_negocio"],
        "rol": "owner",
        "tenant_id": str(tenant["id"]),
        "message": "Email verificado correctamente.",
    }


# ── Reenviar verificación ─────────────────────────────────────────────────────

class ResendVerificationIn(BaseModel):
    email: str

@router.post("/resend-verification", status_code=200)
def resend_verification(body: ResendVerificationIn, db: Session = Depends(get_db)):
    tenant = db.execute(
        text("SELECT email, nombre_negocio, email_verified FROM tenants WHERE email = :email AND activo = TRUE"),
        {"email": body.email},
    ).mappings().fetchone()

    if tenant and not tenant["email_verified"]:
        _send_verification_email(tenant["email"], tenant["nombre_negocio"])

    return {"message": "Si el email existe y no está verificado, recibirás el link nuevamente."}


# ── Recuperación de contraseña ────────────────────────────────────────────────

class ForgotPasswordIn(BaseModel):
    email: str

class ResetPasswordIn(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password", status_code=200)
def forgot_password(body: ForgotPasswordIn, db: Session = Depends(get_db)):
    settings = get_settings()

    admin = db.execute(
        text("SELECT email, nombre FROM panel_admins WHERE email = :email"),
        {"email": body.email},
    ).mappings().fetchone()

    tenant = db.execute(
        text("SELECT email, nombre_negocio FROM tenants WHERE email = :email AND activo = TRUE AND email_verified = TRUE"),
        {"email": body.email},
    ).mappings().fetchone()

    user = admin or tenant
    if user:
        nombre = user.get("nombre") or user.get("nombre_negocio", "")
        reset_token = create_access_token(
            {"sub": body.email, "type": "password_reset"},
            expires_delta=timedelta(hours=1),
        )
        reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
        from ..utils.email import send_password_reset
        try:
            send_password_reset(body.email, nombre, reset_url)
        except Exception as exc:
            logger.error("Error enviando email de reset a %s: %s", body.email, exc, exc_info=True)

    return {"message": "Si el email existe, recibirás las instrucciones en breve."}


@router.get("/desktop-callback")
def desktop_callback(token: str, db: Session = Depends(get_db)):
    """
    El desktop llama a este endpoint con el token de activación obtenido
    vía deep link (ventasimple://activate?token=...).
    Devuelve la sesión completa para que el desktop inicialice su DB local.
    """
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise HTTPException(400, "Token de activación inválido o expirado.")

    if payload.get("type") != "desktop_activation":
        raise HTTPException(400, "Token inválido.")

    tenant_id = payload.get("tenant_id")
    email = payload.get("sub")
    if not tenant_id or not email:
        raise HTTPException(400, "Token inválido.")

    tenant = db.execute(
        text("SELECT * FROM tenants WHERE id = :id AND activo = TRUE"),
        {"id": tenant_id},
    ).mappings().fetchone()

    if not tenant:
        raise HTTPException(403, "Cuenta suspendida o no encontrada.")

    # Obtener licencia activa
    lic = db.execute(
        text("SELECT clave, plan, expira_at FROM licencias WHERE tenant_id = :tid AND estado = 'ACTIVA' ORDER BY activada_at DESC LIMIT 1"),
        {"tid": tenant_id},
    ).mappings().fetchone()

    # Token de sesión normal (24h)
    session_token = create_access_token({"sub": email, "rol": "owner", "tenant_id": tenant_id})

    return {
        "token": session_token,
        "nombre": tenant["nombre_negocio"],
        "email": email,
        "rol": "owner",
        "tenant_id": tenant_id,
        "plan": tenant["plan"],
        "plan_expires_at": str(tenant["plan_expires_at"]) if tenant["plan_expires_at"] else None,
        "licencia": lic["clave"] if lic else None,
    }


@router.post("/reset-password", status_code=200)
def reset_password(body: ResetPasswordIn, db: Session = Depends(get_db)):
    settings = get_settings()

    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres.")

    try:
        payload = jwt.decode(body.token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise HTTPException(status_code=400, detail="El link es inválido o ya expiró.")

    if payload.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Token inválido.")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Token inválido.")

    new_hash = hash_password(body.new_password)

    r1 = db.execute(
        text("UPDATE panel_admins SET password_hash = :h WHERE email = :e"),
        {"h": new_hash, "e": email},
    )
    r2 = db.execute(
        text("UPDATE tenants SET password_hash = :h WHERE email = :e AND activo = TRUE"),
        {"h": new_hash, "e": email},
    )
    db.commit()

    if r1.rowcount == 0 and r2.rowcount == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return {"message": "Contraseña actualizada correctamente."}
