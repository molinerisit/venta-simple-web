import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { C, T } from "./tokens";

const CHECKS_QR   = ["Sin escribir montos", "Sin errores de tipeo", "Más rápido que cualquier posnet"];
const CHECKS_PROD = ["Menos tiempo cargando el catálogo", "Menos errores en precios", "Listo para vender desde el día 1"];
const CHECKS_IA   = ["Ves transferencias de Mercado Pago en tiempo real", "Sin necesitar el celular", "Todo directo en tu PC"];

const STEPS_QR = [
  { n: "1", text: "Imprimís tu QR de Mercado Pago una sola vez" },
  { n: "2", text: "Escaneás los productos en caja" },
  { n: "3", text: "El sistema genera el cobro automáticamente" },
];

const UPDATES = [
  "Cobro automático con QR — sin escribir montos",
  "Base de +10.000 productos precargados",
  "IA Kairos con recomendaciones en tiempo real",
  "Transferencias de Mercado Pago sin usar el celular",
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map(item => (
        <li key={item} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: C.muted }}>
          <Check size={13} strokeWidth={3} style={{ color: C.green, flexShrink: 0 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function LandingFeatures() {
  return (
    <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Diferenciales</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px", maxWidth: 560 }}>
            No es otro sistema de caja.
          </h2>
          <p style={{ ...T.body, maxWidth: 500, margin: 0 }}>
            VentaSimple no solo reemplaza el cuaderno.<br />
            Hace cosas que otros sistemas directamente no pueden.
          </p>
        </div>

        {/* Block 1: QR */}
        <div className="l-feat-qr" style={{
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: "40px",
          marginBottom: 14,
        }}>
          {/* Left: copy */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Image src="/icons/qr.png" alt="QR" width={32} height={32} style={{ objectFit: "contain" }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.orange }}>
                Cobro instantáneo
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 14px" }}>
              Cobrás con QR sin tocar el posnet
            </h3>
            <p style={{ ...T.body, fontSize: 14, margin: "0 0 24px", lineHeight: 1.7 }}>
              Imprimís tu QR una vez y te olvidás. El sistema calcula el total y lo envía al QR automáticamente. El cliente paga. Listo.
            </p>
            <CheckList items={CHECKS_QR} />
          </div>

          {/* Right: steps */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS_QR.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 99,
                    background: C.orange, color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 15, fontWeight: 900, flexShrink: 0,
                  }}>
                    {s.n}
                  </div>
                  {i < STEPS_QR.length - 1 && (
                    <div style={{ width: 2, height: 28, background: C.border, margin: "6px 0" }} />
                  )}
                </div>
                <p style={{
                  fontSize: 14, fontWeight: 600, color: C.text,
                  margin: 0, paddingTop: 8, lineHeight: 1.5,
                  ...(i < STEPS_QR.length - 1 ? { marginBottom: 6 } : {}),
                }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Blocks 2 + 3 */}
        <div className="l-feat-cards" style={{ marginBottom: 14 }}>

          {/* Block 2: Productos */}
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "36px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Image src="/icons/producto.png" alt="Productos" width={30} height={30} style={{ objectFit: "contain" }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.blue }}>
                Base de datos
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 12px" }}>
              Cargás productos en segundos
            </h3>
            <p style={{ ...T.body, fontSize: 14, margin: "0 0 22px", lineHeight: 1.7 }}>
              VentaSimple ya tiene más de <strong>10.000 productos cargados</strong>. Buscás por nombre o código y listo.
            </p>
            <CheckList items={CHECKS_PROD} />
          </div>

          {/* Block 3: IA Kairos */}
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "36px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Image src="/icons/ia.png" alt="IA Kairos" width={30} height={30} style={{ objectFit: "contain" }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.blue }}>
                Inteligencia artificial
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 12px" }}>
              Tu negocio empieza a pensar solo
            </h3>
            <p style={{ ...T.body, fontSize: 14, margin: "0 0 22px", lineHeight: 1.7 }}>
              <strong>Kairos</strong>, nuestra IA, te dice qué productos te dejan más plata, qué conviene reponer y cómo estás vendiendo hoy.
            </p>
            <CheckList items={CHECKS_IA} />
          </div>
        </div>

        {/* En constante evolución */}
        <div className="l-feat-updates" style={{
          background: C.heroBg, borderRadius: 20,
          padding: "36px 40px", marginBottom: 48,
        }}>
          <div>
            <div style={{ ...T.label, color: "rgba(255,255,255,.3)", marginBottom: 12 }}>Actualizaciones</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 12px" }}>
              En constante evolución
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.75, margin: 0 }}>
              VentaSimple no es un sistema que se queda quieto. Todos los meses sumamos mejoras reales para que tu negocio funcione mejor.
            </p>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
            {UPDATES.map(u => (
              <li key={u} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                  background: C.orange, color: "#fff", padding: "3px 9px", borderRadius: 4,
                  flexShrink: 0,
                }}>
                  Nuevo
                </span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.5 }}>{u}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
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
