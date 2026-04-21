"use client";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, CreditCard, Package, ShoppingCart, BarChart2,
  Wifi, Globe, TrendingUp,
} from "lucide-react";
import { C } from "./tokens";

/* ─── shared types ───────────────────────────────────────────── */
type Sale = { prod: string; price: string; key: number; isNew: boolean };

const POOL = [
  { prod: "Gaseosa 1.5L",    price: "$950",   amount: 950  },
  { prod: "Yerba 500g",      price: "$1.450", amount: 1450 },
  { prod: "Aceite 900ml",    price: "$2.100", amount: 2100 },
  { prod: "Fideos 500g",     price: "$620",   amount: 620  },
  { prod: "Jabón x500ml",    price: "$1.200", amount: 1200 },
  { prod: "Galletitas 200g", price: "$480",   amount: 480  },
];

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Caja",      icon: CreditCard      },
  { label: "Productos", icon: Package         },
  { label: "Ventas",    icon: ShoppingCart    },
  { label: "Métricas",  icon: BarChart2       },
];

const SCREENS = ["Dashboard", "Métricas"] as const;
type Screen = typeof SCREENS[number];

/* ─── Live badge ─────────────────────────────────────────────── */
function LiveBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 99, padding: "2px 8px 2px 6px" }}>
      <span className="sync-dot" style={{ width: 5, height: 5 }} />
      <span style={{ fontSize: 8, color: "#16A34A", fontWeight: 700 }}>en vivo</span>
    </div>
  );
}

