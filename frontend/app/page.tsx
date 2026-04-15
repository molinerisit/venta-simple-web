import Link from "next/link";
import Image from "next/image";

const PRICE_BASIC = 2999;
const PRICE_PRO   = 4499;

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

/* ─── Colores ───────────────────────────────────────────────────── */
const C = {
  bg:       "#F8F7F4",
  bgAlt:    "#EDECE8",
  surface:  "#FFFFFF",
  border:   "#E2E0DA",
  text:     "#1A1816",
  muted:    "#706B65",
  light:    "#A39D97",
  blue:     "#1E3A8A",
  blueDark: "#162D70",
  blueBg:   "#EEF2FE",
  green:    "#0A6E45",
  greenBg:  "#ECFDF5",
  greenBdr: "#A7F3D0",
  redBg:    "#FDF2F2",
  redBdr:   "#FECACA",
  redText:  "#B91C1C",
};

/* ─── Estilos tipográficos reutilizables ────────────────────────── */
const T = {
  display: { fontSize: "clamp(42px, 5.2vw, 68px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: C.text } as React.CSSProperties,
  h2:      { fontSize: "clamp(26px, 3vw, 38px)",   fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", color: C.text } as React.CSSProperties,
  h3:      { fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: C.text } as React.CSSProperties,
  label:   { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.light } as React.CSSProperties,
  body:    { fontSize: 15, lineHeight: 1.75, color: C.muted } as React.CSSProperties,
  small:   { fontSize: 13, lineHeight: 1.65, color: C.muted } as React.CSSProperties,
};

const CARD_SHADOW = "0 1px 4px rgba(26,24,22,.06), 0 16px 40px rgba(26,24,22,.06)";

/* ══════════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="vs-landing">

      {/* ══ 1. NAV ══ */}
      <nav className="l-nav">
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Image src="/brand/logotexto.png" alt="Venta Simple" width={148} height={40}
              style={{ height: 30, width: "auto", objectFit: "contain" }} priority />
          </Link>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="#como-funciona" style={{ ...T.small, textDecoration: "none", color: C.muted }}>Cómo funciona</a>
            <a href="#pricing"       style={{ ...T.small, textDecoration: "none", color: C.muted }}>Precios</a>
            <a href="#faq"           style={{ ...T.small, textDecoration: "none", color: C.muted }}>FAQ</a>
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/login" style={{ ...T.small, textDecoration: "none", color: C.muted, padding: "8px 14px" }}>
              Iniciar sesión
            </Link>
            <Link href="/registro" className="l-btn l-btn-primary" style={{ fontSize: 13, padding: "9px 20px" }}>
              Empezar gratis →
            </Link>
          </div>

        </div>
      </nav>

      {/* ══ 2. HERO ══ */}
      <section style={{ background: C.bg, padding: "88px 0 72px" }}>
        <div className="l-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          {/* Columna izquierda */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block" }} />
              <span style={{ ...T.small, color: C.green, fontWeight: 600 }}>Soporte activo · Respondemos en &lt; 5 min</span>
            </div>

            <h1 style={{ ...T.display, margin: "0 0 22px" }}>
              Controlá tu negocio<br />
              desde <span style={{ color: C.blue }}>un solo lugar.</span>
            </h1>

            <p style={{ ...T.body, maxWidth: 460, margin: "0 0 32px", fontSize: 16 }}>
              App de escritorio para Windows con ventas, stock y reportes. Funciona offline y se sincroniza en la nube. Con soporte humano 24/7.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
              <Link href="/registro" className="l-btn l-btn-primary" style={{ fontSize: 15, padding: "14px 30px" }}>
                Empezar gratis, sin tarjeta →
              </Link>
              <a href="#como-funciona" className="l-btn l-btn-secondary" style={{ fontSize: 14, padding: "14px 22px" }}>
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["✓  Sin tarjeta de crédito", "✓  Listo en 5 minutos", "✓  Cancelás cuando querés"].map(t => (
                <span key={t} style={{ ...T.small, fontSize: 12 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Columna derecha — preview del producto */}
          <div className="l-card" style={{ padding: 0, overflow: "hidden", boxShadow: "0 4px 12px rgba(26,24,22,.08), 0 40px 80px rgba(26,24,22,.1)" }}>
            {/* Barra de título app */}
            <div style={{ padding: "12px 16px", background: C.bgAlt, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#EF4444","#F59E0B","#22C55E"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
              </div>
              <span style={{ fontSize: 11, color: C.light, marginLeft: 6, fontWeight: 500 }}>VentaSimple — Dashboard</span>
            </div>

            <div style={{ padding: 20 }}>
              {/* Métricas */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Ventas hoy", value: "$124.500", trend: "+12%", up: true },
                  { label: "Tickets",    value: "47",       trend: "+6%",  up: true },
                  { label: "Stock bajo", value: "3",        trend: "items", up: false, warn: true },
                ].map(m => (
                  <div key={m.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 13px" }}>
                    <div style={{ fontSize: 10, color: C.light, marginBottom: 4, fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: m.warn ? "#D97706" : C.text, letterSpacing: "-0.03em" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: m.warn ? "#D97706" : C.green, marginTop: 2, fontWeight: 600 }}>{m.trend}</div>
                  </div>
                ))}
              </div>

              {/* Lista de ventas */}
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "8px 13px", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>Últimas ventas</span>
                </div>
                {[
                  { prod: "Coca-Cola 2.25L",  precio: "$1.200", hora: "14:32" },
                  { prod: "Pan lactal 400g",  precio: "$850",   hora: "14:28" },
                  { prod: "Leche entera x1L", precio: "$750",   hora: "14:21" },
                  { prod: "Galletitas Oreo",  precio: "$620",   hora: "14:15" },
                ].map((v, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 13px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{v.prod}</div>
                      <div style={{ fontSize: 10, color: C.light }}>{v.hora}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{v.precio}</span>
                  </div>
                ))}
              </div>

              {/* Badge soporte */}
              <div style={{ marginTop: 14, padding: "10px 13px", borderRadius: 10, background: C.greenBg, border: `1px solid ${C.greenBdr}`, display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: 15 }}>💬</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.green }}>Soporte en línea</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Respondemos en menos de 5 minutos</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ 3. STATS BAR ══ */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "40px 0" }}>
        <div className="l-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
            {[
              { n: "+500",       sub: "negocios activos" },
              { n: "+1.200.000", sub: "ventas procesadas" },
              { n: "72 hs",      sub: "modo offline" },
              { n: "< 5 min",    sub: "tiempo de respuesta" },
              { n: "desde $0",   sub: "para empezar" },
            ].map((s, i) => (
              <div key={s.n} style={{ textAlign: "center", padding: "0 16px", borderRight: i < 4 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 900, letterSpacing: "-0.04em", color: C.text, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: C.light, marginTop: 6, fontWeight: 500 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. PROBLEMA ══ */}
      <section style={{ background: C.bg, padding: "80px 0 72px" }}>
        <div className="l-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>El problema</div>
            <h2 style={{ ...T.h2, maxWidth: 620, margin: "0 0 16px" }}>
              ¿Seguís controlando tu negocio con Excel o papel?
            </h2>
            <p style={{ ...T.body, maxWidth: 540 }}>
              Cada día sin un sistema claro es plata que se pierde — errores en el stock, clientes sin registro y cero visibilidad sobre qué realmente vendés.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {[
              { icon: "📉", pain: "No sabés cuánto stock te queda hasta que se acaba" },
              { icon: "🤯", pain: "Cada cierre de caja es un caos de papeles y calculadora" },
              { icon: "📵", pain: "Si algo falla, nadie te ayuda en el momento" },
              { icon: "💸", pain: "Pagás software caro que no usás ni la mitad" },
              { icon: "😤", pain: "No podés ver si tu negocio creció o bajó este mes" },
              { icon: "🖥️", pain: "Tu sistema no funciona desde todas las PCs del negocio" },
            ].map(p => (
              <div key={p.pain} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 18px", borderRadius: 12, background: C.redBg, border: `1px solid ${C.redBdr}` }}>
                <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1.5 }}>{p.icon}</span>
                <span style={{ fontSize: 13, color: C.redText, lineHeight: 1.55, fontWeight: 500 }}>{p.pain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. FUNCIONALIDADES ══ */}
      <section style={{ background: C.surface, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "flex-start" }}>

            {/* Título sticky en columna izquierda */}
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ ...T.label, marginBottom: 16 }}>Funcionalidades</div>
              <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
                Todo lo que<br />necesitás,<br />en un solo lugar.
              </h2>
              <p style={{ ...T.body }}>
                Pensado para dueños de negocio que necesitan resultados, no un manual de 200 páginas.
              </p>
              <Link href="/registro" className="l-btn l-btn-primary" style={{ marginTop: 28, display: "inline-flex", fontSize: 13 }}>
                Probarlo gratis →
              </Link>
            </div>

            {/* Features */}
            <div style={{ display: "grid", gap: 0 }}>
              {[
                {
                  n: "01", icon: "🧾",
                  title: "Punto de venta y caja",
                  desc: "Cobrá rápido con búsqueda por nombre o código. Cierre de caja en 2 minutos. Tickets automáticos. Historial de movimientos completo.",
                  tags: ["POS", "Caja", "Tickets"],
                },
                {
                  n: "02", icon: "📦",
                  title: "Control de stock en tiempo real",
                  desc: "Alertas automáticas cuando un producto está por agotarse. Ingreso de mercadería, ajustes de inventario y control de lotes.",
                  tags: ["Stock", "Alertas", "Inventario"],
                },
                {
                  n: "03", icon: "📊",
                  title: "Reportes y métricas",
                  desc: "Tus productos más vendidos, horarios pico, comparativas por período y exportes en PDF o CSV. Datos para tomar decisiones reales.",
                  tags: ["KPIs", "Reportes", "Exportes"],
                },
                {
                  n: "04", icon: "👥",
                  title: "Gestión de clientes",
                  desc: "Historial de compras, datos de contacto y seguimiento. Sabé quiénes son tus mejores clientes y cuándo compraron por última vez.",
                  tags: ["Clientes", "CRM", "Historial"],
                },
                {
                  n: "05", icon: "☁️",
                  title: "Multi-PC y modo offline",
                  desc: "Cajero, depósito y administración sincronizados. Si se va la luz, seguís trabajando hasta 72 horas sin perder ninguna venta.",
                  tags: ["Multi-PC", "Offline", "Sync"],
                },
                {
                  n: "06", icon: "🤖",
                  title: "Add-ons inteligentes",
                  desc: "Bot de WhatsApp para consultas y pedidos automáticos. Cámaras IA para contar personas y detectar colas. Disponible en planes Básico y Pro.",
                  tags: ["WhatsApp Bot", "Cámaras IA"],
                },
              ].map((f, i) => (
                <div key={f.n} style={{ display: "flex", gap: 20, padding: "28px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: C.blueBg, border: `1px solid ${C.border}`, display: "grid", placeItems: "center", fontSize: 17 }}>
                    {f.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.light, letterSpacing: "0.08em" }}>{f.n}</span>
                      <h3 style={{ ...T.h3, margin: 0, fontSize: 15 }}>{f.title}</h3>
                    </div>
                    <p style={{ ...T.small, margin: "0 0 12px" }}>{f.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {f.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: "2px 9px", borderRadius: 99, background: C.bgAlt, border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ 6. CÓMO FUNCIONA ══ */}
      <section id="como-funciona" style={{ background: C.bg, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ ...T.label, marginBottom: 16 }}>Simple de arrancar</div>
            <h2 style={{ ...T.h2, margin: "0 0 14px" }}>En 3 pasos ya estás operando</h2>
            <p style={{ ...T.body, maxWidth: 460, margin: "0 auto" }}>Sin técnicos, sin instalaciones complicadas, sin migraciones de una semana.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, position: "relative" }}>
            {/* Línea conectora */}
            <div style={{ position: "absolute", top: 40, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg, ${C.border}, ${C.blue}40, ${C.border})`, zIndex: 0 }} />

            {[
              { n: "01", title: "Creá tu cuenta gratis",     desc: "Registrate en 2 minutos. Sin tarjeta de crédito. Nada que instalar todavía." },
              { n: "02", title: "Descargá e instalá la app",  desc: "Instalás el sistema en tu PC, cargás tus productos y ya tenés todo listo para vender." },
              { n: "03", title: "Empezá a vender",           desc: "Desde el panel web ves todo en tiempo real. El soporte 24/7 te acompaña desde el primer día." },
            ].map((s, i) => (
              <div key={s.n} style={{ textAlign: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: i === 1 ? C.blue : C.surface,
                  border: `1.5px solid ${i === 1 ? C.blue : C.border}`,
                  display: "grid", placeItems: "center",
                  margin: "0 auto 20px",
                  fontWeight: 900, fontSize: 16,
                  color: i === 1 ? "#fff" : C.text,
                  letterSpacing: "-0.02em",
                  boxShadow: i === 1 ? `0 8px 24px ${C.blue}40` : CARD_SHADOW,
                }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{s.title}</div>
                <div style={{ ...T.small }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/registro" className="l-btn l-btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
              Empezar ahora — es gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 7. SOPORTE 24/7 ══ */}
      <section style={{ background: C.greenBg, borderTop: `1px solid ${C.greenBdr}`, borderBottom: `1px solid ${C.greenBdr}`, padding: "80px 0" }}>
        <div className="l-container" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, display: "inline-block" }} />
                <span style={{ ...T.small, color: C.green, fontWeight: 700 }}>Disponible ahora mismo</span>
              </div>
              <h2 style={{ ...T.h2, margin: "0 0 16px" }}>
                Soporte real,<br />las 24 horas.
              </h2>
              <p style={{ ...T.body, marginBottom: 24 }}>
                Ningún software elimina todos los problemas. La diferencia es qué pasa cuando algo falla. Con VentaSimple, en minutos tenés a alguien real ayudándote.
              </p>
              <blockquote style={{ margin: 0, padding: "16px 20px", borderLeft: `3px solid ${C.green}`, background: "rgba(10,110,69,.06)", borderRadius: "0 10px 10px 0" }}>
                <p style={{ ...T.small, fontStyle: "italic", margin: "0 0 8px", color: C.green }}>
                  "Tuve un problema a las 11pm en medio de una venta y me respondieron en 3 minutos. No lo podía creer."
                </p>
                <cite style={{ fontSize: 12, color: C.muted, fontStyle: "normal", fontWeight: 600 }}>— Martín R., ferretería, Rosario</cite>
              </blockquote>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "💬", title: "< 5 min de respuesta", desc: "Por WhatsApp con alguien que conoce el sistema." },
                { icon: "🕐", title: "24/7/365",              desc: "Fines de semana, feriados, a la madrugada." },
                { icon: "🧑‍💻", title: "Soporte humano",       desc: "Una persona real que entiende tu problema." },
                { icon: "🚀", title: "Onboarding incluido",   desc: "Te ayudamos a configurar todo desde el primer día." },
              ].map(s => (
                <div key={s.title} style={{ padding: "18px", borderRadius: 12, background: C.surface, border: `1px solid ${C.greenBdr}`, boxShadow: "0 1px 3px rgba(10,110,69,.06)" }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ 8. TESTIMONIOS ══ */}
      <section style={{ background: C.surface, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">
          <div style={{ marginBottom: 44 }}>
            <div style={{ ...T.label, marginBottom: 14 }}>Testimonios</div>
            <h2 style={{ ...T.h2, margin: 0 }}>Negocios reales, resultados reales</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { q: "Antes cerraba la caja con una calculadora y me tardaba 40 minutos. Ahora son 5 minutos y sé exactamente qué vendí.", name: "Laura G.", biz: "Minimercado · Buenos Aires" },
              { q: "Lo que más me convenció fue el soporte. Tuve una duda a la noche y en minutos me lo resolvieron. Antes esperaba días.", name: "Diego F.", biz: "Kiosco · Córdoba" },
              { q: "Por fin sé cuáles son mis 10 productos más vendidos. Cambié el pedido al proveedor y mejoré el margen notablemente.", name: "Carlos M.", biz: "Ferretería · Rosario" },
            ].map(t => (
              <div key={t.name} className="l-card" style={{ padding: 26 }}>
                <div style={{ fontSize: 36, lineHeight: 1, color: C.border, fontFamily: "Georgia, serif", marginBottom: 12 }}>&ldquo;</div>
                <p style={{ ...T.small, margin: "0 0 20px", fontStyle: "italic", color: C.muted }}>
                  {t.q}
                </p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.light }}>{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. PRICING ══ */}
      <section id="pricing" style={{ background: C.bg, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...T.label, marginBottom: 14 }}>Precios</div>
            <h2 style={{ ...T.h2, margin: "0 0 12px" }}>Sin contratos. Sin sorpresas.</h2>
            <p style={{ ...T.body, maxWidth: 440 }}>Empezá gratis. Cuando tu negocio lo necesite, escalás.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(256px, 1fr))", gap: 16, maxWidth: 900, marginBottom: 16 }}>
            <PricingCard
              name="Gratis"
              badge={null}
              price={0}
              desc="Para conocer el sistema sin arriesgar nada."
              features={["Ventas y cobros básicos","1 dispositivo","Historial últimos 30 días","Sin sincronización en la nube","Soporte por email"]}
              cta="Crear cuenta gratis"
              href="/registro"
              highlight={false}
            />
            <PricingCard
              name="Básico"
              badge="Más elegido"
              price={PRICE_BASIC}
              desc="Para negocios que quieren control total y soporte real."
              features={["Todo lo del plan Gratis","Sincronización en la nube","1 PC conectada","KPIs, reportes y heatmap","Exportes PDF / CSV","Soporte 24/7 por WhatsApp"]}
              cta={`Empezar con Básico · ${money(PRICE_BASIC)}/mes`}
              href="/login?next=/cuenta"
              highlight={true}
            />
            <PricingCard
              name="Pro"
              badge={null}
              price={PRICE_PRO}
              desc="Para negocios con múltiples puestos o empleados."
              features={["Todo lo del plan Básico","Hasta 3 PCs sincronizadas","Análisis avanzado","Soporte 24/7 prioritario","Add-ons disponibles"]}
              cta={`Empezar con Pro · ${money(PRICE_PRO)}/mes`}
              href="/login?next=/cuenta"
              highlight={false}
            />
          </div>

          {/* Add-ons */}
          <div className="l-card" style={{ padding: 24, maxWidth: 900 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ ...T.h3, margin: 0 }}>Add-ons disponibles en Básico y Pro</h3>
              <a href="mailto:ventas@ventasimple.app" style={{ fontSize: 12, color: C.blue, fontWeight: 600, textDecoration: "none" }}>Consultar precio →</a>
            </div>
            {[
              { icon: "💬", name: "Bot de WhatsApp", desc: "Respondé consultas de clientes, tomá pedidos y enviá notificaciones automáticamente." },
              { icon: "📷", name: "Detección con Cámaras IA", desc: "Conteo de personas en tiempo real, alertas de cola y reportes de afluencia." },
            ].map((a, i) => (
              <div key={a.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderTop: i === 0 ? `1px solid ${C.border}` : "none", marginTop: i === 0 ? 0 : 0 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 3 }}>{a.name}</div>
                  <div style={{ ...T.small }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 10. FAQ ══ */}
      <section id="faq" style={{ background: C.surface, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
        <div className="l-container">
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 64, alignItems: "flex-start" }}>

            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ ...T.label, marginBottom: 16 }}>FAQ</div>
              <h2 style={{ ...T.h2, margin: "0 0 14px" }}>Preguntas frecuentes</h2>
              <p style={{ ...T.small }}>¿Hay algo más? Escribinos a <a href="mailto:ventas@ventasimple.app" style={{ color: C.blue, fontWeight: 600 }}>ventas@ventasimple.app</a></p>
            </div>

            <div>
              {[
                { q: "¿Funciona si se va internet o la conexión es mala?",     a: "Sí. La app funciona offline hasta 72 horas. Seguís vendiendo con normalidad y cuando vuelve la conexión, todo se sincroniza automáticamente." },
                { q: "¿Qué pasa si tengo un problema en medio de una venta?",  a: "Nos escribís por WhatsApp y respondemos en menos de 5 minutos, las 24 horas. Soporte humano, no un bot que te manda artículos de ayuda." },
                { q: "¿Es difícil migrar desde Excel o de otro sistema?",       a: "No. Podés importar tus productos en minutos desde un archivo CSV. El equipo de soporte te acompaña en la migración sin costo adicional." },
                { q: "¿Puedo cancelar cuando quiero?",                          a: "Sí, en cualquier momento. Sin contratos anuales, sin cargos por cancelación. La suscripción es mensual y la controlás vos." },
                { q: "¿Qué incluye exactamente el soporte 24/7?",               a: "Asistencia por WhatsApp con una persona real para resolver dudas, problemas técnicos y configuraciones. En el plan Pro tenés prioridad de atención." },
                { q: "¿Funciona en cualquier PC con Windows?",                  a: "Sí. La app funciona en Windows 10 y 11. El panel administrativo web funciona en cualquier navegador moderno desde cualquier dispositivo." },
              ].map((item, i) => (
                <details key={i} className="l-details" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", fontSize: 14, fontWeight: 600, color: C.text, userSelect: "none" }}>
                    {item.q}
                    <span className="l-faq-icon" style={{ color: C.light, fontSize: 20, marginLeft: 16, flexShrink: 0, fontWeight: 300 }}>+</span>
                  </summary>
                  <div style={{ ...T.small, paddingBottom: 18, paddingRight: 32 }}>{item.a}</div>
                </details>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ 11. CTA FINAL ══ */}
      <section style={{ background: C.blue, padding: "88px 0" }}>
        <div className="l-container" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 20 }}>
            Soporte 24/7 incluido desde el día uno
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 18px", lineHeight: 1.1 }}>
            Tu negocio merece<br />un sistema a la altura.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.75)", lineHeight: 1.75, margin: "0 0 36px", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Empezá gratis hoy. Sin tarjeta, sin compromisos. Y con soporte real para que nunca estés solo ante un problema.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <Link href="/registro" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "15px 32px", borderRadius: 9, fontWeight: 800, fontSize: 15, background: "#fff", color: C.blue, textDecoration: "none", letterSpacing: "-0.02em" }}>
              Empezar gratis ahora →
            </Link>
            <Link href="/descargar" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "15px 24px", borderRadius: 9, fontWeight: 600, fontSize: 14, background: "rgba(255,255,255,.12)", color: "#fff", textDecoration: "none", border: "1.5px solid rgba(255,255,255,.25)" }}>
              Descargar la app
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 24px" }}>
            {["✓  Sin tarjeta de crédito","✓  Cancelás cuando querés","✓  Soporte 24/7 incluido"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 12. FOOTER ══ */}
      <footer style={{ background: C.text, padding: "36px 0" }}>
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: C.blue, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 11, color: "#fff" }}>VS</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Venta Simple</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
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
                ? <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none" }}>{l.label}</Link>
                : <a key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none" }}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─── PricingCard ─────────────────────────────────────────────── */
function PricingCard({ name, badge, price, desc, features, cta, href, highlight }: {
  name: string; badge: string | null; price: number; desc: string;
  features: string[]; cta: string; href: string; highlight: boolean;
}) {
  return (
    <div style={{
      background: highlight ? C.blue : C.surface,
      border: `1.5px solid ${highlight ? C.blue : C.border}`,
      borderRadius: 14,
      padding: 24,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxShadow: highlight ? `0 8px 32px ${C.blue}40` : CARD_SHADOW,
    }}>
      {badge && (
        <span style={{ position: "absolute", top: -11, left: 20, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 99, background: highlight ? "#fff" : C.blue, color: highlight ? C.blue : "#fff", letterSpacing: "0.04em" }}>
          {badge}
        </span>
      )}

      <div style={{ marginBottom: 4 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em", color: highlight ? "#fff" : C.text }}>{name}</h3>
        <p style={{ margin: "0 0 16px", fontSize: 12, color: highlight ? "rgba(255,255,255,.7)" : C.muted, lineHeight: 1.5 }}>{desc}</p>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
        <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em", color: highlight ? "#fff" : C.text }}>
          {price === 0 ? "Gratis" : money(price)}
        </span>
        {price > 0 && <span style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,.6)" : C.muted }}>/mes</span>}
      </div>

      <ul style={{ margin: "0 0 22px", padding: 0, listStyle: "none", display: "grid", gap: 9, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: highlight ? "rgba(255,255,255,.85)" : C.muted }}>
            <span style={{ color: highlight ? "rgba(255,255,255,.7)" : C.green, flexShrink: 0, marginTop: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Link href={href} style={{
        display: "block", textAlign: "center",
        padding: "13px 0", borderRadius: 9, fontWeight: 700, fontSize: 13,
        textDecoration: "none",
        background: highlight ? "#fff" : C.blue,
        color: highlight ? C.blue : "#fff",
        boxShadow: highlight ? "none" : `0 4px 14px ${C.blue}40`,
      }}>
        {cta}
      </Link>
    </div>
  );
}
