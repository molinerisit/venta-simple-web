from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .utils.security import verify_token
from .schemas.auth import TokenPayload

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> TokenPayload:
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def require_superadmin(
    current_user: TokenPayload = Depends(get_current_user),
) -> TokenPayload:
    if current_user.rol != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requiere rol superadmin.",
        )
    return current_user


def require_owner_or_superadmin(
    current_user: TokenPayload = Depends(get_current_user),
) -> TokenPayload:
    if current_user.rol not in ("owner", "superadmin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado.",
        )
    return current_user


def resolve_tenant_id(
    tenant_id: str | None = None,
    current_user: TokenPayload = Depends(get_current_user),
) -> str:
    """
    Para rutas de tenant:
    - superadmin puede pasar ?tenant_id= para ver datos de cualquier tenant
    - owner siempre usa su propio tenant_id del JWT
    """
    if current_user.rol == "superadmin":
        if not tenant_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Superadmin debe proveer tenant_id como query param.",
            )
        return tenant_id
    if not current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sin tenant_id en token.",
        )
    return current_user.tenant_id
