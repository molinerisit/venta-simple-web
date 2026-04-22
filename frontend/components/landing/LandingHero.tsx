"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Wifi, Smartphone, RefreshCw,
  LayoutDashboard, Package, ShoppingCart, BarChart2, CreditCard,
} from "lucide-react";
import { C } from "./tokens";

const MICRO = [
  { icon: RefreshCw,   label: "Cobro en segundos — sin buscar precios a mano" },
  { icon: Wifi,        label: "Se sincroniza cuando tenés internet"            },
  { icon: Smartphone,  label: "Gestioná desde el panel web — sin moverte"     },
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

const PC_SCREENS = ["Ventas", "Dashboard", "Métricas"] as const;

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
          <div style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>${total.toLocaleString("es-AR")}</div>
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
          <div key={s.key} className={s.isNew ? "mockup-row-new" : undefined} style={{ display: "flex", justifyContent: "space-between", padding: "5px 9px", borderBottom: i < 3 ? "1px solid #F8F9FB" : "none", background: s.isNew ? "#F0FDF4" : "transparent", transition: "background 1.4s ease" }}>
            <span style={{ fontSize: 8.5, color: "#6B7280" }}>{s.prod}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827" }}>{s.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricasScreen() {
  const days     = ["L", "M", "X", "J", "V", "S", "D"];
  const lineVals = [42, 55, 48, 68, 72, 85, 95];
  const barVals  = [55, 70, 45, 80, 65, 100, 35];
  const W = 260, H = 52;
  const max = Math.max(...lineVals);
  const pts = lineVals.map((v, i) => ({ x: (i / (lineVals.length - 1)) * W, y: H - (v / max) * (H - 6) - 3 }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 7, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Esta semana</div>
      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, padding: "7px 9px" }}>
        <div style={{ fontSize: 7.5, fontWeight: 600, color: "#9CA3AF", marginBottom: 5 }}>Tendencia de ventas ↑</div>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="mg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,${H} ${polyline} ${W},${H}`} fill="url(#mg2)" />
          <polyline points={polyline} fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="line-chart-path" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {days.map(d => <span key={d} style={{ fontSize: 7, color: "#C4C9D4" }}>{d}</span>)}
        </div>
      </div>
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
      <div style={{ flex: 1, background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, padding: "7px 9px", display: "flex", flexDirection: "column", gap: 4, minHeight: 0 }}>
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

function LiveBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 99, padding: "2px 7px 2px 5px" }}>
      <span className="sync-dot" style={{ width: 5, height: 5 }} />
      <span style={{ fontSize: 7.5, color: "#16A34A", fontWeight: 700 }}>en vivo</span>
    </div>
  );
}

