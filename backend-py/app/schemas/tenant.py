from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TenantOut(BaseModel):
    id: str
    nombre_negocio: str
    email: str
    plan: str
    plan_expires_at: Optional[datetime] = None
    activo: bool
    created_at: datetime
    last_seen_at: Optional[datetime] = None
    version_app: Optional[str] = None
    ip_address: Optional[str] = None
    online: bool = False

    model_config = {"from_attributes": True}


class TenantUpdate(BaseModel):
    nombre_negocio: Optional[str] = None
    plan: Optional[str] = None
    plan_expires_at: Optional[datetime] = None
    activo: Optional[bool] = None
