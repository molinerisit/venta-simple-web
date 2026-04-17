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
              fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.06,
              letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 22px",
            }}>
              Vendé más, controlá tu stock<br />
              y dejá de perder plata.
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.72, color: "rgba(255,255,255,.65)", maxWidth: 430, margin: "0 0 36px" }}>
              Registrá ventas, controlá stock y entendé tu negocio en tiempo real. Funciona sin internet y se sincroniza automáticamente.
            </p>

            <div className="l-hero-btns">
              <Link href="/registro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 30px", borderRadius: 8,
                fontWeight: 800, fontSize: 15, textDecoration: "none",
                background: C.orange, color: "#fff",
                letterSpacing: "-0.01em",
              }}>
                Empezar gratis <ArrowRight size={15} />
              </Link>
              <a href="#como-funciona" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 22px", borderRadius: 8,
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                color: "rgba(255,255,255,.80)",
                border: "1px solid rgba(255,255,255,.28)",
              }}>
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {["Sin tarjeta de crédito", "Listo en 5 minutos", "Cancelás cuando querés"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,.68)" }}>
                  <Check size={13} strokeWidth={3} style={{ color: "#22C55E", flexShrink: 0 }} />
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
              {/* Title bar */}
              <div style={{
                padding: "9px 14px",
                background: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>VentaSimple</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#E5E7EB" }} />
                  ))}
                </div>
              </div>

              {/* App layout */}
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", height: 320 }}>

                {/* Sidebar */}
                <div style={{ background: "#F3F4F6", borderRight: "1px solid #E5E7EB", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ padding: "6px 8px 10px", marginBottom: 2 }}>
                    <div style={{ height: 8, width: "80%", borderRadius: 4, background: "#1E3A8A", opacity: 0.85 }} />
                  </div>
                  {[
                    { label: "Dashboard", active: true  },
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

                {/* Contenido */}
                <div style={{ background: "#F9FAFB", padding: 14, display: "flex", flexDirection: "column", gap: 10, overflowY: "hidden" }}>

                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", marginBottom: 2 }}>Hoy, miércoles 16 de abril</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Buenos días, Martín</div>
                  </div>

                  {/* Stat cards — ventas destacada */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                    <div style={{ background: "#1E3A8A", border: "1px solid #1E3A8A", borderRadius: 8, padding: "10px 10px" }}>
                      <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,.60)", marginBottom: 4 }}>Ventas hoy</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>$124.500</div>
                      <div style={{ fontSize: 8, color: "#4ADE80", marginTop: 3, fontWeight: 700 }}>+12% vs ayer</div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #E9EAEC", borderRadius: 8, padding: "10px 10px" }}>
                      <div style={{ fontSize: 8, fontWeight: 600, color: "#9CA3AF", marginBottom: 4 }}>Tickets</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>47</div>
                      <div style={{ fontSize: 8, color: "#16A34A", marginTop: 3, fontWeight: 700 }}>+6 esta hora</div>
                    </div>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 10px" }}>
                      <div style={{ fontSize: 8, fontWeight: 600, color: "#D97706", marginBottom: 4 }}>Stock bajo</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#D97706", letterSpacing: "-0.03em", lineHeight: 1 }}>3</div>
                      <div style={{ fontSize: 8, color: "#D97706", marginTop: 3, fontWeight: 700 }}>productos</div>
                    </div>
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
                  <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#B45309" }}>Stock bajo: Coca Cola (3) · Pan lactal (2)</span>
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
