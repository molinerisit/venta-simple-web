import Link from "next/link";
import { Receipt, Smartphone, LineChart, Cloud, ArrowRight } from "lucide-react";
import { C, T } from "./tokens";

const FEATURES = [
  {
    icon: Receipt,
    title: "Cobrás en segundos, no en minutos",
    desc: "Punto de venta en PC diseñado para el mostrador. Buscás el producto, cobrás e imprimís ticket en menos de 10 segundos.",
  },
  {
    icon: Cloud,
    title: "Funciona aunque se corte internet",
    desc: "El sistema no depende de la conexión. Seguís cobrando con normalidad — cuando vuelve la señal, sincroniza solo.",
  },
  {
    icon: LineChart,
    title: "Cierre de caja automático — sin calculadora",
    desc: "Al final del día el sistema cierra la caja solo. Sin sumas manuales, sin diferencias, sin 40 minutos perdidos.",
  },
  {
    icon: Smartphone,
    title: "Todo desde el celular — sin moverte del negocio",
    desc: "Ventas, stock y ganancias en tiempo real desde cualquier lugar. El negocio bajo control, aunque no estés presente.",
  },
];

export default function LandingFeatures() {
  return (
    <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Por qué funciona</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
            El sistema de caja que tu negocio<br />necesitaba desde hace tiempo.
          </h2>
        </div>

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
            Empezar gratis <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
