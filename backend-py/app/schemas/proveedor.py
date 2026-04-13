from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProveedorBase(BaseModel):
    nombre: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    cuit: Optional[str] = None
    notas: Optional[str] = None


class ProveedorCreate(ProveedorBase):
    local_id: Optional[str] = None


class ProveedorUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    cuit: Optional[str] = None
    notas: Optional[str] = None
    activo: Optional[bool] = None


class ProveedorOut(ProveedorBase):
    id: str
    tenant_id: str
    activo: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
