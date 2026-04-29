import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad · VentaSimple",
  description: "Conocé cómo VentaSimple recopila, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
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
          Política de Privacidad
        </h1>
        <p style={{ fontSize: 13, color: "#A39D97", marginBottom: 40 }}>
          Última actualización: {lastUpdate}
        </p>

        <LegalSection title="1. Quiénes somos y base legal">
          <p>VentaSimple es un sistema de gestión para negocios pequeños operado por <strong>Molineris Julian Andres</strong> (CUIT 20-42070994-1), con domicilio en Córdoba, República Argentina. Operamos el sitio web <strong>ventasimple.app</strong> y la aplicación de escritorio VentaSimple para Windows.</p>
          <p>Esta Política de Privacidad se enmarca en la <strong>Ley 25.326 de Protección de Datos Personales</strong> de Argentina y su decreto reglamentario 1558/01, siendo el responsable del tratamiento de datos personales quien figura como titular de este servicio.</p>
          <p>Para consultas sobre privacidad podés escribirnos a <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a>.</p>
        </LegalSection>

        <LegalSection title="2. Qué información recopilamos">
          <ul>
            <li><strong>Datos de registro:</strong> nombre, email y contraseña (almacenada con hash bcrypt) al crear tu cuenta.</li>
            <li><strong>Datos del negocio:</strong> nombre del negocio, productos, precios, ventas, clientes y proveedores que cargás en el sistema. Estos datos son de tu exclusiva propiedad.</li>
            <li><strong>Datos de uso:</strong> métricas anónimas de uso de la plataforma para mejorar el servicio. No identifican a personas físicas individualmente.</li>
            <li><strong>Datos de pago:</strong> el procesamiento de pagos se realiza íntegramente a través de MercadoPago. <strong>No almacenamos datos de tarjetas de crédito ni débito.</strong></li>
            <li><strong>Información técnica:</strong> dirección IP, tipo de navegador y sistema operativo, solo para seguridad, diagnóstico y prevención de fraudes.</li>
            <li><strong>Datos de soporte:</strong> cuando te contactás con nuestro equipo, podemos guardar la conversación para mejorar el servicio.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Finalidad del tratamiento de datos">
          <p>Usamos tus datos exclusivamente para:</p>
          <ul>
            <li>Proveer, mantener y mejorar el servicio de VentaSimple.</li>
            <li>Gestionar tu cuenta y suscripción.</li>
            <li>Enviarte notificaciones del sistema (verificación de email, alertas de plan, actualizaciones importantes).</li>
            <li>Brindarte soporte técnico cuando lo solicitás.</li>
            <li>Cumplir con obligaciones legales y fiscales.</li>
            <li>Prevenir fraudes y garantizar la seguridad del sistema.</li>
          </ul>
          <p><strong>No vendemos, cedemos ni compartimos tus datos personales con terceros con fines publicitarios o comerciales.</strong></p>
        </LegalSection>

        <LegalSection title="4. Almacenamiento y conservación de datos">
          <p>Tus datos se almacenan en servidores seguros a través de <strong>Supabase</strong> (PostgreSQL en la nube, con servidores en Estados Unidos). Los datos de la aplicación de escritorio también se guardan localmente en tu PC en una base de datos SQLite, que permanece bajo tu control exclusivo.</p>
          <p>Conservamos tus datos mientras tu cuenta esté activa o mientras sea necesario para proveer el servicio y cumplir obligaciones legales. Si eliminás tu cuenta, eliminamos tus datos personales identificables en un plazo máximo de 30 días hábiles, excepto los que debamos conservar por obligaciones legales o fiscales (por ejemplo, registros de facturación).</p>
        </LegalSection>

        <LegalSection title="5. Transferencias internacionales de datos">
          <p>Como prestamos servicio en Argentina y otros países de América Latina, tus datos pueden ser procesados en servidores ubicados fuera de tu país de residencia, incluyendo Estados Unidos, donde operan nuestros proveedores de infraestructura (Supabase, Vercel).</p>
          <p>Estas transferencias se realizan bajo contratos que garantizan niveles adecuados de protección de datos personales, conforme al artículo 12 de la Ley 25.326 (Argentina) y normativas equivalentes de cada país.</p>
          <p><strong>Usuarios en otros países de LATAM:</strong> los datos son tratados con los mismos estándares de protección que la legislación argentina exige, que es equivalente o superior a la normativa de protección de datos de la mayoría de los países latinoamericanos.</p>
        </LegalSection>

        <LegalSection title="6. Cookies">
          <p>Usamos únicamente cookies de sesión estrictamente necesarias para mantener tu sesión iniciada en el panel web. No usamos cookies de seguimiento, publicidad de terceros ni perfilado de comportamiento.</p>
          <p>Podés configurar tu navegador para bloquear cookies, pero esto puede impedir el funcionamiento correcto del panel de administración.</p>
        </LegalSection>

        <LegalSection title="7. Tus derechos (Ley 25.326 y normativas equivalentes)">
          <p>En cumplimiento de la Ley 25.326 y normativas equivalentes de protección de datos, tenés derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> obtener información sobre los datos personales que tenemos sobre vos.</li>
            <li><strong>Rectificación:</strong> corregir datos incorrectos, incompletos o desactualizados.</li>
            <li><strong>Cancelación/Eliminación:</strong> solicitar la eliminación de tu cuenta y datos personales asociados.</li>
            <li><strong>Portabilidad:</strong> solicitar una exportación de tus datos en formato legible (CSV/JSON).</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
            <li><strong>No ser objeto de decisiones automatizadas</strong> que te afecten significativamente sin intervención humana.</li>
          </ul>
          <p>Para ejercer cualquiera de estos derechos, escribinos a <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a>. Respondemos en un plazo máximo de 5 días hábiles.</p>
          <p style={{ fontSize: 12, color: "#A39D97" }}>
            En Argentina, podés también presentar reclamos ante la <strong>Dirección Nacional de Protección de Datos Personales (DNPDP)</strong> en <strong>argentina.gob.ar/aaip/datospersonales</strong>.
          </p>
        </LegalSection>

        <LegalSection title="8. Seguridad">
          <p>Implementamos medidas técnicas y organizativas para proteger tus datos:</p>
          <ul>
            <li>HTTPS/TLS en todas las comunicaciones.</li>
            <li>Contraseñas hasheadas con bcrypt (nunca almacenamos contraseñas en texto plano).</li>
            <li>Tokens JWT con tiempo de expiración.</li>
            <li>Acceso a datos restringido por tenant_id (aislamiento entre cuentas).</li>
            <li>Autenticación de dos factores disponible.</li>
          </ul>
          <p>En caso de detectar una brecha de seguridad que afecte tus datos, te notificaremos en el menor tiempo posible conforme a la normativa vigente.</p>
        </LegalSection>

        <LegalSection title="9. Servicios de terceros">
          <p>VentaSimple utiliza los siguientes servicios de terceros, cada uno con su propia política de privacidad:</p>
          <ul>
            <li><strong>Supabase</strong> — base de datos en la nube (supabase.com/privacy).</li>
            <li><strong>MercadoPago</strong> — procesamiento de pagos (mercadopago.com.ar/privacidad).</li>
            <li><strong>Resend</strong> — envío de emails transaccionales (resend.com/privacy).</li>
            <li><strong>Vercel</strong> — hosting del panel web (vercel.com/legal/privacy-policy).</li>
          </ul>
        </LegalSection>

        <LegalSection title="10. Menores de edad">
          <p>VentaSimple no está dirigido a menores de 18 años. No recopilamos intencionalmente datos de menores de edad. Si sos padre/madre o tutor y creés que un menor nos ha proporcionado datos personales, contactanos para eliminarlos.</p>
        </LegalSection>

        <LegalSection title="11. Cambios a esta política">
          <p>Podemos actualizar esta política periódicamente. Si hay cambios significativos que afecten tus derechos o el tratamiento de tus datos, te notificaremos por email con al menos 15 días de anticipación. El uso continuado del servicio después de la notificación implica la aceptación de la nueva política.</p>
        </LegalSection>

        <LegalSection title="12. Contacto">
          <p>Para cualquier consulta sobre esta política de privacidad o para ejercer tus derechos:</p>
          <ul>
            <li>Email: <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A" }}>ventas@ventasimple.app</a></li>
            <li>Web: <Link href="/" style={{ color: "#1E3A8A" }}>ventasimple.app</Link></li>
          </ul>
          <p style={{ fontSize: 12, color: "#A39D97" }}>
            Respondemos todos los pedidos relacionados con privacidad en un plazo máximo de 5 días hábiles, conforme al artículo 14 de la Ley 25.326.
          </p>
        </LegalSection>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #E2E0DA", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Link href="/terminos" style={{ fontSize: 13, color: "#1E3A8A", textDecoration: "none" }}>Términos y Condiciones →</Link>
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
