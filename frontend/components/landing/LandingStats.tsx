import { C } from "./tokens";

const STATS = [
  { n: "+500",       sub: "negocios activos",    accent: false },
  { n: "+1.200.000", sub: "ventas procesadas",   accent: true  },
  { n: "100%",       sub: "modo offline",        accent: false },
  { n: "< 5 min",    sub: "tiempo de respuesta", accent: false },
  { n: "$0",         sub: "para empezar",        accent: false },
];

export default function LandingStats() {
  return (
    <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "64px 0" }}>
      <div className="l-container">
        <div className="l-stats-grid">
          {STATS.map((s, i) => (
            <div key={s.n} style={{
              textAlign: "center",
              padding: "0 24px",
              borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900,
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
