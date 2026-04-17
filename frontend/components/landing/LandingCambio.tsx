"use client";
import { useEffect, useRef, useState } from "react";
import { C, T } from "./tokens";

const METRICS = [
  {
    label: "Velocidad de cobro",
    before: { text: "2–3 min por cliente",    pct: 88 },
    after:  { text: "menos de 30 seg",         pct: 16 },
  },
  {
    label: "Carga operativa",
    before: { text: "Flujo desordenado",       pct: 92 },
    after:  { text: "Flujo estable",            pct: 20 },
  },
  {
    label: "Personal en caja",
    before: { text: "2 personas",              pct: 66 },
    after:  { text: "1 persona",               pct: 33 },
  },
];

function AnimBar({
  pct, color, animate, slow, delay = 0,
}: {
  pct: number; color: string; animate: boolean; slow?: boolean; delay?: number;
}) {
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [animate, delay]);

  return (
    <div style={{ height: 10, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 99, background: color,
        width: go ? `${pct}%` : "0%",
        transition: go
          ? slow
            ? `width 2.6s cubic-bezier(.05,.55,.3,1)`
            : `width 0.5s cubic-bezier(.4,0,.2,1)`
          : "none",
      }} />
    </div>
  );
}

export default function LandingCambio() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const colLeft: React.CSSProperties = {
    background: "#FEF2F2", border: "1px solid #FECACA",
    borderRadius: 14, padding: "28px 24px",
    display: "flex", flexDirection: "column", gap: 24,
  };

  const colRight: React.CSSProperties = {
    background: C.greenBg, border: `1px solid ${C.greenBdr}`,
    borderRadius: 14, padding: "28px 24px",
    display: "flex", flexDirection: "column", gap: 24,
  };

  return (
    <section style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ maxWidth: 540, marginBottom: 56 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Impacto real</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            Así cambia tu negocio<br />en pocos días
          </h2>
          <p style={{ ...T.body, margin: 0 }}>
            No hablamos de teoría. Estos son los cambios concretos que ven los negocios que empiezan a usar VentaSimple.
          </p>
        </div>

        {/* 2-column comparison */}
        <div ref={ref} className="l-cambio-grid">

          {/* Left — Sin sistema */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "#EF4444" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#B91C1C", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Sin sistema
              </span>
            </div>
            <div style={colLeft}>
              {METRICS.map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#7F1D1D" }}>{m.label}</span>
                    <span style={{ fontSize: 12, color: "#B91C1C" }}>{m.before.text}</span>
                  </div>
                  <AnimBar pct={m.before.pct} color="#EF4444" animate={visible} slow delay={i * 120} />
                </div>
              ))}
            </div>
          </div>

          {/* Right — Con VentaSimple */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: C.green }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Con VentaSimple
              </span>
            </div>
            <div style={colRight}>
              {METRICS.map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#064E3B" }}>{m.label}</span>
                    <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{m.after.text}</span>
                  </div>
                  <AnimBar pct={m.after.pct} color={C.green} animate={visible} delay={i * 120} />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 36, textAlign: "center",
          padding: "18px 32px",
          background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 12,
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.green, margin: 0, letterSpacing: "-0.01em" }}>
            Menos tiempo por venta = más clientes atendidos = más ingresos
          </p>
        </div>

      </div>
    </section>
  );
}
