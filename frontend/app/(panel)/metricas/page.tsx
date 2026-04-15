"use client";

import { useEffect, useState } from "react";
import { getMetricas, type Metricas } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

function StatCard({ title, value, sub, icon: Icon, color = "text-foreground" }: {
  title: string; value: string | number; sub?: string; icon: React.ElementType; color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <Icon size={18} className="text-slate-400" />
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

const PERIODOS = [7, 30, 90, 365];

export default function MetricasPage() {
  const [data, setData] = useState<Metricas | null>(null);
  const [dias, setDias] = useState(30);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data: m } = await getMetricas(dias);
      setData(m);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [dias]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Análisis de tu negocio</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {PERIODOS.map((d) => (
              <Button
                key={d}
                size="sm"
                variant={dias === d ? "default" : "outline"}
                onClick={() => setDias(d)}
                className="text-xs"
              >
                {d === 365 ? "1 año" : `${d}d`}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {loading || !data ? (
        <p className="text-sm text-slate-400 py-12 text-center">Cargando métricas…</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Ventas totales" value={fmt(data.ventas.total)} icon={TrendingUp} color="text-primary"
              sub={`${data.ventas.cantidad} operaciones`} />
            <StatCard title="Ticket promedio" value={fmt(data.ventas.ticket_promedio)} icon={ShoppingCart}
              sub={`Últimos ${dias} días`} />
            <StatCard title="Productos activos" value={data.totales.total_productos ?? "—"} icon={Package} />
            <StatCard title="Clientes" value={data.totales.total_clientes ?? "—"} icon={Users} />
          </div>

          {/* Ventas por día */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Evolución de ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.ventas_por_dia} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => typeof v === 'number' ? fmt(v) : ''} />
                  <Area type="monotone" dataKey="total" name="Total" stroke="#3b82f6" fill="url(#grad1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top productos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-slate-500">Top 5 productos vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                {data.top_productos.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Sin datos</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data.top_productos} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="nombre" width={100} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="unidades" name="Unidades" fill="#3b82f6" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-slate-500">Ventas por método de pago</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {data.ventas_por_metodo.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4">Sin datos</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data.ventas_por_metodo}
                        dataKey="total"
                        nameKey="metodo"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {data.ventas_por_metodo.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => typeof v === 'number' ? fmt(v) : ''} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stock bajo mínimo */}
          {data.stock_bajo_minimo.length > 0 && (
            <Card style={{ borderColor: "rgba(245,158,11,.25)", background: "rgba(245,158,11,.08)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-300 flex items-center gap-2">
                  <AlertTriangle size={14} />
                  {data.stock_bajo_minimo.length} producto{data.stock_bajo_minimo.length > 1 ? "s" : ""} con stock bajo mínimo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-orange-600">
                      <th className="text-left px-4 py-2 font-medium">Producto</th>
                      <th className="text-left px-4 py-2 font-medium">Stock actual</th>
                      <th className="text-left px-4 py-2 font-medium">Mínimo</th>
                      <th className="text-left px-4 py-2 font-medium">Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.stock_bajo_minimo.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="px-4 py-2 font-medium text-slate-800">{p.nombre}</td>
                        <td className="px-4 py-2">
                          <Badge variant="destructive">{p.stock}</Badge>
                        </td>
                        <td className="px-4 py-2 text-slate-500">{p.stock_minimo}</td>
                        <td className="px-4 py-2 text-slate-400">{p.categoria ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Clientes con deuda */}
          {data.clientes_con_deuda.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700">
                  Clientes con deuda pendiente
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-0">
                {data.clientes_con_deuda.map((c) => (
                  <Badge key={c.id} variant="outline" className="border-red-300 text-red-700 bg-white">
                    {c.nombre} · {fmt(c.deuda)}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
