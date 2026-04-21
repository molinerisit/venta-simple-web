"use client";
import { useEffect, useRef, useState } from "react";
import { Clock, Wifi, BarChart2, ArrowRight, Users, XCircle, CheckCircle2 } from "lucide-react";
import { C, T } from "./tokens";

const ROWS = [
  {
    before: { title: "Pérdida de tiempo buscando precios",       sub: "La fila crece y los clientes se van"        },
    after:  { title: "Cobrás en 10 segundos",                    sub: "Ticket impreso automático"                  },
  },
  {
    before: { title: "Cierres de caja interminables",            sub: "Con calculadora"                            },
    after:  { title: "La caja se cierra sola en 5 min.",         sub: "Sin errores, sin diferencias"               },
  },
  {
    before: { title: "Se corta internet y dejás de vender",      sub: ""                                           },
    after:  { title: "Funciona sin internet",                    sub: "Seguís vendiendo igual"                     },
  },
  {
    before: { title: "Vendés pero no sabés cuánto ganaste",      sub: "Trabajás a ciegas"                          },
    after:  { title: "Ganancia exacta del día",                  sub: "en tiempo real. Desde el celular"           },
  },
];

const BENEFITS = [
  { Icon: Clock,     label: "Cobrás en segundos",        bg: "#EEF2FE", color: C.blue   },
  { Icon: Wifi,      label: "Seguís vendiendo siempre",  bg: "#ECFDF5", color: C.green  },
  { Icon: BarChart2, label: "Ganancia exacta del día",   bg: "#FFF7ED", color: "#C2410C" },
];

export default function LandingSolucion() {
  const ref           = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}
    >
      <div className="l-container">
        <div className="l-solucion-grid">

          {/* ── Left: copy ── */}
          <div style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateY(18px)",
            transition: "opacity .55s ease, transform .55s ease",
          }}>
            <div style={{ ...T.label, marginBottom: 16 }}>La solución</div>

            <h2 style={{ ...T.h2, margin: "0 0 20px", lineHeight: 1.08 }}>
              Tomá el control total<br />de tu negocio.<br />
              <span style={{ color: C.orange }}>Sin errores, sin vueltas.</span>
            </h2>

            <p style={{ fontSize: 16, color: C.text, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.5 }}>
              Sabés exactamente cuánto ganás — desde hoy.
            </p>
            <p style={{ ...T.body, maxWidth: 420, marginBottom: 36 }}>
              VentaSimple reemplaza el cuaderno, la calculadora y el caos.
              Lo instalás hoy y desde esa tarde cobrás diferente.
            </p>

            {/* Benefit bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
              {BENEFITS.map(({ Icon, label, bg, color }, i) => (
                <div
                  key={label}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    opacity: vis ? 1 : 0,
                    transform: vis ? "none" : "translateX(-14px)",
                    transition: `opacity .45s ease ${0.15 + i * 0.1}s, transform .45s ease ${0.15 + i * 0.1}s`,
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: bg, display: "grid", placeItems: "center",
                  }}>
                    <Icon size={17} strokeWidth={1.9} style={{ color }} />
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/registro"
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "14px 28px", borderRadius: 10, textDecoration: "none",
                background: C.orange, color: "#fff", fontWeight: 800, fontSize: 15,
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 18px rgba(249,115,22,.38), 0 1px 4px rgba(0,0,0,.12)",
                transition: "box-shadow .2s, transform .15s",
              }}
            >
              Quiero la prueba gratuita <ArrowRight size={16} />
            </a>
            <p style={{ fontSize: 12, color: C.light, marginTop: 10, fontWeight: 500 }}>
              7 días gratis. Sin tarjeta de crédito.
            </p>
          </div>

          {/* ── Right: side-by-side comparison card ── */}
          <div style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateX(22px)",
            transition: "opacity .6s ease .1s, transform .6s ease .1s",
            borderRadius: 18,
            border: `1px solid ${C.border}`,
            boxShadow: "0 28px 64px rgba(0,0,0,.10), 0 6px 20px rgba(0,0,0,.06)",
            overflow: "hidden",
          }}>

            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{
                background: "#FEF2F2", padding: "14px 18px",
                borderRight: "1px solid #FECACA", borderBottom: "1px solid #FECACA",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, color: "#DC2626",
                  letterSpacing: "0.08em", textTransform: "uppercase" as const,
                }}>
                  Hoy, sin VentaSimple
                </span>
              </div>
              <div style={{
                background: "#ECFDF5", padding: "14px 18px",
                borderBottom: `1px solid ${C.greenBdr}`,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, color: C.green,
                  letterSpacing: "0.08em", textTransform: "uppercase" as const,
                }}>
                  Con VentaSimple
                </span>
              </div>
            </div>

            {/* Comparison rows */}
            {ROWS.map((row, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${C.border}` }}
              >
                {/* Before */}
                <div style={{
                  background: i % 2 === 0 ? "#FFFBFB" : "#FFF8F8",
                  padding: "14px 16px", borderRight: "1px solid #FEE2E2",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "#FEE2E2", display: "grid", placeItems: "center", marginTop: 1,
                  }}>
                    <XCircle size={13} strokeWidth={2} style={{ color: "#EF4444" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#7F1D1D", lineHeight: 1.35 }}>
                      {row.before.title}
                    </div>
                    {row.before.sub && (
                      <div style={{ fontSize: 11, color: "#B91C1C", marginTop: 3, fontWeight: 500 }}>
                        {row.before.sub}
                      </div>
                    )}
                  </div>
                </div>

                {/* After */}
                <div style={{
                  background: i % 2 === 0 ? "#F0FDF8" : "#ECFDF5",
                  padding: "14px 16px",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "#A7F3D0", display: "grid", placeItems: "center", marginTop: 1,
                  }}>
                    <CheckCircle2 size={13} strokeWidth={2} style={{ color: C.green }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#064E3B", lineHeight: 1.35 }}>
                      {row.after.title}
                    </div>
                    {row.after.sub && (
                      <div style={{ fontSize: 11, color: C.green, marginTop: 3, fontWeight: 500 }}>
                        {row.after.sub}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Social proof footer */}
            <div style={{
              borderTop: `1px solid ${C.border}`,
              background: C.bg,
              padding: "12px 20px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: C.blueBg, display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <Users size={12} strokeWidth={1.8} style={{ color: C.blue }} />
              </div>
              <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>
                +500 negocios en Argentina ya venden con VentaSimple
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
