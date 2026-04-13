"use client";

import { useEffect, useState } from "react";
import { getMetricas, getAdminStats, type Metricas, type AdminStats } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TrendingUp, Users, Package, ShoppingCart, Shield, Wifi, AlertCircle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

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

export default function DashboardPage() {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);
  const user = typeof window !== "undefined" ? getUser() : null;
  const isSuperAdmin = user?.rol === "superadmin";

  useEffect(() => {
    if (isSuperAdmin) {
      getAdminStats()
        .then(r => setAdminStats(r.data))
        .catch(() => setError(true));
    } else {
      getMetricas(30)
        .then(r => setMetricas(r.data))
        .catch(() => setError(true));
    }
  }, [isSuperAdmin]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
        <AlertCircle size={32} />
        <p className="text-sm">No se pudo conectar con el backend.</p>
        <p className="text-xs text-slate-400">Verificá que la variable NEXT_PUBLIC_API_URL apunte al servidor correcto.</p>
      </div>
    );
  }

  // ── Dashboard Superadmin ──────────────────────────────────────
  if (isSuperAdmin) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-foreground">Dashboard — Superadmin</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Vista global del ecosistema VentaSimple</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Clientes SaaS" value={adminStats?.total ?? "—"} icon={Users} sub={`${adminStats?.activos ?? 0} activos`} />
          <StatCard title="Online ahora" value={adminStats?.online ?? "—"} icon={Wifi} color="text-green-600" />
          <StatCard title="Ventas globales (30d)" value={adminStats ? fmt(adminStats.ventas_30d) : "—"} icon={TrendingUp} color="text-blue-600"
            sub={`${adminStats?.cantidad_ventas_30d ?? 0} transacciones`} />
          <StatCard title="Productos registrados" value={adminStats?.total_productos?.toLocaleString() ?? "—"} icon={Package} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin">
            <Card className="cursor-pointer hover:border-blue-300 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Gestionar clientes SaaS</p>
                    <p className="text-xs text-slate-400">Features, planes, suspensión</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/instalaciones">
            <Card className="cursor-pointer hover:border-blue-300 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Wifi size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Instalaciones desktop</p>
                    <p className="text-xs text-slate-400">Heartbeats, acceso remoto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  // ── Dashboard Owner ───────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Resumen de los últimos 30 días</p>
      </div>

      {!metricas ? (
        <p className="text-sm text-slate-400 py-8 text-center">Cargando…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Ventas" value={fmt(metricas.ventas.total)} icon={TrendingUp} color="text-blue-600"
              sub={`${metricas.ventas.cantidad} operaciones`} />
            <StatCard title="Ticket promedio" value={fmt(metricas.ventas.ticket_promedio)} icon={ShoppingCart} />
            <StatCard title="Productos" value={metricas.totales?.total_productos ?? "—"} icon={Package} />
            <StatCard title="Clientes" value={metricas.totales?.total_clientes ?? "—"} icon={Users} />
          </div>

          {/* Gráfico evolución */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">Evolución de ventas diarias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={metricas.ventas_por_dia} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => typeof v === 'number' ? fmt(v) : ''} />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top productos */}
          {metricas.top_productos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500">Top productos vendidos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <tbody>
                    {metricas.top_productos.map((p, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-4 py-2.5">
                          <span className="text-xs text-slate-400 mr-2">#{i + 1}</span>
                          <span className="font-medium">{p.nombre}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm text-slate-500">{p.unidades} ud.</td>
                        <td className="px-4 py-2.5 text-right font-medium">{fmt(p.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Alertas de stock */}
          {metricas.stock_bajo_minimo.length > 0 && (
            <Card style={{ borderColor: "rgba(245,158,11,.25)", background: "rgba(245,158,11,.08)" }}>
              <CardContent className="pt-4 pb-3">
                <p className="text-sm font-medium text-orange-300 mb-2">
                  {metricas.stock_bajo_minimo.length} productos con stock bajo mínimo
                </p>
                <div className="flex flex-wrap gap-2">
                  {metricas.stock_bajo_minimo.map(p => (
                    <Link key={p.id} href="/productos">
                      <Badge variant="outline" className="border-orange-500/30 text-orange-300 cursor-pointer">
                        {p.nombre} ({p.stock})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