/* ─── Dashboard screen ───────────────────────────────────────── */
function DashboardScreen({ total, tickets, sales }: { total: number; tickets: number; sales: Sale[] }) {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF" }}>Hoy, jueves 17 de abril</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Buenos días, Martín</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
        <div style={{ background: "#1E3A8A", borderRadius: 9, padding: "10px 11px" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.55)", marginBottom: 4 }}>Ventas hoy</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>${total.toLocaleString("es-AR")}</div>
          <div style={{ fontSize: 8.5, color: "#4ADE80", marginTop: 3, fontWeight: 700 }}>+12% vs ayer</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 9, padding: "10px 11px" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", marginBottom: 4 }}>Tickets</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>{tickets}</div>
          <div style={{ fontSize: 8.5, color: "#16A34A", marginTop: 3, fontWeight: 700 }}>hoy</div>
        </div>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 9, padding: "10px 11px" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#D97706", marginBottom: 4 }}>Stock bajo</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#D97706", letterSpacing: "-0.03em", lineHeight: 1 }}>3</div>
          <div style={{ fontSize: 8.5, color: "#D97706", marginTop: 3, fontWeight: 700 }}>productos</div>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 9, overflow: "hidden", flex: 1, minHeight: 0 }}>
        <div style={{ padding: "7px 12px", borderBottom: "1px solid #F1F3F5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#111827" }}>Últimas ventas</span>
          <LiveBadge />
        </div>
        {sales.slice(0, 5).map((s, i) => (
          <div key={s.key} className={s.isNew ? "mockup-row-new" : undefined} style={{
            display: "flex", justifyContent: "space-between", padding: "7px 12px",
            borderBottom: i < 4 ? "1px solid #F8F9FB" : "none",
            background: s.isNew ? "#F0FDF4" : "transparent", transition: "background 1.4s ease",
          }}>
            <span style={{ fontSize: 10, color: "#6B7280" }}>{s.prod}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#111827" }}>{s.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Métricas screen ────────────────────────────────────────── */
function MetricasScreen() {
  const days    = ["L","M","X","J","V","S","D"];
  const lineV   = [42,55,48,68,72,85,95];
  const barV    = [55,70,45,80,65,100,35];
  const W = 340, H = 64;
  const max = Math.max(...lineV);
  const pts = lineV.map((v, i) => ({ x: (i / (lineV.length-1)) * W, y: H-(v/max)*(H-8)-4 }));
  const poly = pts.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 9, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Esta semana</div>
      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 9, padding: "9px 12px" }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", marginBottom: 6 }}>Tendencia de ventas ↑</div>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="dpg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon points={`0,${H} ${poly} ${W},${H}`} fill="url(#dpg)" />
          <polyline points={poly} fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="line-chart-path" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {days.map(d => <span key={d} style={{ fontSize: 8, color: "#C4C9D4" }}>{d}</span>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 9, padding: "9px 11px" }}>
          <div style={{ fontSize: 9, color: "#16A34A", fontWeight: 600 }}>Mejor día</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#15803D", letterSpacing: "-0.03em" }}>$189K</div>
        </div>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 9, padding: "9px 11px" }}>
          <div style={{ fontSize: 9, color: "#1D4ED8", fontWeight: 600 }}>Promedio/día</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#1D4ED8", letterSpacing: "-0.03em" }}>$124K</div>
        </div>
      </div>
      <div style={{ flex: 1, background: "#fff", border: "1px solid #E9EAEC", borderRadius: 9, padding: "9px 12px", display: "flex", flexDirection: "column", gap: 5, minHeight: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#111827" }}>Ventas por día</div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4, minHeight: 0 }}>
          {barV.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: days[i] === "S" ? "#1E3A8A" : "#DBEAFE", height: `${v * 0.38}px` }} />
              <span style={{ fontSize: 8, color: days[i] === "S" ? "#1E3A8A" : "#9CA3AF", fontWeight: days[i] === "S" ? 700 : 500 }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function LandingDashboardPreview() {
  const [active, setActive]   = useState<Screen>("Dashboard");
  const [total, setTotal]     = useState(124500);
  const [tickets, setTickets] = useState(47);
  const [sales, setSales]     = useState<Sale[]>([
    { prod: "Coca-Cola 2.25L",  price: "$1.200", key: 0, isNew: false },
    { prod: "Pan lactal 400g",  price: "$850",   key: 1, isNew: false },
    { prod: "Leche entera 1L",  price: "$750",   key: 2, isNew: false },
    { prod: "Aceite 900ml",     price: "$2.100", key: 3, isNew: false },
    { prod: "Yerba 500g",       price: "$1.450", key: 4, isNew: false },
  ]);
  const dashKey = useRef(5);

  useEffect(() => {
    if (active !== "Dashboard") return;
    const id = setInterval(() => {
      const s   = POOL[Math.floor(Math.random() * POOL.length)];
      const key = dashKey.current++;
      setSales(prev => [{ prod: s.prod, price: s.price, key, isNew: true }, ...prev.slice(0, 4)]);
      setTotal(prev => prev + s.amount);
      setTickets(prev => prev + 1);
      setTimeout(() => setSales(prev => prev.map(r => r.key === key ? { ...r, isNew: false } : r)), 900);
    }, 2500);
    return () => clearInterval(id);
  }, [active]);

  // Cicla automáticamente entre pantallas cada 7s
  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => {
        const i = SCREENS.indexOf(prev);
        return SCREENS[(i + 1) % SCREENS.length];
      });
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ background: C.bgAlt, padding: "88px 0 96px", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container" style={{ maxWidth: 960 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, marginBottom: 12 }}>
            El panel online
          </div>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 12px", lineHeight: 1.1 }}>
            Controlás todo desde el panel.
          </h2>
          <p style={{ fontSize: 15, color: C.muted, fontWeight: 400, margin: 0 }}>
            Ventas, stock y métricas — en tiempo real, desde cualquier lugar.
          </p>
        </div>


        {/* Large PC mockup */}
        <div style={{
          borderRadius: 14, overflow: "hidden",
          border: "1px solid #D1D5DB",
          boxShadow: "0 24px 72px rgba(0,0,0,.12), 0 6px 20px rgba(0,0,0,.06)",
        }}>
          {/* Title bar */}
          <div style={{ padding: "10px 18px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", letterSpacing: "-0.01em" }}>VentaSimple</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span className="sync-dot" />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#16A34A" }}>Sincronizado</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {["#EF4444","#F59E0B","#22C55E"].map((bg, i) => (
                <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: bg, opacity: .6 }} />
              ))}
            </div>
          </div>

          {/* App layout */}
          <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", height: 420, background: "#F9FAFB" }}>

            {/* Sidebar */}
            <div style={{ background: "#F3F4F6", borderRight: "1px solid #E5E7EB", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ padding: "2px 8px 12px" }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: "#1E3A8A", letterSpacing: "-0.03em" }}>VentaSimple</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", flexShrink: 0 }}>M</div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#111827", lineHeight: 1.1 }}>Martín</div>
                    <div style={{ fontSize: 8, color: "#9CA3AF" }}>Propietario</div>
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: "#E5E7EB", margin: "0 4px 6px" }} />
              <div style={{ padding: "0 8px 4px" }}>
                <span style={{ fontSize: 7.5, fontWeight: 800, color: "#C4C9D4", letterSpacing: "0.1em", textTransform: "uppercase" }}>Navegación</span>
              </div>
              {NAV.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  onClick={() => label === "Ventas" || label === "Dashboard" || label === "Métricas"
                    ? setActive(label as Screen)
                    : undefined}
                  style={{
                    padding: "7px 8px", borderRadius: 7, display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
                    background: active === label ? "#DBEAFE" : "transparent",
                    borderLeft: active === label ? "2px solid #1E3A8A" : "2px solid transparent",
                    transition: "background .2s, border-left-color .2s",
                  }}
                >
                  <Icon size={11} strokeWidth={active === label ? 2.2 : 1.8} style={{ color: active === label ? "#1E3A8A" : "#9CA3AF", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: active === label ? 700 : 500, color: active === label ? "#1E3A8A" : "#9CA3AF" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Active screen */}
            <div key={active} className="mockup-screen" style={{ overflow: "hidden", height: "100%", minHeight: 0 }}>
              {active === "Dashboard" && <DashboardScreen total={total} tickets={tickets} sales={sales} />}
              {active === "Métricas"  && <MetricasScreen />}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16, marginTop: 48,
        }}>
          {([
            {
              Icon: Wifi,
              title: "Siempre sincronizado",
              desc: "Cada venta se sincroniza automáticamente en cuanto tenés conexión.",
            },
            {
              Icon: Globe,
              title: "Gestioná desde cualquier lugar",
              desc: "Accedé al panel web desde el celular, tablet o cualquier navegador.",
            },
            {
              Icon: TrendingUp,
              title: "Métricas inteligentes",
              desc: "Visualizá ventas, productos más vendidos y tendencias en tiempo real.",
            },
          ] as const).map(({ Icon, title, desc }) => (
            <div key={title} style={{
              display: "flex", gap: 14, padding: "20px",
              borderRadius: 12, background: C.surface,
              border: `1px solid ${C.border}`,
              boxShadow: "0 2px 8px rgba(0,0,0,.04)",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: "#EFF6FF", border: "1px solid #DBEAFE",
                display: "grid", placeItems: "center",
              }}>
                <Icon size={17} strokeWidth={1.8} style={{ color: C.blue }} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, marginBottom: 4, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, fontWeight: 400 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
