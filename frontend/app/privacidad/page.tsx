import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad · VentaSimple",
  description: "Conocé cómo VentaSimple recopila, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
  const lastUpdate = "15 de abril de 2026";

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

        <LegalSection title="1. Quiénes somos">
          <p>VentaSimple es un sistema de gestión para negocios pequeños en Argentina. Operamos el sitio web <strong>ventasimple.app</strong> y la aplicación de escritorio VentaSimple para Windows.</p>
          <p>Para consultas sobre privacidad podés escribirnos a <a href="mailto:ventas@ventasimple.app" style={{ color: "#b3a7ff" }}>ventas@ventasimple.app</a>.</p>
        </LegalSection>

        <LegalSection title="2. Qué información recopilamos">
          <ul>
            <li><strong>Datos de registro:</strong> nombre, email y contraseña al crear tu cuenta.</li>
            <li><strong>Datos del negocio:</strong> nombre del negocio, productos, precios, ventas, clientes y proveedores que cargás en el sistema.</li>
            <li><strong>Datos de uso:</strong> métricas anónimas de uso de la plataforma para mejorar el servicio.</li>
            <li><strong>Datos de pago:</strong> el procesamiento de pagos se realiza a través de MercadoPago. No almacenamos datos de tarjetas.</li>
            <li><strong>Información técnica:</strong> dirección IP, tipo de navegador y sistema operativo, solo para seguridad y diagnóstico.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Cómo usamos tu información">
          <ul>
            <li>Para proveer y mantener el servicio de VentaSimple.</li>
            <li>Para gestionar tu cuenta y suscripción.</li>
            <li>Para enviarte notificaciones del sistema (verificación de email, alertas de plan, actualizaciones importantes).</li>
            <li>Para brindarte soporte técnico cuando lo solicitás.</li>
            <li>Para mejorar el producto a partir del análisis de uso agregado y anónimo.</li>
          </ul>
          <p>No vendemos ni compartimos tus datos personales con terceros con fines publicitarios.</p>
        </LegalSection>

        <LegalSection title="4. Almacenamiento de datos">
          <p>Tus datos se almacenan en servidores seguros a través de <strong>Supabase</strong> (PostgreSQL en la nube). Los datos de la aplicación de escritorio también se guardan localmente en tu PC en una base de datos SQLite, que permanece bajo tu control.</p>
          <p>Conservamos tus datos mientras tu cuenta esté activa o mientras sea necesario para proveer el servicio. Si eliminás tu cuenta, eliminamos tus datos personales en un plazo de 30 días, excepto los que debamos conservar por obligaciones legales.</p>
        </LegalSection>

        <LegalSection title="5. Cookies">
          <p>Usamos cookies de sesión estrictamente necesarias para mantener tu sesión iniciada en el panel web. No usamos cookies de seguimiento ni publicidad de terceros.</p>
        </LegalSection>

        <LegalSection title="6. Tus derechos">
          <p>Tenés derecho a:</p>
          <ul>
            <li><strong>Acceder</strong> a los datos personales que tenemos sobre vos.</li>
            <li><strong>Corregir</strong> datos incorrectos o desactualizados.</li>
            <li><strong>Eliminar</strong> tu cuenta y datos personales asociados.</li>
            <li><strong>Portabilidad:</strong> solicitar una exportación de tus datos en formato CSV.</li>
            <li><strong>Oponerte</strong> al procesamiento de tus datos en determinadas circunstancias.</li>
          </ul>
          <p>Para ejercer cualquiera de estos derechos, escribinos a <a href="mailto:ventas@ventasimple.app" style={{ color: "#b3a7ff" }}>ventas@ventasimple.app</a>.</p>
        </LegalSection>

        <LegalSection title="7. Seguridad">
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos: HTTPS en todas las comunicaciones, contraseñas hasheadas (bcrypt), tokens JWT con expiración, y acceso restringido a los datos por tenant_id.</p>
          <p>Aun así, ningún sistema es 100% seguro. Te recomendamos usar una contraseña fuerte y no compartirla.</p>
        </LegalSection>

        <LegalSection title="8. Servicios de terceros">
          <p>VentaSimple utiliza los siguientes servicios de terceros, cada uno con su propia política de privacidad:</p>
          <ul>
            <li><strong>Supabase</strong> — base de datos en la nube.</li>
            <li><strong>MercadoPago</strong> — procesamiento de pagos.</li>
            <li><strong>Resend</strong> — envío de emails transaccionales.</li>
            <li><strong>Vercel</strong> — hosting del panel web y backend.</li>
          </ul>
        </LegalSection>

        <LegalSection title="9. Menores de edad">
          <p>VentaSimple no está dirigido a menores de 18 años. No recopilamos intencionalmente datos de menores.</p>
        </LegalSection>

        <LegalSection title="10. Cambios a esta política">
          <p>Podemos actualizar esta política periódicamente. Si hay cambios significativos, te notificaremos por email. El uso continuado del servicio después de los cambios implica la aceptación de la nueva política.</p>
        </LegalSection>

        <LegalSection title="11. Contacto">
          <p>Para cualquier consulta sobre esta política de privacidad:</p>
          <ul>
            <li>Email: <a href="mailto:ventas@ventasimple.app" style={{ color: "#b3a7ff" }}>ventas@ventasimple.app</a></li>
            <li>Web: <Link href="/" style={{ color: "#b3a7ff" }}>ventasimple.app</Link></li>
          </ul>
        </LegalSection>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Link href="/terminos" style={{ fontSize: 13, color: "#b3a7ff", textDecoration: "none" }}>Términos y Condiciones →</Link>
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
