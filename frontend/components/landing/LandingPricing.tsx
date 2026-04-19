import Link from "next/link";
import { Check, MessageSquare, Camera } from "lucide-react";
import { C, T, PRICE_BASIC, PRICE_PRO, money } from "./tokens";

function PricingCard({ name, badge, price, sub, features, cta, href, highlight }: {
  name: string; badge: string | null; price: number; sub: string;
  features: string[]; cta: string; href: string; highlight: boolean;
}) {
  return (
    <div style={{
      background: highlight ? C.heroBg : C.surface,
      border: highlight ? `2px solid ${C.orange}` : `1px solid ${C.border}`,
      borderRadius: 18,
      padding: highlight ? "36px 30px" : "30px 26px",
      position: "relative",
      display: "flex", flexDirection: "column",
      boxShadow: highlight ? "0 8px 24px rgba(11,29,63,.18)" : "0 1px 4px rgba(26,24,22,.05)",
    }}>
      {badge && (
        <span style={{
          position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
          fontSize: 10, fontWeight: 900, letterSpacing: "0.09em",
          textTransform: "uppercase", padding: "4px 14px", borderRadius: 99,
          background: C.orange, color: "#fff", whiteSpace: "nowrap",
        }}>
          {badge}
        </span>
      )}

      <p style={{
        fontSize: 12, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase",
        color: highlight ? "rgba(255,255,255,.45)" : C.light, margin: "0 0 14px",
      }}>
        {name}
      </p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
        <span style={{
          fontSize: price === 0 ? 42 : 44, fontWeight: 900,
          letterSpacing: "-0.04em", lineHeight: 1,
          color: highlight ? "#fff" : C.text,
        }}>
          {price === 0 ? "Gratis" : money(price)}
        </span>
        {price > 0 && (
          <span style={{ fontSize: 14, color: highlight ? "rgba(255,255,255,.45)" : C.light, fontWeight: 500 }}>/mes</span>
        )}
      </div>

      <p style={{ fontSize: 12, color: highlight ? "rgba(255,255,255,.35)" : C.light, margin: "0 0 28px" }}>
        {sub}
      </p>

      <div style={{ height: 1, background: highlight ? "rgba(255,255,255,.08)" : C.border, marginBottom: 22 }} />

      <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, lineHeight: 1.5, color: highlight ? "rgba(255,255,255,.75)" : C.muted }}>
            <Check size={14} strokeWidth={3} style={{ color: highlight ? C.orange : C.green, flexShrink: 0, marginTop: 1 }} />
            {f}
          </li>
        ))}
      </ul>

      <Link href={href} style={{
        display: "block", textAlign: "center",
        padding: "14px 0", borderRadius: 10,
        fontWeight: 800, fontSize: 14,
        textDecoration: "none",
        background: highlight ? C.orange : C.heroBg,
        color: "#fff",
        letterSpacing: "-0.01em",
      }}>
        {cta}
      </Link>
    </div>
  );
}

export default function LandingPricing() {
  return (
    <section id="pricing" style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Precios</div>
          <h2 style={{ ...T.h2, margin: "0 0 14px" }}>Elegí el control<br />que necesita tu negocio.</h2>
          <p style={{ ...T.body, maxWidth: 440, margin: "0 auto" }}>
            Sin contratos. Sin sorpresas. Probalo 15 días gratis — si no te sirve, no pagás nada.
          </p>
        </div>

        <div className="l-pricing-grid" style={{ alignItems: "center" }}>
          <PricingCard
            name="Para arrancar"
            badge={null}
            price={0}
            sub="Sin tarjeta de crédito · para conocer el sistema"
            features={[
              "Vendés y cobrás desde el primer día",
              "1 dispositivo",
              "Historial de los últimos 30 días",
              "Soporte por email",
            ]}
            cta="Probar gratis"
            href="/registro"
            highlight={false}
          />
          <PricingCard
            name="Para ordenar tu negocio"
            badge="Más elegido"
            price={PRICE_BASIC}
            sub="Pesos argentinos · 15 días de prueba · cancelás cuando querés"
            features={[
              "Sabés cuánto ganás todos los días",
              "Cerrás la caja en 5 minutos, sin errores",
              "Controlás stock, clientes y ventas desde el celular",
              "Soporte 24/7 por WhatsApp — persona real, no un bot",
            ]}
            cta="Empezar — 15 días gratis"
            href="/login?next=/cuenta"
            highlight={true}
          />
          <PricingCard
            name="Para tener control total"
            badge={null}
            price={PRICE_PRO}
            sub="Pesos argentinos · cancelás cuando querés"
            features={[
              "Todo lo del plan anterior",
              "Hasta 3 cajas conectadas al mismo tiempo",
              "Reportes avanzados para decidir mejor",
              "Soporte prioritario 24/7",
            ]}
            cta="Empezar"
            href="/login?next=/cuenta"
            highlight={false}
          />
        </div>

        {/* Guarantee */}
        <div style={{ textAlign: "center", marginTop: 32, marginBottom: 56 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.muted, margin: "0 0 6px" }}>
            Probalo 15 días gratis. Si no te sirve, no pagás nada.
          </p>
          <p style={{ fontSize: 13, color: C.light, fontStyle: "italic" }}>
            Hoy podés empezar y esta noche ya saber cuánto vendiste.
          </p>
        </div>

        {/* Add-ons */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px", maxWidth: 920 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ ...T.h3, margin: "0 0 2px", fontSize: 15 }}>Potenciá tu negocio</h3>
              <p style={{ fontSize: 12, color: C.light, margin: 0 }}>Disponibles en planes Básico y Pro</p>
            </div>
            <a href="mailto:ventas@ventasimple.app" style={{ fontSize: 12, color: C.blue, fontWeight: 700, textDecoration: "none" }}>Consultar precio →</a>
          </div>
          <div>
            {[
              {
                icon: MessageSquare,
                name: "Atendé por WhatsApp automáticamente",
                desc: "Respondé clientes y tomá pedidos sin perder tiempo — funciona solo, las 24 horas.",
              },
              {
                icon: Camera,
                name: "Controlá el flujo de gente con IA",
                desc: "Sabé cuándo tenés más clientes y optimizá tus horarios con datos reales.",
              },
            ].map((a, i) => (
              <div key={a.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderTop: i === 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: C.blueBg, border: "1px solid rgba(30,58,138,.15)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <a.icon size={14} style={{ color: C.blue }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 3 }}>{a.name}</div>
                  <div style={{ ...T.small }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
