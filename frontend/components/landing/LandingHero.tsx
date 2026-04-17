import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { C } from "./tokens";

export default function LandingHero() {
  return (
    <section style={{ background: C.heroBg, padding: "96px 0 120px" }}>
      <div className="l-container" style={{ position: "relative", zIndex: 1 }}>

        <div className="l-hero-grid">

          {/* Columna izquierda */}
          <div>
            <h1 style={{
              fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 900, lineHeight: 1.05,
              letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 20px",
            }}>
              Vendé rápido,<br />
              controlá tu negocio.
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.70, color: "rgba(255,255,255,.62)", maxWidth: 420, margin: "0 0 36px" }}>
              App de escritorio para Windows con ventas, stock y reportes en tiempo real. Funciona sin internet y se sincroniza automáticamente.
            </p>

            <div className="l-hero-btns">
              <Link href="/registro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 8,
                fontWeight: 800, fontSize: 15, textDecoration: "none",
                background: C.orange, color: "#fff",
                letterSpacing: "-0.01em",
              }}>
                Empezar gratis <ArrowRight size={15} />
              </Link>
              <a href="#como-funciona" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 20px", borderRadius: 8,
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                color: "rgba(255,255,255,.72)",
                border: "1px solid rgba(255,255,255,.14)",
              }}>
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {["Sin tarjeta de crédito", "Listo en 5 minutos", "Cancelás cuando querés"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(255,255,255,.60)" }}>
                  <Check size={12} strokeWidth={3} style={{ color: "#22C55E", flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup — replica el panel real */}
          <div className="l-hero-mockup">
            <div style={{
              borderRadius: 12, overflow: "hidden",
              border: "1px solid rgba(255,255,255,.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              background: "#F3F4F6",
            }}>
              {/* Title bar — app Windows */}
              <div style={{
                padding: "9px 14px",
                background: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>VentaSimple</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#E5E7EB","#E5E7EB","#E5E7EB"].map((col, i) => (
                    <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: col }} />
                  ))}
                </div>
              </div>

              {/* App layout */}
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", height: 320 }}>

                {/* Sidebar real */}
                <div style={{ background: "#F3F4F6", borderRight: "1px solid #E5E7EB", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ padding: "6px 8px 10px", marginBottom: 2 }}>
                    <div style={{ height: 8, width: "80%", borderRadius: 4, background: "#1E3A8A", opacity: 0.85 }} />
                  </div>
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Ventas",    active: false },
                    { label: "Productos", active: false },
                    { label: "Clientes",  active: false },
                    { label: "Métricas",  active: false },
                  ].map(item => (
                    <div key={item.label} style={{
                      padding: "7px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6,
                      background: item.active ? "#DBEAFE" : "transparent",
                      borderLeft: item.active ? "2px solid #1E3A8A" : "2px solid transparent",
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: 2, background: item.active ? "#1E3A8A" : "#9CA3AF", flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, color: item.active ? "#1E3A8A" : "#9CA3AF" }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Contenido dashboard */}
                <div style={{ background: "#F9FAFB", padding: 14, display: "flex", flexDirection: "column", gap: 10, overflowY: "hidden" }}>

                  {/* Header */}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", marginBottom: 2 }}>Hoy, miércoles 16 de abril</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Buenos días, Martín</div>
                  </div>

                  {/* Stat cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                    {[
                      { label: "Ventas hoy",  value: "$124.500", sub: "+12% vs ayer",  accent: true,  warn: false },
                      { label: "Tickets",      value: "47",       sub: "+6 esta hora",  accent: false, warn: false },
                      { label: "Stock bajo",   value: "3",        sub: "productos",      accent: false, warn: true  },
                    ].map((m, i) => (
                      <div key={i} style={{
                        background: "#fff",
                        border: `1px solid ${m.warn ? "#FDE68A" : "#E9EAEC"}`,
                        borderRadius: 8, padding: "10px 10px",
                      }}>
                        <div style={{ fontSize: 8, fontWeight: 600, color: "#9CA3AF", marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: m.warn ? "#D97706" : "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>{m.value}</div>
                        <div style={{ fontSize: 8, color: m.warn ? "#D97706" : "#16A34A", marginTop: 3, fontWeight: 700 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Últimas ventas */}
                  <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ padding: "7px 10px", borderBottom: "1px solid #F1F3F5" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#111827" }}>Últimas ventas</span>
                    </div>
                    {[
                      ["Coca-Cola 2.25L",  "$1.200"],
                      ["Pan lactal 400g",  "$850"],
                      ["Leche entera x1L", "$750"],
                    ].map(([prod, precio], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: i < 2 ? "1px solid #F8F9FB" : "none" }}>
                        <span style={{ fontSize: 9, color: "#6B7280", fontWeight: 500 }}>{prod}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#111827" }}>{precio}</span>
                      </div>
                    ))}
                  </div>

                  {/* Alerta stock */}
                  <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#B45309" }}>Stock bajo: Coca Cola (3) · Pan (2)</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
