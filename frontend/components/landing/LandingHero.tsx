import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { C } from "./tokens";

export default function LandingHero() {
  return (
    <section style={{ background: C.heroBg, padding: "100px 0 96px" }}>
      <div className="l-container" style={{ position: "relative", zIndex: 1 }}>

        {/* Badge soporte */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36,
          padding: "6px 14px 6px 10px", borderRadius: 99,
          border: "1px solid rgba(255,255,255,.10)",
          background: "rgba(255,255,255,.05)",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 99, background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.25)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", letterSpacing: "0.04em" }}>EN VIVO</span>
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>Soporte activo · respondemos en menos de 5 min</span>
        </div>

        <div className="l-hero-grid">

          {/* Columna izquierda */}
          <div>
            <h1 style={{
              fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.04,
              letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 22px",
            }}>
              Controlá tu negocio<br />
              desde un solo lugar.
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.72, color: "rgba(255,255,255,.58)", maxWidth: 440, margin: "0 0 36px" }}>
              App de escritorio para Windows con ventas, stock y reportes. Funciona offline y se sincroniza en la nube. Con soporte humano 24/7.
            </p>

            <div className="l-hero-btns">
              <Link href="/registro" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 30px", borderRadius: 9,
                fontWeight: 800, fontSize: 15, textDecoration: "none",
                background: C.orange, color: "#fff",
                boxShadow: "0 8px 32px rgba(249,115,22,.40)",
                letterSpacing: "-0.01em",
              }}>
                Empezar gratis, sin tarjeta <ArrowRight size={15} />
              </Link>
              <a href="#como-funciona" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 22px", borderRadius: 9,
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.80)",
                border: "1px solid rgba(255,255,255,.15)",
              }}>
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
              {["Sin tarjeta de crédito", "Listo en 5 minutos", "Cancelás cuando querés"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.38)" }}>
                  <Check size={11} strokeWidth={3} style={{ color: "#22C55E", flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup del dashboard */}
          <div className="l-hero-mockup">
            <div style={{
              borderRadius: 14, overflow: "hidden",
              background: "#0D1B38",
              border: "1px solid rgba(255,255,255,.10)",
              boxShadow: "0 24px 60px rgba(0,0,0,.45)",
            }}>
              {/* Browser chrome */}
              <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#EF4444","#F59E0B","#22C55E"].map(col => (
                    <span key={col} style={{ width: 9, height: 9, borderRadius: "50%", background: col, opacity: 0.7 }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)", marginLeft: 6, fontWeight: 500 }}>VentaSimple — Dashboard</span>
              </div>

              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "38px 1fr", gap: 12 }}>
                {/* Mini sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingTop: 4 }}>
                  {[1,1,0,0,0,0,0].map((active, i) => (
                    <div key={i} style={{ height: 7, borderRadius: 99, background: active ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.06)" }} />
                  ))}
                </div>

                {/* Content */}
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                      { label: "Ventas hoy", value: "$124.500", sub: "+12%",    hero: true },
                      { label: "Tickets",    value: "47",        sub: "+6%",    hero: false },
                      { label: "Stock bajo", value: "3 items",   sub: "reponer", warn: true },
                    ].map((m, i) => (
                      <div key={i} style={{
                        background: m.hero ? "rgba(30,58,138,.85)" : "rgba(255,255,255,.04)",
                        border: `1px solid ${m.hero ? "rgba(96,165,250,.3)" : "rgba(255,255,255,.07)"}`,
                        borderRadius: 8, padding: "10px 11px",
                      }}>
                        <div style={{ fontSize: 9, color: m.hero ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.35)", marginBottom: 4, fontWeight: 600 }}>{m.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: m.warn ? "#F59E0B" : "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{m.value}</div>
                        <div style={{ fontSize: 9, color: m.warn ? "#F59E0B" : "#4ADE80", marginTop: 3, fontWeight: 700 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ padding: "7px 11px", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)" }}>Últimas ventas</span>
                    </div>
                    {[
                      ["Coca-Cola 2.25L",  "$1.200"],
                      ["Pan lactal 400g",  "$850"],
                      ["Leche entera x1L", "$750"],
                      ["Galletitas Oreo",  "$620"],
                    ].map(([prod, precio], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 11px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>{prod}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.80)" }}>{precio}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 10, padding: "8px 11px", borderRadius: 8, background: "rgba(10,110,69,.14)", border: "1px solid rgba(34,197,94,.22)", display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#4ADE80" }}>Soporte en línea · &lt; 5 min de respuesta</span>
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
