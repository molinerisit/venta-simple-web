"""
Catálogo maestro compartido — Phase 1
GET  /api/catalog/barcode/{barcode}   — consulta pública por código de barras
POST /api/catalog/observations        — registra observación anónima desde desktop
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from ..database import get_db

router = APIRouter(prefix="/api/catalog", tags=["catalog"])

# DDL idempotente — se ejecuta una vez por cold start serverless
_DDL = [
    """
    CREATE TABLE IF NOT EXISTS catalog_products (
        id             SERIAL PRIMARY KEY,
        barcode        TEXT NOT NULL UNIQUE,
        canonical_name TEXT NOT NULL,
        department     TEXT,
        family         TEXT,
        brand          TEXT,
        unit           TEXT,
        size           TEXT,
        confidence     FLOAT DEFAULT 0,
        sources_count  INTEGER DEFAULT 1,
        updated_at     TIMESTAMPTZ DEFAULT NOW()
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_catalog_products_barcode ON catalog_products(barcode)",
    """
    CREATE TABLE IF NOT EXISTS catalog_observations (
        id             BIGSERIAL PRIMARY KEY,
        barcode        TEXT NOT NULL,
        raw_name       TEXT,
        raw_department TEXT,
        raw_family     TEXT,
        sale_price     FLOAT,
        country        TEXT,
        province       TEXT,
        city           TEXT,
        geo_bucket     TEXT,
        source_hash    TEXT,
        created_at     TIMESTAMPTZ DEFAULT NOW()
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_catalog_obs_barcode ON catalog_observations(barcode)",
]

_tables_ready = False


def _ensure_tables(db: Session):
    global _tables_ready
    if _tables_ready:
        return
    try:
        for stmt in _DDL:
            db.execute(text(stmt))
        db.commit()
        _tables_ready = True
    except Exception as exc:
        db.rollback()
        print(f"[CATALOG] DDL warning (tables may already exist): {exc}")
        _tables_ready = True  # don't retry on every request


@router.get("/barcode/{barcode}")
def buscar_por_barcode(barcode: str, db: Session = Depends(get_db)):
    _ensure_tables(db)
    barcode = barcode.strip()
    if not barcode or len(barcode) > 60:
        raise HTTPException(400, "Código inválido")
    row = db.execute(
        text("SELECT * FROM catalog_products WHERE barcode = :bc"),
        {"bc": barcode},
    ).mappings().fetchone()
    if not row:
        raise HTTPException(404, "No encontrado en el catálogo")
    return dict(row)


class ObservationIn(BaseModel):
    barcode: str
    raw_name: Optional[str] = None
    raw_department: Optional[str] = None
    raw_family: Optional[str] = None
    sale_price: Optional[float] = None
    country: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    geo_bucket: Optional[str] = None
    source_hash: Optional[str] = None


@router.post("/observations", status_code=201)
def registrar_observacion(obs: ObservationIn, db: Session = Depends(get_db)):
    _ensure_tables(db)
    obs.barcode = obs.barcode.strip()
    if not obs.barcode or len(obs.barcode) > 60:
        raise HTTPException(400, "Código inválido")
    # Evitar spam: un mismo source_hash no puede enviar más de 1 obs por barcode por día
    if obs.source_hash:
        existing = db.execute(
            text("""
                SELECT 1 FROM catalog_observations
                WHERE barcode = :bc AND source_hash = :sh
                  AND created_at >= NOW() - INTERVAL '1 day'
                LIMIT 1
            """),
            {"bc": obs.barcode, "sh": obs.source_hash},
        ).fetchone()
        if existing:
            return {"ok": True, "skipped": True}
    db.execute(
        text("""
            INSERT INTO catalog_observations
              (barcode, raw_name, raw_department, raw_family, sale_price,
               country, province, city, geo_bucket, source_hash, created_at)
            VALUES
              (:barcode, :raw_name, :raw_department, :raw_family, :sale_price,
               :country, :province, :city, :geo_bucket, :source_hash, NOW())
        """),
        obs.model_dump(),
    )
    db.commit()
    return {"ok": True}
