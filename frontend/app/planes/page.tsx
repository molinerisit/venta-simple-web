import Link from "next/link";
import Image from "next/image";
import { Check, Zap, Shield, Monitor, HeadphonesIcon, Star } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

const PLANES = [
  {
    id: "FREE",
    nombre: "Gratis",
    precio: 0,
    desc: "Para empezar sin compromiso",
    color: "#64748B",
    highlight: false,
    features: [
      "Ventas ilimitadas",
      "1 dispositivo",
      "Stock y productos básico",
      "Sin tarjeta de crédito",
    ],
    cta: "Crear cuenta gratis",
    href: "/registro",
  },
  {
    id: "BASIC",
    nombre: "Básico",
    precio: 2999,
    desc: "Para ordenar tu negocio",
    color: "#1E3A8A",
    highlight: false,
    features: [
      "Todo lo del plan gratis",
      "1 dispositivo",
      "Sincronización en la nube",
      "Reportes y métricas",
      "Gestión de clientes",
      "Soporte por email",
    ],
    cta: "Empezar con Básico",
    href: "/registro",
  },
  {
    id: "PRO",
    nombre: "Pro",
    precio: 4499,
    desc: "Para tener control total",
    color: "#059669",
    highlight: true,
    badge: "Más elegido",
    features: [
      "Todo lo del plan básico",
      "Hasta 3 dispositivos",
      "Backup automático",
      "Informes avanzados (Informe X)",
      "Gestión de caja con arqueo",
      "Integración MercadoPago",
      "Soporte prioritario 24/7",
    ],
    cta: "Empezar con Pro",
    href: "/registro",
  },
];

const FAQS = [
  {
    q: "¿Puedo cambiar de plan cuando quiera?",
    a: "Sí. Podés subir o bajar de plan en cualquier momento desde tu cuenta.",
  },
  {
    q: "¿Cómo funciona la licencia de activación?",
    a: "Al suscribirte recibís una clave de licencia por email. La ingresás en la app de escritorio para activarla y listo.",
  },
  {
    q: "¿Qué pasa si cancelo?",
    a: "Podés cancelar en cualquier momento. No hay contratos anuales ni cargos por cancelación. Tu suscripción sigue activa hasta el fin del período pagado.",
  },
  {
    q: "¿Funciona sin internet?",
    a: "Sí. La app de escritorio trabaja completamente offline y sincroniza los datos con la nube cuando hay conexión.",
  },
];

