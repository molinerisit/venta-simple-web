from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    nombre: str
    rol: str
    tenant_id: Optional[str] = None


class RegisterRequest(BaseModel):
    email: str
    password: str
    nombre_negocio: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    rol: Optional[str] = None
    tenant_id: Optional[str] = None
