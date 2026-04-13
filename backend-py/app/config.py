from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./dev.db"
    secret_key: str = "dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24h
    frontend_url: str = "http://localhost:3000"
    # Mercado Pago
    mp_access_token: str = ""
    webhook_public_url: str = ""  # e.g. https://backend.vercel.app
    # Email (Resend)
    resend_api_key: str = ""
    from_email: str = "VentaSimple <onboarding@resend.dev>"

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