export default function PlanesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid #E2E8F0", background: "#fff",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image src="/brand/logoletras.png" alt="Venta Simple" width={320} height={100}
              style={{ height: 36, width: "auto", objectFit: "contain" }} priority />
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textDecoration: "none", padding: "7px 14px" }}>
              Iniciar sesión
            </Link>
            <Link href="/registro" style={{
              fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none",
              padding: "8px 18px", borderRadius: 8, background: "#1E3A8A",
            }}>
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px 96px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#EFF6FF", border: "1px solid #BFDBFE",
            borderRadius: 100, padding: "4px 14px", marginBottom: 20,
          }}>
            <Star size={12} style={{ color: "#1E3A8A" }} fill="#1E3A8A" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", letterSpacing: ".04em", textTransform: "uppercase" }}>
              Planes y precios
            </span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Elegí el plan que<br />le va a tu negocio
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Empezá gratis, sin tarjeta. Cuando tu negocio crezca, sumá funciones cuando las necesités.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 80,
          alignItems: "start",
        }}>
          {PLANES.map((plan) => (
            <div key={plan.id} style={{
              background: plan.highlight ? "#0F172A" : "#fff",
              border: plan.highlight ? "none" : "1.5px solid #E2E8F0",
              borderRadius: 20,
              padding: "32px 28px",
              position: "relative",
              boxShadow: plan.highlight
                ? "0 20px 60px rgba(0,0,0,.25)"
                : "0 1px 4px rgba(0,0,0,.04)",
              transform: plan.highlight ? "translateY(-8px)" : "none",
            }}>

              {plan.badge && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "#059669", color: "#fff", fontSize: 11, fontWeight: 800,
                  padding: "4px 14px", borderRadius: 100, letterSpacing: ".05em",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: plan.highlight ? "rgba(255,255,255,.5)" : "#94A3B8",
                  marginBottom: 8,
                }}>
                  {plan.id}
                </div>
                <div style={{
                  fontSize: 36, fontWeight: 900,
                  color: plan.highlight ? "#fff" : "#0F172A",
                  letterSpacing: "-0.04em", lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {plan.precio === 0 ? "Gratis" : (
                    <>
                      {fmt(plan.precio)}
                      <span style={{ fontSize: 14, fontWeight: 500, opacity: .6 }}>/mes</span>
                    </>
                  )}
                </div>
                <p style={{
                  fontSize: 13, margin: 0,
                  color: plan.highlight ? "rgba(255,255,255,.6)" : "#64748B",
                }}>
                  {plan.desc}
                </p>
              </div>

              <div style={{ marginBottom: 28 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    marginBottom: 10,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                      background: plan.highlight ? "rgba(5,150,105,.25)" : "#F0FDF4",
                      display: "grid", placeItems: "center",
                    }}>
                      <Check size={10} style={{ color: plan.highlight ? "#34D399" : "#059669" }} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,.8)" : "#374151" }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={plan.href} style={{
                display: "block", textAlign: "center",
                padding: "13px 0", borderRadius: 10, fontWeight: 700, fontSize: 14,
                textDecoration: "none",
                background: plan.highlight ? "#059669" : "#F1F5F9",
                color: plan.highlight ? "#fff" : "#0F172A",
                transition: "opacity .15s",
              }}>
                {plan.cta}
              </Link>

            </div>
          ))}
        </div>

        {/* Features comparison strip */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1.5px solid #E2E8F0",
          padding: "40px 40px 32px", marginBottom: 80,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", margin: "0 0 32px" }}>
            ¿Por qué elegir Venta Simple?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28 }}>
            {[
              { icon: Zap, color: "#F59E0B", title: "Funciona offline", desc: "Trabajá sin internet todo el día. Sincroniza al reconectar." },
              { icon: Monitor, color: "#1E3A8A", title: "App de escritorio", desc: "Instalás en Windows y tenés el POS listo en segundos." },
              { icon: Shield, color: "#059669", title: "Datos seguros", desc: "Backup automático en la nube. Nunca perdés información." },
              { icon: HeadphonesIcon, color: "#8B5CF6", title: "Soporte 24/7", desc: "Equipo humano por WhatsApp. Respondemos en minutos." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, marginBottom: 12,
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  display: "grid", placeItems: "center",
                }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>{title}</p>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 680, margin: "0 auto 80px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", margin: "0 0 28px", textAlign: "center" }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map(({ q, a }) => (
              <div key={q} style={{
                background: "#fff", border: "1.5px solid #E2E8F0",
                borderRadius: 12, padding: "18px 22px",
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>{q}</p>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div style={{
          background: "#0F172A", borderRadius: 20, padding: "48px 40px",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", margin: "0 0 12px" }}>
            Empezá hoy, gratis
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.6)", margin: "0 0 28px", lineHeight: 1.5 }}>
            Sin tarjeta de crédito. Sin compromisos. Cuando estés listo, activás la licencia.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/registro" style={{
              padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: "#059669", color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 16px rgba(5,150,105,.4)",
            }}>
              Crear cuenta gratis
            </Link>
            <Link href="/descargar" style={{
              padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: "rgba(255,255,255,.1)", color: "#fff", textDecoration: "none",
              border: "1px solid rgba(255,255,255,.2)",
            }}>
              Descargar la app
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E2E8F0", background: "#fff", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
          © {new Date().getFullYear()} VentaSimple · Todos los derechos reservados ·{" "}
          <Link href="/terminos" style={{ color: "#94A3B8" }}>Términos</Link>
        </p>
      </footer>

    </div>
  );
}
