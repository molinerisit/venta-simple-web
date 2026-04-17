"use client";
import { useEffect, useRef, useState } from "react";
import { C, T } from "./tokens";

const ROWS = [
  {
    label: "Velocidad de cobro",
    before: { label: "2–3 min por cliente", pct: 85 },
    after:  { label: "menos de 30 seg",     pct: 18 },
  },
  {
    label: "Carga operativa diaria",
    before: { label: "Desorganizada, impredecible", pct: 90 },
    after:  { label: "Estable, automatizada",        pct: 22 },
  },
  {
    label: "Personal en caja",
    before: { label: "2 personas",  pct: 66 },
    after:  { label: "1 persona",   pct: 33 },
  },
];

function Bar({ pct, color, animate }: { pct: number; color: string; animate: boolean }) {
  return (
    <div style={{ height: 8, background: "#E5E7EB", borderRadius: 99, overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", borderRadius: 99,
        background: color,
        width: animate ? `${pct}%` : "0%",
        transition: animate ? "width 1s cubic-bezier(.4,0,.2,1)" : "none",
      }} />
    </div>
  );
}

export default function LandingCambio() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">
        <div style={{ maxWidth: 560, marginBottom: 64 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Impacto real</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            Así cambia tu negocio<br />en pocos días
          </h2>
          <p style={{ ...T.body }}>
            No hablamos de teoría — estos son los cambios que ven los negocios que empiezan a usar VentaSimple.
          </p>
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 16, marginBottom: 12, alignItems: "center" }}>
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: "#EF4444", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B91C1C", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sin sistema</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: C.green, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: "0.06em", textTransform: "uppercase" }}>Con VentaSimple</span>
          </div>
        </div>

        {/* Rows */}
        <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ROWS.map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 16,
              alignItems: "center",
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "20px 24px",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{row.label}</span>

              {/* Before */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Bar pct={row.before.pct} color="#EF4444" animate={visible} />
                </div>
                <span style={{ fontSize: 12, color: "#B91C1C" }}>{row.before.label}</span>
              </div>

              {/* After */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Bar pct={row.after.pct} color={C.green} animate={visible} />
                </div>
                <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{row.after.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 40, textAlign: "center",
          padding: "20px 32px",
          background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 12,
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.green, margin: 0, letterSpacing: "-0.01em" }}>
            Menos tiempo por venta = más clientes atendidos = más ingresos
          </p>
        </div>
      </div>
    </section>
  );
}
