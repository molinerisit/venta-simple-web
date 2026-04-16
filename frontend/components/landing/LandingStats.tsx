import { C } from "./tokens";

const STATS = [
  { n: "+500",       sub: "negocios activos",    accent: false },
  { n: "+1.200.000", sub: "ventas procesadas",   accent: true  },
  { n: "100%",       sub: "funciona offline",    accent: false },
  { n: "< 5 min",    sub: "tiempo de respuesta", accent: false },
];

export default function LandingStats() {
  return (
    <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "56px 0" }}>
      <div className="l-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={s.n} style={{
              textAlign: "center",
              padding: "0 24px",
              borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                fontSize: "clamp(38px, 4.5vw, 56px)", fontWeight: 900,
                letterSpacing: "-0.05em",
                color: s.accent ? C.orange : C.text,
                lineHeight: 1,
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 10, fontWeight: 500 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
