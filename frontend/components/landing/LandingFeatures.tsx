import Link from "next/link";
import { Receipt, Package, LineChart, Cloud, ArrowRight } from "lucide-react";
import { C, T } from "./tokens";

const FEATURES = [
  {
    icon: Receipt,
    title: "Punto de venta y caja",
    desc: "Cobrá rápido y sin errores. Atendé más clientes en menos tiempo.",
  },
  {
    icon: Package,
    title: "Control de stock",
    desc: "Sabé siempre qué tenés y qué falta. Evitá quedarte sin stock sin darte cuenta.",
  },
  {
    icon: LineChart,
    title: "Reportes y Ganancias",
    desc: "Entendé qué te deja plata y qué no. Tomá decisiones con datos reales.",
  },
  {
    icon: Cloud,
    title: "Conexión y Offline",
    desc: "Tu negocio sigue funcionando siempre. Aunque se corte internet, no frenás.",
  },
];

export default function LandingFeatures() {
  return (
    <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Funcionalidades</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            Todo lo que necesitás para<br />manejar tu negocio sin complicarte.
          </h2>
          <p style={{ ...T.body, maxWidth: 480, margin: "0 auto" }}>
            Hecho para que vendas más y pierdas menos tiempo.
          </p>
        </div>

        <p style={{
          textAlign: "center", marginBottom: 40,
          fontSize: 15, fontWeight: 700, color: C.blue,
          letterSpacing: "-0.01em",
        }}>
          Todo lo que hoy hacés manual, acá se resuelve solo.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="l-feature-card" style={{
              background: C.surface, padding: "36px 32px",
              border: `1px solid ${C.border}`, borderRadius: 16,
              display: "flex", flexDirection: "column", gap: 18,
              transition: "box-shadow .2s, transform .2s",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: C.blueBg, display: "grid", placeItems: "center",
              }}>
                <f.icon size={22} strokeWidth={2} style={{ color: C.blue }} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p style={{ ...T.body, fontSize: 14, margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 9, fontWeight: 700, fontSize: 14,
            background: C.orange, color: "#fff", textDecoration: "none",
          }}>
            Probarlo gratis <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
