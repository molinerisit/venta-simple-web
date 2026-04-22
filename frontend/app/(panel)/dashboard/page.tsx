"use client";

import { useEffect, useState } from "react";
import { getMetricas, getAdminStats, getLicencia, type Metricas, type AdminStats } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import { TrendingUp, Users, Package, ShoppingCart, Shield, Wifi, AlertCircle, AlertTriangle, ArrowRight, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard, Skeleton, PageHeader } from "@/components/dashboard/DashboardShell";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import OnboardingChat from "@/components/dashboard/OnboardingChat";

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

export default function DashboardPage() {
  const [metricas, setMetricas]             = useState<Metricas | null>(null);
  const [adminStats, setAdminStats]         = useState<AdminStats | null>(null);
  const [licenciaActiva, setLicenciaActiva] = useState(false);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(false);
  const [isMobile, setIsMobile]             = useState(false);
  const user = typeof window !== "undefined" ? getUser() : null;
  const isSuperAdmin = user?.rol === "superadmin";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      getAdminStats()
        .then(r => setAdminStats(r.data))
        .catch(() => setError(true))
        .finally(() => setLoading(false));
      return;
    }

    const cacheKey = `vs_dash_${user?.tenant_id ?? "default"}`;

    // Stale-while-revalidate: mostrar cache inmediatamente si existe (< 5 min)
    let hasCached = false;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const { m, ts } = JSON.parse(raw) as { m: Metricas; ts: number };
        if (Date.now() - ts < 300_000) {
          setMetricas(m);
          setLoading(false);
          hasCached = true;
        }
      }
    } catch { /* localStorage no disponible */ }

    // Fetch fresco siempre (en background si ya hay cache)
    getMetricas(30)
      .then(r => {
        setMetricas(r.data);
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ m: r.data, ts: Date.now() }));
        } catch { }
      })
      .catch(() => { if (!hasCached) setError(true); })
      .finally(() => setLoading(false));

    // Licencia en paralelo, sin bloquear el render de métricas
    getLicencia()
      .then(r => setLicenciaActiva(!!r.data.licencia))
      .catch(() => {});
  }, [isSuperAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, gap: 10 }}>
        <AlertCircle size={28} style={{ color: "#E2E8F0" }} />
        <p style={{ fontSize: 14, margin: 0, color: "#64748B", fontWeight: 500 }}>No se pudo conectar con el backend.</p>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Verificá que NEXT_PUBLIC_API_URL apunte al servidor correcto.</p>
      </div>
    );
  }

  /* ── Superadmin ── */
  if (isSuperAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <PageHeader title="Dashboard" subtitle="Vista global del ecosistema VentaSimple" />

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <Skeleton h={11} w="60%" /><Skeleton h={26} w="70%" /><Skeleton h={12} w="40%" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            <StatCard title="Ventas globales 30d" value={adminStats ? fmt(adminStats.ventas_30d) : "—"} icon={TrendingUp} accent sub={`${adminStats?.cantidad_ventas_30d ?? 0} transacciones`} />
            <StatCard title="Clientes SaaS" value={adminStats?.total ?? "—"} icon={Users} sub={`${adminStats?.activos ?? 0} activos`} />
            <StatCard title="Online ahora" value={adminStats?.online ?? "—"} icon={Wifi} />
            <StatCard title="Productos registrados" value={adminStats?.total_productos?.toLocaleString() ?? "—"} icon={Package} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {[
            { href: "/admin",         icon: Shield, bg: "#EEF2FF", color: "#1E3A8A", title: "Gestionar clientes SaaS",    sub: "Features, planes, suspensión" },
            { href: "/instalaciones", icon: Wifi,   bg: "#DCFCE7", color: "#16A34A", title: "Instalaciones desktop", sub: "Heartbeats, acceso remoto" },
          ].map(({ href, icon: Icon, bg, color, title, sub }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
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

  /* ── Owner ── */
  const sinDatos = metricas && metricas.ventas.cantidad === 0 && (metricas.totales?.total_productos ?? 0) === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title={sinDatos ? `Hola, ${user?.nombre ?? ""}` : "Dashboard"}
        subtitle={sinDatos ? "Bienvenido a Venta Simple" : "Resumen de los últimos 30 días"}
      />

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <Skeleton h={11} w="55%" /><Skeleton h={26} w="65%" /><Skeleton h={11} w="40%" />
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: 20 }}>
            <Skeleton h={180} r={8} />
          </div>
        </div>
      )}

      {!loading && sinDatos && (
        <DashboardEmptyState licenciaActiva={licenciaActiva} nombre={user?.nombre ?? "tu negocio"} />
      )}

      {!loading && metricas && !sinDatos && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            <StatCard title="Ventas" value={fmt(metricas.ventas.total)} icon={TrendingUp} accent sub={`${metricas.ventas.cantidad} operaciones`} />
            <StatCard title="Ticket promedio" value={fmt(metricas.ventas.ticket_promedio)} icon={ShoppingCart} sub="por operación" />
            <StatCard title="Productos" value={metricas.totales?.total_productos ?? "—"} icon={Package} sub="en catálogo" />
            <StatCard title="Clientes" value={metricas.totales?.total_clientes ?? "—"} icon={Users} sub="registrados" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 12, alignItems: "flex-start" }}>
            {/* Chart */}
            <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>Evolución de ventas</p>
                <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, background: "#F8F9FB", padding: "3px 10px", borderRadius: 99, border: "1px solid #E9EAEC" }}>
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
            <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #F1F3F5" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>Top productos</p>
              </div>
              {metricas.top_productos.length === 0 ? (
                <div style={{ padding: "32px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Sin datos aún</p>
                </div>
              ) : (
                <div>
                  {metricas.top_productos.slice(0, 6).map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: i < metricas.top_productos.length - 1 ? "1px solid #F8F9FB" : "none" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: "#F8F9FB", border: "1px solid #E9EAEC", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800, color: "#94A3B8" }}>
                        {i + 1}
                      </span>
                      <span style={{ flex: 1, fontSize: 13, color: "#0F172A", fontWeight: 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.nombre}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", flexShrink: 0 }}>{fmt(p.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alertas stock bajo */}
          {metricas.stock_bajo_minimo.length > 0 && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: "#FEF3C7", display: "grid", placeItems: "center" }}>
                <AlertTriangle size={16} style={{ color: "#D97706" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#B45309", margin: "0 0 8px" }}>
                  {metricas.stock_bajo_minimo.length} producto{metricas.stock_bajo_minimo.length > 1 ? "s" : ""} con stock bajo mínimo
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {metricas.stock_bajo_minimo.map(p => (
                    <Link key={p.id} href="/productos" style={{ textDecoration: "none" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#D97706", background: "#FEF3C7", border: "1px solid #FDE68A", padding: "3px 10px", borderRadius: 99 }}>
                        {p.nombre} <span style={{ opacity: 0.7 }}>({p.stock})</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/productos" style={{ textDecoration: "none", flexShrink: 0 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, background: "#FEF3C7", border: "1px solid #FDE68A", fontSize: 12, fontWeight: 700, color: "#D97706" }}>
                  Ver productos <ArrowRight size={11} />
                </div>
              </Link>
            </div>
          )}
        </>
      )}

      <OnboardingChat />
    </div>
  );
}
