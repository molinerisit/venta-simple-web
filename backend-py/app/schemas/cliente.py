from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClienteBase(BaseModel):
    nombre: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    dni: Optional[str] = None
    deuda: float = 0
    notas: Optional[str] = None


class ClienteCreate(ClienteBase):
    local_id: Optional[str] = None


class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    dni: Optional[str] = None
    deuda: Optional[float] = None
    notas: Optional[str] = None
    activo: Optional[bool] = None


class ClienteOut(ClienteBase):
    id: str
    tenant_id: str
    activo: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
