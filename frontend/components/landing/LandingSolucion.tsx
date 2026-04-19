import { CheckCircle2, ArrowRight } from "lucide-react";
import { C, T } from "./tokens";

const BENEFITS = [
  { text: "Cobrás en segundos — la fila no espera más" },
  { text: "La caja cierra sola — sin calculadora, sin diferencias" },
  { text: "Seguís vendiendo aunque se corte internet" },
  { text: "Ganancia exacta del día — en tiempo real, desde el celular" },
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
              Sin buscar precios. Sin contar caja. Sin adivinar.<br />
              Sabés exactamente cuánto ganás — desde hoy.
            </h2>
            <p style={{ ...T.body, maxWidth: 440, marginBottom: 40 }}>
              VentaSimple reemplaza el cuaderno, la calculadora y el caos.
              Lo instalás hoy — y desde esa tarde cobrás diferente.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 44 }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle2 size={18} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{b.text}</p>
                </div>
              ))}
            </div>

            <a href="#pricing" className="l-cta-btn">
              Empezar gratis <ArrowRight size={16} />
            </a>
          </div>

          {/* Right: before/after card */}
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "32px 28px", display: "flex", flexDirection: "column", gap: 0,
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...T.label, marginBottom: 12 }}>Hoy, sin VentaSimple</div>
              {[
                "Buscás el precio a mano — la fila espera",
                "Caja que cierra en 40 minutos con calculadora",
                "Se corta internet y dejás de vender",
                "Vendés pero no sabés si realmente ganaste",
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
              <div style={{ ...T.label, color: C.green, marginBottom: 12 }}>Con VentaSimple — desde hoy</div>
              {[
                "Cobrás en 10 segundos — ticket impreso automático",
                "La caja se cierra sola, sin errores, en 5 minutos",
                "Funciona sin internet — seguís vendiendo igual",
                "Ganancia exacta del día, en tiempo real",
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
