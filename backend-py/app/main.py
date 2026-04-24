from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routers import auth, productos, proveedores, clientes, ventas, metricas, sync, admin
from .routers import suscripciones, licencias, cuenta, catalog, support, monitoring

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from .startup import seed_support_account
    seed_support_account()
    yield


app = FastAPI(
    title="VentaSimple Panel API",
    version="1.0.0",
    description="API multi-tenant para el panel administrativo de VentaSimple",
    lifespan=lifespan,
)

_allowed_origins = [
    settings.frontend_url,
    "http://localhost:3000",
    # aliases Vercel del frontend
    "https://frontend-eight-lyart-56.vercel.app",
    "https://frontend-julianmolineris-projects.vercel.app",
    "https://frontend-git-main-julianmolineris-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
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
app.include_router(catalog.router)
app.include_router(support.router)
app.include_router(monitoring.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "VentaSimple Panel API v1.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
