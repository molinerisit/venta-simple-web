"use client";

import { useEffect, useState } from "react";
import { getMetricas, getAdminStats, getLicencia, type Metricas, type AdminStats } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TrendingUp, Users, Package, ShoppingCart, Shield, Wifi,
  AlertCircle, Download, Monitor, CheckCircle2, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

function StatCard({
  title, value, sub, icon: Icon, accent = false,
}: {
  title: string; value: string | number; sub?: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div style={{
      background: "var(--card)",
      borderRadius: 14,
      border: "1px solid var(--border)",
      borderLeft: `3px solid ${accent ? "#F97316" : "#1E3A8A"}`,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          margin: 0,
        }}>
          {title}
        </p>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: accent ? "rgba(249,115,22,.10)" : "rgba(30,58,138,.07)",
          display: "grid", placeItems: "center",
        }}>
          <Icon size={16} style={{ color: accent ? "#F97316" : "#1E3A8A" }} />
        </div>
      </div>
      <div>
        <p style={{
          fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
          color: accent ? "#F97316" : "var(--foreground)",
          margin: 0,
        }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 5 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Onboarding — sin instancia desktop vinculada ──────────────────────────────

const PASOS = [
  {
    n: 1,
    titulo: "Cuenta creada y verificada",
    desc: "Ya tenés acceso al panel web.",
    done: true,
  },
  {
    n: 2,
    titulo: "Descargá la app de escritorio",
    desc: "La app funciona sin internet y sincroniza automáticamente.",
    action: { label: "Descargar Venta Simple", href: "/descargar" },
    done: false,
  },
  {
    n: 3,
    titulo: "Activá la app desde Mi Cuenta",
    desc: 'En Mi Cuenta → hacé clic en "Activar en desktop". La app se configura sola.',
    action: { label: "Ir a Mi Cuenta", href: "/cuenta" },
    done: false,
  },
  {
    n: 4,
    titulo: "¡Listo! Empezá a vender",
    desc: "Tus ventas y stock se van a sincronizar automáticamente acá.",
    done: false,
  },
];

function OnboardingPanel({ licenciaActiva }: { licenciaActiva: boolean }) {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Hero */}
      <div className="rounded-2xl p-6" style={{
        background: "rgba(30,58,138,.06)",
        border: "1px solid rgba(30,58,138,.16)",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "#1E3A8A",
          display: "grid", placeItems: "center",
          marginBottom: 16,
        }}>
          <Monitor size={22} color="#fff" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Configurá tu sistema de ventas
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Seguí estos pasos para instalar la app de escritorio y empezar a registrar ventas.
          Funciona sin internet y se sincroniza automáticamente cuando hay conexión.
        </p>
      </div>

      {/* Pasos */}
      <div className="space-y-3">
        {PASOS.map((paso, i) => {
          const unlocked = paso.done || i <= (licenciaActiva ? 2 : 1);
          return (
            <div
              key={paso.n}
              className="flex gap-4 items-start rounded-2xl border bg-card"
              style={{
                padding: "16px 20px",
                opacity: i === PASOS.length - 1 && !licenciaActiva ? 0.45 : 1,
              }}
            >
              {/* Número / check */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: paso.done ? "rgba(5,150,105,.10)" : "rgba(30,58,138,.10)",
                border: paso.done ? "1px solid rgba(5,150,105,.30)" : "1px solid rgba(30,58,138,.25)",
                display: "grid", placeItems: "center",
              }}>
                {paso.done
                  ? <CheckCircle2 size={16} style={{ color: "#059669" }} />
                  : <span style={{ fontWeight: 800, fontSize: 13, color: "#1E3A8A" }}>{paso.n}</span>
                }
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm mb-0.5">{paso.titulo}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{paso.desc}</p>
                {paso.action && unlocked && (
                  <Link href={paso.action.href} className="inline-flex items-center gap-1 mt-3">
                    <Button
                      size="sm"
                      variant={i === 1 ? "accent" : "outline"}
                      className="gap-1.5"
                    >
                      {i === 1 && <Download size={12} />}
                      {i === 2 && <Monitor size={12} />}
                      {paso.action.label}
                      <ArrowRight size={11} />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        ¿Necesitás ayuda?{" "}
        <Link href="/descargar" className="underline text-primary">
          Ver guía de instalación
        </Link>
      </p>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const [metricas, setMetricas]     = useState<Metricas | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [licenciaActiva, setLicenciaActiva] = useState(false);
  const [error, setError]           = useState(false);
  const user = typeof window !== "undefined" ? getUser() : null;
  const isSuperAdmin = user?.rol === "superadmin";

  useEffect(() => {
    if (isSuperAdmin) {
      getAdminStats()
        .then(r => setAdminStats(r.data))
        .catch(() => setError(true));
    } else {
      Promise.all([getMetricas(30), getLicencia()])
        .then(([mRes, lRes]) => {
          setMetricas(mRes.data);
          setLicenciaActiva(!!lRes.data.licencia);
        })
        .catch(() => setError(true));
    }
  }, [isSuperAdmin]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <AlertCircle size={32} />
        <p className="text-sm">No se pudo conectar con el backend.</p>
        <p className="text-xs text-muted-foreground/60">Verificá que NEXT_PUBLIC_API_URL apunte al servidor correcto.</p>
      </div>
    );
  }

  // ── Dashboard Superadmin ──────────────────────────────────────────────────
  if (isSuperAdmin) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Vista global del ecosistema VentaSimple</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Clientes SaaS" value={adminStats?.total ?? "—"} icon={Users}
            sub={`${adminStats?.activos ?? 0} activos`} />
          <StatCard title="Online ahora" value={adminStats?.online ?? "—"} icon={Wifi} />
          <StatCard title="Ventas globales (30d)" value={adminStats ? fmt(adminStats.ventas_30d) : "—"}
            icon={TrendingUp} accent
            sub={`${adminStats?.cantidad_ventas_30d ?? 0} transacciones`} />
          <StatCard title="Productos registrados" value={adminStats?.total_productos?.toLocaleString() ?? "—"} icon={Package} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin">
            <Card className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(30,58,138,.08)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Shield size={18} style={{ color: "#1E3A8A" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Gestionar clientes SaaS</p>
                    <p className="text-xs text-muted-foreground">Features, planes, suspensión</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/instalaciones">
            <Card className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(5,150,105,.08)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Wifi size={18} style={{ color: "#059669" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Instalaciones desktop</p>
                    <p className="text-xs text-muted-foreground">Heartbeats, acceso remoto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  // ── Dashboard Owner ───────────────────────────────────────────────────────
  const sinDatos =
    metricas &&
    metricas.ventas.cantidad === 0 &&
    (metricas.totales?.total_productos ?? 0) === 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {sinDatos ? `Hola, ${user?.nombre ?? ""}` : "Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {sinDatos ? "Bienvenido a Venta Simple" : "Resumen de los últimos 30 días"}
        </p>
      </div>

      {/* Sin datos → mostrar onboarding */}
      {!metricas ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-muted-foreground">Cargando…</p>
        </div>
      ) : sinDatos ? (
        <OnboardingPanel licenciaActiva={licenciaActiva} />
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Ventas" value={fmt(metricas.ventas.total)} icon={TrendingUp} accent
              sub={`${metricas.ventas.cantidad} operaciones`} />
            <StatCard title="Ticket promedio" value={fmt(metricas.ventas.ticket_promedio)} icon={ShoppingCart} />
            <StatCard title="Productos" value={metricas.totales?.total_productos ?? "—"} icon={Package} />
            <StatCard title="Clientes" value={metricas.totales?.total_clientes ?? "—"} icon={Users} />
          </div>

          {/* Gráfico evolución */}
          <Card>
            <CardHeader className="pb-2">
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <CardTitle className="text-base font-bold text-foreground">Evolución de ventas</CardTitle>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500 }}>últimos 30 días</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={metricas.ventas_por_dia} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => typeof v === "number" ? fmt(v) : ""} />
                  <Area type="monotone" dataKey="total" stroke="#1E3A8A" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top productos */}
          {metricas.top_productos.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground">Top productos vendidos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <tbody>
                    {metricas.top_productos.map((p, i) => (
                      <tr key={i} className="border-b last:border-0 vs-table-row">
                        <td className="px-4 py-2.5">
                          <span style={{
                            fontSize: 10, fontWeight: 800, color: "#F97316",
                            marginRight: 8, opacity: 0.8,
                          }}>
                            #{i + 1}
                          </span>
                          <span className="font-medium text-foreground">{p.nombre}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm text-muted-foreground">{p.unidades} ud.</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-foreground">{fmt(p.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Alertas de stock */}
          {metricas.stock_bajo_minimo.length > 0 && (
            <Card style={{ borderColor: "var(--warning-bdr)", background: "var(--warning-bg)" }}>
              <CardContent className="pt-4 pb-3">
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--warning-text)" }}>
                  {metricas.stock_bajo_minimo.length} producto{metricas.stock_bajo_minimo.length > 1 ? "s" : ""} con stock bajo mínimo
                </p>
                <div className="flex flex-wrap gap-2">
                  {metricas.stock_bajo_minimo.map(p => (
                    <Link key={p.id} href="/productos">
                      <Badge variant="outline" style={{
                        borderColor: "var(--warning-bdr)",
                        color: "var(--warning-text)",
                        background: "transparent",
                        cursor: "pointer",
                      }}>
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
