"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C, T } from "./tokens";

/* ── Comparison data ─────────────────────────────────── */
const LEFT = [
  { text: "Buscás precios a mano",          consequence: "la fila crece y perdés clientes" },
  { text: "Cerrás la caja con calculadora",  consequence: "nunca sabés si está bien" },
  { text: "Si se corta internet, no vendés", consequence: "el negocio se frena" },
  { text: "No sabés cuánto ganás",           consequence: "tomás decisiones a ciegas" },
];

const RIGHT = [
  { text: "Cobrás en segundos",        consequence: "sin buscar ni pensar" },
  { text: "La caja cierra sola",        consequence: "sin errores, sin cuentas" },
  { text: "Seguís vendiendo offline",   consequence: "nada se detiene" },
  { text: "Sabés todo en tiempo real",  consequence: "ventas, stock y ganancias" },
];

/* ── Bars data ───────────────────────────────────────── */
const METRICS = [
  {
    label: "Tiempo por cliente en caja",
    before: { text: "2–3 min buscando precios a mano", pct: 88 },
    after:  { text: "menos de 30 seg con el sistema",  pct: 16 },
  },
  {
    label: "Cierre de caja",
    before: { text: "40 min con diferencias",  pct: 88 },
    after:  { text: "5 min sin errores",        pct: 10 },
  },
  {
    label: "Costo de personal en caja",
    before: { text: "2 personas — doble sueldo",     pct: 66 },
    after:  { text: "1 persona — un sueldo ahorrado", pct: 33 },
  },
];

function AnimBar({ pct, color, animate, delay = 0 }: {
  pct: number; color: string; animate: boolean; delay?: number;
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
        transition: go ? `width 2.2s cubic-bezier(.05,.55,.3,1)` : "none",
      }} />
    </div>
  );
}

function useRevealOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function LandingCambio() {
  const compareReveal = useRevealOnce();
  const barsReveal    = useRevealOnce();

  /* ── COMPARISON ITEM ── */
  function CmpItem({ text, consequence, side }: {
    text: string; consequence: string; side: "left" | "right";
  }) {
    const isLeft = side === "left";
    return (
      <div className={isLeft ? "l-cmp-item l-cmp-item-left" : "l-cmp-item l-cmp-item-right"} style={{
        background: isLeft ? "#FEF2F2" : C.greenBg,
        border: `1px solid ${isLeft ? "#FECACA" : C.greenBdr}`,
        borderRadius: 10, padding: "14px 16px",
        transition: "box-shadow .2s, transform .18s",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
            {isLeft ? "❌" : "✅"}
          </span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: isLeft ? "#7F1D1D" : "#064E3B", margin: "0 0 3px", lineHeight: 1.4 }}>
              {text}
            </p>
            <p style={{ fontSize: 12, color: isLeft ? "#B91C1C" : C.green, margin: 0, fontWeight: 500 }}>
              → {consequence}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* ── PART 1: Antes vs ahora ── */}
        <div ref={compareReveal.ref}>
          <div style={{
            opacity: compareReveal.visible ? 1 : 0,
            transform: compareReveal.visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity .5s ease, transform .5s ease",
            marginBottom: 48,
          }}>
            <div style={{ ...T.label, marginBottom: 14 }}>Lo que cambia cuando tenés sistema</div>
            <h2 style={{ ...T.h2, margin: "0 0 14px" }}>
              Antes vs ahora.<br />La diferencia es plata.
            </h2>
            <p style={{ ...T.body, maxWidth: 500, margin: 0 }}>
              Lo que pasa todos los días en un negocio sin sistema… y lo que cambia cuando lo usás.
            </p>
          </div>

          <div className="l-cambio-compare" style={{ marginBottom: 36 }}>
            {/* Left col — red */}
            <div style={{
              opacity: compareReveal.visible ? 1 : 0,
              transform: compareReveal.visible ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity .55s ease 0ms, transform .55s ease 0ms",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#EF4444" }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: "#B91C1C", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Sin sistema
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {LEFT.map((item, i) => (
                  <CmpItem key={i} text={item.text} consequence={item.consequence} side="left" />
                ))}
              </div>
            </div>

            {/* Right col — green */}
            <div style={{
              opacity: compareReveal.visible ? 1 : 0,
              transform: compareReveal.visible ? "translateX(0)" : "translateX(20px)",
              transition: "opacity .55s ease 200ms, transform .55s ease 200ms",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: C.green }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Con VentaSimple
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RIGHT.map((item, i) => (
                  <CmpItem key={i} text={item.text} consequence={item.consequence} side="right" />
                ))}
              </div>
            </div>
          </div>

          {/* Closing + CTA */}
          <div style={{
            textAlign: "center",
            opacity: compareReveal.visible ? 1 : 0,
            transition: "opacity .5s ease 400ms",
          }}>
            <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 6px" }}>
              No es tu negocio.
            </p>
            <p style={{ fontSize: 15, color: C.muted, margin: "0 0 28px" }}>
              Es el sistema que estás usando.
            </p>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 9, fontWeight: 700, fontSize: 14,
              background: C.orange, color: "#fff", textDecoration: "none",
            }}>
              Empezar gratis — probalo en tu negocio <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, background: C.border, margin: "72px 0" }} />

        {/* ── PART 2: Así cambia tu negocio ── */}
        <div style={{ maxWidth: 540, marginBottom: 48 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Impacto real</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            Así cambia tu negocio<br />en la primera semana.
          </h2>
          <p style={{ ...T.body, margin: 0 }}>
            No hablamos de teoría. Estos son los cambios concretos que ven los negocios que empiezan a usar VentaSimple.
          </p>
        </div>

        <div ref={barsReveal.ref} className="l-cambio-grid">

          {/* Left bars — Sin sistema */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "#EF4444" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#B91C1C", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Sin sistema
              </span>
            </div>
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 14, padding: "28px 24px",
              display: "flex", flexDirection: "column", gap: 24,
            }}>
              {METRICS.map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#7F1D1D" }}>{m.label}</span>
                    <span style={{ fontSize: 12, color: "#B91C1C" }}>{m.before.text}</span>
                  </div>
                  <AnimBar pct={m.before.pct} color="#EF4444" animate={barsReveal.visible} delay={i * 100} />
                </div>
              ))}
            </div>
          </div>

          {/* Right bars — Con VentaSimple */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: C.green }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Con VentaSimple
              </span>
            </div>
            <div style={{
              background: C.greenBg, border: `1px solid ${C.greenBdr}`,
              borderRadius: 14, padding: "28px 24px",
              display: "flex", flexDirection: "column", gap: 24,
            }}>
              {METRICS.map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#064E3B" }}>{m.label}</span>
                    <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{m.after.text}</span>
                  </div>
                  <AnimBar pct={m.after.pct} color={C.green} animate={barsReveal.visible} delay={i * 100} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 36, textAlign: "center",
          padding: "18px 32px",
          background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 12,
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.green, margin: 0, letterSpacing: "-0.01em" }}>
            Un sueldo de ahorro. Por empezar a usar el sistema.
          </p>
        </div>

      </div>
    </section>
  );
}
