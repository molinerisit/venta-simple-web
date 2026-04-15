import Link from "next/link";
import Image from "next/image";
import {
  TrendingDown, Clock, PhoneOff, DollarSign, BarChart2, Monitor,
  Receipt, Package, Users, Cloud, Bot, MessageSquare, UserCheck,
  Rocket, Check, ArrowRight, Download, LineChart, ShoppingCart,
  AlertTriangle, Zap, Star,
} from "lucide-react";

const PRICE_BASIC = 2999;
const PRICE_PRO   = 4499;

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

/* ─── Paleta — azul navy + naranja (colores de marca) ───────── */
const C = {
  bg:         "#F8F7F4",
  bgAlt:      "#EDECE8",
  surface:    "#FFFFFF",
  border:     "#E2E0DA",
  text:       "#1A1816",
  muted:      "#706B65",
  light:      "#A39D97",
  blue:       "#1E3A8A",
  blueDark:   "#162D70",
  blueBg:     "#EEF2FE",
  orange:     "#F97316",
  orangeDark: "#EA6C00",
  orangeBg:   "#FFF7ED",
  orangeBdr:  "#FED7AA",
  green:      "#0A6E45",
  greenBg:    "#ECFDF5",
  greenBdr:   "#A7F3D0",
  heroBg:     "#0B1D3F",
};

