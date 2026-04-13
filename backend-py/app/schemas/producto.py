from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductoBase(BaseModel):
    nombre: str
    codigo: Optional[str] = None
    precio: float = 0
    precio_costo: Optional[float] = 0
    stock: int = 0
    stock_minimo: int = 0
    categoria: Optional[str] = None
    descripcion: Optional[str] = None
    unidad: str = "unidad"


class ProductoCreate(ProductoBase):
    local_id: Optional[str] = None


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    codigo: Optional[str] = None
    precio: Optional[float] = None
    precio_costo: Optional[float] = None
    stock: Optional[int] = None
    stock_minimo: Optional[int] = None
    categoria: Optional[str] = None
    descripcion: Optional[str] = None
    unidad: Optional[str] = None
    activo: Optional[bool] = None


class ProductoOut(ProductoBase):
    id: str
    tenant_id: str
    activo: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class StockAjuste(BaseModel):
    delta: int
    motivo: Optional[str] = None
