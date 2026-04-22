"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { C, T } from "./tokens";

/* ── Animation states ─────────────────────────────── */
type Demo = "idle" | "scan" | "add" | "pay" | "ok";

const FLOW = [
  {
    label: "Abrís la app",
    sub:   "En cualquier PC con Windows.",
  },
  {
    label: "Escaneás o buscás el producto",
    sub:   "Con lector USB o a mano — como prefieras.",
  },
  {
    label: "Confirmás el cobro",
    sub:   "El ticket sale solo. La venta queda registrada.",
  },
];

export default function LandingSteps() {
  const ref                   = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [demo, setDemo]       = useState<Demo>("idle");
  const timers                = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* Scroll reveal */
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

  /* Demo loop — starts once visible */
  useEffect(() => {
    if (!visible) return;
    const at = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setDemo("idle");
      at(() => setDemo("scan"),  900);
      at(() => setDemo("add"),   2000);
      at(() => setDemo("pay"),   3200);
      at(() => setDemo("ok"),    4000);
      at(run,                    6400);
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  }, [visible]);

  const scanning = demo === "scan";
  const hasItem  = demo === "add" || demo === "pay" || demo === "ok";
  const pressing = demo === "pay";
  const success  = demo === "ok";

  return (
    <section
      id="como-funciona"
      ref={ref}
      style={{ background: C.bgAlt, padding: "112px 0", borderTop: `1px solid ${C.border}` }}
    >
      <div className="l-container" style={{ maxWidth: 960 }}>

        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: 48,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <div style={{ ...T.label, marginBottom: 10 }}>Así de simple</div>
          <h2 style={{ ...T.h2, margin: "0 0 10px" }}>
            Abrís. Escaneás. Cobrás.
          </h2>
          <p style={{ fontSize: 15, color: C.muted, fontWeight: 500, margin: 0 }}>
            Sin manual. Sin técnico. En minutos.
          </p>
        </div>

        {/* 2-col layout */}
        <div className="l-steps-two-col">

          {/* ── LEFT: flow ── */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-16px)",
            transition: "opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s",
          }}>
            {FLOW.map((step, i) => (
              <div key={i}>
                {/* Step row */}
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(12px)",
                  transition: `opacity 0.45s ease ${0.2 + i * 0.12}s, transform 0.45s ease ${0.2 + i * 0.12}s`,
                }}>
                  {/* Number dot */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: i === 1 ? C.orange : C.surface,
                    border: `2px solid ${i === 1 ? C.orange : C.border}`,
                    display: "grid", placeItems: "center",
                    boxShadow: i === 1
                      ? "0 6px 20px rgba(249,115,22,.35)"
                      : "0 2px 8px rgba(0,0,0,.06)",
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 900,
                      color: i === 1 ? "#fff" : C.muted,
                    }}>
                      {i + 1}
                    </span>
                  </div>

                  {/* Text */}
                  <div style={{ paddingTop: 4 }}>
                    <div style={{
                      fontSize: i === 1 ? 17 : 15,
                      fontWeight: 800,
                      color: C.text,
                      letterSpacing: "-0.02em",
                      marginBottom: 4,
                    }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, lineHeight: 1.5 }}>
                      {step.sub}
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                {i < FLOW.length - 1 && (
                  <div style={{
                    marginLeft: 17, paddingLeft: 1,
                    borderLeft: `2px dashed ${C.border}`,
                    height: 32, marginTop: 4, marginBottom: 4,
                  }} />
                )}
              </div>
            ))}

            {/* CTA */}
            <div style={{
              marginTop: 40,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.45s ease 0.6s",
            }}>
              <Link
                href="/registro"
                className="l-steps-cta"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", borderRadius: 10,
                  fontWeight: 700, fontSize: 14,
                  background: C.orange, color: "#fff", textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(249,115,22,.30)",
                }}
              >
                Empezar ahora — es gratis →
              </Link>
              <p style={{ fontSize: 12, color: C.light, marginTop: 10, fontWeight: 500 }}>
                Sin tarjeta. Sin instalación complicada.
              </p>
            </div>
          </div>

          {/* ── RIGHT: animated mock ── */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(16px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}>
            <div style={{
              borderRadius: 14, overflow: "hidden",
              border: "1px solid #CBD5E1",
              boxShadow: "0 24px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.07)",
            }}>

              {/* Title bar */}
              <div style={{
                background: "#1E293B", padding: "9px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                    VentaSimple — Caja
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="sync-dot" />
                    <span style={{ fontSize: 8, color: "#4ADE80", fontWeight: 700 }}>Caja abierta</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#EF4444","#F59E0B","#22C55E"].map((bg, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: bg, opacity: .6 }} />
                  ))}
                </div>
              </div>

              {/* App body */}
              <div style={{ background: "#F8FAFC", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>

                {/* Scanner bar */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#fff",
                    border: `2px solid ${scanning ? "#2563EB" : "#E2E8F0"}`,
                    borderRadius: 10, padding: "10px 14px",
                    boxShadow: scanning ? "0 0 0 3px rgba(37,99,235,.10)" : "0 1px 3px rgba(0,0,0,.05)",
                    transition: "border-color .2s, box-shadow .2s",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={scanning ? "#2563EB" : "#94A3B8"} strokeWidth="2.5">
                      <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14"/>
                    </svg>
                    <span style={{
                      flex: 1, fontSize: 13, fontWeight: scanning ? 600 : 400,
                      color: scanning ? "#2563EB" : "#94A3B8",
                      transition: "color .2s",
                    }}>
                      {scanning ? "Escaneando..." : "Escanear o buscar producto..."}
                    </span>
                  </div>
                  {scanning && (
                    <div key="laser" className="pos-laser" style={{
                      position: "absolute", bottom: -1, left: 14, right: 14, height: 2,
                      background: "linear-gradient(90deg, transparent, #2563EB 40%, #2563EB 60%, transparent)",
                      borderRadius: 1,
                    }} />
                  )}
                </div>

                {/* Cart area */}
                <div style={{
                  background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0",
                  minHeight: 100, display: "flex", flexDirection: "column",
                  boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden",
                }}>
                  {/* Table header */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 80px 80px",
                    padding: "6px 12px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC",
                  }}>
                    {["Producto","P. Unit.","Total"].map(h => (
                      <span key={h} style={{ fontSize: 8.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Empty state */}
                  {!hasItem && (
                    <div style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "20px 0",
                    }}>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>
                        {scanning ? "Leyendo código..." : "Carrito vacío"}
                      </span>
                    </div>
                  )}

                  {/* Product row */}
                  {hasItem && (
                    <div className="pos-row-new" style={{
                      display: "grid", gridTemplateColumns: "1fr 80px 80px",
                      padding: "10px 12px", alignItems: "center",
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>Coca-Cola 1.5L</span>
                      <span style={{ fontSize: 12, color: "#64748B" }}>$950</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1E293B" }}>$950</span>
                    </div>
                  )}
                </div>

                {/* Total bar */}
                <div style={{
                  background: "#1E293B", borderRadius: 9, padding: "10px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.45)", fontWeight: 600 }}>
                    {hasItem ? "1 ítem" : "0 ítems"}
                  </span>
                  <span style={{
                    fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em",
                    transition: "all .3s",
                  }}>
                    {hasItem ? "$950" : "$0"}
                  </span>
                </div>

                {/* Confirm button */}
                <div style={{ position: "relative" }}>
                  <button style={{
                    width: "100%", padding: "12px", borderRadius: 9, border: "none",
                    background: success ? "#059669" : pressing ? "#1D4ED8" : "#2563EB",
                    color: "#fff", fontWeight: 800, fontSize: 13,
                    cursor: "default", letterSpacing: "-0.01em",
                    transform: pressing ? "scale(0.97)" : "scale(1)",
                    transition: "all .2s",
                    boxShadow: success
                      ? "0 4px 14px rgba(5,150,105,.4)"
                      : "0 4px 14px rgba(37,99,235,.35)",
                  }}>
                    {success ? "✓ Venta confirmada" : "Confirmar cobro"}
                  </button>
                </div>

              </div>
            </div>

            {/* Badge strip */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 20,
              marginTop: 16, flexWrap: "wrap",
            }}>
              {["Ticket automático", "Stock actualizado", "Sin pasos extra"].map(t => (
                <span key={t} style={{
                  fontSize: 11, color: C.muted, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="6" fill={C.greenBg}/>
                    <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
