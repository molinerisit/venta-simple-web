import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { C, T } from "./tokens";

const CHECKS_QR      = ["Sin escribir montos", "Sin errores de tipeo", "Más rápido que cualquier posnet"];
const CHECKS_TRANS   = [
  "Ves las transferencias que entran en tiempo real",
  "Todo directo en la PC — sin usar el celular",
  "El cajero solo ve los pagos que entran, sin acceso a tu cuenta de Mercado Pago",
];
const CHECKS_PROD    = ["Menos tiempo cargando el catálogo", "Menos errores en precios", "Listo para vender desde el día 1"];
const CHECKS_IA      = ["Sabe qué productos te dejan más plata", "Te dice qué conviene reponer", "Compara períodos y muestra tendencias"];

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

function CheckList({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map(item => (
        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: light ? "rgba(255,255,255,.65)" : C.muted, lineHeight: 1.5 }}>
          <Check size={13} strokeWidth={3} style={{ color: light ? C.orange : C.green, flexShrink: 0, marginTop: 1 }} />
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

        {/* Block 1: Mercado Pago integration */}
        <div style={{
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: "36px 40px",
          marginBottom: 14,
        }}>
          {/* Block header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Image src="/icons/mercadopago.png" alt="Mercado Pago" width={28} height={28} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.orange }}>
              Integración con Mercado Pago
            </span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.muted, margin: "0 0 24px" }}>
            Para que puedas:
          </p>

          <div style={{ height: 1, background: C.border, marginBottom: 28 }} />

          {/* 2 sub-columns */}
          <div className="l-feat-mp-sub">

            {/* Sub 1: QR */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Image src="/icons/qr.png" alt="QR" width={22} height={22} style={{ objectFit: "contain" }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Cobrás con QR sin tocar el posnet</span>
              </div>
              <p style={{ ...T.body, fontSize: 13, margin: "0 0 20px", lineHeight: 1.65 }}>
                Imprimís tu QR una vez y te olvidás. El sistema calcula el total y lo envía al QR solo. El cliente paga. Listo.
              </p>

              <div style={{ display: "flex", flexDirection: "column" as const, marginBottom: 20 }}>
                {STEPS_QR.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 99,
                        background: C.orange, color: "#fff",
                        display: "grid", placeItems: "center",
                        fontSize: 12, fontWeight: 900, flexShrink: 0,
                      }}>
                        {s.n}
                      </div>
                      {i < STEPS_QR.length - 1 && (
                        <div style={{ width: 2, height: 22, background: C.border, margin: "4px 0" }} />
                      )}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, paddingTop: 5, lineHeight: 1.45 }}>
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>

              <CheckList items={CHECKS_QR} />
            </div>

            {/* Divider vertical */}
            <div className="l-feat-mp-divider" style={{ width: 1, background: C.border, alignSelf: "stretch" }} />

            {/* Sub 2: Transfers */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12l10-10 10 10" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Ves las transferencias en tiempo real</span>
              </div>
              <p style={{ ...T.body, fontSize: 13, margin: "0 0 20px", lineHeight: 1.65 }}>
                Sin abrir el celular. Sin darle acceso a tu cuenta al cajero. Solo ves los pagos que entran — directo en la PC de caja.
              </p>
              <CheckList items={CHECKS_TRANS} />
            </div>
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
              <strong>Kairos</strong>, nuestra IA, analiza tus ventas y te dice qué hacer para ganar más — sin que vos tengas que buscar nada.
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
