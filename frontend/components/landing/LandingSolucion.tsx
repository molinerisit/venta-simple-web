import { CheckCircle2, ArrowRight } from "lucide-react";
import { C, T } from "./tokens";

const BENEFITS = [
  { text: "Control de stock en tiempo real — sin perder una venta por falta de producto" },
  { text: "Cierre de caja automático — sin errores, sin tiempo perdido" },
  { text: "Lista de precios siempre actualizada — desde el celular, en segundos" },
  { text: "Dashboard de ganancias — sabés exactamente cuánto entrá cada día" },
];

export default function LandingSolucion() {
  return (
    <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">
        <div className="l-solucion-grid">

          {/* Left: copy */}
          <div>
            <div style={{ ...T.label, marginBottom: 16 }}>La solución</div>
            <h2 style={{ ...T.h2, margin: "0 0 20px" }}>
              Todo lo que necesitás<br />en un solo sistema.
            </h2>
            <p style={{ ...T.body, maxWidth: 440, marginBottom: 40 }}>
              Cada problema que te frena hoy tiene una respuesta concreta dentro de VentaSimple.
              Sin planillas, sin papel, sin depender de nadie.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 44 }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle2 size={18} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{b.text}</p>
                </div>
              ))}
            </div>

            <a href="#pricing" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.orange, color: "#fff",
              padding: "14px 28px", borderRadius: 10,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              transition: "background .15s",
            }}
              onMouseOver={e => (e.currentTarget.style.background = C.orangeDark)}
              onMouseOut={e => (e.currentTarget.style.background = C.orange)}
            >
              Empezar gratis <ArrowRight size={16} />
            </a>
          </div>

          {/* Right: before/after card */}
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "32px 28px", display: "flex", flexDirection: "column", gap: 0,
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...T.label, marginBottom: 12 }}>Sin sistema</div>
              {[
                "Stock en cuadernos o de memoria",
                "Caja que cierra con errores",
                "Precios desactualizados",
                "Sin idea de la ganancia real",
              ].map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B91C1C", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.muted }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: C.bgAlt, marginBottom: 24 }} />

            <div>
              <div style={{ ...T.label, color: C.green, marginBottom: 12 }}>Con VentaSimple</div>
              {[
                "Stock actualizado automáticamente",
                "Caja que se cierra sola, sin errores",
                "Precios editables desde el celular",
                "Dashboard con ganancia en tiempo real",
              ].map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.greenBdr}` : "none",
                }}>
                  <CheckCircle2 size={14} style={{ color: C.green, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
