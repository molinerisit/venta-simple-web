import Link from "next/link";
import { Receipt, Package, LineChart, Cloud } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { C, T } from "./tokens";

const FEATURES = [
  {
    icon: Receipt, n: "01",
    title: "Punto de venta y caja",
    desc: "Cobrá rápido con búsqueda por nombre o código. Cierre de caja en 2 minutos. Tickets automáticos.",
  },
  {
    icon: Package, n: "02",
    title: "Control de stock en tiempo real",
    desc: "Alertas automáticas cuando un producto está por agotarse. Ingreso de mercadería y ajustes de inventario.",
  },
  {
    icon: LineChart, n: "03",
    title: "Reportes y métricas",
    desc: "Productos más vendidos, horarios pico, comparativas por período. Exportes en PDF y CSV.",
  },
  {
    icon: Cloud, n: "04",
    title: "Multi-PC · Funciona offline",
    desc: "Cajero, depósito y administración sincronizados. Si se va internet, seguís vendiendo sin límite.",
  },
];

export default function LandingFeatures() {
  return (
    <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Funcionalidades</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            Todo lo que necesitás,<br />en un solo lugar.
          </h2>
          <p style={{ ...T.body, maxWidth: 500, margin: "0 auto" }}>
            Pensado para dueños de negocio que necesitan resultados, no un manual de 200 páginas.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: C.border, borderRadius: 20, overflow: "hidden" }}>
          {FEATURES.map((f) => (
            <div key={f.n} style={{
              background: C.surface,
              padding: "40px 36px",
              display: "flex", flexDirection: "column", gap: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: C.heroBg, display: "grid", placeItems: "center",
                }}>
                  <f.icon size={22} style={{ color: "#fff" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.orange, letterSpacing: "0.1em" }}>{f.n}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
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
            boxShadow: "0 4px 18px rgba(249,115,22,.30)",
          }}>
            Probarlo gratis <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