function PCVentasScreen({ rows, total }: { rows: VentasRow[]; total: number }) {
  return (
    <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 8, height: "100%", minHeight: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Ventas de hoy</div>
        <LiveBadge />
      </div>

      <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 7, overflow: "hidden", flex: 1, minHeight: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 54px", padding: "5px 9px", borderBottom: "1px solid #F1F3F5", gap: 6 }}>
          {["Hora", "Producto", "Monto"].map(h => (
            <span key={h} style={{ fontSize: 7.5, fontWeight: 700, color: "#9CA3AF" }}>{h}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={r.key}
            className={r.isNew ? "mockup-row-new" : undefined}
            style={{
              display: "grid", gridTemplateColumns: "36px 1fr 54px",
              padding: "6px 9px", gap: 6, alignItems: "center",
              borderBottom: i < rows.length - 1 ? "1px solid #F8F9FB" : "none",
              background: r.isNew ? "#F0FDF4" : "transparent",
              transition: "background 1.4s ease",
            }}
          >
            <span style={{ fontSize: 8, color: "#9CA3AF" }}>{r.time}</span>
            <span style={{ fontSize: 8.5, color: "#374151", fontWeight: r.isNew ? 700 : 500 }}>{r.prod}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827", textAlign: "right" }}>{r.price}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1E3A8A", borderRadius: 7, padding: "8px 11px" }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.7)" }}>Total del día</span>
        <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>${total.toLocaleString("es-AR")}</span>
      </div>
    </div>
  );
}

function PhoneDashboard({ total, tickets }: { total: number; tickets: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "11px 11px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 8.5, fontWeight: 600, color: "#9CA3AF" }}>jue 17 de abril</div>
          <LiveBadge />
        </div>

        <div style={{ background: "#1E3A8A", borderRadius: 9, padding: "11px 12px" }}>
          <div style={{ fontSize: 7.5, fontWeight: 600, color: "rgba(255,255,255,.55)", marginBottom: 3 }}>Ventas hoy</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>${total.toLocaleString("es-AR")}</div>
          <div style={{ fontSize: 7.5, color: "#4ADE80", marginTop: 4, fontWeight: 700 }}>+12% vs ayer</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "8px 9px" }}>
            <div style={{ fontSize: 7, color: "#16A34A", fontWeight: 600 }}>Tickets</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#15803D", letterSpacing: "-0.02em" }}>{tickets}</div>
          </div>
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 9px" }}>
            <div style={{ fontSize: 7, color: "#D97706", fontWeight: 600 }}>Stock ⚠</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#D97706", letterSpacing: "-0.02em" }}>3</div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 8, padding: "8px 9px" }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: "#9CA3AF", marginBottom: 5 }}>Tendencia semanal</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22 }}>
            {[35, 52, 41, 68, 60, 85, 95].map((v, i) => (
              <div key={i} style={{ flex: 1, borderRadius: "1px 1px 0 0", background: i === 6 ? "#1E3A8A" : "#DBEAFE", height: `${v * 0.23}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ borderTop: "1px solid #E9EAEC", padding: "7px 0 5px", display: "flex", justifyContent: "space-around" }}>
        {["▦", "↗", "☰"].map((icon, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 11, color: i === 0 ? "#1E3A8A" : "#C4C9D4" }}>{icon}</span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: i === 0 ? "#1E3A8A" : "transparent" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingHero() {
  const [active, setActive]   = useState<typeof PC_SCREENS[number]>("Ventas");
  const [total, setTotal]     = useState(124500);
  const [tickets, setTickets] = useState(47);
  const [sales, setSales]     = useState<Sale[]>([
    { prod: "Coca-Cola 2.25L",  price: "$1.200", key: 0, isNew: false },
    { prod: "Pan lactal 400g",  price: "$850",   key: 1, isNew: false },
    { prod: "Leche entera 1L",  price: "$750",   key: 2, isNew: false },
  ]);
  const [rows, setRows]       = useState<VentasRow[]>([
    { time: "14:32", prod: "Coca-Cola 2.25L",  price: "$1.200", key: 10, isNew: false },
    { time: "14:28", prod: "Yerba mate 500g",   price: "$1.450", key: 11, isNew: false },
    { time: "14:21", prod: "Aceite 900ml",      price: "$2.100", key: 12, isNew: false },
    { time: "14:15", prod: "Pan lactal 400g",   price: "$850",   key: 13, isNew: false },
    { time: "14:08", prod: "Leche entera 1L",   price: "$750",   key: 14, isNew: false },
  ]);
  const [phoneTotal, setPhoneTotal] = useState(124500);
  const dashKey  = useRef(3);
  const ventasKey = useRef(15);

  // Ventas live animation
  useEffect(() => {
    if (active !== "Ventas") return;
    const id = setInterval(() => {
      const s   = SALE_POOL[Math.floor(Math.random() * SALE_POOL.length)];
      const key = ventasKey.current++;
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      setRows(prev => [{ prod: s.prod, price: s.price, key, isNew: true, time }, ...prev.slice(0, 4)]);
      setTotal(prev => prev + s.amount);
      setTickets(prev => prev + 1);
      setTimeout(() => setRows(prev => prev.map(r => r.key === key ? { ...r, isNew: false } : r)), 900);
    }, 2500);
    return () => clearInterval(id);
  }, [active]);

  // Dashboard live animation
  useEffect(() => {
    if (active !== "Dashboard") return;
    const id = setInterval(() => {
      const s   = SALE_POOL[Math.floor(Math.random() * SALE_POOL.length)];
      const key = dashKey.current++;
      setSales(prev => [{ prod: s.prod, price: s.price, key, isNew: true }, ...prev.slice(0, 3)]);
      setTotal(prev => prev + s.amount);
      setTickets(prev => prev + 1);
      setTimeout(() => setSales(prev => prev.map(r => r.key === key ? { ...r, isNew: false } : r)), 900);
    }, 2500);
    return () => clearInterval(id);
  }, [active]);

  // Autoplay — cambia de pantalla cada 7s
  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => {
        const i = PC_SCREENS.indexOf(prev);
        return PC_SCREENS[(i + 1) % PC_SCREENS.length];
      });
    }, 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhoneTotal(total), 1500);
    return () => clearTimeout(t);
  }, [total]);

  return (
    <section style={{ background: C.heroBg, padding: "64px 0 80px" }}>
      <div className="l-container" style={{ position: "relative", zIndex: 1 }}>
        <div className="l-hero-grid">

          {/* Columna texto */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22, padding: "4px 12px 4px 9px", borderRadius: 99, border: "1px solid rgba(255,255,255,.14)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.58)", fontWeight: 500 }}>
                +500 negocios en Argentina ya venden con VentaSimple
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(28px, 3.2vw, 46px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 16px" }}>
              Tu negocio funcionando<br />
              rápido, ordenado y<br />
              <span style={{ color: C.orange }}>bajo control.</span>
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,.70)", maxWidth: 420, margin: "0 0 6px" }}>
              Vendé en tu PC. Controlá todo desde el celular, en tiempo real.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.42)", maxWidth: 400, margin: "0 0 22px", fontStyle: "italic" }}>
              Usado por kioscos, almacenes y ferreterías que dejaron de improvisar.
            </p>

            <div className="l-hero-btns">
              <Link href="/registro" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none", background: C.orange, color: "#fff", letterSpacing: "-0.01em" }}>
                Empezar gratis — probalo en tu negocio
              </Link>
              <a href="#como-funciona" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13.5, textDecoration: "none", color: "rgba(255,255,255,.80)", border: "1px solid rgba(255,255,255,.28)" }}>
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 16 }}>
              {["Dejás de perder ventas por errores", "Sabés exactamente cuánto ganás"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,.55)" }}>
                  <Check size={11} strokeWidth={3} style={{ color: "#22C55E", flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup PC + Phone */}
          <div className="l-hero-mockup" style={{ overflow: "visible" }}>
            <div style={{ marginBottom: 10, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.38)", fontWeight: 500 }}>Mirá tus ventas en tiempo real →</span>
            </div>

            <div className="l-mockup-pc-wrap" style={{ position: "relative", paddingBottom: 84 }}>

              {/* PC Frame */}
              <div className="l-mockup-pc" style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 16px 48px rgba(0,0,0,.28)", background: "#F3F4F6" }}>

                {/* Title bar */}
                <div style={{ padding: "8px 14px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", height: 258, overflow: "hidden" }}>

                  {/* Sidebar */}
                  <div style={{ background: "#F3F4F6", borderRight: "1px solid #E5E7EB", padding: "10px 7px", display: "flex", flexDirection: "column", gap: 1, overflow: "hidden" }}>
                    <div style={{ padding: "2px 6px 8px" }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: "#1E3A8A", letterSpacing: "-0.03em" }}>VentaSimple</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7.5, fontWeight: 800, color: "#fff", flexShrink: 0 }}>M</div>
                        <div>
                          <div style={{ fontSize: 7.5, fontWeight: 600, color: "#111827", lineHeight: 1.1 }}>Martín</div>
                          <div style={{ fontSize: 6.5, color: "#9CA3AF" }}>Propietario</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: "#E5E7EB", margin: "0 2px 4px" }} />
                    <div style={{ padding: "0 6px 3px" }}>
                      <span style={{ fontSize: 6.5, fontWeight: 800, color: "#C4C9D4", letterSpacing: "0.1em", textTransform: "uppercase" }}>Navegación</span>
                    </div>
                    {NAV_ITEMS.map(({ label, icon: Icon }) => (
                      <div key={label} style={{ padding: "5px 6px", borderRadius: 6, display: "flex", alignItems: "center", gap: 5, background: active === label ? "#DBEAFE" : "transparent", borderLeft: active === label ? "2px solid #1E3A8A" : "2px solid transparent", transition: "background .2s, border-left-color .2s" }}>
                        <Icon size={9} strokeWidth={active === label ? 2.2 : 1.8} style={{ color: active === label ? "#1E3A8A" : "#9CA3AF", flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: active === label ? 700 : 500, color: active === label ? "#1E3A8A" : "#9CA3AF" }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pantalla activa */}
                  <div key={active} className="mockup-screen" style={{ background: "#F9FAFB", overflow: "hidden", height: "100%", minHeight: 0 }}>
                    {active === "Ventas"    && <PCVentasScreen rows={rows} total={total} />}
                    {active === "Dashboard" && <DashboardScreen total={total} tickets={tickets} sales={sales} />}
                    {active === "Métricas"  && <MetricasScreen />}
                  </div>

                </div>
              </div>

              {/* Phone */}
              <div className="l-mockup-phone" style={{ position: "absolute", bottom: -24, right: -18, width: 168, background: "#111827", borderRadius: 24, padding: "13px 8px 10px", boxShadow: "0 20px 56px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.09)" }}>
                <div style={{ width: 38, height: 4, borderRadius: 2, background: "#374151", margin: "0 auto 10px" }} />
                <div style={{ background: "#F9FAFB", borderRadius: 14, overflow: "hidden" }}>
                  <PhoneDashboard total={phoneTotal} tickets={tickets} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Micro bloque */}
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.08)" }}>
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
