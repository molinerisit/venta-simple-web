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

const BENEFITS: { Icon: typeof Clock; label: string; bold: string; bg: string; color: string }[] = [
  { Icon: Clock,     label: "Cobrás en",        bold: "segundos",       bg: "#EEF2FE", color: C.blue    },
  { Icon: Wifi,      label: "Seguís vendiendo", bold: "siempre",        bg: "#ECFDF5", color: C.green   },
  { Icon: BarChart2, label: "Ganancia",         bold: "exacta del día", bg: "#FFF7ED", color: "#C2410C" },
];

export default function LandingSolucion() {
  const ref           = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: C.surface, padding: "80px 0 88px", borderTop: `1px solid ${C.border}` }}
    >
      <div className="l-container">
        <div className="l-solucion-grid">

          {/* ── Left: copy ── */}
          <div style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateY(18px)",
            transition: "opacity .55s ease, transform .55s ease",
          }}>
            <div style={{ ...T.label, marginBottom: 18 }}>La solución</div>

            <h2 style={{
              fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 900,
              letterSpacing: "-0.04em", lineHeight: 1.06,
              color: C.text, margin: "0 0 24px",
            }}>
              Tomá el control<br />de tu negocio.<br />
              <span style={{ color: C.orange }}>Sin errores, sin vueltas.</span>
            </h2>

            <p style={{ fontSize: 16, color: C.text, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.5 }}>
              Sabés exactamente cuánto ganás — desde hoy.
            </p>
            <p style={{ ...T.body, maxWidth: 420, marginBottom: 44 }}>
              VentaSimple reemplaza el cuaderno, la calculadora y el caos.
              Lo instalás hoy y desde esa tarde cobrás diferente.
            </p>

            {/* Benefit bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 52 }}>
              {BENEFITS.map(({ Icon, label, bold, bg, color }, i) => (
                <div
                  key={label}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    opacity: vis ? 1 : 0,
                    transform: vis ? "none" : "translateX(-14px)",
                    transition: `opacity .45s ease ${0.15 + i * 0.1}s, transform .45s ease ${0.15 + i * 0.1}s`,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: bg, display: "grid", placeItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                  }}>
                    <Icon size={20} strokeWidth={1.8} style={{ color }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
                    {label} <strong style={{ fontWeight: 800, color: C.text }}>{bold}</strong>
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href="/registro" className="l-solucion-cta">
              Quiero la prueba gratuita <ArrowRight size={16} />
            </a>
            <p style={{ fontSize: 12, color: C.light, marginTop: 12, fontWeight: 500 }}>
              7 días gratis. Sin tarjeta de crédito.
            </p>
          </div>

          {/* ── Right: side-by-side comparison card ── */}
          <div style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateX(22px)",
            transition: "opacity .6s ease .1s, transform .6s ease .1s",
            borderRadius: 20,
            border: `1.5px solid ${C.border}`,
            boxShadow: "0 32px 72px rgba(0,0,0,.12), 0 8px 24px rgba(0,0,0,.07)",
            overflow: "hidden",
          }}>

            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{
                background: "linear-gradient(135deg, #FEE2E2, #FEF2F2)",
                padding: "16px 20px",
                borderRight: "2px solid #FCA5A5",
                borderBottom: "2px solid #FCA5A5",
              }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 800, color: "#B91C1C",
                  letterSpacing: "0.08em", textTransform: "uppercase" as const,
                }}>
                  Sin VentaSimple
                </span>
              </div>
              <div style={{
                background: "linear-gradient(135deg, #A7F3D0, #D1FAE5)",
                padding: "16px 20px",
                borderBottom: `2px solid #6EE7B7`,
              }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 800, color: "#065F46",
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
                  background: i % 2 === 0 ? "#FFFBFB" : "#FFF5F5",
                  padding: "16px 18px", borderRight: "2px solid #FEE2E2",
                  display: "flex", gap: 11, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "#FEE2E2", display: "grid", placeItems: "center", marginTop: 1,
                    boxShadow: "0 2px 6px rgba(220,38,38,.18)",
                  }}>
                    <XCircle size={17} strokeWidth={2} style={{ color: "#DC2626" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#7F1D1D", lineHeight: 1.3 }}>
                      {row.before.title}
                    </div>
                    {row.before.sub && (
                      <div style={{ fontSize: 11, color: "#B91C1C", marginTop: 5, fontWeight: 400, opacity: 0.65 }}>
                        {row.before.sub}
                      </div>
                    )}
                  </div>
                </div>

                {/* After */}
                <div style={{
                  background: i % 2 === 0 ? "#F0FDF8" : "#ECFDF5",
                  padding: "16px 18px",
                  display: "flex", gap: 11, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "#6EE7B7", display: "grid", placeItems: "center", marginTop: 1,
                    boxShadow: "0 2px 6px rgba(6,78,59,.20)",
                  }}>
                    <CheckCircle2 size={17} strokeWidth={2.2} style={{ color: "#065F46" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#064E3B", lineHeight: 1.3 }}>
                      {row.after.title}
                    </div>
                    {row.after.sub && (
                      <div style={{ fontSize: 11, color: C.green, marginTop: 5, fontWeight: 500, opacity: 0.85 }}>
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
              background: "linear-gradient(135deg, #F8F7F4, #F1F0EC)",
              padding: "14px 22px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: C.blueBg, display: "grid", placeItems: "center", flexShrink: 0,
                boxShadow: "0 2px 6px rgba(30,58,138,.12)",
              }}>
                <Users size={13} strokeWidth={1.8} style={{ color: C.blue }} />
              </div>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                +500 negocios en Argentina ya venden con VentaSimple
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
