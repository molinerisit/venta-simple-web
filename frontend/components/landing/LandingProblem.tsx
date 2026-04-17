import { C, T, PROBLEMS } from "./tokens";

export default function LandingProblem() {
  return (
    <section style={{ background: C.bg, padding: "112px 0" }}>
      <div className="l-container">
        <div style={{ maxWidth: 580, marginBottom: 64 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>El problema</div>
          <h2 style={{ ...T.h2, margin: "0 0 20px" }}>
            ¿Seguís manejando<br />tu negocio sin un sistema?
          </h2>
          <p style={{ ...T.body, maxWidth: 480 }}>
            Cada día sin control es plata que perdés.<br />
            Errores en el stock, ventas sin registrar y decisiones a ciegas.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: C.border, borderRadius: 16, overflow: "hidden" }}>
          {PROBLEMS.map((p, i) => (
            <div key={i} className="l-problem-card" style={{
              background: C.surface, padding: "28px 26px",
              display: "flex", gap: 16, alignItems: "flex-start",
              transition: "background .15s, box-shadow .15s",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: "#FDF2F2", border: "1px solid #FECACA",
                display: "grid", placeItems: "center",
              }}>
                <p.icon size={13} style={{ color: "#B91C1C" }} />
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
