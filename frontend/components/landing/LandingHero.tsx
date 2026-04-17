"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Monitor, Globe, RefreshCw,
  LayoutDashboard, Package, ShoppingCart, BarChart2, CreditCard,
} from "lucide-react";
import { C } from "./tokens";

const MICRO = [
  { icon: Monitor,   label: "Funciona sin conexión"               },
  { icon: Globe,     label: "Accedé desde cualquier lugar"        },
  { icon: RefreshCw, label: "Todo se sincroniza automáticamente"  },
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

type VentasRow = { prod: string; price: string; time: string; key: number; isNew: boolean };

function LiveBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span className="sync-dot" style={{ width: 5, height: 5 }} />
      <span style={{ fontSize: 7.5, color: "#16A34A", fontWeight: 600 }}>en vivo</span>
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

function MobileScreen({ total, tickets }: { total: number; tickets: number }) {
  return (
    <div style={{ padding: "8px 8px 6px", display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ fontSize: 7.5, fontWeight: 600, color: "#9CA3AF" }}>Hoy · jue 17</div>

      <div style={{ background: "#1E3A8A", borderRadius: 8, padding: "8px 9px" }}>
        <div style={{ fontSize: 6.5, fontWeight: 600, color: "rgba(255,255,255,.55)", marginBottom: 2 }}>Ventas hoy</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>${total.toLocaleString("es-AR")}</div>
        <div style={{ fontSize: 6.5, color: "#4ADE80", marginTop: 3, fontWeight: 700 }}>+12% vs ayer</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 7, padding: "5px 6px" }}>
          <div style={{ fontSize: 6, color: "#16A34A", fontWeight: 600 }}>Tickets</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#15803D", letterSpacing: "-0.02em" }}>{tickets}</div>
        </div>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 7, padding: "5px 6px" }}>
          <div style={{ fontSize: 6, color: "#D97706", fontWeight: 600 }}>Stock ⚠</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#D97706", letterSpacing: "-0.02em" }}>3</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6 }}>
        <span className="sync-dot" style={{ width: 4, height: 4 }} />
        <span style={{ fontSize: 6.5, color: "#16A34A", fontWeight: 600 }}>Sincronizado</span>
      </div>
    </div>
  );
}

export default function LandingHero() {
  const [total, setTotal]       = useState(124500);
  const [tickets, setTickets]   = useState(47);
  const [rows, setRows]         = useState<VentasRow[]>([
    { time: "14:32", prod: "Coca-Cola 2.25L",  price: "$1.200", key: 10, isNew: false },
    { time: "14:28", prod: "Yerba mate 500g",   price: "$1.450", key: 11, isNew: false },
    { time: "14:21", prod: "Aceite 900ml",      price: "$2.100", key: 12, isNew: false },
    { time: "14:15", prod: "Pan lactal 400g",   price: "$850",   key: 13, isNew: false },
  ]);
  const [phoneTotal, setPhoneTotal] = useState(124500);
  const keyRef = useRef(15);

  useEffect(() => {
    const id = setInterval(() => {
      const s   = SALE_POOL[Math.floor(Math.random() * SALE_POOL.length)];
      const key = keyRef.current++;
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      setRows(prev => [{ prod: s.prod, price: s.price, key, isNew: true, time }, ...prev.slice(0, 3)]);
      setTotal(prev => prev + s.amount);
      setTickets(prev => prev + 1);
      setTimeout(() => setRows(prev => prev.map(r => r.key === key ? { ...r, isNew: false } : r)), 900);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhoneTotal(total), 1500);
    return () => clearTimeout(t);
  }, [total]);

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

          {/* Mockup PC + Mobile */}
          <div className="l-hero-mockup">
            <div style={{ marginBottom: 10, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.38)", fontWeight: 500 }}>Vendé en la PC. Controlá desde tu celular →</span>
            </div>

            <div style={{ position: "relative", paddingBottom: 56 }}>

              {/* PC Frame */}
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 16px 48px rgba(0,0,0,.28)", background: "#F3F4F6" }}>

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
                      <div key={label} style={{ padding: "5px 6px", borderRadius: 6, display: "flex", alignItems: "center", gap: 5, background: label === "Ventas" ? "#DBEAFE" : "transparent", borderLeft: label === "Ventas" ? "2px solid #1E3A8A" : "2px solid transparent" }}>
                        <Icon size={9} strokeWidth={label === "Ventas" ? 2.2 : 1.8} style={{ color: label === "Ventas" ? "#1E3A8A" : "#9CA3AF", flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: label === "Ventas" ? 700 : 500, color: label === "Ventas" ? "#1E3A8A" : "#9CA3AF" }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Ventas en vivo */}
                  <VentasScreen rows={rows} total={total} />

                </div>
              </div>

              {/* Phone overlay */}
              <div style={{ position: "absolute", bottom: 0, right: 20, width: 118, background: "#111827", borderRadius: 18, padding: "10px 6px 13px", boxShadow: "0 12px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.07)" }}>
                <div style={{ width: 30, height: 4, borderRadius: 2, background: "#374151", margin: "0 auto 7px" }} />
                <div style={{ background: "#F9FAFB", borderRadius: 11, overflow: "hidden" }}>
                  <MobileScreen total={phoneTotal} tickets={tickets} />
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
