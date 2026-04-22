import { Star } from "lucide-react";
import { C, T } from "./tokens";

const TESTIMONIALS = [
  {
    title: "De 40 minutos a 5. Y sin errores.",
    body: "Antes cerraba con calculadora. Ahora aprieto un botón y listo.",
    name: "Laura G.", biz: "Minimercado · Buenos Aires", stars: 5,
  },
  {
    title: "Cambié el pedido y gané más vendiendo lo mismo.",
    body: "Los reportes me mostraron que las galletitas me dejaban más plata que las gaseosas.",
    name: "Diego F.", biz: "Kiosco · Córdoba", stars: 5,
  },
  {
    title: "Hace meses que no llamo al local.",
    body: "Antes llamaba tres veces al día para saber cómo iba. Ahora abro el celular y en cinco segundos sé todo.",
    name: "Carlos M.", biz: "Ferretería · Rosario", stars: 5,
  },
];

export default function LandingTestimonials() {
  return (
    <section style={{ background: C.bg, padding: "112px 0" }}>
      <div className="l-container">

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.blueBg, border: "1px solid #BFDBFE",
            borderRadius: 99, padding: "7px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>🏪</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>
              +500 negocios ya usan VentaSimple todos los días
            </span>
          </div>
          <div style={{ ...T.label, marginBottom: 10 }}>Testimonios</div>
          <h2 style={{ ...T.h2, margin: "0 0 10px" }}>Negocios reales,<br />resultados reales.</h2>
          <div style={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#F59E0B" style={{ color: "#F59E0B" }} />
            ))}
            <span style={{ ...T.small, marginLeft: 8, fontSize: 13, fontWeight: 600 }}>4.9 / 5 promedio</span>
          </div>
        </div>

        <div className="l-testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="l-testimonial-card" style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "20px 20px 16px",
              display: "flex", flexDirection: "column",
              boxShadow: "0 1px 3px rgba(26,24,22,.04)",
              transition: "box-shadow .2s, transform .2s",
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={13} fill="#F59E0B" style={{ color: "#F59E0B" }} />
                ))}
              </div>

              <p style={{
                fontSize: 15, fontWeight: 800, lineHeight: 1.35,
                letterSpacing: "-0.02em", color: C.text, margin: "0 0 8px",
              }}>
                &ldquo;{t.title}&rdquo;
              </p>

              <p style={{ ...T.small, margin: "0 0 auto", color: C.muted, lineHeight: 1.65, flex: 1 }}>
                {t.body}
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
