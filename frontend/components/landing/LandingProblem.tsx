import { C, T, PROBLEMS } from "./tokens";

export default function LandingProblem() {
  return (
    <section style={{ background: C.bg, padding: "112px 0" }}>
      <div className="l-container">
        <div style={{ maxWidth: 580, marginBottom: 52 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>El problema</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            ¿Seguís controlando<br />tu negocio con Excel?
          </h2>
          <p style={{ ...T.body, maxWidth: 480 }}>
            Cada día sin un sistema claro es plata que se pierde — errores en el stock, clientes sin registro y cero visibilidad sobre qué realmente vendés.
          </p>
        </div>

        <div className="l-problems-grid">
          {PROBLEMS.map((p, i) => (
            <div key={i} style={{
              background: C.surface, padding: "28px 26px",
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: "#FDF2F2", border: "1px solid #FECACA",
                display: "grid", placeItems: "center",
              }}>
                <p.icon size={16} style={{ color: "#B91C1C" }} />
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
