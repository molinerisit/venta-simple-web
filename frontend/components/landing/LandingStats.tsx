"use client";
import { useEffect, useState } from "react";
import { C } from "./tokens";

const STATS = [
  {
    n:     "+500",
    sub:   "negocios activos",
    ctx:   "ferreterías, almacenes, kioscos y más",
    accent: false,
  },
  {
    n:     "-80%",
    sub:   "menos tiempo cerrando la caja",
    ctx:   "de 40 minutos a menos de 5 — sin errores ni diferencias",
    accent: true,
  },
  {
    n:     "Siempre activo",
    sub:   "tengas internet o no",
    ctx:   "vendé offline, se sincroniza solo al reconectar",
    accent: false,
  },
];

export default function LandingStats() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return null;

  return (
    <section style={{ background: C.heroBg, padding: "64px 0" }}>
      <div className="l-container">
        <div className="l-stats-3col">
          {STATS.map((s, i) => (
            <div key={s.n} style={{
              textAlign: "center",
              padding: "0 28px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,.10)" : "none",
            }}>
              <div style={{
                fontSize: s.accent ? "clamp(32px, 3.8vw, 48px)" : "clamp(26px, 2.8vw, 38px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                color: s.accent ? C.orange : "#fff",
                lineHeight: 1,
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginTop: 8, fontWeight: 700 }}>{s.sub}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.38)", marginTop: 4, fontWeight: 400, fontStyle: "italic" }}>{s.ctx}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
