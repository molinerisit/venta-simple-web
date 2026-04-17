import { C, T, PROBLEMS } from "./tokens";

export default function LandingProblem() {
  return (
    <section style={{ background: C.bg, padding: "112px 0" }}>
      <div className="l-container">
        <div style={{ maxWidth: 580, marginBottom: 64 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>El problema</div>
          <h2 style={{ ...T.h2, margin: "0 0 20px" }}>
            ¿Tu negocio depende<br />de lo que te acordás?
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
              transition: "box-shadow .2s, transform .2s",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: "rgba(185,28,28,0.08)",
                display: "grid", placeItems: "center",
              }}>
                <p.icon size={15} strokeWidth={2.5} style={{ color: "#B91C1C" }} />
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 32, fontSize: 14, fontWeight: 700,
          color: C.muted, textAlign: "center", letterSpacing: "-0.01em",
        }}>
          No es tu culpa. Es el sistema que no tenés.
        </p>
      </div>
    </section>
  );
}
