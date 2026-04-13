"""
Router: /api/panel/licencias  (gestión para superadmin)
        /api/auth/activate-license  (activación desde desktop — público)
        /api/auth/validate-session  (desktop verifica plan al sincronizar)
"""
from datetime import timedelta, timezone, datetime

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional

from ..database import get_db
from ..dependencies import require_superadmin, get_current_user
from ..schemas.auth import TokenPayload
from ..utils.licencias import generar_clave
from ..utils.security import hash_password, verify_password, create_access_token

router = APIRouter(tags=["licencias"])


# ── Helper: crear licencia vinculada a tenant ─────────────────────────────────

def crear_licencia_para_tenant(db: Session, tenant_id: str, plan: str) -> str:
    """
    Genera una nueva licencia ACTIVA para el tenant.
    Si ya tiene una activa del mismo plan la devuelve sin duplicar.
    """
    existing = db.execute(
        text("""
            SELECT clave FROM licencias
            WHERE tenant_id = :tid AND estado = 'ACTIVA' AND plan = :plan
            ORDER BY created_at DESC LIMIT 1
        """),
        {"tid": tenant_id, "plan": plan},
    ).fetchone()
    if existing:
        return existing[0]

    clave = _unique_clave(db)
    expira_at = None
    if plan != "FREE":
        expira_at = datetime.now(timezone.utc) + timedelta(days=365)

    db.execute(
        text("""
            INSERT INTO licencias (clave, plan, estado, tenant_id, activada_at, expira_at)
            VALUES (:clave, :plan, 'ACTIVA', :tid, NOW(), :expira_at)
        """),
        {"clave": clave, "plan": plan, "tid": tenant_id, "expira_at": expira_at},
    )
    return clave


def _unique_clave(db: Session) -> str:
    for _ in range(10):
        c = generar_clave()
        if not db.execute(text("SELECT 1 FROM licencias WHERE clave = :c"), {"c": c}).fetchone():
            return c
    raise RuntimeError("No se pudo generar una clave única")


def _default_features(db: Session, tenant_id: str):
    defaults = [
        ("productos", True), ("clientes", True), ("proveedores", True),
        ("ventas", True), ("metricas", True), ("ofertas", False),
        ("lotes", False), ("remoto", False),
    ]
    for nombre, habilitado in defaults:
        db.execute(
            text("""
                INSERT INTO feature_flags (tenant_id, nombre, habilitado)
                VALUES (:tid, :nombre, :hab) ON CONFLICT DO NOTHING
            """),
            {"tid": tenant_id, "nombre": nombre, "hab": habilitado},
        )


# ── Panel admin: gestión de licencias ────────────────────────────────────────

@router.get("/api/panel/licencias")
def listar_licencias(
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        text("""
            SELECT l.id, l.clave, l.plan, l.estado,
                   l.activada_at, l.expira_at, l.created_at,
                   t.nombre_negocio, t.email AS tenant_email
            FROM licencias l
            LEFT JOIN tenants t ON t.id = l.tenant_id
            ORDER BY l.created_at DESC
        """)
    ).mappings().fetchall()
    return [dict(r) for r in rows]


class GenerarLicenciaIn(BaseModel):
    plan: str = "PRO"
    cantidad: int = 1


