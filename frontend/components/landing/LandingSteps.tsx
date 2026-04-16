import Link from "next/link";
import { Zap, Download, ShoppingCart } from "lucide-react";
import { C, T } from "./tokens";

const STEPS = [
  {
    n: "1", icon: Zap,
    title: "Creá tu cuenta gratis",
    desc: "Registrate en 2 minutos. Sin tarjeta de crédito. Nada que instalar todavía.",
    highlight: false,
  },
  {
    n: "2", icon: Download,
    title: "Descargá e instalá la app",
    desc: "Instalás el sistema en tu PC, cargás tus productos y ya tenés todo listo para vender.",
    highlight: true,
  },
  {
    n: "3", icon: ShoppingCart,
    title: "Empezá a vender",
    desc: "Desde el panel web ves todo en tiempo real. El soporte 24/7 te acompaña desde el primer día.",
    highlight: false,
  },
];

export default function LandingSteps() {
  return (
    <section id="como-funciona" style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container" style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Simple de arrancar</div>
          <h2 style={{ ...T.h2, margin: "0 0 14px" }}>En 3 pasos ya estás operando</h2>
          <p style={{ ...T.body, maxWidth: 460, margin: "0 auto" }}>Sin técnicos, sin instalaciones complicadas, sin migraciones de una semana.</p>
        </div>

        <div className="l-steps-grid">
          {STEPS.map((s) => (
            <div key={s.n} style={{
              padding: "28px 26px",
              borderRadius: 16,
              background: s.highlight ? C.orange : C.surface,
              border: `1.5px solid ${s.highlight ? C.orange : C.border}`,
              boxShadow: s.highlight ? `0 12px 40px rgba(249,115,22,.30)` : "0 1px 3px rgba(26,24,22,.05)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 20, right: 22,
                fontSize: 52, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1,
                color: s.highlight ? "rgba(255,255,255,.08)" : "rgba(26,24,22,.05)",
                pointerEvents: "none", userSelect: "none",
              }}>
                {s.n}
              </div>

              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: s.highlight ? "rgba(255,255,255,.20)" : C.orangeBg,
                border: `1px solid ${s.highlight ? "rgba(255,255,255,.28)" : C.orangeBdr}`,
                display: "grid", placeItems: "center",
                marginBottom: 18,
              }}>
                <s.icon size={20} style={{ color: s.highlight ? "#fff" : C.orange }} />
              </div>

              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: s.highlight ? "#fff" : C.text, marginBottom: 10 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: s.highlight ? "rgba(255,255,255,.65)" : C.muted }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 9, fontWeight: 700, fontSize: 15,
            background: C.orange, color: "#fff", textDecoration: "none",
            boxShadow: "0 4px 18px rgba(249,115,22,.30)",
          }}>
            Empezar ahora — es gratis →
          </Link>
        </div>
      </div>
    </section>
  );
}
