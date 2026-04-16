"use client";

import { useEffect, useState } from "react";
import { getMetricas, type Metricas } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, ShoppingCart, Users, Package, AlertTriangle, BarChart2, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = ["#1E3A8A", "#0ea5e9", "#059669", "#d97706", "#dc2626"];

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

// ── KPI card principal ────────────────────────────────────────────────────────
function HeroStatCard({
  title, value, sub, icon: Icon,
}: {
  title: string; value: string | number; sub?: string; icon: React.ElementType;
}) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
      borderRadius: 16,
      padding: "24px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: "0 8px 32px rgba(30,58,138,.28)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -28, right: -28,
        width: 110, height: 110, borderRadius: "50%",
        background: "rgba(255,255,255,.06)", pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.10em",
          textTransform: "uppercase", color: "rgba(255,255,255,.60)", margin: 0,
        }}>
          {title}
        </p>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "rgba(255,255,255,.15)",
          display: "grid", placeItems: "center",
        }}>
          <Icon size={18} style={{ color: "#fff" }} />
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <p style={{
          fontSize: 38, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1,
          color: "#fff", margin: 0,
        }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,.58)", margin: "6px 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── KPI cards secundarias ─────────────────────────────────────────────────────
function StatCard({
  title, value, sub, icon: Icon,
}: {
  title: string; value: string | number; sub?: string; icon: React.ElementType;
}) {
  return (
    <div style={{
      background: "var(--card)",
      borderRadius: 14,
      border: "1px solid var(--border)",
      padding: "20px 20px",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.10em",
          textTransform: "uppercase", color: "var(--muted-foreground)", margin: 0,
        }}>
          {title}
        </p>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: "rgba(30,58,138,.07)",
          display: "grid", placeItems: "center",
        }}>
          <Icon size={14} style={{ color: "#1E3A8A" }} />
        </div>
      </div>
      <div>
        <p style={{
          fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
          color: "var(--foreground)", margin: 0,
        }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "4px 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Empty state completo para métricas ────────────────────────────────────────
function MetricasEmptyState() {
  const PREVIEW = [
    { icon: TrendingUp, label: "Evolución de ventas",  desc: "Gráfico día a día" },
    { icon: ShoppingCart, label: "Ticket promedio",    desc: "Por período elegido" },
    { icon: Package,    label: "Top productos",        desc: "Los más vendidos" },
    { icon: Users,      label: "Clientes activos",     desc: "Con deuda o frecuentes" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      {/* Header */}
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
        display: "grid", placeItems: "center",
        boxShadow: "0 8px 24px rgba(30,58,138,.25)",
      }}>
        <BarChart2 size={28} color="#fff" />
      </div>

      <div>
        <h2 style={{
          fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em",
          color: "var(--foreground)", margin: "0 0 10px",
        }}>
          Tu panel de análisis te espera
        </h2>
        <p style={{
          fontSize: 15, lineHeight: 1.7, color: "var(--muted-foreground)", margin: 0,
        }}>
          Cuando registres tus primeras ventas vas a ver la evolución diaria de tu negocio,
          los productos más vendidos, el ticket promedio y cómo te pagan tus clientes.
        </p>
      </div>

      {/* Preview de qué vas a ver */}
      <div>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.10em",
          textTransform: "uppercase", color: "var(--muted-foreground)",
          margin: "0 0 12px",
        }}>
          Lo que vas a ver cuando vendas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PREVIEW.map(item => (
            <div key={item.label} style={{
              padding: "12px 14px", borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              display: "flex", alignItems: "center", gap: 11,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(30,58,138,.07)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <item.icon size={14} style={{ color: "#1E3A8A" }} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/ventas">
          <Button variant="default" className="gap-1.5">
            <ShoppingCart size={14} />
            Registrar primera venta
            <ArrowRight size={13} />
          </Button>
        </Link>
        <Link href="/productos">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Package size={13} />
            Ver productos
          </Button>
        </Link>
      </div>
    </div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--foreground)", margin: "0 0 4px" }}>
            Métricas
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>Análisis de tu negocio</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {PERIODOS.map((d) => (
              <Button
                key={d}
                size="sm"
                variant={dias === d ? "default" : "outline"}
                onClick={() => setDias(d)}
                style={{ fontSize: 12 }}
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

      {loading ? (
        <p style={{ fontSize: 14, color: "var(--muted-foreground)", padding: "48px 0", textAlign: "center" }}>
          Cargando métricas…
        </p>
      ) : !data || data.ventas.cantidad === 0 ? (
        <MetricasEmptyState />
      ) : (
        <>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <HeroStatCard
              title="Ventas totales"
              value={fmt(data.ventas.total)}
              icon={TrendingUp}
              sub={`${data.ventas.cantidad} operaciones`}
            />
            <StatCard title="Ticket promedio" value={fmt(data.ventas.ticket_promedio)} icon={ShoppingCart}
              sub={`Últimos ${dias} días`} />
            <StatCard title="Productos activos" value={data.totales.total_productos ?? "—"} icon={Package} />
            <StatCard title="Clientes" value={data.totales.total_clientes ?? "—"} icon={Users} />
          </div>

          {/* Ventas por día */}
          <Card>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <CardTitle style={{ fontSize: 15, fontWeight: 700 }}>Evolución de ventas</CardTitle>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500 }}>últimos {dias} días</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.ventas_por_dia} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => typeof v === 'number' ? fmt(v) : ''} />
                  <Area type="monotone" dataKey="total" name="Total" stroke="#1E3A8A" fill="url(#grad1)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Top productos */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: 15, fontWeight: 700 }}>Top productos vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                {data.top_productos.length === 0 ? (
                  <p style={{ fontSize: 14, color: "var(--muted-foreground)", textAlign: "center", padding: "16px 0" }}>Sin datos</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data.top_productos} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="nombre" width={100} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="unidades" name="Unidades" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: 15, fontWeight: 700 }}>Ventas por método de pago</CardTitle>
              </CardHeader>
              <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {data.ventas_por_metodo.length === 0 ? (
                  <p style={{ fontSize: 14, color: "var(--muted-foreground)", padding: "16px 0" }}>Sin datos</p>
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
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
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
            <Card style={{ border: "1px solid var(--warning-bdr)", background: "var(--warning-bg)" }}>
              <CardHeader style={{ paddingBottom: 8 }}>
                <CardTitle style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8, color: "var(--warning-text)" }}>
                  <AlertTriangle size={14} />
                  {data.stock_bajo_minimo.length} producto{data.stock_bajo_minimo.length > 1 ? "s" : ""} con stock bajo mínimo
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: 0 }}>
                <table style={{ width: "100%", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid var(--warning-bdr)`, fontSize: 12, color: "var(--warning-text)" }}>
                      <th style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>Producto</th>
                      <th style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>Stock actual</th>
                      <th style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>Mínimo</th>
                      <th style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.stock_bajo_minimo.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--warning-bdr)" }}>
                        <td style={{ padding: "8px 16px", fontWeight: 500, color: "var(--foreground)" }}>{p.nombre}</td>
                        <td style={{ padding: "8px 16px" }}>
                          <Badge variant="destructive">{p.stock}</Badge>
                        </td>
                        <td style={{ padding: "8px 16px", color: "var(--muted-foreground)" }}>{p.stock_minimo}</td>
                        <td style={{ padding: "8px 16px", color: "var(--muted-foreground)" }}>{p.categoria ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Clientes con deuda */}
          {data.clientes_con_deuda.length > 0 && (
            <Card style={{ borderColor: "var(--error-bdr)", background: "var(--error-bg)" }}>
              <CardHeader style={{ paddingBottom: 8 }}>
                <CardTitle style={{ fontSize: 14, color: "var(--error-text)" }}>
                  Clientes con deuda pendiente
                </CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.clientes_con_deuda.map((c) => (
                  <Badge key={c.id} variant="outline" style={{
                    borderColor: "var(--error-bdr)",
                    color: "var(--error-text)",
                    background: "transparent",
                  }}>
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