@router.post("/api/panel/licencias", status_code=201)
def generar_licencias(
    body: GenerarLicenciaIn,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    plan = body.plan.upper()
    if plan not in ("FREE", "BASIC", "PRO", "ENTERPRISE"):
        raise HTTPException(400, "Plan inválido")

    claves = []
    for _ in range(min(body.cantidad, 50)):
        clave = _unique_clave(db)
        db.execute(
            text("INSERT INTO licencias (clave, plan, estado) VALUES (:clave, :plan, 'DISPONIBLE')"),
            {"clave": clave, "plan": plan},
        )
        claves.append(clave)

    db.commit()
    return {"claves": claves, "plan": plan, "cantidad": len(claves)}


@router.delete("/api/panel/licencias/{clave}")
def revocar_licencia(
    clave: str,
    _: TokenPayload = Depends(require_superadmin),
    db: Session = Depends(get_db),
):
    r = db.execute(
        text("UPDATE licencias SET estado = 'REVOCADA' WHERE clave = :c AND estado != 'REVOCADA'"),
        {"c": clave},
    )
    db.commit()
    if r.rowcount == 0:
        raise HTTPException(404, "Licencia no encontrada o ya revocada")
    return {"ok": True}


# ── Activación desde desktop (primer arranque) ────────────────────────────────

class ActivateLicenseIn(BaseModel):
    key: str
    email: str
    password: str
    nombre_negocio: Optional[str] = None  # requerido solo si la cuenta no existe


@router.post("/api/auth/activate-license")
def activate_license(
    body: ActivateLicenseIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Endpoint para el primer arranque del desktop.

    Caso A — usuario ya tiene cuenta web:
        Valida email + contraseña, vincula la licencia al tenant.

    Caso B — usuario no tiene cuenta:
        nombre_negocio requerido; crea cuenta verificada + vincula licencia.

    En ambos casos devuelve el mismo payload que /login.
    """
    clave = body.key.strip().upper()

    # 1. Validar licencia
    lic = db.execute(
        text("SELECT * FROM licencias WHERE clave = :c"),
        {"c": clave},
    ).mappings().fetchone()

    if not lic:
        raise HTTPException(400, "Clave de licencia inválida.")
    if lic["estado"] == "REVOCADA":
        raise HTTPException(400, "Esta licencia fue revocada. Contactá soporte.")
    if lic["estado"] == "ACTIVA" and lic["tenant_id"]:
        # Licencia en uso: solo el mismo tenant puede "re-activarla" (reinstalación)
        owner = db.execute(
            text("SELECT email FROM tenants WHERE id = :id"),
            {"id": str(lic["tenant_id"])},
        ).fetchone()
        if not owner or owner[0] != body.email:
            raise HTTPException(409, "Esta licencia ya está en uso por otra cuenta.")

    plan = lic["plan"]

    # 2. Buscar cuenta existente
    tenant = db.execute(
        text("SELECT * FROM tenants WHERE email = :email AND activo = TRUE"),
        {"email": body.email},
    ).mappings().fetchone()

    if tenant:
        # Caso A: validar contraseña
        if not verify_password(body.password, tenant["password_hash"]):
            raise HTTPException(401, "Contraseña incorrecta.")
        tenant_id = str(tenant["id"])
        nombre = tenant["nombre_negocio"]
        # Actualizar plan si la licencia trae uno mejor o igual
        db.execute(
            text("""
                UPDATE tenants
                SET plan = :plan,
                    email_verified = TRUE,
                    plan_expires_at = CASE WHEN :plan != 'FREE'
                        THEN NOW() + INTERVAL '365 days'
                        ELSE plan_expires_at END
                WHERE id = :tid
            """),
            {"plan": plan, "tid": tenant_id},
        )
    else:
        # Caso B: crear cuenta nueva
        if not body.nombre_negocio:
            raise HTTPException(400, "nombre_negocio es requerido para crear la cuenta.")
        if len(body.password) < 6:
            raise HTTPException(400, "La contraseña debe tener al menos 6 caracteres.")

        conflict = db.execute(
            text("SELECT id FROM tenants WHERE email = :email"),
            {"email": body.email},
        ).fetchone()
        if conflict:
            raise HTTPException(409, "El email ya está registrado pero inactivo. Contactá soporte.")

        hashed = hash_password(body.password)
        plan_expires = (
            datetime.now(timezone.utc) + timedelta(days=365) if plan != "FREE" else None
        )
        result = db.execute(
            text("""
                INSERT INTO tenants (nombre_negocio, email, password_hash, plan, email_verified, plan_expires_at)
                VALUES (:nombre, :email, :pass, :plan, TRUE, :expires)
                RETURNING id
            """),
            {"nombre": body.nombre_negocio, "email": body.email,
             "pass": hashed, "plan": plan, "expires": plan_expires},
        )
        tenant_id = str(result.fetchone()[0])
        nombre = body.nombre_negocio
        _default_features(db, tenant_id)

    # 3. Vincular licencia
    db.execute(
        text("""
            UPDATE licencias
            SET estado = 'ACTIVA', tenant_id = :tid, activada_at = NOW()
            WHERE clave = :c
        """),
        {"tid": tenant_id, "c": clave},
    )
    db.commit()

    # 4. Token de sesión
    token = create_access_token({"sub": body.email, "rol": "owner", "tenant_id": tenant_id})
    return {
        "token": token,
        "nombre": nombre,
        "rol": "owner",
        "tenant_id": tenant_id,
        "plan": plan,
        "licencia": clave,
    }


# ── Validar sesión / plan (desktop al sincronizar) ──────────��─────────────────

@router.get("/api/auth/validate-session")
def validate_session(
    current: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    El desktop lo llama al arrancar o sincronizar para confirmar que el plan sigue activo.
    """
    if not current.tenant_id:
        # superadmin u otro — simplemente ok
        return {"valid": True, "plan": None}

    tenant = db.execute(
        text("SELECT plan, activo, plan_expires_at, email_verified FROM tenants WHERE id = :id"),
        {"id": current.tenant_id},
    ).mappings().fetchone()

    if not tenant or not tenant["activo"]:
        raise HTTPException(403, "Cuenta suspendida.")

    plan_expires = tenant["plan_expires_at"]
    expired = (
        plan_expires is not None
        and plan_expires < datetime.now(timezone.utc)
        and tenant["plan"] != "FREE"
    )

    return {
        "valid": True,
        "plan": tenant["plan"],
        "plan_expires_at": str(plan_expires) if plan_expires else None,
        "plan_expired": expired,
        "tenant_id": current.tenant_id,
    }
