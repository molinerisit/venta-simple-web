"use client";
import { useEffect, useRef, useState } from "react";
import { C, T } from "./tokens";

const MESSAGES = [
  {
    side: "client" as const,
    text: "No me imprime el ticket y tengo una venta a las 23hs",
    time: "22:58",
    delay: 0.25,
  },
  {
    side: "support" as const,
    text: "Estoy viendo tu caja ahora, dame un segundo 👀",
    time: "22:59",
    delay: 0.75,
  },
  {
    side: "support" as const,
    text: "Listo, probá ahora 👍",
    time: "23:00",
    delay: 1.25,
  },
];

const STATS = [
  { val: "< 5 min", label: "respuesta" },
  { val: "24/7",    label: "disponible" },
  { val: "Humano",  label: "no un bot"  },
];

export default function LandingSupport() {
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

  return (
    <section
      ref={ref}
      style={{
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "112px 0",
      }}
    >
      <div className="l-container" style={{ maxWidth: 960 }}>
        <div className="l-support-grid">

          {/* ── LEFT: copy ── */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}>
            {/* Online badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
              padding: "5px 14px 5px 10px", borderRadius: 999,
              background: C.greenBg, border: `1px solid ${C.greenBdr}`,
            }}>
              <span className="l-support-dot" />
              <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>Disponible ahora mismo</span>
            </div>

            <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
              Si algo falla,<br />te lo resolvemos<br />al toque.
            </h2>

            <p style={{ ...T.body, margin: "0 0 28px", maxWidth: 380 }}>
              Ningún software elimina todos los problemas. La diferencia es qué pasa cuando algo falla.
              Con VentaSimple, en minutos tenés a una persona real ayudándote.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
              {STATS.map(({ val, label }) => (
                <div key={val}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.green, letterSpacing: "-0.04em" }}>{val}</div>
                  <div style={{ fontSize: 11, color: C.light, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={{
              padding: "18px 20px",
              background: C.greenBg,
              border: `1px solid ${C.greenBdr}`,
              borderLeft: `3px solid ${C.green}`,
              borderRadius: "0 12px 12px 0",
            }}>
              <p style={{ fontSize: 14, fontStyle: "italic", color: C.text, margin: "0 0 10px", lineHeight: 1.65 }}>
                &ldquo;Tuve un problema a las 23hs en medio de una venta. Escribí y en 3 minutos me lo resolvieron. Seguí vendiendo.&rdquo;
              </p>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                — Martín R., ferretería, Rosario
              </span>
            </div>
          </div>

          {/* ── RIGHT: chat WhatsApp ── */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}>
            <div style={{
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 20px 56px rgba(0,0,0,.10), 0 4px 16px rgba(0,0,0,.06)",
              border: `1px solid ${C.border}`,
            }}>

              {/* Chat header */}
              <div style={{
                background: "#075E54",
                padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#128C7E",
                  border: "2px solid rgba(255,255,255,.2)",
                  display: "grid", placeItems: "center",
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                    Soporte VentaSimple
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#25D366", display: "inline-block",
                    }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>
                      En línea
                    </span>
                  </div>
                </div>

                {/* WhatsApp icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,.35)">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.139.561 4.146 1.541 5.887L.057 23.428a.5.5 0 0 0 .611.612l5.499-1.48A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.5-5.22-1.375l-.374-.215-3.876 1.043 1.051-3.792-.234-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>

              {/* Messages area */}
              <div style={{
                background: "#ECE5DD",
                padding: "16px 14px",
                display: "flex", flexDirection: "column", gap: 10,
                minHeight: 220,
              }}>
                {MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.side === "client" ? "flex-end" : "flex-start",
                      opacity: visible ? 1 : 0,
                      transform: visible
                        ? "none"
                        : msg.side === "client" ? "translateX(10px)" : "translateX(-10px)",
                      transition: `opacity 0.4s ease ${msg.delay}s, transform 0.4s ease ${msg.delay}s`,
                    }}
                  >
                    <div style={{
                      maxWidth: "78%",
                      padding: "9px 12px",
                      borderRadius: msg.side === "client"
                        ? "14px 14px 3px 14px"
                        : "14px 14px 14px 3px",
                      background: msg.side === "client" ? "#DCF8C6" : "#fff",
                      boxShadow: "0 1px 2px rgba(0,0,0,.12)",
                    }}>
                      {msg.side === "support" && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#075E54", marginBottom: 4 }}>
                          Soporte
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: "#1A1816", lineHeight: 1.5, marginBottom: 4 }}>
                        {msg.text}
                      </div>
                      <div style={{
                        fontSize: 10, color: "#9CA3AF", fontWeight: 500,
                        textAlign: "right",
                        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3,
                      }}>
                        {msg.time}
                        {msg.side === "client" && (
                          <svg width="14" height="10" viewBox="0 0 16 10" fill="#53BDEB">
                            <path d="M1 5l3 3 5-7M6 5l3 3 5-7" stroke="#53BDEB" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div style={{
                background: "#F0F0F0",
                padding: "10px 12px",
                display: "flex", alignItems: "center", gap: 10,
                borderTop: "1px solid #E2E0DA",
              }}>
                <div style={{
                  flex: 1, background: "#fff", borderRadius: 999,
                  padding: "8px 14px", fontSize: 12, color: "#9CA3AF",
                  boxShadow: "0 1px 2px rgba(0,0,0,.08)",
                }}>
                  Escribí tu consulta...
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#075E54", display: "grid", placeItems: "center",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </div>
              </div>

            </div>

            {/* Bottom note */}
            <p style={{
              fontSize: 12, color: C.light, textAlign: "center",
              marginTop: 14, fontWeight: 500, lineHeight: 1.5,
            }}>
              Respuesta real en menos de 5 minutos — incluso a la madrugada.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
