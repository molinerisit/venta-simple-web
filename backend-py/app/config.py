import sys
from functools import lru_cache
from pydantic_settings import BaseSettings

_DEV_SECRET = "dev-secret-change-in-production"


class Settings(BaseSettings):
    database_url: str = "sqlite:///./dev.db"
    secret_key: str = _DEV_SECRET
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24h
    frontend_url: str = "http://localhost:3000"
    # Mercado Pago — token de VentaSimple (suscripciones/preapproval)
    mp_access_token: str = ""
    webhook_public_url: str = ""
    # Secreto para verificar firma de webhooks de MP (configurar en panel MP → Webhooks)
    mp_webhook_secret: str = ""
    # Mercado Pago — OAuth de negocios clientes (cobros / QR)
    mp_client_id: str = ""
    mp_client_secret: str = ""
    mp_redirect_uri: str = "https://api.ventasimple.cloud/mercadopago/oauth/callback"
    # Email (Resend)
    resend_api_key: str = ""
    from_email: str = "VentaSimple <onboarding@resend.dev>"

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    s = Settings()
    if s.secret_key == _DEV_SECRET:
        # En producción Railway/Vercel este valor nunca debería ser el default.
        # Bloqueamos el arranque para forzar la configuración correcta.
        import os
        if os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("VERCEL"):
            print("FATAL: SECRET_KEY no está configurada. Setéala en las variables de entorno.", file=sys.stderr)
            sys.exit(1)
    return s
