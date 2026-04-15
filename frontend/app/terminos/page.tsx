import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones · VentaSimple",
  description: "Leé los términos y condiciones de uso del servicio VentaSimple.",
};

export default function TerminosPage() {
  const lastUpdate = "15 de abril de 2026";

  return (
    <div style={{ minHeight: "100vh", background: "var(--vs-bg)" }}>
      {/* Nav */}
      <nav className="vs-nav">
        <div className="vs-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6d5dfc,#51c6ff)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14, color: "#fff" }}>VS</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "var(--vs-text)" }}>Venta Simple</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>← Volver al inicio</Link>
        </div>
      </nav>

      <div className="vs-container" style={{ maxWidth: 760, margin: "0 auto", padding: "56px 0 80px" }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "var(--vs-text)", marginBottom: 8 }}>
          Términos y Condiciones
        </h1>
        <p style={{ fontSize: 13, color: "var(--vs-muted)", marginBottom: 40 }}>
          Última actualización: {lastUpdate}
        </p>

        <LegalSection title="1. Aceptación de los términos">
          <p>Al registrarte y usar VentaSimple, aceptás estos Términos y Condiciones. Si no estás de acuerdo con alguno de los términos, no uses el servicio.</p>
        </LegalSection>

        <LegalSection title="2. Descripción del servicio">
          <p>VentaSimple es un sistema de gestión para puntos de venta que incluye:</p>
          <ul>
            <li>Aplicación de escritorio para Windows (VentaSimple POS).</li>
            <li>Panel web administrativo accesible desde cualquier dispositivo.</li>
            <li>Sincronización de datos en la nube.</li>
            <li>Soporte técnico según el plan contratado.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Registro y cuenta">
          <ul>
            <li>Debés proporcionar información verídica al crear tu cuenta.</li>
            <li>Sos responsable de mantener la confidencialidad de tu contraseña.</li>
            <li>Sos responsable de toda actividad que ocurra bajo tu cuenta.</li>
            <li>Debés notificarnos inmediatamente si detectás acceso no autorizado a tu cuenta.</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Planes y pagos">
          <p>VentaSimple ofrece los siguientes planes:</p>
          <ul>
            <li><strong>Plan Gratis:</strong> sin costo, con funcionalidades básicas.</li>
            <li><strong>Plan Básico:</strong> $2.999/mes (pesos argentinos).</li>
            <li><strong>Plan Pro:</strong> $4.499/mes (pesos argentinos).</li>
          </ul>
          <p>Los pagos se procesan a través de MercadoPago. Los precios pueden actualizarse con previo aviso de 30 días. La suscripción es mensual y se renueva automáticamente hasta que la cancelés.</p>
        </LegalSection>

        <LegalSection title="5. Cancelación">
          <p>Podés cancelar tu suscripción en cualquier momento desde el panel de tu cuenta en la sección Suscripciones. No hay contratos anuales ni cargos por cancelación. Al cancelar, seguís teniendo acceso al plan hasta el final del período pagado.</p>
        </LegalSection>

        <LegalSection title="6. Uso aceptable">
          <p>Al usar VentaSimple te comprometés a:</p>
          <ul>
            <li>No usar el servicio para actividades ilegales o fraudulentas.</li>
            <li>No intentar acceder a datos de otros usuarios o tenants.</li>
            <li>No realizar ingeniería inversa ni intentar vulnerar la seguridad del sistema.</li>
            <li>No usar el servicio para registrar transacciones ilegales.</li>
          </ul>
          <p>Nos reservamos el derecho de suspender cuentas que violen estas condiciones.</p>
        </LegalSection>

        <LegalSection title="7. Propiedad de los datos">
          <p>Los datos que cargás en VentaSimple (productos, ventas, clientes, etc.) son de tu propiedad. VentaSimple no reclamará propiedad sobre ellos. Tenés derecho a exportar tus datos en cualquier momento.</p>
        </LegalSection>

        <LegalSection title="8. Disponibilidad del servicio">
          <p>Nos esforzamos por mantener el servicio disponible 24/7, pero no garantizamos una disponibilidad del 100%. Puede haber interrupciones por mantenimiento programado (con aviso previo) o situaciones excepcionales.</p>
          <p>La aplicación de escritorio funciona offline, por lo que las interrupciones del servicio web no afectan la operación del punto de venta.</p>
        </LegalSection>

        <LegalSection title="9. Limitación de responsabilidad">
          <p>VentaSimple no será responsable por:</p>
          <ul>
            <li>Pérdidas de datos causadas por fallas del hardware del usuario.</li>
            <li>Interrupciones del negocio derivadas de cortes de internet o luz.</li>
            <li>Decisiones comerciales tomadas en base a los datos del sistema.</li>
            <li>Daños indirectos o consecuentes derivados del uso del servicio.</li>
          </ul>
        </LegalSection>

        <LegalSection title="10. Soporte técnico">
          <p>El soporte técnico se provee según el plan contratado:</p>
          <ul>
            <li><strong>Plan Gratis:</strong> soporte por email.</li>
            <li><strong>Plan Básico:</strong> soporte 24/7 por WhatsApp.</li>
            <li><strong>Plan Pro:</strong> soporte 24/7 prioritario por WhatsApp.</li>
          </ul>
          <p>El onboarding inicial está incluido en todos los planes pagos sin costo adicional.</p>
        </LegalSection>

        <LegalSection title="11. Actualizaciones del software">
          <p>La aplicación de escritorio puede recibir actualizaciones automáticas para mejorar el servicio y corregir errores. Las actualizaciones mayores que cambien funcionalidades serán notificadas con anticipación.</p>
        </LegalSection>

        <LegalSection title="12. Modificaciones a los términos">
          <p>Podemos modificar estos Términos y Condiciones. Te notificaremos por email con al menos 15 días de anticipación ante cambios significativos. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
        </LegalSection>

        <LegalSection title="13. Legislación aplicable">
          <p>Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se someterá a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.</p>
        </LegalSection>

        <LegalSection title="14. Contacto">
          <p>Para consultas sobre estos términos:</p>
          <ul>
            <li>Email: <a href="mailto:ventas@ventasimple.app" style={{ color: "#b3a7ff" }}>ventas@ventasimple.app</a></li>
            <li>Web: <Link href="/" style={{ color: "#b3a7ff" }}>ventasimple.app</Link></li>
          </ul>
        </LegalSection>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Link href="/privacidad" style={{ fontSize: 13, color: "#b3a7ff", textDecoration: "none" }}>Política de Privacidad →</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--vs-text)", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "var(--vs-muted)", lineHeight: 1.8, display: "grid", gap: 10 }}>
        {children}
      </div>
    </section>
  );
}
