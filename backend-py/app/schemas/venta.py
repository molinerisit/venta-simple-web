from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DetalleVentaIn(BaseModel):
    producto_id: Optional[str] = None
    nombre_producto: str
    cantidad: int
    precio_unitario: float
    subtotal: float


class DetalleVentaOut(DetalleVentaIn):
    id: str
    venta_id: str

    model_config = {"from_attributes": True}


class VentaCreate(BaseModel):
    cliente_id: Optional[str] = None
    total: float
    descuento: float = 0
    metodo_pago: str = "efectivo"
    estado: str = "completada"
    notas: Optional[str] = None
    fecha: Optional[datetime] = None
    items: List[DetalleVentaIn] = []
    local_id: Optional[str] = None


class VentaOut(BaseModel):
    id: str
    tenant_id: str
    cliente_id: Optional[str] = None
    total: float
    descuento: float
    metodo_pago: str
    estado: str
    notas: Optional[str] = None
    fecha: datetime
    created_at: datetime
    items: List[DetalleVentaOut] = []

    model_config = {"from_attributes": True}


class ResumenVentas(BaseModel):
    total_ventas: float
    cantidad_ventas: int
    ticket_promedio: float
    top_productos: List[dict]
    ventas_por_dia: List[dict]
    ventas_por_metodo_pago: List[dict]