/* ─── Tipografía ────────────────────────────────────────────── */
const T = {
  display: { fontSize: "clamp(42px, 5.2vw, 68px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.04em", color: C.text } as React.CSSProperties,
  h2:      { fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.03em", color: C.text } as React.CSSProperties,
  h3:      { fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: C.text } as React.CSSProperties,
  label:   { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.light } as React.CSSProperties,
  body:    { fontSize: 15, lineHeight: 1.75, color: C.muted } as React.CSSProperties,
  small:   { fontSize: 13, lineHeight: 1.65, color: C.muted } as React.CSSProperties,
};

/* ─── Datos ─────────────────────────────────────────────────── */
const PROBLEMS = [
  { icon: TrendingDown, text: "No sabés cuánto stock te queda hasta que se acaba" },
  { icon: Clock,        text: "Cada cierre de caja es un caos de papeles y calculadora" },
  { icon: PhoneOff,     text: "Si algo falla, nadie te ayuda en el momento" },
  { icon: DollarSign,   text: "Pagás software caro que no usás ni la mitad" },
  { icon: BarChart2,    text: "No podés ver si tu negocio creció o bajó este mes" },
  { icon: Monitor,      text: "Tu sistema no funciona desde todas las PCs del negocio" },
];

const FEATURES = [
  { n: "01", icon: Receipt,   title: "Punto de venta y caja",        tags: ["POS", "Caja", "Tickets"],       desc: "Cobrá rápido con búsqueda por nombre o código. Cierre de caja en 2 minutos. Tickets automáticos. Historial de movimientos completo." },
  { n: "02", icon: Package,   title: "Control de stock en tiempo real", tags: ["Stock", "Alertas", "Inventario"], desc: "Alertas automáticas cuando un producto está por agotarse. Ingreso de mercadería, ajustes de inventario y control de lotes." },
  { n: "03", icon: LineChart, title: "Reportes y métricas",           tags: ["KPIs", "Reportes", "Exportes"],  desc: "Tus productos más vendidos, horarios pico, comparativas por período y exportes en PDF o CSV. Datos para tomar decisiones reales." },
  { n: "04", icon: Users,     title: "Gestión de clientes",           tags: ["CRM", "Historial"],              desc: "Historial de compras, datos de contacto y seguimiento. Sabé quiénes son tus mejores clientes y cuándo compraron por última vez." },
  { n: "05", icon: Cloud,     title: "Multi-PC y modo offline",       tags: ["Multi-PC", "Offline", "Sync"],   desc: "Cajero, depósito y administración sincronizados. Si se va internet o la luz, seguís trabajando sin límite de tiempo. Todo se sincroniza cuando vuelve la conexión." },
  { n: "06", icon: Bot,       title: "Add-ons inteligentes",          tags: ["WhatsApp Bot", "Cámaras IA"],    desc: "Bot de WhatsApp para consultas y pedidos automáticos. Cámaras IA para contar personas y detectar colas. Disponible en planes personalizados." },
];

const SUPPORT_CARDS = [
  { icon: MessageSquare, title: "< 5 min de respuesta", desc: "Por WhatsApp con alguien que conoce el sistema." },
  { icon: Clock,         title: "24/7/365",              desc: "Fines de semana, feriados, a la madrugada." },
  { icon: UserCheck,     title: "Soporte humano",        desc: "Una persona real que entiende tu problema." },
  { icon: Rocket,        title: "Onboarding incluido",   desc: "Te ayudamos a configurar todo desde el primer día." },
];

/* ══════════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="vs-landing">

      {/* ══ 1. NAV ══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248,247,244,.93)",
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}>
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Image src="/brand/texto.png" alt="VentaSimple" width={320} height={100}
              style={{ height: 46, width: "auto", objectFit: "contain" }} priority />
          </Link>

          <div className="l-nav-links">
            <a href="#como-funciona" style={{ ...T.small, textDecoration: "none", color: C.muted }}>Cómo funciona</a>
            <a href="#pricing"       style={{ ...T.small, textDecoration: "none", color: C.muted }}>Precios</a>
            <a href="#faq"           style={{ ...T.small, textDecoration: "none", color: C.muted }}>FAQ</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/login" style={{ ...T.small, textDecoration: "none", color: C.muted, padding: "8px 14px" }}>
              Iniciar sesión
            </Link>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "9px 20px", borderRadius: 8, textDecoration: "none",
              fontWeight: 700, fontSize: 13, color: "#fff",
              background: C.orange,
              boxShadow: "0 2px 10px rgba(249,115,22,.35)",
            }}>
              Empezar gratis →
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ 2. HERO ══ */}
      <section style={{
        background: C.heroBg,
        padding: "100px 0 96px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow naranja — la flecha del logo */}
        <div style={{
          position: "absolute", top: "-10%", right: "8%",
          width: 600, height: 600,
          background: "radial-gradient(ellipse at center, rgba(249,115,22,.18) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        {/* Glow azul — el carrito del logo */}
        <div style={{
          position: "absolute", top: "10%", left: "-5%",
          width: 700, height: 500,
          background: "radial-gradient(ellipse at center, rgba(30,58,138,.45) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: `linear-gradient(to bottom, transparent, rgba(11,29,63,.7))`,
          pointerEvents: "none",
        }} />

        <div className="l-container" style={{ position: "relative", zIndex: 1 }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36,
            padding: "6px 14px 6px 10px", borderRadius: 99,
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(255,255,255,.05)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 99, background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.25)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", letterSpacing: "0.04em" }}>EN VIVO</span>
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>Soporte activo · respondemos en menos de 5 min</span>
          </div>

          <div className="l-hero-grid">

            {/* Columna izquierda */}
            <div>
              <h1 style={{
                fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.04,
                letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 22px",
              }}>
                Controlá tu negocio<br />
                desde <span style={{ color: "#fff" }}>un solo lugar.</span>
              </h1>

              <p style={{ fontSize: 17, lineHeight: 1.72, color: "rgba(255,255,255,.58)", maxWidth: 440, margin: "0 0 36px" }}>
                App de escritorio para Windows con ventas, stock y reportes. Funciona offline y se sincroniza en la nube. Con soporte humano 24/7.
              </p>

              <div className="l-hero-btns">
                <Link href="/registro" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "15px 30px", borderRadius: 9,
                  fontWeight: 800, fontSize: 15, textDecoration: "none",
                  background: C.orange, color: "#fff",
                  boxShadow: "0 8px 32px rgba(249,115,22,.45)",
                  letterSpacing: "-0.01em",
                }}>
                  Empezar gratis, sin tarjeta <ArrowRight size={15} />
                </Link>
                <a href="#como-funciona" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "15px 22px", borderRadius: 9,
                  fontWeight: 600, fontSize: 14, textDecoration: "none",
                  background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.80)",
                  border: "1px solid rgba(255,255,255,.15)",
                }}>
                  Ver cómo funciona
                </a>
              </div>

              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                {["Sin tarjeta de crédito", "Listo en 5 minutos", "Cancelás cuando querés"].map(t => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.38)" }}>
                    <Check size={11} strokeWidth={3} style={{ color: "#22C55E", flexShrink: 0 }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Columna derecha — product mockup dark */}
            <div className="l-hero-mockup" style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: 20,
                background: "radial-gradient(ellipse, rgba(30,58,138,.45), transparent 70%)",
                filter: "blur(28px)", zIndex: 0, pointerEvents: "none",
              }} />
              <div style={{
                position: "relative", zIndex: 1,
                borderRadius: 14, overflow: "hidden",
                background: "#0D1B38",
                border: "1px solid rgba(255,255,255,.10)",
                boxShadow: "0 32px 72px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.04)",
              }}>
                {/* Browser chrome */}
                <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#EF4444","#F59E0B","#22C55E"].map(col => (
                      <span key={col} style={{ width: 9, height: 9, borderRadius: "50%", background: col, opacity: 0.7 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)", marginLeft: 6, fontWeight: 500 }}>VentaSimple — Dashboard</span>
                </div>

                <div style={{ padding: 16, display: "grid", gridTemplateColumns: "38px 1fr", gap: 12 }}>
                  {/* Mini sidebar */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingTop: 4 }}>
                    {[1,1,0,0,0,0,0].map((active, i) => (
                      <div key={i} style={{ height: 7, borderRadius: 99, background: active ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.06)" }} />
                    ))}
                  </div>

                  {/* Content */}
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                      {[
                        { label: "Ventas hoy", value: "$124.500", sub: "+12%",    hero: true },
                        { label: "Tickets",    value: "47",        sub: "+6%",    hero: false },
                        { label: "Stock bajo", value: "3 items",   sub: "reponer", warn: true },
                      ].map((m, i) => (
                        <div key={i} style={{
                          background: m.hero ? "rgba(30,58,138,.85)" : "rgba(255,255,255,.04)",
                          border: `1px solid ${m.hero ? "rgba(96,165,250,.3)" : "rgba(255,255,255,.07)"}`,
                          borderRadius: 8, padding: "10px 11px",
                        }}>
                          <div style={{ fontSize: 9, color: m.hero ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.35)", marginBottom: 4, fontWeight: 600 }}>{m.label}</div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: m.warn ? "#F59E0B" : "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{m.value}</div>
                          <div style={{ fontSize: 9, color: m.warn ? "#F59E0B" : "#4ADE80", marginTop: 3, fontWeight: 700 }}>{m.sub}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ padding: "7px 11px", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)" }}>Últimas ventas</span>
                      </div>
                      {[
                        ["Coca-Cola 2.25L",  "$1.200"],
                        ["Pan lactal 400g",  "$850"],
                        ["Leche entera x1L", "$750"],
                        ["Galletitas Oreo",  "$620"],
                      ].map(([prod, precio], i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 11px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>{prod}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.80)" }}>{precio}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 10, padding: "8px 11px", borderRadius: 8, background: "rgba(10,110,69,.14)", border: "1px solid rgba(34,197,94,.22)", display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#4ADE80" }}>Soporte en línea · &lt; 5 min de respuesta</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. STATS BAR ══ */}
      <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "64px 0" }}>
        <div className="l-container">
          <div className="l-stats-grid">
            {[
              { n: "+500",       sub: "negocios activos",      accent: false },
              { n: "+1.200.000", sub: "ventas procesadas",     accent: true  },
              { n: "100%",       sub: "modo offline",          accent: false },
              { n: "< 5 min",    sub: "tiempo de respuesta",   accent: false },
              { n: "$0",         sub: "para empezar",          accent: false },
            ].map((s, i) => (
              <div key={s.n} style={{
                textAlign: "center",
                padding: "0 24px",
                borderRight: i < 4 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: s.accent ? C.orange : C.text,
                  lineHeight: 1,
                }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 10, fontWeight: 500 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. PROBLEMA ══ */}
      <section style={{ background: C.bg, padding: "112px 0" }}>
        <div className="l-container">
          <div style={{ maxWidth: 580, marginBottom: 52 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>El problema</div>
            <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
              ¿Seguís controlando<br />tu negocio con Excel?
            </h2>
            <p style={{ ...T.body, maxWidth: 480 }}>
              Cada día sin un sistema claro es plata que se pierde — errores en el stock, clientes sin registro y cero visibilidad sobre qué realmente vendés.
            </p>
          </div>

          {/* Grid con borde como divisor — sin borders individuales */}
          <div className="l-problems-grid">
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{
                background: C.surface, padding: "28px 26px",
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "#FDF2F2", border: "1px solid #FECACA",
                  display: "grid", placeItems: "center",
                }}>
                  <p.icon size={16} style={{ color: "#B91C1C" }} />
                </div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. FUNCIONALIDADES ══ */}
      <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">

          {/* Header centrado */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>Funcionalidades</div>
            <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
              Todo lo que necesitás,<br />en un solo lugar.
            </h2>
            <p style={{ ...T.body, maxWidth: 500, margin: "0 auto" }}>
              Pensado para dueños de negocio que necesitan resultados, no un manual de 200 páginas.
            </p>
          </div>

          {/* Grid 2×2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: C.border, borderRadius: 20, overflow: "hidden" }}>
            {[
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
            ].map((f) => (
              <div key={f.n} style={{
                background: C.surface,
                padding: "40px 36px",
                display: "flex", flexDirection: "column", gap: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: C.heroBg, display: "grid", placeItems: "center",
                    boxShadow: "0 4px 16px rgba(11,29,63,.20)",
                  }}>
                    <f.icon size={22} style={{ color: "#fff" }} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: C.orange,
                    letterSpacing: "0.1em",
                  }}>{f.n}</span>
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
              boxShadow: "0 4px 18px rgba(249,115,22,.35)",
            }}>
              Probarlo gratis <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* ══ 6. CÓMO FUNCIONA ══ */}
      <section id="como-funciona" style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container" style={{ maxWidth: 960, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>Simple de arrancar</div>
            <h2 style={{ ...T.h2, margin: "0 0 14px" }}>En 3 pasos ya estás operando</h2>
            <p style={{ ...T.body, maxWidth: 460, margin: "0 auto" }}>Sin técnicos, sin instalaciones complicadas, sin migraciones de una semana.</p>
          </div>

          <div className="l-steps-grid">
            {[
              {
                n: "1",
                icon: Zap,
                title: "Creá tu cuenta gratis",
                desc: "Registrate en 2 minutos. Sin tarjeta de crédito. Nada que instalar todavía.",
                highlight: false,
              },
              {
                n: "2",
                icon: Download,
                title: "Descargá e instalá la app",
                desc: "Instalás el sistema en tu PC, cargás tus productos y ya tenés todo listo para vender.",
                highlight: true,
              },
              {
                n: "3",
                icon: ShoppingCart,
                title: "Empezá a vender",
                desc: "Desde el panel web ves todo en tiempo real. El soporte 24/7 te acompaña desde el primer día.",
                highlight: false,
              },
            ].map((s) => (
              <div key={s.n} style={{
                padding: "28px 26px",
                borderRadius: 16,
                background: s.highlight ? C.orange : C.surface,
                border: `1.5px solid ${s.highlight ? C.orange : C.border}`,
                boxShadow: s.highlight ? `0 12px 40px rgba(249,115,22,.35)` : "0 1px 3px rgba(26,24,22,.05)",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 20, right: 22,
                  fontSize: 52, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1,
                  color: s.highlight ? "rgba(255,255,255,.08)" : "rgba(26,24,22,.05)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}>
                  {s.n}
                </div>

                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: s.highlight ? "rgba(255,255,255,.20)" : C.orangeBg,
                  border: `1px solid ${s.highlight ? "rgba(255,255,255,.28)" : C.orangeBdr}`,
                  display: "grid", placeItems: "center",
                  marginBottom: 18,
                }}>
                  <s.icon size={20} style={{ color: s.highlight ? "#fff" : C.orange }} />
                </div>

                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: s.highlight ? "#fff" : C.text, marginBottom: 10 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.65, color: s.highlight ? "rgba(255,255,255,.65)" : C.muted }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/registro" className="l-btn l-btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
              Empezar ahora — es gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 7. SOPORTE 24/7 ══ */}
      <section style={{
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "112px 0",
      }}>
        <div className="l-container" style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="l-support-grid">

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
                padding: "5px 12px 5px 8px", borderRadius: 99,
                background: C.greenBg, border: `1px solid ${C.greenBdr}`,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
                <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>Disponible ahora mismo</span>
              </div>

              <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
                Soporte real,<br />las 24 horas.
              </h2>
              <p style={{ ...T.body, marginBottom: 28 }}>
                Ningún software elimina todos los problemas. La diferencia es qué pasa cuando algo falla. Con VentaSimple, en minutos tenés a alguien real ayudándote.
              </p>

              <blockquote style={{
                margin: 0, padding: "18px 22px",
                borderLeft: `3px solid ${C.green}`,
                background: C.greenBg,
                borderRadius: "0 12px 12px 0",
                border: `1px solid ${C.greenBdr}`,
                borderLeftWidth: 3,
              }}>
                <p style={{ ...T.small, fontStyle: "italic", margin: "0 0 10px", color: C.text, lineHeight: 1.6 }}>
                  "Tuve un problema a las 11pm en medio de una venta y me respondieron en 3 minutos. No lo podía creer."
                </p>
                <cite style={{ fontSize: 12, color: C.muted, fontStyle: "normal", fontWeight: 600 }}>
                  — Martín R., ferretería, Rosario
                </cite>
              </blockquote>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.border, borderRadius: 16, overflow: "hidden" }}>
              {SUPPORT_CARDS.map((s) => (
                <div key={s.title} style={{ padding: "22px 20px", background: C.surface }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: C.greenBg, border: `1px solid ${C.greenBdr}`,
                    display: "grid", placeItems: "center", marginBottom: 14,
                  }}>
                    <s.icon size={16} style={{ color: C.green }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ 8. TESTIMONIOS ══ */}
      <section style={{ background: C.bg, padding: "112px 0" }}>
        <div className="l-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ ...T.label, marginBottom: 14 }}>Testimonios</div>
              <h2 style={{ ...T.h2, margin: 0 }}>Negocios reales,<br />resultados reales.</h2>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" style={{ color: "#F59E0B" }} />
              ))}
              <span style={{ ...T.small, marginLeft: 8, fontSize: 13, fontWeight: 600 }}>4.9 / 5 promedio</span>
            </div>
          </div>

          <div className="l-testimonials-grid">
            {[
              { q: "Antes cerraba la caja con una calculadora y me tardaba 40 minutos. Ahora son 5 minutos y sé exactamente qué vendí.", name: "Laura G.", biz: "Minimercado · Buenos Aires", stars: 5 },
              { q: "Lo que más me convenció fue el soporte. Tuve una duda a la noche y en minutos me lo resolvieron. Antes esperaba días.", name: "Diego F.", biz: "Kiosco · Córdoba", stars: 5 },
              { q: "Por fin sé cuáles son mis 10 productos más vendidos. Cambié el pedido al proveedor y mejoré el margen notablemente.", name: "Carlos M.", biz: "Ferretería · Rosario", stars: 5 },
            ].map(t => (
              <div key={t.name} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "26px 26px 22px",
                display: "flex", flexDirection: "column",
                boxShadow: "0 1px 3px rgba(26,24,22,.04)",
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={13} fill="#F59E0B" style={{ color: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ ...T.small, margin: "0 0 auto", color: C.text, lineHeight: 1.7, fontWeight: 400, fontStyle: "normal", flex: 1 }}>
                  &ldquo;{t.q}&rdquo;
                </p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.light, marginTop: 2 }}>{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. PRICING ══ */}
      <section id="pricing" style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>Precios</div>
            <h2 style={{ ...T.h2, margin: "0 0 14px" }}>Sin contratos. Sin sorpresas.</h2>
            <p style={{ ...T.body, maxWidth: 420, margin: "0 auto" }}>
              Empezá gratis. Cuando tu negocio lo necesite, escalás.
            </p>
          </div>

          <div className="l-pricing-grid" style={{ alignItems: "center" }}>
            <PricingCard
              name="Gratis"
              badge={null}
              price={0}
              features={["Ventas y cobros básicos", "1 dispositivo", "Historial 30 días", "Soporte por email"]}
              cta="Crear cuenta gratis"
              href="/registro"
              highlight={false}
            />
            <PricingCard
              name="Básico"
              badge="Más elegido"
              price={PRICE_BASIC}
              features={["Sincronización en la nube", "KPIs, reportes y heatmap", "Exportes PDF / CSV", "Soporte 24/7 por WhatsApp"]}
              cta="Empezar con Básico"
              href="/login?next=/cuenta"
              highlight={true}
            />
            <PricingCard
              name="Pro"
              badge={null}
              price={PRICE_PRO}
              features={["Hasta 3 PCs sincronizadas", "Análisis avanzado", "Soporte 24/7 prioritario", "Add-ons disponibles"]}
              cta="Empezar con Pro"
              href="/login?next=/cuenta"
              highlight={false}
            />
          </div>

          {/* Add-ons */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px", maxWidth: 920 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ ...T.h3, margin: 0, fontSize: 15 }}>Add-ons disponibles en Básico y Pro</h3>
              <a href="mailto:ventas@ventasimple.app" style={{ fontSize: 12, color: C.blue, fontWeight: 700, textDecoration: "none" }}>Consultar precio →</a>
            </div>
            <div style={{ display: "grid", gap: 0 }}>
              {[
                { icon: MessageSquare, name: "Bot de WhatsApp",        desc: "Respondé consultas de clientes, tomá pedidos y enviá notificaciones automáticamente." },
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

      {/* ══ 10. FAQ ══ */}
      <section id="faq" style={{ background: C.bg, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">
          <div className="l-faq-grid">

            <div className="l-faq-sticky" style={{ position: "sticky", top: 100 }}>
              <div style={{ ...T.label, marginBottom: 16 }}>FAQ</div>
              <h2 style={{ ...T.h2, margin: "0 0 14px" }}>Preguntas frecuentes</h2>
              <p style={{ ...T.small }}>
                ¿Hay algo más?{" "}
                <a href="mailto:ventas@ventasimple.app" style={{ color: C.blue, fontWeight: 700 }}>
                  Escribinos →
                </a>
              </p>
            </div>

            <div>
              {[
                { q: "¿Funciona si se va internet o la conexión es mala?",     a: "Sí. La app funciona offline sin límite de tiempo. Seguís vendiendo con normalidad y cuando vuelve la conexión, todo se sincroniza automáticamente." },
                { q: "¿Qué pasa si tengo un problema en medio de una venta?",  a: "Nos escribís por WhatsApp y respondemos en menos de 5 minutos, las 24 horas. Soporte humano, no un bot que te manda artículos de ayuda." },
                { q: "¿Es difícil migrar desde Excel o de otro sistema?",       a: "No. Podés importar tus productos en minutos desde un archivo CSV. El equipo de soporte te acompaña en la migración sin costo adicional." },
                { q: "¿Puedo cancelar cuando quiero?",                          a: "Sí, en cualquier momento. Sin contratos anuales, sin cargos por cancelación. La suscripción es mensual y la controlás vos." },
                { q: "¿Qué incluye exactamente el soporte 24/7?",               a: "Asistencia por WhatsApp con una persona real para resolver dudas, problemas técnicos y configuraciones. En el plan Pro tenés prioridad de atención." },
                { q: "¿Funciona en cualquier PC con Windows?",                  a: "Sí. La app funciona en Windows 10 y 11. El panel administrativo web funciona en cualquier navegador moderno desde cualquier dispositivo." },
              ].map((item, i) => (
                <details key={i} className="l-details" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <summary style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 0", fontSize: 14, fontWeight: 600, color: C.text, userSelect: "none",
                  }}>
                    {item.q}
                    <span className="l-faq-icon" style={{ color: C.light, fontSize: 22, marginLeft: 20, flexShrink: 0, fontWeight: 300, lineHeight: 1 }}>+</span>
                  </summary>
                  <div style={{ ...T.small, paddingBottom: 20, paddingRight: 40, lineHeight: 1.75 }}>{item.a}</div>
                </details>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ 11. CTA FINAL ══ */}
      <section style={{
        background: C.heroBg,
        padding: "96px 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 500,
          background: "radial-gradient(ellipse at center, rgba(249,115,22,.20) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="l-container" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
            color: "rgba(255,255,255,.40)",
          }}>
            Soporte 24/7 incluido desde el día uno
          </div>
          <h2 style={{
            fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#fff",
            margin: "0 0 18px", lineHeight: 1.08,
          }}>
            Tu negocio merece<br />un sistema a la altura.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.55)", lineHeight: 1.75, margin: "0 auto 40px", maxWidth: 460 }}>
            Empezá gratis hoy. Sin tarjeta, sin compromisos. Y con soporte real para que nunca estés solo ante un problema.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <Link href="/registro" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 34px", borderRadius: 9, fontWeight: 800, fontSize: 15,
              background: C.orange, color: "#fff", textDecoration: "none",
              letterSpacing: "-0.02em",
              boxShadow: "0 8px 32px rgba(249,115,22,.45)",
            }}>
              Empezar gratis ahora <ArrowRight size={15} />
            </Link>
            <Link href="/descargar" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 26px", borderRadius: 9, fontWeight: 600, fontSize: 14,
              background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.80)",
              textDecoration: "none", border: "1px solid rgba(255,255,255,.14)",
            }}>
              <Download size={14} />
              Descargar la app
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 24px" }}>
            {["Sin tarjeta de crédito","Cancelás cuando querés","Soporte 24/7 incluido"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.35)" }}>
                <Check size={11} strokeWidth={3} style={{ color: "#22C55E" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 12. FOOTER ══ */}
      <footer style={{ background: "#071429", borderTop: "1px solid rgba(255,255,255,.08)", padding: "36px 0" }}>
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ marginBottom: 8 }}>
              <Image src="/brand/texto.png" alt="VentaSimple" width={320} height={100}
                style={{ height: 32, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1) opacity(.75)" }} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.28)" }}>
              © {new Date().getFullYear()} Venta Simple · Soporte 24/7 disponible
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Cómo funciona", href: "#como-funciona", ext: false },
              { label: "Precios",       href: "#pricing",       ext: false },
              { label: "FAQ",           href: "#faq",           ext: false },
              { label: "Privacidad",    href: "/privacidad",    ext: true  },
              { label: "Términos",      href: "/terminos",      ext: true  },
              { label: "Contacto",      href: "mailto:ventas@ventasimple.app", ext: true },
            ].map(l => (
              l.ext
                ? <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.32)", textDecoration: "none" }}>{l.label}</Link>
                : <a key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.32)", textDecoration: "none" }}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─── PricingCard ─────────────────────────────────────────────── */
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
      display: "flex",
      flexDirection: "column",
      boxShadow: highlight
        ? `0 20px 56px rgba(11,29,63,.45), 0 0 0 1px rgba(249,115,22,.3)`
        : "0 1px 4px rgba(26,24,22,.05)",
      transform: highlight ? "translateY(-8px)" : "none",
    }}>

      {badge && (
        <span style={{
          position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
          fontSize: 10, fontWeight: 900, letterSpacing: "0.09em",
          textTransform: "uppercase",
          padding: "4px 14px", borderRadius: 99,
          background: C.orange, color: "#fff",
          boxShadow: "0 2px 10px rgba(249,115,22,.4)",
          whiteSpace: "nowrap",
        }}>
          {badge}
        </span>
      )}

      {/* Plan name */}
      <p style={{
        fontSize: 12, fontWeight: 800, letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: highlight ? "rgba(255,255,255,.45)" : C.light,
        margin: "0 0 14px",
      }}>
        {name}
      </p>

      {/* Price */}
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
      <p style={{
        fontSize: 12, color: highlight ? "rgba(255,255,255,.35)" : C.light,
        margin: "0 0 28px",
      }}>
        {price === 0 ? "Sin tarjeta de crédito" : "Pesos argentinos · cancelás cuando querés"}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: highlight ? "rgba(255,255,255,.08)" : C.border, marginBottom: 22 }} />

      {/* Features */}
      <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, lineHeight: 1.5, color: highlight ? "rgba(255,255,255,.75)" : C.muted }}>
            <Check size={14} strokeWidth={3} style={{
              color: highlight ? C.orange : C.green,
              flexShrink: 0, marginTop: 1,
            }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={href} style={{
        display: "block", textAlign: "center",
        padding: "14px 0", borderRadius: 10,
        fontWeight: 800, fontSize: 14,
        textDecoration: "none",
        background: highlight ? C.orange : C.heroBg,
        color: "#fff",
        boxShadow: highlight
          ? "0 6px 20px rgba(249,115,22,.40)"
          : "0 4px 14px rgba(11,29,63,.25)",
        letterSpacing: "-0.01em",
      }}>
        {cta}
      </Link>
    </div>
  );
}
