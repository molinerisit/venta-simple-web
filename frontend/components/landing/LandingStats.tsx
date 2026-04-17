import { C } from "./tokens";

const STATS = [
  {
    n:    "+500",
    sub:  "negocios activos",
    ctx:  "ferreterías, almacenes, kioscos y más",
    accent: false,
  },
  {
    n:    "+1.200.000",
    sub:  "ventas procesadas",
    ctx:  "en negocios reales, todos los días",
    accent: true,
  },
  {
    n:    "Desde 2022",
    sub:  "en el mercado",
    ctx:  "3 años de historial real, no somos nuevos",
    accent: false,
  },
];

export default function LandingStats() {
  return (
    <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "64px 0" }}>
      <div className="l-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={s.n} style={{
              textAlign: "center",
              padding: "0 28px",
              borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                fontSize: s.accent ? "clamp(44px, 5.5vw, 68px)" : "clamp(36px, 4vw, 52px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                color: s.accent ? C.orange : C.text,
                lineHeight: 1,
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: 14, color: C.text, marginTop: 10, fontWeight: 700 }}>{s.sub}</div>
              <div style={{ fontSize: 12, color: C.light, marginTop: 5, fontWeight: 400, fontStyle: "italic" }}>{s.ctx}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
