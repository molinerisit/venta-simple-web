from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routers import auth, productos, proveedores, clientes, ventas, metricas, sync, admin
from .routers import suscripciones, licencias, cuenta

settings = get_settings()

app = FastAPI(
    title="VentaSimple Panel API",
    version="1.0.0",
    description="API multi-tenant para el panel administrativo de VentaSimple",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(proveedores.router)
app.include_router(clientes.router)
app.include_router(ventas.router)
app.include_router(metricas.router)
app.include_router(sync.router)
app.include_router(admin.router)
app.include_router(suscripciones.router)
app.include_router(licencias.router)
app.include_router(cuenta.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "VentaSimple Panel API v1.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/debug/email")
def debug_email():
    """Diagnóstico temporal — eliminar después de confirmar que el email funciona."""
    import resend as _resend
    settings = get_settings()
    key = settings.resend_api_key
    from_email = settings.from_email
    frontend_url = settings.frontend_url

    key = key.strip()
    from_email = from_email.strip()

    if not key:
        return {"error": "RESEND_API_KEY vacío", "from_email": from_email, "frontend_url": frontend_url}

    _resend.api_key = key
    try:
        r = _resend.Emails.send({
            "from": from_email,
            "to": ["delivered@resend.dev"],
            "subject": "VentaSimple — test diagnóstico",
            "html": "<p>Test desde Vercel</p>",
        })
        return {"ok": True, "resend_id": str(r), "from_email": from_email, "key_prefix": key[:8] + "..."}
    except Exception as exc:
        return {"ok": False, "error": str(exc), "from_email": from_email, "key_prefix": key[:8] + "..."}
