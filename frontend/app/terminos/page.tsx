import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones · VentaSimple",
  description: "Leé los términos y condiciones de uso del servicio VentaSimple.",
};

export default function TerminosPage() {
  const lastUpdate = "29 de abril de 2026";

  return (
    <div className="vs-landing">
      {/* Nav */}
      <nav className="l-nav">
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1E3A8A", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 13, color: "#fff" }}>VS</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#1A1816", letterSpacing: "-0.02em" }}>Venta Simple</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#706B65", textDecoration: "none" }}>← Volver al inicio</Link>
        </div>
      </nav>

      <div className="l-container" style={{ maxWidth: 760, margin: "0 auto", padding: "56px 0 80px" }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#1A1816", marginBottom: 8 }}>
          Términos y Condiciones
        </h1>
        <p style={{ fontSize: 13, color: "#A39D97", marginBottom: 40 }}>
          Última actualización: {lastUpdate}
        </p>

        <LegalSection title="1. Datos del prestador del servicio">
          <p>El servicio VentaSimple es prestado por:</p>
          <ul>
            <li><strong>Razón social:</strong> Molineris Julian Andres</li>
            <li><strong>CUIT/CUIL:</strong> 20-42070994-1</li>
            <li><strong>Domicilio legal:</strong> Córdoba, República Argentina</li>
            <li><strong>Email de contacto:</strong> <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a></li>
            <li><strong>Sitio web:</strong> ventasimple.app</li>
          </ul>
          <p>Estos datos son provistos en cumplimiento de la Ley 24.240 de Defensa del Consumidor (Argentina) y normativas equivalentes de comercio electrónico de los países donde operamos.</p>
        </LegalSection>

        <LegalSection title="2. Aceptación de los términos">
          <p>Al registrarte y usar VentaSimple, aceptás expresamente estos Términos y Condiciones, que constituyen un contrato vinculante entre vos y el prestador. Si no estás de acuerdo con alguno de los términos, no uses el servicio.</p>
          <p>La aceptación de estos términos implica asimismo la aceptación de nuestra <Link href="/privacidad" style={{ color: "#1E3A8A" }}>Política de Privacidad</Link>.</p>
        </LegalSection>

        <LegalSection title="3. Descripción del servicio">
          <p>VentaSimple es un sistema SaaS (Software as a Service) de gestión para puntos de venta que incluye:</p>
          <ul>
            <li>Aplicación de escritorio para Windows (VentaSimple POS).</li>
            <li>Panel web administrativo accesible desde cualquier dispositivo.</li>
            <li>Sincronización de datos en la nube.</li>
            <li>Soporte técnico según el plan contratado.</li>
          </ul>
          <p>El servicio es de naturaleza digital y se presta en modalidad de suscripción mensual. La aplicación de escritorio funciona de manera offline, garantizando la continuidad operativa del punto de venta independientemente de la conectividad a internet.</p>
        </LegalSection>

        <LegalSection title="4. Registro y cuenta">
          <ul>
            <li>Debés proporcionar información verídica al crear tu cuenta.</li>
            <li>Sos responsable de mantener la confidencialidad de tu contraseña.</li>
            <li>Sos responsable de toda actividad que ocurra bajo tu cuenta.</li>
            <li>Debés notificarnos inmediatamente si detectás acceso no autorizado a tu cuenta.</li>
            <li>El servicio está destinado exclusivamente a personas mayores de 18 años o representantes legales de empresas.</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Planes y pagos">
          <p>VentaSimple ofrece los siguientes planes:</p>
          <ul>
            <li><strong>Plan Gratis:</strong> sin costo, con funcionalidades básicas limitadas.</li>
            <li><strong>Plan Básico:</strong> $30.000/mes (pesos argentinos) · precio de lanzamiento.</li>
            <li><strong>Plan Pro:</strong> $55.000/mes (pesos argentinos) · precio de lanzamiento.</li>
            <li><strong>Plan Enterprise:</strong> $120.000/mes (pesos argentinos) · precio de lanzamiento.</li>
          </ul>
          <p>Los pagos se procesan a través de MercadoPago. La suscripción es mensual y se renueva automáticamente hasta que la cancelés. Los precios pueden actualizarse con previo aviso de 30 días por email.</p>
          <p>Para usuarios fuera de Argentina, los precios pueden variar según la cotización y las políticas de MercadoPago en cada país.</p>
        </LegalSection>

        <LegalSection title="6. Derecho de arrepentimiento (Art. 34, Ley 24.240)">
          <p><strong>Usuarios en Argentina:</strong> En cumplimiento del artículo 34 de la Ley 24.240 de Defensa del Consumidor, tenés derecho a revocar la aceptación de estos términos y resolver el contrato dentro de los <strong>10 (diez) días hábiles</strong> a partir de la celebración del mismo, sin costo ni penalidad alguna.</p>
          <p>Para ejercer este derecho, notificanos por email a <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a> dentro del plazo indicado. Procederemos al reembolso del importe abonado en un plazo de 10 días hábiles desde la recepción de tu solicitud.</p>
          <p>Dado que VentaSimple es un servicio digital de acceso inmediato, el derecho de arrepentimiento aplica conforme a la normativa vigente para servicios digitales SaaS.</p>
        </LegalSection>

        <LegalSection title="7. Cancelación y baja del servicio">
          <p>Podés cancelar tu suscripción en cualquier momento desde el panel de tu cuenta en la sección <strong>Mi Cuenta</strong> o escribiéndonos a <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a>. No hay contratos anuales ni cargos por cancelación.</p>
          <p>Al cancelar, seguís teniendo acceso al plan hasta el final del período mensual pagado. Transcurrido ese período, la cuenta pasa al plan gratuito automáticamente.</p>
          <p>Para dar de baja tu cuenta completa y solicitar la eliminación de tus datos, escribinos a nuestro email de contacto. El proceso se completa en un plazo máximo de 30 días hábiles.</p>
        </LegalSection>

        <LegalSection title="8. Facturación y comprobantes">
          <p>VentaSimple emite comprobantes electrónicos en cumplimiento de la normativa de la AFIP (Argentina). Al completar el proceso de suscripción podés solicitar la factura electrónica correspondiente enviando tu CUIT/CUIL y datos fiscales a <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a>.</p>
          <p>Los pagos realizados a través de MercadoPago generan automáticamente un comprobante de pago en tu cuenta de MercadoPago.</p>
        </LegalSection>

        <LegalSection title="9. Uso aceptable">
          <p>Al usar VentaSimple te comprometés a:</p>
          <ul>
            <li>No usar el servicio para actividades ilegales, fraudulentas o contrarias a la moral y las buenas costumbres.</li>
            <li>No intentar acceder a datos de otros usuarios o tenants.</li>
            <li>No realizar ingeniería inversa ni intentar vulnerar la seguridad del sistema.</li>
            <li>No usar el servicio para registrar transacciones ilegales o evadir impuestos.</li>
            <li>Cumplir con la normativa fiscal vigente en tu país al usar el software de gestión.</li>
          </ul>
          <p>Nos reservamos el derecho de suspender o cancelar cuentas que violen estas condiciones, sin perjuicio de las acciones legales que correspondan.</p>
        </LegalSection>

        <LegalSection title="10. Propiedad de los datos">
          <p>Los datos que cargás en VentaSimple (productos, ventas, clientes, proveedores, etc.) son de tu propiedad. VentaSimple no reclamará propiedad sobre ellos. Tenés derecho a exportar tus datos en cualquier momento en formato CSV.</p>
          <p>Al dar de baja tu cuenta, podés solicitar una copia completa de tus datos antes de la eliminación.</p>
        </LegalSection>

        <LegalSection title="11. Disponibilidad del servicio">
          <p>Nos esforzamos por mantener el servicio disponible 24/7, apuntando a una disponibilidad del 99% mensual. Puede haber interrupciones por mantenimiento programado (notificado con anticipación) o situaciones excepcionales fuera de nuestro control.</p>
          <p>La aplicación de escritorio funciona offline, por lo que las interrupciones del servicio web no afectan la operación del punto de venta. Los datos se sincronizan automáticamente al reestablecerse la conexión.</p>
        </LegalSection>

        <LegalSection title="12. Limitación de responsabilidad">
          <p>VentaSimple no será responsable por:</p>
          <ul>
            <li>Pérdidas de datos causadas por fallas del hardware del usuario.</li>
            <li>Interrupciones del negocio derivadas de cortes de internet o energía eléctrica.</li>
            <li>Decisiones comerciales o fiscales tomadas en base a los datos del sistema.</li>
            <li>Daños indirectos o consecuentes derivados del uso del servicio.</li>
            <li>Uso incorrecto del software por parte del usuario o sus empleados.</li>
          </ul>
          <p>La responsabilidad total de VentaSimple, en cualquier caso, estará limitada al monto abonado por el usuario en los últimos 3 meses de servicio.</p>
        </LegalSection>

        <LegalSection title="13. Soporte técnico">
          <p>El soporte técnico se provee según el plan contratado:</p>
          <ul>
            <li><strong>Plan Gratis:</strong> soporte por email con respuesta en 48–72hs hábiles.</li>
            <li><strong>Plan Básico:</strong> soporte 24/7 por WhatsApp.</li>
            <li><strong>Plan Pro:</strong> soporte 24/7 prioritario por WhatsApp.</li>
            <li><strong>Plan Enterprise:</strong> soporte 24/7 prioritario + onboarding personalizado.</li>
          </ul>
          <p>El onboarding inicial está incluido en todos los planes pagos sin costo adicional.</p>
        </LegalSection>

        <LegalSection title="14. Actualizaciones del software">
          <p>La aplicación de escritorio puede recibir actualizaciones automáticas para mejorar el servicio y corregir errores de seguridad. Las actualizaciones mayores que cambien funcionalidades existentes serán notificadas con anticipación por email.</p>
        </LegalSection>

        <LegalSection title="15. Modificaciones a los términos">
          <p>Podemos modificar estos Términos y Condiciones. Te notificaremos por email con al menos 15 días de anticipación ante cambios significativos. El uso continuado del servicio después del vencimiento del plazo de notificación implica la aceptación de los nuevos términos.</p>
          <p>Si no aceptás los nuevos términos, podés cancelar tu suscripción antes del vencimiento del plazo sin penalidad.</p>
        </LegalSection>

        <LegalSection title="16. Legislación aplicable y jurisdicción">
          <p><strong>Argentina:</strong> Estos términos se rigen por las leyes de la República Argentina, en particular la Ley 24.240 de Defensa del Consumidor, la Ley 25.326 de Protección de Datos Personales, el Código Civil y Comercial de la Nación, y normativas aplicables del comercio electrónico. Cualquier disputa se someterá a la jurisdicción de los tribunales ordinarios de la Ciudad de Córdoba, Argentina, salvo que la normativa de defensa del consumidor otorgue al usuario una jurisdicción más favorable.</p>
          <p><strong>Otros países de LATAM:</strong> Para usuarios de otros países, estos términos se rigen por la legislación argentina como ley aplicable al contrato, sin perjuicio de los derechos irrenunciables que la normativa local del consumidor otorgue al usuario en su país de residencia.</p>
        </LegalSection>

        <LegalSection title="17. Contacto y reclamos">
          <p>Para consultas, reclamos o ejercicio de derechos:</p>
          <ul>
            <li>Email: <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a></li>
            <li>Web: <Link href="/" style={{ color: "#1E3A8A" }}>ventasimple.app</Link></li>
          </ul>
          <p>Respondemos todos los reclamos en un plazo máximo de 5 días hábiles.</p>
          <p style={{ fontSize: 12, color: "#A39D97", marginTop: 8 }}>
            Usuarios en Argentina: podés también realizar denuncias ante la Dirección Nacional de Defensa del Consumidor (DNDC) a través de <strong>consumidor.gob.ar</strong>.
          </p>
        </LegalSection>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #E2E0DA", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Link href="/privacidad" style={{ fontSize: 13, color: "#1E3A8A", textDecoration: "none" }}>Política de Privacidad →</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--vs-muted)", textDecoration: "none" }}>Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1816", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #E2E0DA" }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "#706B65", lineHeight: 1.8, display: "grid", gap: 10 }}>
        {children}
      </div>
    </section>
  );
}
