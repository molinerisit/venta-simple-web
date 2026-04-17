"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Monitor, Globe, RefreshCw, LayoutDashboard, Package, ShoppingCart, BarChart2, CreditCard } from "lucide-react";
import { C } from "./tokens";

const MICRO = [
  { icon: Monitor,   label: "Funciona sin conexión"                  },
  { icon: Globe,     label: "Accedé desde cualquier lugar"           },
  { icon: RefreshCw, label: "Todo se sincroniza automáticamente"     },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Caja",      icon: CreditCard      },
  { label: "Productos", icon: Package         },
  { label: "Ventas",    icon: ShoppingCart    },
  { label: "Métricas",  icon: BarChart2       },
];

const SALE_POOL = [
  { prod: "Gaseosa 1.5L",    price: "$950",   amount: 950   },
  { prod: "Yerba 500g",      price: "$1.450", amount: 1450  },
  { prod: "Aceite 900ml",    price: "$2.100", amount: 2100  },
  { prod: "Fideos 500g",     price: "$620",   amount: 620   },
  { prod: "Jabón x500ml",    price: "$1.200", amount: 1200  },
  { prod: "Galletitas 200g", price: "$480",   amount: 480   },
];

type Sale      = { prod: string; price: string; key: number; isNew: boolean };
type VentasRow = Sale & { time: string };

function LiveBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span className="sync-dot" style={{ width: 5, height: 5 }} />
      <span style={{ fontSize: 7.5, color: "#16A34A", fontWeight: 600 }}>en vivo</span>
    </div>
  );
}

