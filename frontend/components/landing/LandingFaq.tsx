import { C, T } from "./tokens";

const FAQS = [
  { q: "¿Funciona si se va internet o la conexión es mala?",             a: "Sí. La app funciona offline sin límite de tiempo. Seguís vendiendo con normalidad y cuando vuelve la conexión, todo se sincroniza automáticamente." },
  { q: "¿Qué pasa si tengo un problema en medio de una venta?",          a: "Nos escribís por WhatsApp y respondemos en menos de 5 minutos, las 24 horas. Soporte humano, no un bot que te manda artículos de ayuda." },
  { q: "¿Funciona con mi impresora de tickets y lector de barras?",      a: "Sí. VentaSimple es compatible con impresoras térmicas de tickets y lectores de código de barras USB estándar. No necesitás comprar hardware nuevo para arrancar. Si tenés dudas sobre tu equipo, el soporte confirma compatibilidad en minutos." },
  { q: "¿Qué pasa con mis datos si se rompe la PC?",                     a: "Nada. Todo se sincroniza automáticamente en la nube con backup diario. Si se rompe la PC, comprás una nueva, instalás la app y en minutos tu historial, productos y configuración están intactos." },
  { q: "¿Es difícil migrar desde Excel o de otro sistema?",              a: "No. Podés importar tus productos en minutos desde un archivo CSV o Excel. El equipo de soporte te acompaña en la migración sin costo adicional." },
  { q: "¿Puedo cancelar cuando quiero?",                                  a: "Sí, en cualquier momento. Sin contratos anuales, sin cargos por cancelación. La suscripción es mensual y la controlás vos." },
  { q: "¿Qué incluye exactamente el soporte 24/7?",                      a: "Asistencia por WhatsApp con una persona real para resolver dudas, problemas técnicos y configuraciones. En el plan Pro tenés prioridad de atención." },
  { q: "¿Funciona en cualquier PC con Windows?",                          a: "Sí. La app funciona en Windows 10 y 11. El panel administrativo web funciona en cualquier navegador moderno desde cualquier dispositivo." },
];

export default function LandingFaq() {
  return (
    <section id="faq" style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">
        <div className="l-faq-grid">

          <div className="l-faq-sticky" style={{ position: "sticky", top: 100 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>FAQ</div>
            <h2 style={{ ...T.h2, margin: "0 0 14px" }}>Preguntas frecuentes</h2>
            <p style={{ ...T.small }}>
              ¿Hay algo más?{" "}
              <a href="mailto:ventas@ventasimple.app" style={{ color: C.blue, fontWeight: 700 }}>
                Escribinos →
              </a>
            </p>
          </div>

          <div>
            {FAQS.map((item, i) => (
              <details key={i} className="l-details" style={{ borderBottom: `1px solid ${C.border}` }}>
                <summary style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 0", fontSize: 14, fontWeight: 600, color: C.text, userSelect: "none",
                }}>
                  {item.q}
                  <span className="l-faq-icon" style={{ color: C.light, fontSize: 22, marginLeft: 20, flexShrink: 0, fontWeight: 300, lineHeight: 1 }}>+</span>
                </summary>
                <div style={{ ...T.small, paddingBottom: 20, paddingRight: 40, lineHeight: 1.75 }}>{item.a}</div>
              </details>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
