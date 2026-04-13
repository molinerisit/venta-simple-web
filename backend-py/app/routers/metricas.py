from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from datetime import date, timedelta
from ..database import get_db
from ..dependencies import get_current_user
from ..schemas.auth import TokenPayload

router = APIRouter(prefix="/api/metricas", tags=["metricas"])


def _tenant(
    tenant_id: Optional[str] = Query(None),
    current_user: TokenPayload = Depends(get_current_user),
) -> str:
    if current_user.rol == "superadmin":
        if not tenant_id:
            raise Exception("Superadmin debe proveer tenant_id")
        return tenant_id
    return current_user.tenant_id


@router.get("/resumen")
def resumen(
    tenant_id: str = Depends(_tenant),
    db: Session = Depends(get_db),
    dias: int = Query(30, ge=1, le=365),
):
    desde = date.today() - timedelta(days=dias)

    # Totales de ventas
    ventas_stats = db.execute(
        text("""
            SELECT
                COALESCE(SUM(total), 0)   AS total_ventas,
                COUNT(*)                  AS cantidad_ventas,
                COALESCE(AVG(total), 0)   AS ticket_promedio
            FROM ventas
            WHERE tenant_id = :tid AND fecha >= :desde AND estado != 'anulada'
        """),
        {"tid": tenant_id, "desde": desde},
    ).mappings().fetchone()

    # Ventas por día
    ventas_por_dia = db.execute(
        text("""
            SELECT DATE(fecha) AS dia, SUM(total) AS total, COUNT(*) AS cantidad
            FROM ventas
            WHERE tenant_id = :tid AND fecha >= :desde AND estado != 'anulada'
            GROUP BY DATE(fecha) ORDER BY dia ASC
        """),
        {"tid": tenant_id, "desde": desde},
    ).mappings().fetchall()

    # Top 5 productos
    top_productos = db.execute(
        text("""
            SELECT dv.nombre_producto, SUM(dv.cantidad) AS unidades, SUM(dv.subtotal) AS total
            FROM detalle_ventas dv
            JOIN ventas v ON dv.venta_id = v.id
            WHERE v.tenant_id = :tid AND v.fecha >= :desde AND v.estado != 'anulada'
            GROUP BY dv.nombre_producto
            ORDER BY unidades DESC LIMIT 5
        """),
        {"tid": tenant_id, "desde": desde},
    ).mappings().fetchall()

    # Ventas por método de pago
    por_metodo = db.execute(
        text("""
            SELECT metodo_pago, COUNT(*) AS cantidad, SUM(total) AS total
            FROM ventas
            WHERE tenant_id = :tid AND fecha >= :desde AND estado != 'anulada'
            GROUP BY metodo_pago
        """),
        {"tid": tenant_id, "desde": desde},
    ).mappings().fetchall()

    # Stock bajo mínimo
    bajo_minimo = db.execute(
        text("""
            SELECT id, nombre, stock, stock_minimo, categoria
            FROM productos
            WHERE tenant_id = :tid AND activo = TRUE AND stock <= stock_minimo AND deleted_at IS NULL
            ORDER BY (stock_minimo - stock) DESC LIMIT 10
        """),
        {"tid": tenant_id},
    ).mappings().fetchall()

    # Clientes con deuda
    clientes_deuda = db.execute(
        text("""
            SELECT id, nombre, deuda FROM clientes
            WHERE tenant_id = :tid AND deuda > 0 AND activo = TRUE
            ORDER BY deuda DESC LIMIT 10
        """),
        {"tid": tenant_id},
    ).mappings().fetchall()

    # Totales de entidades
    totales = db.execute(
        text("""
            SELECT
                (SELECT COUNT(*) FROM productos WHERE tenant_id = :tid AND activo = TRUE AND deleted_at IS NULL) AS total_productos,
                (SELECT COUNT(*) FROM clientes  WHERE tenant_id = :tid AND activo = TRUE AND deleted_at IS NULL) AS total_clientes,
                (SELECT COUNT(*) FROM proveedores WHERE tenant_id = :tid AND activo = TRUE AND deleted_at IS NULL) AS total_proveedores
        """),
        {"tid": tenant_id},
    ).mappings().fetchone()

    return {
        "periodo_dias": dias,
        "ventas": {
            "total": float(ventas_stats["total_ventas"]),
            "cantidad": int(ventas_stats["cantidad_ventas"]),
            "ticket_promedio": float(ventas_stats["ticket_promedio"]),
        },
        "ventas_por_dia": [
            {"dia": str(r["dia"]), "total": float(r["total"]), "cantidad": int(r["cantidad"])}
            for r in ventas_por_dia
        ],
        "top_productos": [
            {"nombre": r["nombre_producto"], "unidades": int(r["unidades"]), "total": float(r["total"])}
            for r in top_productos
        ],
        "ventas_por_metodo": [
            {"metodo": r["metodo_pago"], "cantidad": int(r["cantidad"]), "total": float(r["total"])}
            for r in por_metodo
        ],
        "stock_bajo_minimo": [dict(r) for r in bajo_minimo],
        "clientes_con_deuda": [dict(r) for r in clientes_deuda],
        "totales": dict(totales) if totales else {},
    }
