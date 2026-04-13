import Link from "next/link";
import { Download, Monitor, Shield, Zap } from "lucide-react";

// URL del instalador — actualizar cuando exista el .exe real
const DOWNLOAD_URL_WIN = "#";   // e.g. https://releases.ventasimple.com/VentaSimple-Setup.exe
const VERSION = "1.0.0";

export default function DescargarPage() {
  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      {/* Nav mínima */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
              display: "grid", placeItems: "center",
              fontWeight: 900, fontSize: 14, color: "#fff",
            }}>VS</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Venta Simple</span>
          </Link>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 600, padding: "7px 18px", borderRadius: 8,
            background: "rgba(109,93,252,.18)", border: "1px solid rgba(109,93,252,.35)",
            color: "#b3a7ff", textDecoration: "none",
          }}>
            Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* Hero descarga */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        {/* Ícono */}
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
          display: "grid", placeItems: "center",
          margin: "0 auto 28px", boxShadow: "0 8px 40px rgba(109,93,252,.35)",
        }}>
          <Monitor size={38} color="#fff" />
        </div>

        <h1 style={{ margin: "0 0 14px", fontSize: 36, fontWeight: 900, color: "#fff" }}>
          Venta Simple para Windows
        </h1>
        <p style={{ margin: "0 0 36px", fontSize: 16, color: "#a3acbb", lineHeight: 1.6 }}>
          La app de escritorio para gestionar ventas, stock y clientes sin depender de internet.
          Sincronización automática cuando hay conexión.
        </p>

        {/* Botón principal */}
        <a
          href={DOWNLOAD_URL_WIN}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 36px", borderRadius: 12, fontWeight: 800, fontSize: 16,
            background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
            color: "#fff", textDecoration: "none",
            boxShadow: "0 6px 30px rgba(109,93,252,.4)",
          }}
        >
          <Download size={20} />
          Descargar para Windows
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>v{VERSION}</span>
        </a>

        <p style={{ margin: "14px 0 0", fontSize: 12, color: "#5a6070" }}>
          Windows 10 / 11 · 64-bit · ~85 MB
        </p>
      </div>

      {/* Pasos de instalación */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 28 }}>
          Cómo empezar
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            {
              n: 1,
              title: "Creá tu cuenta",
              desc: "Registrate en el sitio web y verificá tu email. Eso es todo — ya tenés acceso.",
              action: { label: "Crear cuenta gratis", href: "/registro" },
            },
            {
              n: 2,
              title: "Descargá e instalá la app",
              desc: "Ejecutá el instalador y seguí los pasos. Se instala en menos de un minuto.",
            },
            {
              n: 3,
              title: "Activá desde tu cuenta web",
              desc: 'En Mi Cuenta → App de escritorio → clic en "Activar en desktop". La app se configura sola.',
              action: { label: "Ir a mi cuenta", href: "/cuenta" },
            },
          ].map(step => (
            <div key={step.n} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              background: "#16181f", border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 14, padding: "18px 22px",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "rgba(109,93,252,.15)", border: "1px solid rgba(109,93,252,.3)",
                display: "grid", placeItems: "center",
                fontWeight: 800, fontSize: 14, color: "#b3a7ff",
              }}>{step.n}</div>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#fff", fontSize: 14 }}>{step.title}</p>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#a3acbb", lineHeight: 1.5 }}>{step.desc}</p>
                {step.action && (
                  <Link href={step.action.href} style={{
                    fontSize: 12, fontWeight: 600, color: "#b3a7ff",
                    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
                  }}>
                    {step.action.label} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "40px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: Zap, title: "Rápido sin internet", desc: "Trabaja offline. Sincroniza automáticamente al reconectar." },
            { icon: Shield, title: "Datos seguros", desc: "Backup automático en la nube con tu cuenta web." },
            { icon: Monitor, title: "Multi-PC", desc: "Usalo en más de una computadora con el plan Pro." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <Icon size={22} style={{ color: "#6d5dfc", marginBottom: 10 }} />
              <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#fff", fontSize: 13 }}>{title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#5a6070", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
