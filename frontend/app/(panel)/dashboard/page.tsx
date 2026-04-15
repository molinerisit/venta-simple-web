"use client";

import { useEffect, useState } from "react";
import { getMetricas, getAdminStats, getLicencia, type Metricas, type AdminStats } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import {
  TrendingUp, Users, Package, ShoppingCart, Shield, Wifi,
  AlertCircle, Download, Monitor, CheckCircle2, ArrowRight,
  BarChart2, ChevronRight, Calendar, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
function StatCard({
  title, value, sub, icon: Icon, accent = false,
}: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: accent ? "1.5px solid #1E3A8A" : "1px solid #E9EAEC",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: accent
        ? "0 4px 20px rgba(30,58,138,.12)"
        : "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "#94A3B8", margin: 0,
        }}>
          {title}
        </p>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: accent ? "#EEF2FF" : "#F8F9FB",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Icon size={15} style={{ color: accent ? "#1E3A8A" : "#94A3B8" }} />
        </div>
      </div>
      <div>
        <p style={{
          fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em",
          lineHeight: 1, color: "#0F172A", margin: 0,
        }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: 12, color: "#94A3B8", margin: "5px 0 0" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 16, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#F1F3F5 25%,#E9EAEC 50%,#F1F3F5 75%)",
      backgroundSize: "400% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

/* ─── Page header ────────────────────────────────────────────────────────────── */
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const dateLabel = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <h1 style={{
          fontSize: 22, fontWeight: 800, color: "#0F172A",
          margin: "0 0 4px", letterSpacing: "-0.02em",
        }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, fontWeight: 500 }}>{subtitle}</p>
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
        padding: "7px 13px", borderRadius: 8,
        background: "#F8F9FB", border: "1px solid #E9EAEC",
        fontSize: 12, color: "#64748B", fontWeight: 500,
      }}>
        <Calendar size={12} style={{ color: "#94A3B8" }} />
        {dateLabel}
      </div>
    </div>
  );
}

/* ─── Onboarding ─────────────────────────────────────────────────────────────── */
const PASOS = [
  {
    n: 1,
    titulo: "Cuenta creada y verificada",
    desc: "Ya tenés acceso al panel web.",
    done: true,
    action: null,
    actionIcon: null,
  },
  {
    n: 2,
    titulo: "Descargá la app de escritorio",
    desc: "Funciona sin internet. Cuando te volvés a conectar, todo se sincroniza solo.",
    action: { label: "Descargar app", href: "/descargar" },
    actionIcon: Download,
    done: false,
  },
  {
    n: 3,
    titulo: "Activá la app desde Mi Cuenta",
    desc: 'En Mi Cuenta hacé clic en "Activar en desktop" y la app se configura sola.',
    action: { label: "Ir a Mi Cuenta", href: "/cuenta" },
    actionIcon: Monitor,
    done: false,
  },
  {
    n: 4,
    titulo: "Registrá tu primera venta",
    desc: "Tus ventas y stock quedan disponibles en este panel en tiempo real.",
    action: null,
    actionIcon: null,
    done: false,
  },
];

