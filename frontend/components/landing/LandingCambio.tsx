"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Users, Zap, Calculator, CheckSquare, Wallet, UserCheck, TrendingUp } from "lucide-react";
import { C, T } from "./tokens";

/* ── data ────────────────────────────────────────────── */
const IMPACT = [
  {
    IconL: Users,
    IconR: Zap,
    before: { title: "Fila / velocidad de cobro",      sub: "Los clientes esperan. La fila se hace más larga.", num: "2–3 min",    numSub: "por cliente"        },
    after:  { title: "Fila / velocidad de cobro",      sub: "Cobrás rápido y la fila no se acumula.",           num: "<30 seg",    numSub: "por cliente"        },
  },
  {
    IconL: Calculator,
    IconR: CheckSquare,
    before: { title: "Tiempo perdido al cerrar",       sub: "Cierre manual con calculadora.",                   num: "40 min",     numSub: "cada día"           },
    after:  { title: "Tiempo para cerrar caja",        sub: "Todo automático, sin errores.",                    num: "5 min",      numSub: "y listo"            },
  },
  {
    IconL: Wallet,
    IconR: UserCheck,
    before: { title: "Plata que se te va en sueldos",  sub: "Necesitás más gente en caja para el cobro.",       num: "2 personas", numSub: "doble sueldo"       },
    after:  { title: "Plata que ahorrás en sueldos",   sub: "Con una sola persona alcanza.",                    num: "1 persona",  numSub: "un sueldo ahorrado" },
  },
];

function useRevealOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function LandingCambio() {
  const impactReveal = useRevealOnce();

  return (
    <section style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* ── Impacto real ── */}
        <div ref={impactReveal.ref}>

          {/* Header */}
          <div style={{
            maxWidth: 560, marginBottom: 44,
            opacity: impactReveal.visible ? 1 : 0,
            transform: impactReveal.visible ? "none" : "translateY(16px)",
            transition: "opacity .5s ease, transform .5s ease",
          }}>
            <div style={{ ...T.label, marginBottom: 14 }}>Impacto real</div>
            <h2 style={{ ...T.h2, margin: "0 0 14px" }}>
              Así cambia tu negocio<br />en la primera semana.
            </h2>
            <p style={{ ...T.body, margin: 0 }}>
              No hablamos de teoría. Estos son los cambios concretos que ven los negocios que empiezan a usar VentaSimple.
            </p>
          </div>

          {/* Comparison card — wrapper relativo para la flecha central */}
          <div style={{
            position: "relative",
            opacity: impactReveal.visible ? 1 : 0,
            transform: impactReveal.visible ? "none" : "translateY(20px)",
            transition: "opacity .6s ease .1s, transform .6s ease .1s",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              borderRadius: 18,
              border: `1px solid ${C.border}`,
              boxShadow: "0 24px 60px rgba(0,0,0,.09), 0 4px 16px rgba(0,0,0,.05)",
              overflow: "hidden",
            }}>

              {/* ── Left: SIN SISTEMA ── */}
              <div style={{ background: "#FFF5F5", borderRight: "1px solid #FEE2E2" }}>
                {/* Column header */}
                <div style={{
                  padding: "18px 24px 16px",
                  borderBottom: "1px solid #FEE2E2",
                  background: "#FEF2F2",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", letterSpacing: "0.09em", textTransform: "uppercase" as const }}>
                    Sin sistema
                  </span>
                </div>

                {/* Rows */}
                {IMPACT.map(({ IconL, before }, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px",
                    borderBottom: i < IMPACT.length - 1 ? "1px solid #FEE2E2" : "none",
                    gap: 12,
                  }}>
                    {/* Icon + text */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "#FEE2E2", display: "grid", placeItems: "center",
                      }}>
                        <IconL size={16} strokeWidth={1.9} style={{ color: "#DC2626" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#7F1D1D", lineHeight: 1.3 }}>{before.title}</div>
                        <div style={{ fontSize: 11, color: "#B91C1C", marginTop: 3, fontWeight: 500, lineHeight: 1.4 }}>{before.sub}</div>
                      </div>
                    </div>
                    {/* Big number */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 30, fontWeight: 900, color: "#DC2626", letterSpacing: "-0.04em", lineHeight: 1 }}>{before.num}</div>
                      <div style={{ fontSize: 10.5, color: "#B91C1C", fontWeight: 600, marginTop: 3 }}>{before.numSub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Right: CON VENTASIMPLE ── */}
              <div style={{ background: "#F0FDF8" }}>
                {/* Column header */}
                <div style={{
                  padding: "18px 24px 16px",
                  borderBottom: `1px solid ${C.greenBdr}`,
                  background: "#ECFDF5",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.09em", textTransform: "uppercase" as const }}>
                    Con VentaSimple
                  </span>
                </div>

                {/* Rows */}
                {IMPACT.map(({ IconR, after }, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px",
                    borderBottom: i < IMPACT.length - 1 ? `1px solid ${C.greenBdr}` : "none",
                    gap: 12,
                  }}>
                    {/* Icon + text */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "#A7F3D0", display: "grid", placeItems: "center",
                      }}>
                        <IconR size={16} strokeWidth={1.9} style={{ color: C.green }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#064E3B", lineHeight: 1.3 }}>{after.title}</div>
                        <div style={{ fontSize: 11, color: C.green, marginTop: 3, fontWeight: 500, lineHeight: 1.4 }}>{after.sub}</div>
                      </div>
                    </div>
                    {/* Big number */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 30, fontWeight: 900, color: C.green, letterSpacing: "-0.04em", lineHeight: 1 }}>{after.num}</div>
                      <div style={{ fontSize: 10.5, color: C.green, fontWeight: 600, marginTop: 3 }}>{after.numSub}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Flecha central — posicionada sobre el divisor */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "#fff",
              border: `1.5px solid ${C.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,.10)",
              display: "grid", placeItems: "center",
              zIndex: 10,
            }}>
              <ArrowRight size={18} strokeWidth={2} style={{ color: C.blue }} />
            </div>
          </div>

          {/* Footer strip */}
          <div style={{
            marginTop: 20,
            borderRadius: 14,
            border: `1px solid ${C.greenBdr}`,
            background: "#ECFDF5",
            padding: "22px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
            opacity: impactReveal.visible ? 1 : 0,
            transition: "opacity .5s ease .4s",
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#064E3B", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                Ahorrás el sueldo de una persona.
              </div>
              <div style={{ fontSize: 14, color: C.green, fontWeight: 500, marginTop: 4 }}>
                Todos los meses.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#A7F3D0", display: "grid", placeItems: "center",
              }}>
                <TrendingUp size={20} strokeWidth={2} style={{ color: C.green }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#064E3B" }}>Más ganancia.</div>
                <div style={{ fontSize: 13, color: C.green, fontWeight: 500 }}>Menos estrés.</div>
              </div>
            </div>
          </div>

          {/* Micro CTA */}
          <p style={{
            textAlign: "center", fontSize: 12.5, color: C.light,
            fontWeight: 500, marginTop: 16,
            opacity: impactReveal.visible ? 1 : 0,
            transition: "opacity .5s ease .5s",
          }}>
            7 días gratis. Sin tarjeta de crédito.
          </p>

        </div>

      </div>
    </section>
  );
}
