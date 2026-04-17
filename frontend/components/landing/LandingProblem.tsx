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
            Y muchas veces ni siquiera te das cuenta.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {PROBLEMS.map((p, i) => (
            <div key={i} className="l-problem-card" style={{
              background: "#fff", padding: "26px 24px",
              display: "flex", gap: 16, alignItems: "flex-start",
              border: `1px solid ${C.border}`, borderRadius: 12,
              transition: "box-shadow .2s",
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