function DashboardScreen({ total, tickets, sales }: { total: number; tickets: number; sales: Sale[] }) {
  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div>
        <div style={{ fontSize: 8.5, fontWeight: 600, color: "#9CA3AF" }}>Hoy, jueves 17 de abril</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Buenos días, Martín</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
        <div style={{ background: "#1E3A8A", borderRadius: 7, padding: "8px" }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: "rgba(255,255,255,.55)", marginBottom: 3 }}>Ventas hoy</div>
          <div style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
            ${total.toLocaleString("es-AR")}
          </div>
          <div style={{ fontSize: 7, color: "#4ADE80", marginTop: 2, fontWeight: 700 }}>+12% vs ayer</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, padding: "8px" }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: "#9CA3AF", marginBottom: 3 }}>Tickets</div>
          <div style={{ fontSize: 11, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>{tickets}</div>
          <div style={{ fontSize: 7, color: "#16A34A", marginTop: 2, fontWeight: 700 }}>hoy</div>
        </div>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 7, padding: "8px" }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: "#D97706", marginBottom: 3 }}>Stock bajo</div>
          <div style={{ fontSize: 11, fontWeight: 900, color: "#D97706", letterSpacing: "-0.03em", lineHeight: 1 }}>3</div>
          <div style={{ fontSize: 7, color: "#D97706", marginTop: 2, fontWeight: 700 }}>productos</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, overflow: "hidden", flex: 1, minHeight: 0 }}>
        <div style={{ padding: "5px 9px", borderBottom: "1px solid #F1F3F5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827" }}>Últimas ventas</span>
          <LiveBadge />
        </div>
        {sales.slice(0, 4).map((s, i) => (
          <div
            key={s.key}
            className={s.isNew ? "mockup-row-new" : undefined}
            style={{
              display: "flex", justifyContent: "space-between",
              padding: "5px 9px",
              borderBottom: i < 3 ? "1px solid #F8F9FB" : "none",
              background: s.isNew ? "#F0FDF4" : "transparent",
              transition: "background 1.2s ease",
            }}
          >
            <span style={{ fontSize: 8.5, color: "#6B7280", fontWeight: 500 }}>{s.prod}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827" }}>{s.price}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 7, padding: "6px 9px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />
        <span style={{ fontSize: 8, fontWeight: 800, color: "#92400E" }}>⚠ Stock bajo: Coca Cola (3) · Pan lactal (2)</span>
      </div>
    </div>
  );
}

function VentasScreen({ rows, total }: { rows: VentasRow[]; total: number }) {
  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Ventas de hoy</div>
        <LiveBadge />
      </div>
      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, overflow: "hidden", flex: 1, minHeight: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 50px", padding: "5px 9px", borderBottom: "1px solid #F1F3F5", gap: 6 }}>
          {["Hora", "Producto", "Monto"].map(h => (
            <span key={h} style={{ fontSize: 7.5, fontWeight: 700, color: "#9CA3AF" }}>{h}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={r.key}
            className={r.isNew ? "mockup-row-new" : undefined}
            style={{ display: "grid", gridTemplateColumns: "36px 1fr 50px", padding: "6px 9px", borderBottom: i < rows.length - 1 ? "1px solid #F8F9FB" : "none", gap: 6, alignItems: "center", background: r.isNew ? "#F0FDF4" : "transparent", transition: "background 1.2s ease" }}
          >
            <span style={{ fontSize: 8, color: "#9CA3AF" }}>{r.time}</span>
            <span style={{ fontSize: 8.5, color: "#374151", fontWeight: r.isNew ? 700 : 500 }}>{r.prod}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827", textAlign: "right" }}>{r.price}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EFF6FF", borderRadius: 7, padding: "7px 9px", border: "1px solid #BFDBFE" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#1D4ED8" }}>Total del día</span>
        <span style={{ fontSize: 10, fontWeight: 900, color: "#1D4ED8" }}>${total.toLocaleString("es-AR")}</span>
      </div>
    </div>
  );
}

function ProductosScreen() {
  const prods = [
    { name: "Coca-Cola 2.25L",  stock: 3,  max: 24, warn: true  },
    { name: "Yerba 500g",       stock: 18, max: 30, warn: false },
    { name: "Aceite 900ml",     stock: 2,  max: 12, warn: true  },
    { name: "Leche 1L",         stock: 24, max: 36, warn: false },
    { name: "Pan lactal 400g",  stock: 2,  max: 20, warn: true  },
  ];
  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Inventario</div>
      <div style={{ background: "#F3F4F6", borderRadius: 6, padding: "5px 9px", fontSize: 8.5, color: "#9CA3AF" }}>
        🔍 Buscar producto...
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 5 }}>
        {prods.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${p.warn ? "#FDE68A" : "#E9EAEC"}`, borderRadius: 6, padding: "6px 9px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{p.name}</div>
              <div style={{ height: 3, borderRadius: 2, background: "#F3F4F6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(p.stock / p.max) * 100}%`, background: p.warn ? "#F97316" : "#22C55E", borderRadius: 2 }} />
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: p.warn ? "#D97706" : "#374151", flexShrink: 0, width: 28, textAlign: "right" }}>{p.stock}u.</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CajaScreen({ success, onCobrar }: { success: boolean; onCobrar: () => void }) {
  const items = [
    { prod: "Coca-Cola 2.25L",  qty: 2, price: "$2.400" },
    { prod: "Pan lactal 400g",  qty: 1, price: "$850"   },
    { prod: "Leche 1L",         qty: 3, price: "$2.250" },
  ];
  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Caja — Venta actual</div>
      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, overflow: "hidden", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 50px", padding: "5px 9px", borderBottom: "1px solid #F1F3F5", gap: 4 }}>
          {["Producto", "Cant", "Total"].map(h => (
            <span key={h} style={{ fontSize: 7.5, fontWeight: 700, color: "#9CA3AF" }}>{h}</span>
          ))}
        </div>
        {items.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 28px 50px", padding: "6px 9px", borderBottom: i < items.length - 1 ? "1px solid #F8F9FB" : "none", gap: 4, alignItems: "center", opacity: success ? 0.4 : 1, transition: "opacity .3s" }}>
            <span style={{ fontSize: 8.5, color: "#374151" }}>{r.prod}</span>
            <span style={{ fontSize: 8.5, color: "#6B7280", textAlign: "center" }}>{r.qty}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827", textAlign: "right" }}>{r.price}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1E3A8A", borderRadius: 7, padding: "9px 12px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>Total</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>$5.500</span>
      </div>

      {success ? (
        <div className="cobrar-success" style={{ background: "#16A34A", borderRadius: 6, padding: "9px", textAlign: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>✓ ¡Venta registrada!</span>
        </div>
      ) : (
        <div
          onClick={onCobrar}
          style={{ background: C.orange, borderRadius: 6, padding: "7px", textAlign: "center", cursor: "pointer" }}
        >
          <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>Cobrar</span>
        </div>
      )}
    </div>
  );
}

function MetricasScreen() {
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const lineVals = [42, 55, 48, 68, 72, 85, 95];
  const barVals  = [55, 70, 45, 80, 65, 100, 35];

  const W = 260, H = 52;
  const max = Math.max(...lineVals);
  const pts = lineVals.map((v, i) => {
    const x = (i / (lineVals.length - 1)) * W;
    const y = H - (v / max) * (H - 6) - 3;
    return { x, y };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = `0,${H} ${polyline} ${W},${H}`;

  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 7, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Esta semana</div>

      {/* Gráfico lineal animado */}
      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, padding: "7px 9px" }}>
        <div style={{ fontSize: 7.5, fontWeight: 600, color: "#9CA3AF", marginBottom: 5 }}>Tendencia de ventas ↑</div>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPath} fill="url(#mg)" />
          <polyline
            points={polyline}
            fill="none" stroke="#1E3A8A" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="line-chart-path"
          />
          {pts.map((p, i) => (
            <circle
              key={i} cx={p.x} cy={p.y} r="2.5"
              fill="#fff" stroke="#1E3A8A" strokeWidth="1.5"
              className="line-chart-dot"
              style={{ animationDelay: `${0.15 + (i / (pts.length - 1)) * 1.25}s` }}
            />
          ))}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {days.map(d => <span key={d} style={{ fontSize: 7, color: "#C4C9D4" }}>{d}</span>)}
        </div>
      </div>

      {/* Stats compactos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 7, padding: "7px" }}>
          <div style={{ fontSize: 7.5, color: "#16A34A", fontWeight: 600 }}>Mejor día</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#15803D", letterSpacing: "-0.03em" }}>$189K</div>
        </div>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 7, padding: "7px" }}>
          <div style={{ fontSize: 7.5, color: "#1D4ED8", fontWeight: 600 }}>Promedio/día</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#1D4ED8", letterSpacing: "-0.03em" }}>$124K</div>
        </div>
      </div>

      {/* Barras por día */}
      <div style={{ flex: 1, background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, padding: "7px 9px", display: "flex", flexDirection: "column", gap: 5, minHeight: 0 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#111827" }}>Ventas por día</div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3, minHeight: 0 }}>
          {barVals.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: "100%", borderRadius: "2px 2px 0 0", background: days[i] === "S" ? "#1E3A8A" : "#DBEAFE", height: `${v * 0.32}px` }} />
              <span style={{ fontSize: 7, color: days[i] === "S" ? "#1E3A8A" : "#9CA3AF", fontWeight: days[i] === "S" ? 700 : 500 }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingHero() {
  const [active, setActive]         = useState("Dashboard");
  const [total, setTotal]           = useState(124500);
  const [tickets, setTickets]       = useState(47);
  const [sales, setSales]           = useState<Sale[]>([
    { prod: "Coca-Cola 2.25L",  price: "$1.200", key: 0, isNew: false },
    { prod: "Pan lactal 400g",  price: "$850",   key: 1, isNew: false },
    { prod: "Leche entera 1L",  price: "$750",   key: 2, isNew: false },
  ]);
  const [ventasTotal, setVentasTotal] = useState(124500);
  const [ventasRows, setVentasRows] = useState<VentasRow[]>([
    { time: "14:32", prod: "Coca-Cola 2.25L",  price: "$1.200", key: 10, isNew: false },
    { time: "14:28", prod: "Yerba mate 500g",   price: "$1.450", key: 11, isNew: false },
    { time: "14:21", prod: "Aceite 900ml",      price: "$2.100", key: 12, isNew: false },
    { time: "14:15", prod: "Pan lactal 400g",   price: "$850",   key: 13, isNew: false },
    { time: "14:08", prod: "Leche entera 1L",   price: "$750",   key: 14, isNew: false },
  ]);
  const [cajaSuccess, setCajaSuccess] = useState(false);
  const keyRef        = useRef(3);
  const ventasKey     = useRef(15);
  const pausedUntil   = useRef(0);

  useEffect(() => {
    if (active !== "Dashboard") return;
    const id = setInterval(() => {
      const s   = SALE_POOL[Math.floor(Math.random() * SALE_POOL.length)];
      const key = keyRef.current++;
      setSales(prev => [{ prod: s.prod, price: s.price, key, isNew: true }, ...prev.slice(0, 3)]);
      setTotal(prev => prev + s.amount);
      setTickets(prev => prev + 1);
      setTimeout(() => setSales(prev => prev.map(r => r.key === key ? { ...r, isNew: false } : r)), 900);
    }, 2500);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (active !== "Ventas") return;
    const id = setInterval(() => {
      const s   = SALE_POOL[Math.floor(Math.random() * SALE_POOL.length)];
      const key = ventasKey.current++;
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      setVentasRows(prev => [{ prod: s.prod, price: s.price, key, isNew: true, time }, ...prev.slice(0, 4)]);
      setVentasTotal(prev => prev + s.amount);
      setTimeout(() => setVentasRows(prev => prev.map(r => r.key === key ? { ...r, isNew: false } : r)), 900);
    }, 2500);
    return () => clearInterval(id);
  }, [active]);

  const handleCobrar = () => {
    setCajaSuccess(true);
    setTimeout(() => setCajaSuccess(false), 2000);
  };

  const handleNavClick = (item: string) => {
    setActive(item);
    pausedUntil.current = Date.now() + 12000;
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setActive(prev => {
        const i = NAV_ITEMS.findIndex(n => n.label === prev);
        return NAV_ITEMS[(i + 1) % NAV_ITEMS.length].label;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ background: C.heroBg, padding: "104px 0 132px" }}>
      <div className="l-container" style={{ position: "relative", zIndex: 1 }}>
        <div className="l-hero-grid">

          {/* Columna texto */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px 5px 10px", borderRadius: 99, border: "1px solid rgba(255,255,255,.14)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,.58)", fontWeight: 500 }}>
                Soporte real · respondemos en menos de 5 min
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(40px, 5.2vw, 64px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 28px" }}>
              Vendé más, controlá<br />
              tu stock y hacé<br />
              crecer tu negocio.
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,.60)", maxWidth: 440, margin: "0 0 44px" }}>
              Cobrá más rápido, evitá errores y tené el control de tu negocio en todo momento.
              Funciona sin internet y se sincroniza automáticamente cuando volvés a tener conexión.
            </p>

            <div className="l-hero-btns">
              <Link href="/registro" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none", background: C.orange, color: "#fff", letterSpacing: "-0.01em" }}>
                Empezar gratis — sin tarjeta <ArrowRight size={15} />
              </Link>
              <a href="#como-funciona" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none", color: "rgba(255,255,255,.80)", border: "1px solid rgba(255,255,255,.28)" }}>
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {["Sin tarjeta de crédito", "Empezás en minutos", "Cancelás cuando quieras"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.62)" }}>
                  <Check size={12} strokeWidth={3} style={{ color: "#22C55E", flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup interactivo */}
          <div className="l-hero-mockup">
            <div style={{ marginBottom: 10, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.38)", fontWeight: 500 }}>Probá el sistema en acción →</span>
            </div>
            <div style={{ width: "100%", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", background: "#F3F4F6" }}>

              {/* Title bar */}
              <div style={{ padding: "9px 14px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>VentaSimple</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="sync-dot" />
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#16A34A" }}>Sincronizado</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#E5E7EB" }} />)}
                </div>
              </div>

              {/* App layout */}
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", height: 330, overflow: "hidden" }}>

                {/* Sidebar navegable */}
                <div style={{ background: "#F3F4F6", borderRight: "1px solid #E5E7EB", padding: "10px 7px 10px", display: "flex", flexDirection: "column", gap: 1, overflow: "hidden" }}>

                  {/* Logo */}
                  <div style={{ padding: "2px 6px 8px" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 900, color: "#1E3A8A", letterSpacing: "-0.03em" }}>VentaSimple</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", flexShrink: 0 }}>M</div>
                      <div>
                        <div style={{ fontSize: 8, fontWeight: 600, color: "#111827", lineHeight: 1.1 }}>Martín</div>
                        <div style={{ fontSize: 7, color: "#9CA3AF" }}>Propietario</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#E5E7EB", margin: "0 2px 5px" }} />

                  {/* Sección label */}
                  <div style={{ padding: "0 6px 3px" }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color: "#C4C9D4", letterSpacing: "0.1em", textTransform: "uppercase" }}>Navegación</span>
                  </div>

                  {NAV_ITEMS.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      onClick={() => handleNavClick(label)}
                      style={{
                        padding: "6px 7px", borderRadius: 6,
                        display: "flex", alignItems: "center", gap: 6,
                        cursor: "pointer", userSelect: "none",
                        background: active === label ? "#DBEAFE" : "transparent",
                        borderLeft: active === label ? "2px solid #1E3A8A" : "2px solid transparent",
                        transition: "background .12s, border-left-color .12s",
                      }}
                    >
                      <Icon size={10} strokeWidth={active === label ? 2.2 : 1.8} style={{ color: active === label ? "#1E3A8A" : "#9CA3AF", flexShrink: 0 }} />
                      <span style={{ fontSize: 9.5, fontWeight: active === label ? 700 : 500, color: active === label ? "#1E3A8A" : "#9CA3AF" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pantalla activa */}
                <div key={active} className="mockup-screen" style={{ background: "#F9FAFB", overflow: "hidden", height: "100%", minHeight: 0 }}>
                  {active === "Dashboard" && <DashboardScreen total={total} tickets={tickets} sales={sales} />}
                  {active === "Ventas"    && <VentasScreen rows={ventasRows} total={ventasTotal} />}
                  {active === "Productos" && <ProductosScreen />}
                  {active === "Caja"      && <CajaScreen success={cajaSuccess} onCobrar={handleCobrar} />}
                  {active === "Métricas"  && <MetricasScreen />}
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Micro bloque — iconos azul */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,.08)" }}>
          {MICRO.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={16} style={{ color: "#60A5FA", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.62)" }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
