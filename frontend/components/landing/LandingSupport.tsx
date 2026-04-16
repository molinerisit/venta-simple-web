import { C, T, SUPPORT_CARDS } from "./tokens";

export default function LandingSupport() {
  return (
    <section style={{
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "112px 0",
    }}>
      <div className="l-container" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="l-support-grid">

          {/* Texto */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
              padding: "5px 12px 5px 8px", borderRadius: 99,
              background: C.greenBg, border: `1px solid ${C.greenBdr}`,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
              <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>Disponible ahora mismo</span>
            </div>

            <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
              Soporte real,<br />las 24 horas.
            </h2>
            <p style={{ ...T.body, marginBottom: 28 }}>
              Ningún software elimina todos los problemas. La diferencia es qué pasa cuando algo falla. Con VentaSimple, en minutos tenés a alguien real ayudándote.
            </p>

            <blockquote style={{
              margin: 0, padding: "18px 22px",
              borderLeft: `3px solid ${C.green}`,
              background: C.greenBg,
              borderRadius: "0 12px 12px 0",
              border: `1px solid ${C.greenBdr}`,
              borderLeftWidth: 3,
            }}>
              <p style={{ ...T.small, fontStyle: "italic", margin: "0 0 10px", color: C.text, lineHeight: 1.6 }}>
                &ldquo;Tuve un problema a las 11pm en medio de una venta y me respondieron en 3 minutos. No lo podía creer.&rdquo;
              </p>
              <cite style={{ fontSize: 12, color: C.muted, fontStyle: "normal", fontWeight: 600 }}>
                — Martín R., ferretería, Rosario
              </cite>
            </blockquote>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.border, borderRadius: 16, overflow: "hidden" }}>
            {SUPPORT_CARDS.map((s) => (
              <div key={s.title} style={{ padding: "22px 20px", background: C.surface }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: C.greenBg, border: `1px solid ${C.greenBdr}`,
                  display: "grid", placeItems: "center", marginBottom: 14,
                }}>
                  <s.icon size={16} style={{ color: C.green }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 5 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
