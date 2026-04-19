"use client";
import { useEffect, useRef, useState } from "react";
import { C, T } from "./tokens";

const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

const RAW = [85, 81, 76, 70, 58, 42, 18];
const W = 340, H = 110;
const pts = RAW.map((v, i) => ({
  x: (i / (RAW.length - 1)) * W,
  y: H - (v / 100) * (H - 16) - 8,
}));
const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
const areaPts  = `0,${H} ${polyline} ${W},${H}`;

const CARDS = [
  { title: "Buscás precios a mano",               arrow: "la fila crece y perdés ventas"           },
  { title: "Cerrás la caja con calculadora",       arrow: "siempre hay diferencias"                 },
  { title: "Se va internet y la venta para",       arrow: "sin offline no tenés sistema real"       },
  { title: "Al final del día no sabés cuánto ganaste", arrow: "decidís a ciegas, todos los días"   },
];

export default function LandingProblem() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setDrawn(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}
    >
      <div className="l-container">

        {/* 2-col header */}
        <div className="l-problem-header">

          {/* Left: copy */}
          <div>
            <div style={{ ...T.label, marginBottom: 20 }}>El problema</div>
            <h2 style={{ ...T.h2, margin: "0 0 24px" }}>
              Estás perdiendo ventas<br />todos los días.<br />
              Y probablemente no<br />te das cuenta.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: "0 0 12px" }}>
              Cada minuto perdido en caja es plata que se va.<br />
              Cada error es un cliente que no vuelve.
            </p>
            <p style={{ fontSize: 13, color: C.light, lineHeight: 1.65, fontStyle: "italic" }}>
              Y pasa todos los días — sin que te des cuenta.
            </p>
          </div>

          {/* Right: declining chart */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "24px 20px",
            boxShadow: "0 4px 24px rgba(0,0,0,.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: C.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Ventas semanales
              </span>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 999,
                background: "#FDF2F2", border: "1px solid #FECACA",
              }}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M5 2v5M2.5 5.5L5 8l2.5-2.5" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#B91C1C" }}>perdiendo</span>
              </div>
            </div>

            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              style={{ display: "block", overflow: "visible" }}
            >
              <defs>
                <linearGradient id="prob-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
              </defs>

              <polygon
                points={areaPts}
                fill="url(#prob-grad)"
                className={`problem-fill${drawn ? " drawn" : ""}`}
              />
              <polyline
                points={polyline}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`problem-line${drawn ? " drawn" : ""}`}
              />
              {drawn && (
                <circle
                  cx={pts[pts.length - 1].x}
                  cy={pts[pts.length - 1].y}
                  r="5"
                  fill="#EF4444"
                  className="problem-dot"
                />
              )}
            </svg>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {DAYS.map(d => (
                <span key={d} style={{ fontSize: 10, color: C.light, fontWeight: 600 }}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Problem cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {CARDS.map((c, i) => (
            <div
              key={i}
              className="l-problem-card"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderLeft: "3px solid #FECACA",
                borderRadius: "0 10px 10px 0",
                padding: "18px 20px",
                transition: "box-shadow .2s, transform .2s",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 5 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 13, color: "#B91C1C", fontWeight: 500 }}>
                → {c.arrow}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 28, fontSize: 13, fontWeight: 700,
          color: C.muted, textAlign: "center", letterSpacing: "-0.01em",
        }}>
          No es tu culpa. Es el sistema que no tenés.
        </p>

      </div>
    </section>
  );
}
