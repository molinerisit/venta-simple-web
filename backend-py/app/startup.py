"""
Seeding de cuentas internas al arrancar el backend.
Se ejecuta una sola vez por proceso; es idempotente.
"""
import logging
import os

from passlib.context import CryptContext
from sqlalchemy import text

logger = logging.getLogger(__name__)

# 14 rounds — solo para la cuenta interna de soporte (operación one-shot al boot)
_strong_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=14)

SUPPORT_EMAIL = "soporte@ventasimple.cloud"
SUPPORT_NOMBRE = "Soporte VentaSimple"
SUPPORT_ROL = "support"


def seed_support_account() -> None:
    password = os.getenv("SUPPORT_PASSWORD", "").strip()
    if not password:
        logger.warning(
            "SUPPORT_PASSWORD no configurado — cuenta %s no creada.", SUPPORT_EMAIL
        )
        return

    from .database import SessionLocal

    db = SessionLocal()
    try:
        existing = db.execute(
            text("SELECT id FROM panel_admins WHERE email = :email"),
            {"email": SUPPORT_EMAIL},
        ).fetchone()

        if existing:
            logger.info("Cuenta de soporte ya existe: %s (sin cambios)", SUPPORT_EMAIL)
            return

        hashed = _strong_ctx.hash(password)
        db.execute(
            text("""
                INSERT INTO panel_admins (email, nombre, password_hash, rol)
                VALUES (:email, :nombre, :hash, :rol)
                ON CONFLICT (email) DO NOTHING
            """),
            {
                "email":  SUPPORT_EMAIL,
                "nombre": SUPPORT_NOMBRE,
                "hash":   hashed,
                "rol":    SUPPORT_ROL,
            },
        )
        db.commit()
        logger.info(
            "Cuenta de soporte creada: %s [rol=%s, bcrypt_rounds=14]",
            SUPPORT_EMAIL, SUPPORT_ROL,
        )
    except Exception as exc:
        db.rollback()
        logger.error("Error al crear cuenta de soporte: %s", exc, exc_info=True)
    finally:
        db.close()
