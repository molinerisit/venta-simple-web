import { Monitor, Globe } from "lucide-react";
import { C } from "./tokens";

const STATS = [
  {
    n:    "+500",
    sub:  "negocios activos",
    ctx:  "ferreterías, almacenes, kioscos y más",
    accent: false,
  },
  {
    n:    "-80%",
    sub:  "menos tiempo cerrando la caja",
    ctx:  "de 40 minutos a menos de 5 — sin errores ni diferencias",
    accent: true,
  },
  {
    n:    "Siempre activo",
    sub:  "tengas internet o no",
    ctx:  "vendé offline, se sincroniza solo al reconectar",
    accent: false,
  },
];

export default function LandingStats() {
  return (
    <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "64px 0" }}>
      <div className="l-container">

        {/* Stats grid */}
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

        {/* Product cards */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 48, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 20px", borderRadius: 12,
            background: C.bg, border: `1px solid ${C.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,.04)",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "#EFF6FF", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Monitor size={18} strokeWidth={1.8} style={{ color: C.blue }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Punto de venta</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>App para Windows</div>
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 300, color: C.light, flexShrink: 0, userSelect: "none" }}>+</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 20px", borderRadius: 12,
            background: C.bg, border: `1px solid ${C.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,.04)",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "#EFF6FF", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Globe size={18} strokeWidth={1.8} style={{ color: C.blue }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Dashboard de gestión</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Panel web desde cualquier lugar</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
