"use client";
import { useEffect, useRef, useState } from "react";
import { Clock, Calculator, WifiOff, TrendingDown } from "lucide-react";
import { C, T } from "./tokens";

const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
const RAW  = [92, 84, 73, 59, 42, 25, 9];
const W = 360, H = 156;
const PAD_X = 10, PAD_Y = 8;

const pts = RAW.map((v, i) => ({
  x: PAD_X + (i / (RAW.length - 1)) * (W - PAD_X * 2),
  y: PAD_Y + (1 - v / 100) * (H - PAD_Y * 2),
}));
const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
const fillPath = `M0,${H} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${W},${H} Z`;
const lastPt   = pts[pts.length - 1];

const CARDS = [
  { Icon: Clock,        title: "Buscás precios a mano",                   detail: "La fila crece y los clientes se van"          },
  { Icon: Calculator,   title: "Cerrás la caja con calculadora",           detail: "Siempre hay diferencias — perdés sin saberlo" },
  { Icon: WifiOff,      title: "Se va internet y la venta para",           detail: "Sin modo offline no tenés sistema real"       },
  { Icon: TrendingDown, title: "Al final del día no sabés cuánto ganaste", detail: "Decidís a ciegas, todos los días"             },
];

export default function LandingProblem() {
  const ref           = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ ...T.label, marginBottom: 12 }}>El problema</div>
          <h2 style={{ ...T.h2, margin: "0 0 12px", maxWidth: 600 }}>
            Estás perdiendo ventas<br />todos los días.<br />
            Y probablemente no te das cuenta.
          </h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: "0 0 6px", maxWidth: 520 }}>
            Cada minuto perdido en caja es plata que se va.
            Cada error es un cliente que no vuelve.
          </p>
          <p style={{ fontSize: 13, color: C.light, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
            Y pasa todos los días — sin que te des cuenta.
          </p>
        </div>

        {/* Main: cards izquierda + gráfico derecha */}
        <div className="l-problem-main">

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CARDS.map(({ Icon, title, detail }, i) => (
              <div
                key={i}
                className={`l-problem-card${vis ? " problem-card-vis" : ""}`}
                style={{
                  background: "#fff",
                  border: "1px solid #FEE2E2",
                  borderLeft: "3px solid #EF4444",
                  borderRadius: "0 12px 12px 0",
                  padding: "16px 20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,.045)",
                  opacity: 0,
                  animationDelay: `${i * 0.11}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: "#FEF2F2", display: "grid", placeItems: "center",
                  }}>
                    <Icon size={15} strokeWidth={2} style={{ color: "#DC2626" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>
                      {title}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#DC2626", fontWeight: 500, lineHeight: 1.4 }}>
                      → {detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico protagonista */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "22px 20px 18px",
            boxShadow: "0 4px 28px rgba(0,0,0,.07)",
            display: "flex", flexDirection: "column",
          }}>

            {/* Top row: label + badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: C.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Ventas semanales
              </span>
              <div className={vis ? "problem-badge-blink" : ""} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 999,
                background: "#FEF2F2", border: "1px solid #FECACA",
              }}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M5 2v5M2.5 5.5L5 8l2.5-2.5" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>ventas cayendo</span>
              </div>
            </div>

            {/* Número impacto */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#DC2626", letterSpacing: "-0.05em", lineHeight: 1 }}>
                -$120.000
              </div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginTop: 5 }}>
                en pérdidas invisibles esta semana
              </div>
            </div>

            {/* SVG chart */}
            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              style={{ display: "block", overflow: "hidden", flex: 1 }}
            >
              <defs>
                <linearGradient id="prob-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={fillPath} fill="url(#prob-grad)" className={`problem-fill${vis ? " drawn" : ""}`} />
              <path
                d={linePath}
                fill="none"
                stroke="#EF4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                className={`problem-line${vis ? " drawn" : ""}`}
              />
              {vis && (
                <circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r="6"
                  fill="#EF4444"
                  className="problem-dot"
                />
              )}
            </svg>

            {/* Eje X */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {DAYS.map(day => (
                <span key={day} style={{ fontSize: 10, color: C.light, fontWeight: 600 }}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ marginTop: 32, fontSize: 14, fontWeight: 700, color: C.muted, textAlign: "center", letterSpacing: "-0.01em" }}>
          No es tu culpa. Es el sistema que no tenés.
        </p>

      </div>
    </section>
  );
}