function OnboardingPanel({ licenciaActiva, nombre }: { licenciaActiva: boolean; nombre: string }) {
  const completedCount = licenciaActiva ? 2 : 1;
  const pct = Math.round((completedCount / PASOS.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "100%" }}>

      {/* Bienvenida */}
      <div style={{
        background: "#fff",
        border: "1px solid #E9EAEC",
        borderRadius: 16,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          background: "#1E3A8A",
          display: "grid", placeItems: "center",
        }}>
          <ShoppingCart size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 4px" }}>
            Bienvenido
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            {nombre}
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
            Configurá la app en minutos y empezá a vender con control total.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#1E3A8A", margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>
            {pct}%
          </p>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            completado
          </p>
        </div>
      </div>

      {/* Setup + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "flex-start" }}>

        {/* Steps card */}
        <div style={{
          background: "#fff",
          border: "1px solid #E9EAEC",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,.05)",
        }}>
          {/* Progress bar */}
          <div style={{ height: 3, background: "#F1F3F5" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: "#1E3A8A",
              transition: "width .5s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>

          <div style={{ padding: "8px 0 12px" }}>
            {PASOS.map((paso, i) => {
              const isDone = paso.done || i < completedCount;
              const isNext = i === completedCount;
              const isLocked = !isDone && !isNext;
              const ActionIcon = paso.actionIcon;

              return (
                <div
                  key={paso.n}
                  style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    padding: "16px 24px",
                    background: isNext ? "#FAFBFF" : "transparent",
                    borderLeft: `3px solid ${isNext ? "#1E3A8A" : "transparent"}`,
                    opacity: isLocked ? 0.38 : 1,
                    transition: "opacity .2s",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    display: "grid", placeItems: "center",
                    background: isDone ? "#DCFCE7" : isNext ? "#EEF2FF" : "#F8F9FB",
                    border: `1.5px solid ${isDone ? "#BBF7D0" : isNext ? "#C7D2FE" : "#E9EAEC"}`,
                    marginTop: 1,
                  }}>
                    {isDone
                      ? <CheckCircle2 size={15} strokeWidth={2.5} style={{ color: "#16A34A" }} />
                      : <span style={{
                          fontWeight: 800, fontSize: 12,
                          color: isNext ? "#1E3A8A" : "#CBD5E1",
                        }}>{paso.n}</span>
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{
                        fontWeight: isDone ? 500 : 600, fontSize: 14,
                        color: isDone ? "#16A34A" : isNext ? "#0F172A" : "#64748B",
                        margin: 0,
                      }}>
                        {paso.titulo}
                      </p>
                      {isDone && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: "#16A34A",
                          background: "#DCFCE7", padding: "1px 8px",
                          borderRadius: 99, letterSpacing: "0.04em",
                        }}>
                          Listo
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                      {paso.desc}
                    </p>
                    {paso.action && isNext && (
                      <Link href={paso.action.href} style={{ textDecoration: "none" }}>
                        <div style={{
                          marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7,
                          padding: "8px 16px", borderRadius: 8,
                          fontWeight: 700, fontSize: 12,
                          background: "#1E3A8A", color: "#fff",
                          boxShadow: "0 2px 10px rgba(30,58,138,.28)",
                          cursor: "pointer",
                        }}>
                          {ActionIcon && <ActionIcon size={12} />}
                          {paso.action.label}
                          <ArrowRight size={11} />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: accesos rápidos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.09em",
            textTransform: "uppercase", color: "#94A3B8", margin: "0 0 4px",
          }}>
            Accesos rápidos
          </p>
          {[
            { icon: Package, color: "#1E3A8A", bg: "#EEF2FF", label: "Productos", sub: "Cargá tu catálogo", href: "/productos" },
            { icon: Users,   color: "#0A6E45", bg: "#DCFCE7", label: "Clientes",  sub: "Gestioná tus clientes", href: "/clientes" },
            { icon: BarChart2, color: "#7C3AED", bg: "#F5F3FF", label: "Métricas", sub: "Ver reportes y KPIs", href: "/metricas" },
          ].map(({ icon: Icon, color, bg, label, sub, href }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: bg, display: "grid", placeItems: "center",
                }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", margin: "0 0 1px" }}>{label}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>{sub}</p>
                </div>
                <ChevronRight size={13} style={{ color: "#CBD5E1", flexShrink: 0 }} />
              </div>
            </Link>
          ))}

          {/* Soporte */}
          <div style={{
            background: "#F8FAFF", border: "1px solid #C7D2FE",
            borderRadius: 12, padding: "14px 16px", marginTop: 4,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", margin: "0 0 4px" }}>
              ¿Necesitás ayuda?
            </p>
            <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6, margin: "0 0 10px" }}>
              Soporte humano 24/7 por WhatsApp. Respondemos en menos de 5 min.
            </p>
            <a
              href="mailto:ventas@ventasimple.app"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 700, color: "#1E3A8A", textDecoration: "none",
              }}
            >
              Contactar soporte <ArrowRight size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard principal ────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [metricas, setMetricas]         = useState<Metricas | null>(null);
  const [adminStats, setAdminStats]     = useState<AdminStats | null>(null);
  const [licenciaActiva, setLicenciaActiva] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const user = typeof window !== "undefined" ? getUser() : null;
  const isSuperAdmin = user?.rol === "superadmin";

  useEffect(() => {
    if (isSuperAdmin) {
      getAdminStats()
        .then(r => setAdminStats(r.data))
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    } else {
      Promise.all([getMetricas(30), getLicencia()])
        .then(([mRes, lRes]) => {
          setMetricas(mRes.data);
          setLicenciaActiva(!!lRes.data.licencia);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [isSuperAdmin]);

  /* Error */
  if (error) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: 280, gap: 10, color: "#94A3B8",
      }}>
        <AlertCircle size={28} style={{ color: "#E2E8F0" }} />
        <p style={{ fontSize: 14, margin: 0, color: "#64748B", fontWeight: 500 }}>No se pudo conectar con el backend.</p>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
          Verificá que NEXT_PUBLIC_API_URL apunte al servidor correcto.
        </p>
      </div>
    );
  }

  /* ── Superadmin ────────────────────────────────────────────────────────────── */
  if (isSuperAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "100%" }}>
        <PageHeader
          title="Dashboard"
          subtitle="Vista global del ecosistema VentaSimple"
        />

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <Skeleton h={11} w="60%" />
                <Skeleton h={26} w="70%" />
                <Skeleton h={12} w="40%" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <StatCard title="Ventas globales 30d" value={adminStats ? fmt(adminStats.ventas_30d) : "—"} icon={TrendingUp} accent sub={`${adminStats?.cantidad_ventas_30d ?? 0} transacciones`} />
            <StatCard title="Clientes SaaS" value={adminStats?.total ?? "—"} icon={Users} sub={`${adminStats?.activos ?? 0} activos`} />
            <StatCard title="Online ahora" value={adminStats?.online ?? "—"} icon={Wifi} />
            <StatCard title="Productos registrados" value={adminStats?.total_productos?.toLocaleString() ?? "—"} icon={Package} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { href: "/admin",         icon: Shield, bg: "#EEF2FF", color: "#1E3A8A", title: "Gestionar clientes SaaS",    sub: "Features, planes, suspensión" },
            { href: "/instalaciones", icon: Wifi,   bg: "#DCFCE7", color: "#16A34A", title: "Instalaciones desktop", sub: "Heartbeats, acceso remoto" },
          ].map(({ href, icon: Icon, bg, color, title, sub }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12,
                padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 1px 3px rgba(0,0,0,.04)", cursor: "pointer",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A", margin: "0 0 2px" }}>{title}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>{sub}</p>
                </div>
                <ChevronRight size={14} style={{ color: "#CBD5E1", marginLeft: "auto", flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  /* ── Owner ─────────────────────────────────────────────────────────────────── */
  const sinDatos =
    metricas &&
    metricas.ventas.cantidad === 0 &&
    (metricas.totales?.total_productos ?? 0) === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "100%" }}>

      <PageHeader
        title={sinDatos ? `Hola, ${user?.nombre ?? ""}` : "Dashboard"}
        subtitle={sinDatos ? "Bienvenido a Venta Simple" : "Resumen de los últimos 30 días"}
      />

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <Skeleton h={11} w="55%" />
                <Skeleton h={26} w="65%" />
                <Skeleton h={11} w="40%" />
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: 20 }}>
            <Skeleton h={180} r={8} />
          </div>
        </div>
      )}

      {/* Onboarding */}
      {!loading && sinDatos && (
        <OnboardingPanel licenciaActiva={licenciaActiva} nombre={user?.nombre ?? "tu negocio"} />
      )}

      {/* Dashboard con datos */}
      {!loading && metricas && !sinDatos && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <StatCard
              title="Ventas"
              value={fmt(metricas.ventas.total)}
              icon={TrendingUp}
              accent
              sub={`${metricas.ventas.cantidad} operaciones`}
            />
            <StatCard title="Ticket promedio" value={fmt(metricas.ventas.ticket_promedio)} icon={ShoppingCart} sub="por operación" />
            <StatCard title="Productos" value={metricas.totales?.total_productos ?? "—"} icon={Package} sub="en catálogo" />
            <StatCard title="Clientes" value={metricas.totales?.total_clientes ?? "—"} icon={Users} sub="registrados" />
          </div>

          {/* Gráfico + top productos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12, alignItems: "flex-start" }}>

            {/* Chart */}
            <div style={{
              background: "#fff", border: "1px solid #E9EAEC",
              borderRadius: 12, padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
                  Evolución de ventas
                </p>
                <span style={{
                  fontSize: 11, color: "#94A3B8", fontWeight: 600,
                  background: "#F8F9FB", padding: "3px 10px", borderRadius: 99,
                  border: "1px solid #E9EAEC",
                }}>
                  últimos 30 días
                </span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={metricas.ventas_por_dia} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1E3A8A" stopOpacity={0.10} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v) => typeof v === "number" ? [fmt(v), "Ventas"] : [""]}
                    contentStyle={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}
                    cursor={{ stroke: "#E9EAEC" }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#1E3A8A" fill="url(#grad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top productos */}
            <div style={{
              background: "#fff", border: "1px solid #E9EAEC",
              borderRadius: 12, overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,.04)",
            }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #F1F3F5" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
                  Top productos
                </p>
              </div>
              {metricas.top_productos.length === 0 ? (
                <div style={{ padding: "32px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Sin datos aún</p>
                </div>
              ) : (
                <div>
                  {metricas.top_productos.slice(0, 6).map((p, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 18px",
                      borderBottom: i < metricas.top_productos.length - 1 ? "1px solid #F8F9FB" : "none",
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        background: "#F8F9FB", border: "1px solid #E9EAEC",
                        display: "grid", placeItems: "center",
                        fontSize: 10, fontWeight: 800, color: "#94A3B8",
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ flex: 1, fontSize: 13, color: "#0F172A", fontWeight: 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.nombre}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", flexShrink: 0 }}>
                        {fmt(p.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alertas de stock */}
          {metricas.stock_bajo_minimo.length > 0 && (
            <div style={{
              background: "#FFFBEB", border: "1px solid #FDE68A",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: "#FEF3C7", display: "grid", placeItems: "center",
              }}>
                <AlertTriangle size={16} style={{ color: "#D97706" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#B45309", margin: "0 0 8px" }}>
                  {metricas.stock_bajo_minimo.length} producto{metricas.stock_bajo_minimo.length > 1 ? "s" : ""} con stock bajo mínimo
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {metricas.stock_bajo_minimo.map(p => (
                    <Link key={p.id} href="/productos" style={{ textDecoration: "none" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, fontWeight: 600, color: "#D97706",
                        background: "#FEF3C7", border: "1px solid #FDE68A",
                        padding: "3px 10px", borderRadius: 99, cursor: "pointer",
                      }}>
                        {p.nombre}
                        <span style={{ opacity: 0.7 }}>({p.stock})</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/productos" style={{ textDecoration: "none", flexShrink: 0 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", borderRadius: 8,
                  background: "#FEF3C7", border: "1px solid #FDE68A",
                  fontSize: 12, fontWeight: 700, color: "#D97706", cursor: "pointer",
                }}>
                  Ver productos <ArrowRight size={11} />
                </div>
              </Link>
            </div>
          )}
        </>
      )}

    </div>
  );
}
