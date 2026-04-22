"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Zap, Monitor } from "lucide-react";
import { C, T } from "./tokens";

const BULLETS = [
  "Efectivo, QR, débito y crédito — el cliente paga como quiera",
  "Lector de código de barras USB — plug & play, sin configuración",
  "Impresora térmica de tickets — sin drivers raros",
  "Cualquier PC con Windows 10 u 11 — la que ya tenés",
  "Báscula conectada si la necesitás",
];

const BADGES = [
  { label: "Sin técnicos",        color: C.green  },
  { label: "Instalación en 20 min", color: C.blue },
  { label: "Funciona offline",    color: "#7C3AED" },
];

const HW_CARDS = [
  { icon: "/icons/usb.png",       label: "Lector USB",         sub: "Plug & play"  },
  { icon: "/icons/ticket.png",    label: "Impresora térmica",  sub: "Sin drivers"  },
  { icon: "/icons/internet2.png", label: "Funciona offline",   sub: "Sin internet" },
];

const MINI_STATS = [
  { label: "Ventas hoy",  val: "48",       color: C.blue  },
  { label: "Ingresos",    val: "$127.400", color: C.green },
  { label: "Caja",        val: "Abierta",  color: "#059669" },
];

const MINI_SALES = [
  { name: "Coca-Cola 1.5L",   price: "$950"   },
  { name: "Yerba 500g",       price: "$1.450" },
  { name: "Galletitas Oreo",  price: "$480"   },
];

export default function LandingLocal() {
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

  return (
    <section
      ref={ref}
      style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}
    >
      <div className="l-container">
        <div className="l-local-grid">

          {/* ── LEFT: copy + badges + bullets ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 28, justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}>
            <div style={{ ...T.label }}>Instalás hoy, vendés hoy</div>

            <h2 style={{ ...T.h2, margin: 0 }}>
              Funciona en la PC<br />
              que ya tenés.{" "}
              <span style={{ color: C.blue }}>Sin cambiar nada.</span>
            </h2>

            <p style={{ ...T.body, margin: 0, maxWidth: 420 }}>
              No necesitás técnicos ni hardware nuevo. En 20 minutos tenés
              la caja funcionando y empezás a vender.
            </p>

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {BADGES.map(({ label, color }) => (
                <div key={label} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 12px", borderRadius: 999,
                  background: `${color}14`, border: `1.5px solid ${color}40`,
                  fontSize: 12, fontWeight: 700, color,
                }}>
                  <CheckCircle2 size={12} />
                  {label}
                </div>
              ))}
            </div>

            {/* Bullets con stagger */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BULLETS.map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 11,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateX(-10px)",
                  transition: `opacity 0.45s ease ${0.18 + i * 0.07}s, transform 0.45s ease ${0.18 + i * 0.07}s`,
                }}>
                  <CheckCircle2 size={16} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: C.muted, fontWeight: 500, lineHeight: 1.55 }}>{b}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: C.light, margin: 0, lineHeight: 1.6 }}>
              ¿No ves tu equipo?{" "}
              <a
                href="mailto:ventas@ventasimple.app"
                style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}
              >
                Escribinos — confirmamos en minutos →
              </a>
            </p>
          </div>

          {/* ── RIGHT: visual mockup ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(20px)",
            transition: "opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s",
          }}>

            {/* PC monitor card */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 20px 56px rgba(0,0,0,.09), 0 4px 14px rgba(0,0,0,.05)",
            }}>
              {/* Title bar */}
              <div style={{
                background: "#1E293B", padding: "9px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Monitor size={11} style={{ color: "rgba(255,255,255,.45)" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                    VentaSimple — Punto de Venta
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="sync-dot" />
                    <span style={{ fontSize: 8, color: "#4ADE80", fontWeight: 700 }}>Sistema activo</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#EF4444", "#F59E0B", "#22C55E"].map((bg, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: bg, opacity: .6 }} />
                  ))}
                </div>
              </div>

              {/* Screen body */}
              <div style={{ padding: "16px", background: "#F8FAFC", display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Mini stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {MINI_STATS.map(({ label, val, color }) => (
                    <div key={label} style={{
                      background: "#fff", borderRadius: 8, padding: "8px 10px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                    }}>
                      <div style={{ fontSize: 8, color: "#94A3B8", fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color, letterSpacing: "-0.03em" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Mini sales table */}
                <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                  <div style={{ padding: "5px 10px", background: "#F1F5F9", borderBottom: "1px solid #E2E8F0" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Últimas ventas
                    </span>
                  </div>
                  {MINI_SALES.map((p, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "6px 10px",
                      borderBottom: i < MINI_SALES.length - 1 ? "1px solid #F1F5F9" : "none",
                    }}>
                      <span style={{ fontSize: 10, color: "#334155", fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1E293B" }}>{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware chips */}
            <div className="l-local-hw-grid">
              {HW_CARDS.map(({ icon, label, sub }) => (
                <div key={label} className="l-local-hw-card" style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "14px 10px", textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                  cursor: "default",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <Image src={icon} alt={label} width={32} height={32} style={{ objectFit: "contain" }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.text, letterSpacing: "-0.01em", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 10, color: C.light, fontWeight: 500 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Bottom strip */}
            <div style={{
              padding: "12px 18px",
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,.04)",
            }}>
              <Zap size={14} style={{ color: "#F97316", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                Tu mostrador sigue igual. Solo que ahora tiene sistema.
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
