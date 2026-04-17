import { Star } from "lucide-react";
import { C, T } from "./tokens";

const TESTIMONIALS = [
  { q: "Antes cerraba la caja con una calculadora y me tardaba 40 minutos. Ahora son 5 minutos y sé exactamente qué vendí.", name: "Laura G.", biz: "Minimercado · Buenos Aires", stars: 5 },
  { q: "Lo que más me convenció fue el soporte. Tuve una duda a la noche y en minutos me lo resolvieron. Antes esperaba días.", name: "Diego F.", biz: "Kiosco · Córdoba", stars: 5 },
  { q: "Por fin sé cuáles son mis 10 productos más vendidos. Cambié el pedido al proveedor y mejoré el margen notablemente.", name: "Carlos M.", biz: "Ferretería · Rosario", stars: 5 },
];

export default function LandingTestimonials() {
  return (
    <section style={{ background: C.bg, padding: "112px 0" }}>
      <div className="l-container">
        {/* Authority badge */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: C.blueBg, border: `1px solid #BFDBFE`,
            borderRadius: 99, padding: "10px 22px", marginBottom: 32,
          }}>
            <span style={{ fontSize: 22 }}>🏪</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>
              +500 negocios ya usan VentaSimple todos los días
            </span>
          </div>
          <div>
            <div style={{ ...T.label, marginBottom: 14 }}>Testimonios</div>
            <h2 style={{ ...T.h2, margin: "0 0 12px" }}>Negocios reales,<br />resultados reales.</h2>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", marginTop: 12 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#F59E0B" style={{ color: "#F59E0B" }} />
            ))}
            <span style={{ ...T.small, marginLeft: 8, fontSize: 13, fontWeight: 600 }}>4.9 / 5 promedio</span>
          </div>
        </div>

        <div className="l-testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: "26px 26px 22px",
              display: "flex", flexDirection: "column",
              boxShadow: "0 1px 3px rgba(26,24,22,.04)",
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={13} fill="#F59E0B" style={{ color: "#F59E0B" }} />
                ))}
              </div>
              <p style={{ ...T.small, margin: "0 0 auto", color: C.text, lineHeight: 1.7, fontWeight: 400, flex: 1 }}>
                &ldquo;{t.q}&rdquo;
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                <div style={{ fontSize: 12, color: C.light, marginTop: 2 }}>{t.biz}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
