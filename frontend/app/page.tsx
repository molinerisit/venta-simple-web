import Link from "next/link";

const PRICE_BASIC = 2999;
const PRICE_PRO   = 4499;

function money(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

/* ─────────────────────────────────────────────
   LANDING — VentaSimple (versión CRO)
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div>

      {/* ══ 1. NAV ══ */}
      <nav className="vs-nav">
        <div className="vs-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
              display: "grid", placeItems: "center",
              fontWeight: 900, fontSize: 14, color: "#fff",
            }}>VS</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "var(--vs-text)" }}>Venta Simple</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="#como-funciona" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Cómo funciona</a>
            <a href="#pricing"       style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Precios</a>
            <a href="#faq"           style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>FAQ</a>
            <Link href="/login" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Iniciar sesión</Link>
            <Link
              href="/registro"
              style={{
                fontSize: 13, fontWeight: 700,
                padding: "8px 18px", borderRadius: 8,
                background: "linear-gradient(135deg,#6d5dfc,#8b7fff)",
                color: "#fff", textDecoration: "none",
                boxShadow: "0 3px 14px rgba(109,93,252,.35)",
              }}
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ 2. HERO ══ */}
      <section style={{ padding: "72px 0 56px" }}>
        <div className="vs-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "center" }}>

          {/* — Columna izquierda — */}
          <div>
            {/* Badge soporte 24/7 — diferencial clave ARRIBA */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", flexShrink: 0,
                boxShadow: "0 0 0 3px rgba(34,197,94,.25)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>
                Soporte 24/7 — Nunca estás solo ante un problema
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(30px, 4.5vw, 50px)", fontWeight: 900, lineHeight: 1.1, color: "var(--vs-text)", margin: "0 0 20px" }}>
              Manejá tu negocio{" "}
              <span className="grad-text">sin perder el control</span>{" "}
              ni quedarte{" "}
              <span className="grad-text-2">sin ayuda</span>
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--vs-muted)", margin: "0 0 12px", maxWidth: 460 }}>
              Ventas, stock, clientes y reportes en un solo sistema. Funciona en tu PC, se sincroniza en la nube y tiene soporte real las 24 horas.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#a78bfa", margin: "0 0 30px", maxWidth: 440, fontWeight: 500 }}>
              Si algo falla en medio de una venta, te respondemos al instante. No mañana. Ahora.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <Link
                href="/registro"
                style={{
                  padding: "14px 30px", borderRadius: 10, fontWeight: 800, fontSize: 15,
                  background: "linear-gradient(135deg, #6d5dfc, #8b7fff)",
                  color: "#fff", textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(109,93,252,.4)",
                  letterSpacing: "-0.2px",
                }}
              >
                Probarlo gratis ahora →
              </Link>
              <a
                href="#como-funciona"
                style={{
                  padding: "14px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14,
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.05)",
                  color: "var(--vs-text)", textDecoration: "none",
                }}
              >
                Ver cómo funciona
              </a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {[
                "✓  Sin tarjeta de crédito",
                "✓  Listo en 5 minutos",
                "✓  Cancelás cuando querés",
              ].map(t => (
                <span key={t} style={{ fontSize: 12, color: "var(--vs-muted)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* — Columna derecha: mockup — */}
          <div className="vs-card" style={{ padding: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <div style={{ height: 8, width: 40, borderRadius: 99, background: "rgba(255,255,255,.12)" }} />
              <div style={{ height: 8, width: 60, borderRadius: 99, background: "rgba(255,255,255,.08)" }} />
              <div style={{ height: 8, width: 100, borderRadius: 99, background: "rgba(255,255,255,.06)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div className="vs-stat">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--vs-muted)" }}>Ventas (30d)</span>
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>+12%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--vs-text)" }}>$1.245.000</div>
              </div>
              <div className="vs-stat">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--vs-muted)" }}>Tickets hoy</span>
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>+6%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--vs-text)" }}>832</div>
              </div>
            </div>
            <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 0.8fr",
                padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,.08)",
                fontSize: 10, color: "var(--vs-muted)", fontWeight: 600, textTransform: "uppercase",
              }}>
                <div>Fecha</div><div>Cliente</div><div>Total</div><div>Estado</div>
              </div>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 0.8fr",
                  padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,.05)",
                  fontSize: 12, color: "var(--vs-text)",
                }}>
                  <div style={{ color: "var(--vs-muted)" }}>12/0{i}</div>
                  <div>Cons. Final</div>
                  <div>${i}2.300</div>
                  <div><span style={{ color: "#22c55e", fontSize: 10, fontWeight: 700 }}>✓ OK</span></div>
                </div>
              ))}
            </div>
            {/* Badge de soporte dentro del mockup */}
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>💬</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4ade80" }}>Soporte en línea ahora</div>
                <div style={{ fontSize: 11, color: "var(--vs-muted)" }}>Respondemos en menos de 5 minutos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. TRUST BAR ══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "28px 0", background: "rgba(255,255,255,.02)" }}>
        <div className="vs-container">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "28px 52px" }}>
            {[
              { n: "+500",       label: "negocios activos" },
              { n: "+1.200.000", label: "ventas procesadas" },
              { n: "24/7",       label: "soporte disponible" },
              { n: "5 min",      label: "tiempo de respuesta" },
              { n: "desde $0",   label: "para empezar" },
            ].map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--vs-text)" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "var(--vs-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. PROBLEMA ══ */}
      <section style={{ padding: "72px 0 56px" }}>
        <div className="vs-container" style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <span className="vs-chip" style={{ marginBottom: 18, display: "inline-flex" }}>El problema</span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--vs-text)", margin: "0 0 18px", lineHeight: 1.2 }}>
            ¿Seguís controlando tu negocio con Excel o papel?
          </h2>
          <p style={{ fontSize: 16, color: "var(--vs-muted)", lineHeight: 1.75, margin: "0 0 44px" }}>
            Cada día sin un sistema claro es plata que se pierde: errores en el stock, clientes sin registro y cero visibilidad sobre qué realmente vendés.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, textAlign: "left" }}>
            {[
              { icon: "😤", pain: "No sabés cuánto stock te queda hasta que se acaba" },
              { icon: "📉", pain: "No podés ver si tu negocio creció o bajó este mes" },
              { icon: "🤯", pain: "Cada cierre de caja es un caos de papeles y calculadora" },
              { icon: "📵", pain: "Si algo falla, no tenés a nadie que te ayude en el momento" },
              { icon: "💸", pain: "Pagás software caro y complicado que no usás ni la mitad" },
              { icon: "🖥️", pain: "Tu sistema no funciona desde todas las PCs del negocio" },
            ].map(p => (
              <div key={p.pain} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", borderRadius: 12, background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                <span style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.5 }}>{p.pain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. SOLUCIÓN — BENEFICIOS ══ */}
      <section style={{ padding: "60px 0" }}>
        <div className="vs-container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="vs-chip" style={{ marginBottom: 18, display: "inline-flex" }}>La solución</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--vs-text)", margin: "0 0 14px", lineHeight: 1.2 }}>
              Un sistema que trabaja para vos,<br />no al revés
            </h2>
            <p style={{ color: "var(--vs-muted)", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>
              Pensado para dueños de negocio que necesitan resultados, no un manual de 200 páginas.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
            {[
              {
                icon: "🧾",
                title: "Sabés exactamente cuánto vendiste",
                desc: "Cada venta registrada, cada ticket guardado. Cerrá el día en 2 minutos y saber a qué hora vendés más.",
                chips: ["POS", "Caja", "Reportes"],
              },
              {
                icon: "📦",
                title: "Nunca más te quedás sin stock sin saberlo",
                desc: "Alertas automáticas cuando un producto está por agotarse. Tu depósito bajo control en tiempo real.",
                chips: ["Stock", "Alertas", "Inventario"],
              },
              {
                icon: "☁️",
                title: "Abrís desde cualquier PC del local",
                desc: "Cajero, depósito y administración sincronizados. Si se va la luz, seguís trabajando 72hs offline.",
                chips: ["Multi-PC", "Offline", "Backup"],
              },
              {
                icon: "📊",
                title: "Ves qué funciona y qué no en tu negocio",
                desc: "Tus productos más vendidos, tus horas pico, qué días bajás. Datos para tomar decisiones reales.",
                chips: ["KPIs", "Heatmap", "Comparativas"],
              },
              {
                icon: "👥",
                title: "Tus clientes, organizados y fidelizados",
                desc: "Historial de compras, datos de contacto y seguimiento. Tratá a tus mejores clientes como merecen.",
                chips: ["Clientes", "Historial", "CRM básico"],
              },
              {
                icon: "🤖",
                title: "Automatizá lo que hoy hacés a mano",
                desc: "Bot de WhatsApp para consultas y pedidos. Cámaras IA para contar personas y detectar colas.",
                chips: ["WhatsApp Bot", "Cámaras IA", "Add-ons"],
              },
            ].map(f => (
              <div key={f.title} className="vs-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div className="vs-feature-ico">{f.icon}</div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--vs-text)", lineHeight: 1.35 }}>{f.title}</h3>
                </div>
                <p style={{ fontSize: 13, color: "var(--vs-muted)", margin: "0 0 12px", lineHeight: 1.65 }}>{f.desc}</p>
                <div className="vs-hr" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {f.chips.map(c => <span key={c} className="vs-kbd">{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. CÓMO FUNCIONA ══ */}
      <section id="como-funciona" style={{ padding: "68px 0" }}>
        <div className="vs-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="vs-chip" style={{ marginBottom: 18, display: "inline-flex" }}>Simple de arrancar</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--vs-text)", margin: "0 0 14px" }}>
              En 3 pasos ya estás operando
            </h2>
            <p style={{ color: "var(--vs-muted)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Sin técnicos, sin instalaciones complicadas, sin migraciones de una semana.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            {[
              {
                step: "01",
                title: "Creá tu cuenta gratis",
                desc: "Registrate en 2 minutos. Sin tarjeta de crédito. Sin nada que instalar todavía.",
              },
              {
                step: "02",
                title: "Descargá la app y cargá tu negocio",
                desc: "Instalás el sistema en tu PC, cargás tus productos y ya tenés todo listo para vender.",
              },
              {
                step: "03",
                title: "Empezá a vender y monitorear",
                desc: "Desde el panel web ves todo en tiempo real. Y si necesitás ayuda, el soporte 24/7 te acompaña.",
              },
            ].map((s, i) => (
              <div key={s.step} style={{ display: "flex", gap: 16, padding: "24px 22px", borderRadius: 16, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", position: "relative" }}>
                {i < 2 && (
                  <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.15)", fontSize: 20, fontWeight: 900, zIndex: 1 }}>→</div>
                )}
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(109,93,252,.25),rgba(81,198,255,.15))", border: "1px solid rgba(109,93,252,.3)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 13, color: "#b3a7ff" }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vs-text)", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "var(--vs-muted)", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link
              href="/registro"
              style={{
                display: "inline-block", padding: "14px 32px", borderRadius: 10,
                fontWeight: 800, fontSize: 15,
                background: "linear-gradient(135deg,#6d5dfc,#8b7fff)",
                color: "#fff", textDecoration: "none",
                boxShadow: "0 6px 24px rgba(109,93,252,.38)",
              }}
            >
              Empezar ahora — es gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 7. SOPORTE 24/7 — DIFERENCIAL CLAVE ══ */}
      <section style={{ padding: "72px 0", position: "relative", overflow: "hidden" }}>
        {/* Glow de fondo */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="vs-container" style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ borderRadius: 20, padding: "52px 44px", background: "linear-gradient(135deg, rgba(34,197,94,.10), rgba(34,197,94,.05))", border: "1px solid rgba(34,197,94,.25)", textAlign: "center" }}>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "6px 16px", borderRadius: 999, background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.35)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 4px rgba(34,197,94,.2)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>Disponible ahora mismo</span>
            </div>

            <h2 style={{ fontSize: "clamp(26px, 3.8vw, 42px)", fontWeight: 900, color: "var(--vs-text)", margin: "0 0 18px", lineHeight: 1.15 }}>
              Soporte real,{" "}
              <span style={{ color: "#4ade80" }}>las 24 horas.</span>
              <br />Nunca estás solo ante un problema.
            </h2>

            <p style={{ fontSize: 16, color: "var(--vs-muted)", maxWidth: 580, margin: "0 auto 36px", lineHeight: 1.75 }}>
              Ningún software elimina todos los problemas. La diferencia es qué pasa cuando algo falla. Con VentaSimple, en minutos tenés a alguien real ayudándote — no un bot, no un ticket que responden en 3 días.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 36, textAlign: "left" }}>
              {[
                { icon: "💬", title: "Respondemos en < 5 min", desc: "Por WhatsApp directo con alguien que conoce el sistema." },
                { icon: "🕐", title: "Disponible 24/7/365", desc: "Fines de semana, feriados, a la madrugada. Siempre." },
                { icon: "🧑‍💻", title: "Soporte humano, no bots", desc: "Una persona real que entiende tu problema y lo resuelve." },
                { icon: "🚀", title: "Onboarding incluido", desc: "Te ayudamos a configurar todo desde el primer día sin costo." },
              ].map(s => (
                <div key={s.title} style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(0,0,0,.2)", border: "1px solid rgba(34,197,94,.15)" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vs-text)", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--vs-muted)", lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 14, color: "#86efac", fontStyle: "italic", margin: 0 }}>
              "Tuve un problema a las 11pm en medio de una venta y me respondieron en 3 minutos. No lo podía creer."
              <br />
              <span style={{ fontSize: 12, color: "var(--vs-muted)", fontStyle: "normal" }}>— Martín R., ferretería, Rosario</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══ 8. TESTIMONIOS ══ */}
      <section style={{ padding: "60px 0" }}>
        <div className="vs-container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="vs-chip" style={{ marginBottom: 18, display: "inline-flex" }}>Lo que dicen los que ya usan VentaSimple</span>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "var(--vs-text)", margin: 0 }}>
              Negocios reales, resultados reales
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              {
                quote: "Antes cerraba la caja con una calculadora y me tardaba 40 minutos. Ahora son 5 minutos y sé exactamente qué vendí.",
                name: "Laura G.",
                biz: "Minimercado · Buenos Aires",
                stars: 5,
              },
              {
                quote: "Lo que más me convenció fue el soporte. Tuve una duda a la noche y en minutos me lo resolvieron. Con el sistema anterior esperaba días.",
                name: "Diego F.",
                biz: "Kiosco · Córdoba",
                stars: 5,
              },
              {
                quote: "Por fin sé cuáles son mis 10 productos más vendidos y en qué horario vendo más. Cambié mi pedido al proveedor y mejoré el margen.",
                name: "Carlos M.",
                biz: "Ferretería · Rosario",
                stars: 5,
              },
            ].map(t => (
              <div key={t.name} className="vs-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#f59e0b", fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "var(--vs-muted)", lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="vs-hr" />
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vs-text)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--vs-muted)" }}>{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. PRICING ══ */}
      <section id="pricing" style={{ padding: "68px 0" }}>
        <div className="vs-container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="vs-chip" style={{ marginBottom: 18, display: "inline-flex" }}>Sin sorpresas</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--vs-text)", margin: "0 0 12px" }}>
              Precios que tienen sentido
            </h2>
            <p style={{ color: "var(--vs-muted)", fontSize: 15, maxWidth: 440, margin: "0 auto" }}>
              Empezá gratis. Cuando tu negocio lo necesite, escalás. Sin contratos anuales, sin letra chica.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, maxWidth: 900, margin: "0 auto" }}>
            <PlanCard
              name="Gratis"
              tag={null}
              badge={null}
              price={0}
              description="Para conocer el sistema sin arriesgar nada."
              features={[
                "Ventas y cobros básicos",
                "1 dispositivo",
                "Historial últimos 30 días",
                "Sin sincronización en la nube",
                "Soporte por email",
              ]}
              cta="Crear cuenta gratis"
              href="/registro"
              highlight={false}
            />
            <PlanCard
              name="Básico"
              tag="Más elegido"
              badge={null}
              price={PRICE_BASIC}
              description="Para negocios que quieren control total y soporte real."
              features={[
                "Todo lo del plan Gratis",
                "Sincronización en la nube",
                "1 PC conectada",
                "KPIs, reportes y heatmap",
                "Exportes PDF / CSV",
                "Soporte 24/7 por WhatsApp",
              ]}
              cta={`Empezar con Básico · ${money(PRICE_BASIC)}/mes`}
              href="/login?next=/cuenta"
              highlight={true}
            />
            <PlanCard
              name="Pro"
              tag={null}
              badge="Para locales con más de 1 puesto"
              price={PRICE_PRO}
              description="Para negocios con múltiples puestos o empleados."
              features={[
                "Todo lo del plan Básico",
                "Hasta 3 PCs sincronizadas",
                "Análisis avanzado",
                "Soporte 24/7 prioritario",
                "Add-ons disponibles",
              ]}
              cta={`Empezar con Pro · ${money(PRICE_PRO)}/mes`}
              href="/login?next=/cuenta"
              highlight={false}
            />
          </div>

          {/* Add-ons */}
          <div className="vs-card" style={{ padding: 26, marginTop: 20, maxWidth: 900, margin: "20px auto 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--vs-text)" }}>Add-ons para potenciar tu negocio</h3>
              <span style={{ fontSize: 12, color: "var(--vs-muted)" }}>Disponibles en planes Básico y Pro</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { icon: "💬", name: "Bot de WhatsApp", desc: "Respondé consultas de clientes, tomá pedidos y enviá notificaciones de forma automática, sin estar pegado al teléfono." },
                { icon: "📷", name: "Detección con Cámaras IA", desc: "Conteo de personas en tiempo real, alertas de cola y reportes de afluencia para saber cuándo reforzar atención." },
              ].map(a => (
                <div key={a.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vs-text)", marginBottom: 3 }}>{a.name}</div>
                    <div style={{ fontSize: 13, color: "var(--vs-muted)", lineHeight: 1.55 }}>{a.desc}</div>
                  </div>
                  <span className="vs-chip" style={{ flexShrink: 0 }}>Consultar precio</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "var(--vs-muted)", marginTop: 16, marginBottom: 0 }}>
              ¿Querés saber más sobre los add-ons?{" "}
              <a href="mailto:ventas@ventasimple.app" style={{ color: "#b3a7ff", fontWeight: 600 }}>Escribinos y te contamos todo →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ══ 10. FAQ ══ */}
      <section id="faq" style={{ padding: "68px 0" }}>
        <div className="vs-container" style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="vs-chip" style={{ marginBottom: 18, display: "inline-flex" }}>Tus dudas, respondidas</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--vs-text)", margin: 0 }}>
              Preguntas frecuentes
            </h2>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                q: "¿Funciona si se va internet o la conexión es mala?",
                a: "Sí. La app funciona offline hasta 72 horas. Seguís vendiendo con normalidad y cuando vuelve la conexión, todo se sincroniza automáticamente.",
              },
              {
                q: "¿Qué pasa si tengo un problema en medio de una venta?",
                a: "Nos escribís por WhatsApp y respondemos en menos de 5 minutos, las 24 horas. Tenemos soporte humano — no un bot que te manda artículos de ayuda.",
              },
              {
                q: "¿Es difícil migrar desde Excel o de otro sistema?",
                a: "No. Podés importar tus productos en minutos desde un archivo CSV. Y si necesitás ayuda con la migración, el equipo de soporte te acompaña sin costo adicional.",
              },
              {
                q: "¿Puedo cancelar cuando quiero?",
                a: "Sí, en cualquier momento. Sin contratos anuales, sin cargos por cancelación. La suscripción es mensual y la controlás vos.",
              },
              {
                q: "¿Qué incluye exactamente el soporte 24/7?",
                a: "Asistencia por WhatsApp con una persona real para resolver dudas, problemas técnicos y ayuda con configuraciones. En el plan Pro tenés prioridad de atención.",
              },
              {
                q: "¿Funciona en cualquier PC con Windows?",
                a: "Sí. La app desktop funciona en Windows 10 y 11. El panel administrativo web funciona en cualquier navegador moderno desde cualquier dispositivo.",
              },
            ].map((item, i) => (
              <details key={i} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)", overflow: "hidden" }}>
                <summary style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "var(--vs-text)", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {item.q}
                  <span style={{ color: "var(--vs-muted)", fontSize: 18, marginLeft: 12, flexShrink: 0 }}>+</span>
                </summary>
                <div style={{ padding: "0 20px 16px", fontSize: 13, color: "var(--vs-muted)", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 14 }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 11. CTA FINAL ══ */}
      <section style={{ padding: "72px 0 80px" }}>
        <div className="vs-container" style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ borderRadius: 22, padding: "56px 40px", background: "linear-gradient(135deg, rgba(109,93,252,.18), rgba(81,198,255,.10))", border: "1px solid rgba(109,93,252,.3)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,93,252,.15), transparent 70%)", pointerEvents: "none" }} />

            <span className="vs-chip" style={{ marginBottom: 20, display: "inline-flex" }}>
              🟢 Soporte 24/7 incluido desde el día uno
            </span>

            <h2 style={{ fontSize: "clamp(24px, 3.8vw, 40px)", fontWeight: 900, color: "var(--vs-text)", margin: "0 0 16px", lineHeight: 1.15 }}>
              Tu negocio merece un sistema que esté a la altura
            </h2>
            <p style={{ fontSize: 15, color: "var(--vs-muted)", lineHeight: 1.75, margin: "0 0 32px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Empezá gratis hoy. Sin tarjeta, sin compromisos. Y con soporte real para que nunca estés solo ante un problema.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              <Link
                href="/registro"
                style={{
                  padding: "15px 34px", borderRadius: 11, fontWeight: 800, fontSize: 16,
                  background: "linear-gradient(135deg,#6d5dfc,#8b7fff)",
                  color: "#fff", textDecoration: "none",
                  boxShadow: "0 8px 28px rgba(109,93,252,.45)",
                  letterSpacing: "-0.3px",
                }}
              >
                Empezar gratis ahora →
              </Link>
              <Link
                href="/descargar"
                style={{
                  padding: "15px 26px", borderRadius: 11, fontWeight: 600, fontSize: 14,
                  border: "1px solid rgba(255,255,255,.18)",
                  background: "rgba(255,255,255,.06)",
                  color: "var(--vs-text)", textDecoration: "none",
                }}
              >
                Descargar la app
              </Link>
            </div>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px 24px" }}>
              {["✓  Sin tarjeta de crédito", "✓  Cancelás cuando querés", "✓  Soporte 24/7 incluido"].map(t => (
                <span key={t} style={{ fontSize: 12, color: "var(--vs-muted)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 12. FOOTER ══ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.08)", padding: "32px 0" }}>
        <div className="vs-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#6d5dfc,#51c6ff)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 11, color: "#fff" }}>VS</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--vs-text)" }}>Venta Simple</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--vs-muted)" }}>© {new Date().getFullYear()} Venta Simple · Soporte 24/7 disponible</p>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <a href="#como-funciona" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Cómo funciona</a>
            <a href="#pricing"       style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Precios</a>
            <a href="#faq"           style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>FAQ</a>
            <Link href="/login"      style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Ingresar</Link>
            <Link href="/privacidad" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Privacidad</Link>
            <Link href="/terminos"   style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Términos</Link>
            <a href="mailto:ventas@ventasimple.app" style={{ fontSize: 13, color: "#b3a7ff", textDecoration: "none" }}>Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─────────────────────────────────────────────
   PlanCard — mejorado con descripción y soporte
───────────────────────────────────────────── */
function PlanCard({
  name, tag, badge, price, description, features, cta, href, highlight,
}: {
  name: string;
  tag: string | null;
  badge: string | null;
  price: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
}) {
  return (
    <div
      className={highlight ? "vs-card vs-card-highlight" : "vs-card"}
      style={{ padding: 24, position: "relative", display: "flex", flexDirection: "column" }}
    >
      {tag && (
        <span className="vs-chip" style={{ position: "absolute", top: 16, right: 16, background: "rgba(109,93,252,.25)", borderColor: "rgba(109,93,252,.4)", color: "#c4b8ff" }}>
          {tag}
        </span>
      )}

      <div style={{ marginBottom: 4 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "var(--vs-text)" }}>{name}</h3>
        {badge && <p style={{ margin: "0 0 8px", fontSize: 11, color: "var(--vs-muted)" }}>{badge}</p>}
        <p style={{ margin: "0 0 16px", fontSize: 12, color: "var(--vs-muted)", lineHeight: 1.5 }}>{description}</p>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 18 }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: "var(--vs-text)" }}>
          {price === 0 ? "Gratis" : money(price)}
        </span>
        {price > 0 && <span style={{ fontSize: 13, color: "var(--vs-muted)" }}>/mes</span>}
      </div>

      <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "grid", gap: 9, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "var(--vs-muted)" }}>
            <span style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        style={{
          display: "block", textAlign: "center",
          padding: "13px 0", borderRadius: 10, fontWeight: 700, fontSize: 13,
          textDecoration: "none",
          ...(highlight
            ? { background: "linear-gradient(135deg,#6d5dfc,#8b7fff)", color: "#fff", boxShadow: "0 4px 18px rgba(109,93,252,.35)" }
            : { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", color: "var(--vs-text)" }
          ),
        }}
      >
        {cta}
      </Link>
    </div>
  );
}
