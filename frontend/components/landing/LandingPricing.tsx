import Link from "next/link";
import { Check, MessageSquare, AlertTriangle } from "lucide-react";
import { C, T, PRICE_BASIC, PRICE_PRO, money } from "./tokens";

function PricingCard({ name, badge, price, features, cta, href, highlight }: {
  name: string; badge: string | null; price: number;
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
        {price === 0 ? "Para conocer el sistema — sin tarjeta" : price === PRICE_BASIC ? "Pesos argentinos · 7 días de prueba · cancelás cuando querés" : "Pesos argentinos · cancelás cuando querés"}
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
          <h2 style={{ ...T.h2, margin: "0 0 14px" }}>Sin contratos. Sin sorpresas.</h2>
          <p style={{ ...T.body, maxWidth: 420, margin: "0 auto" }}>
            7 días de prueba en el plan Básico, sin tarjeta. Si no es para vos, no cobramos nada.
          </p>
        </div>

        <div className="l-pricing-grid" style={{ alignItems: "center" }}>
          <PricingCard
            name="Básico gratis" badge={null} price={0}
            features={["Ventas y cobros básicos", "1 dispositivo", "Historial 30 días", "Soporte por email (48hs)"]}
            cta="Crear cuenta gratis" href="/registro" highlight={false}
          />
          <PricingCard
            name="Básico" badge="Más elegido" price={PRICE_BASIC}
            features={["Todo sincronizado — celular, PC y nube en tiempo real", "Sabés qué productos te dejan plata y cuáles no", "Cerrás la caja en 5 minutos, sin errores", "Soporte 24/7 por WhatsApp — te responde una persona, no un bot"]}
            cta="Empezar — 7 días gratis" href="/login?next=/cuenta" highlight={true}
          />
          <PricingCard
            name="Pro" badge={null} price={PRICE_PRO}
            features={["Hasta 3 PCs o cajas sincronizadas", "Reportes avanzados y exportación completa", "Soporte 24/7 prioritario", "Configuración personalizada incluida"]}
            cta="Empezar — 7 días gratis" href="/login?next=/cuenta" highlight={false}
          />
        </div>

        {/* Add-ons */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px", maxWidth: 920 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ ...T.h3, margin: 0, fontSize: 15 }}>Add-ons disponibles en Básico y Pro</h3>
            <a href="mailto:ventas@ventasimple.app" style={{ fontSize: 12, color: C.blue, fontWeight: 700, textDecoration: "none" }}>Consultar precio →</a>
          </div>
          <div>
            {[
              { icon: MessageSquare, name: "Bot de WhatsApp",          desc: "Respondé consultas de clientes, tomá pedidos y enviá notificaciones automáticamente." },
              { icon: AlertTriangle, name: "Detección con Cámaras IA", desc: "Conteo de personas en tiempo real, alertas de cola y reportes de afluencia." },
            ].map((a, i) => (
              <div key={a.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderTop: i === 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: C.blueBg, border: `1px solid rgba(30,58,138,.15)`, display: "grid", placeItems: "center", flexShrink: 0 }}>
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
