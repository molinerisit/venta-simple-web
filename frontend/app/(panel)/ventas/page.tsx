"use client";

import { useEffect, useState } from "react";
import { getVentas, anularVenta, type Venta } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Ban } from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

function estadoColor(estado: string): "default" | "secondary" | "outline" | "destructive" {
  return ({ completada: "default", anulada: "destructive", pendiente: "secondary" } as Record<string, "default" | "secondary" | "outline" | "destructive">)[estado] ?? "outline";
}

export default function VentasPage() {
  const [items, setItems] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split("T")[0]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await getVentas({ desde, hasta, limit: 200 });
      setItems(data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [desde, hasta]);

  async function handleAnular(v: Venta) {
    if (!confirm(`¿Anular venta del ${new Date(v.fecha).toLocaleDateString("es-AR")} por ${fmt(v.total)}?`)) return;
    await anularVenta(v.id);
    load();
  }

  const total = items.filter(v => v.estado === "completada").reduce((s, v) => s + v.total, 0);
  const cantidad = items.filter(v => v.estado === "completada").length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ventas</h1>
          <p className="text-sm text-slate-500">
            {cantidad} ventas · total: <span className="font-semibold text-blue-600">{fmt(total)}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Filtros de fecha */}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="space-y-1">
          <Label className="text-xs">Desde</Label>
          <Input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="w-36" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Hasta</Label>
          <Input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="w-36" />
        </div>
        <Button size="sm" onClick={load} disabled={loading}>Filtrar</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? <p className="px-4 py-8 text-sm text-slate-400 text-center">Cargando…</p> :
           items.length === 0 ? <p className="px-4 py-8 text-sm text-slate-400 text-center">Sin ventas en el período.</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-400">
                  <th className="text-left px-4 py-2">Fecha</th>
                  <th className="text-left px-4 py-2">Cliente</th>
                  <th className="text-left px-4 py-2">Método</th>
                  <th className="text-right px-4 py-2">Total</th>
                  <th className="text-center px-4 py-2">Estado</th>
                  <th className="text-left px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(v => (
                  <tr key={v.id} className={`border-b last:border-0 hover:bg-white/5 ${v.estado === "anulada" ? "opacity-50" : ""}`}>
                    <td className="px-4 py-2.5 text-xs text-slate-500">
                      {new Date(v.fecha).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{v.cliente_nombre ?? <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="text-xs">{v.metodo_pago}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold">
                      {fmt(v.total)}
                      {v.descuento > 0 && <span className="text-xs text-slate-400 ml-1">(-{fmt(v.descuento)})</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant={estadoColor(v.estado)}>{v.estado}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      {v.estado === "completada" && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500 hover:text-red-700"
                          onClick={() => handleAnular(v)} title="Anular venta">
                          <Ban size={12} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
