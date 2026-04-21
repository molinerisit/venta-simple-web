"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, Zap, Calculator, CheckSquare, Wallet, UserCheck, TrendingUp } from "lucide-react";
import { C, T } from "./tokens";

/* ── PART 1 data ─────────────────────────────────────── */
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

/* ── PART 2 data ─────────────────────────────────────── */
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
  const compareReveal = useRevealOnce();
  const impactReveal  = useRevealOnce();

  function CmpItem({ text, consequence, side }: { text: string; consequence: string; side: "left" | "right" }) {
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
            <div style={{
              opacity: compareReveal.visible ? 1 : 0,
              transform: compareReveal.visible ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity .55s ease 0ms, transform .55s ease 0ms",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#EF4444" }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: "#B91C1C", letterSpacing: "0.08em", textTransform: "uppercase" }}>Sin sistema</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {LEFT.map((item, i) => <CmpItem key={i} text={item.text} consequence={item.consequence} side="left" />)}
              </div>
            </div>
            <div style={{
              opacity: compareReveal.visible ? 1 : 0,
              transform: compareReveal.visible ? "translateX(0)" : "translateX(20px)",
              transition: "opacity .55s ease 200ms, transform .55s ease 200ms",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: C.green }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>Con VentaSimple</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RIGHT.map((item, i) => <CmpItem key={i} text={item.text} consequence={item.consequence} side="right" />)}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", opacity: compareReveal.visible ? 1 : 0, transition: "opacity .5s ease 400ms" }}>
            <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 6px" }}>No es tu negocio.</p>
            <p style={{ fontSize: 15, color: C.muted, margin: "0 0 28px" }}>Es el sistema que estás usando.</p>
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

        {/* ── PART 2: Impacto real ── */}
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
