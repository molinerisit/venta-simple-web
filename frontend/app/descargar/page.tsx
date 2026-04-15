"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import {
  Download, Monitor, Shield, Zap, Loader2,
  ChevronDown, AlertTriangle, CheckCircle2, Info, ExternalLink,
} from "lucide-react";

const GITHUB_REPO = "molinerisit/venta-simple-pos";

interface Release {
  version: string;
  downloadUrl: string | null;
  publishedAt: string;
  fileSize: string | null;
}

async function fetchLatestRelease(): Promise<Release> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 0 } }
  );
  if (!res.ok) throw new Error("No hay releases aún");
  const data = await res.json();
  const asset = (data.assets as { name: string; browser_download_url: string; size: number }[])
    .find(a => a.name.endsWith(".exe"));
  return {
    version:     data.tag_name?.replace(/^v/, "") ?? "—",
    downloadUrl: asset?.browser_download_url ?? null,
    publishedAt: data.published_at ?? "",
    fileSize:    asset ? `${(asset.size / 1024 / 1024).toFixed(0)} MB` : null,
  };
}

/* ── Guía de instalación — ítems ────────────────────────────── */
const GUIA = [
  {
    id: "smartscreen",
    icon: AlertTriangle,
    iconColor: "#D97706",
    bgLight: "#FFFBEB",
    bgDark:  "rgba(217,119,6,.08)",
    bdrLight:"#FDE68A",
    bdrDark: "rgba(217,119,6,.25)",
    titulo: "Windows bloqueó la instalación (SmartScreen)",
    pasos: [
      'Al ejecutar el instalador, Windows puede mostrar el mensaje "Windows protegió tu PC".',
      'Hacé clic en "Más información" (link pequeño debajo del mensaje).',
      'Aparece el botón "Ejecutar de todas formas" — hacé clic ahí.',
      'La instalación continúa con normalidad.',
    ],
    nota: "Esto ocurre porque el instalador aún no tiene reputación acumulada en Microsoft. No indica que el archivo sea peligroso.",
  },
  {
    id: "antivirus",
    icon: Shield,
    iconColor: "#DC2626",
    bgLight: "#FEF2F2",
    bgDark:  "rgba(220,38,38,.08)",
    bdrLight:"#FECACA",
    bdrDark: "rgba(220,38,38,.2)",
    titulo: "El antivirus bloqueó o borró el instalador",
    pasos: [
      "Algunos antivirus eliminan archivos .exe desconocidos antes de que los ejecutes.",
      "Revisá la carpeta de cuarentena de tu antivirus y restaurá el archivo si está ahí.",
      "Podés desactivar temporalmente la protección en tiempo real, instalar la app, y volver a activarla.",
      "Si usás Windows Defender: Seguridad de Windows → Protección contra virus → Administrar configuración → Desactivar protección en tiempo real por un momento.",
      "Una vez instalada la app, el antivirus ya no la va a volver a eliminar.",
    ],
    nota: "La app está publicada en GitHub con código abierto. Si querés verificar su origen, el repositorio es github.com/molinerisit/venta-simple-pos",
  },
  {
    id: "instalacion",
    icon: Download,
    iconColor: "#1E3A8A",
    bgLight: "#F5F3FF",
    bgDark:  "rgba(30,58,138,.08)",
    bdrLight:"#DDD6FE",
    bdrDark: "rgba(30,58,138,.2)",
    titulo: "Pasos de instalación normales",
    pasos: [
      "Descargá el archivo .exe desde esta página.",
      "Ejecutalo y seguí el asistente de instalación (Next → Next → Install).",
      "Podés elegir si instalar para todos los usuarios o solo para vos.",
      "Al finalizar, aparece el acceso directo en el escritorio y en el Menú Inicio.",
      "Abrí la app e iniciá sesión con tu cuenta de VentaSimple.",
      "Desde Mi Cuenta en el panel web, generá el token de activación para conectar la app.",
    ],
    nota: null,
  },
  {
    id: "noapre",
    icon: Info,
    iconColor: "#0EA5E9",
    bgLight: "#F0F9FF",
    bgDark:  "rgba(14,165,233,.08)",
    bdrLight:"#BAE6FD",
    bdrDark: "rgba(14,165,233,.2)",
    titulo: "La app se instaló pero no abre",
    pasos: [
      "Buscá 'Venta Simple Hub' en el menú Inicio.",
      "Si no aparece, revisá en C:\\Users\\TuUsuario\\AppData\\Local\\Programs\\Venta Simple.",
      "Clic derecho en el .exe → Ejecutar como administrador.",
      "Si ves un error sobre módulos faltantes, desinstalá la app y volvé a instalar la versión más reciente desde esta página.",
    ],
    nota: "Ante cualquier problema escribinos por WhatsApp. Respondemos en menos de 5 minutos las 24 horas.",
  },
];

function GuiaItem({ item, open, onToggle }: {
  item: typeof GUIA[0];
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
        style={{ background: "var(--card)" }}
      >
        <span style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: `color-mix(in srgb, ${item.iconColor} 12%, transparent)`,
          display: "grid", placeItems: "center",
        }}>
          <Icon size={15} style={{ color: item.iconColor }} />
        </span>
        <span className="flex-1 text-sm font-semibold text-foreground">{item.titulo}</span>
        <ChevronDown
          size={16}
          className="text-muted-foreground shrink-0 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
          <ol className="space-y-2.5">
            {item.pasos.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                  background: `color-mix(in srgb, ${item.iconColor} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${item.iconColor} 25%, transparent)`,
                  display: "grid", placeItems: "center",
                  fontSize: 10, fontWeight: 800, color: item.iconColor,
                }}>
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
          {item.nota && (
            <div className="mt-3 flex gap-2 px-3 py-2.5 rounded-lg" style={{
              background: `color-mix(in srgb, ${item.iconColor} 8%, transparent)`,
              border: `1px solid color-mix(in srgb, ${item.iconColor} 20%, transparent)`,
            }}>
              <Info size={13} style={{ color: item.iconColor, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs leading-relaxed" style={{ color: item.iconColor, margin: 0 }}>{item.nota}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Página principal ────────────────────────────────────────── */
export default function DescargarPage() {
  const router  = useRouter();
  const [release, setRelease]   = useState<Release | null>(null);
  const [loading, setLoading]   = useState(true);
  const [openId, setOpenId]     = useState<string | null>("smartscreen");

  useEffect(() => {
    const user = getUser();
    if (!user) { router.replace("/login?next=/descargar"); return; }
    fetchLatestRelease()
      .then(setRelease)
      .catch(() => setRelease({ version: "—", downloadUrl: null, publishedAt: "", fileSize: null }))
      .finally(() => setLoading(false));
  }, [router]);

  const user = typeof window !== "undefined" ? getUser() : null;
  if (!user) return null;

  function toggle(id: string) {
    setOpenId(prev => prev === id ? null : id);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="border-b bg-background/90 backdrop-blur sticky top-0 z-50" style={{ borderColor: "var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Image src="/brand/logotexto.png" alt="Venta Simple" width={140} height={38}
              style={{ height: 26, width: "auto", objectFit: "contain" }} priority />
          </Link>
          <Link href="/dashboard" style={{
            fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 8,
            background: "rgba(30,58,138,.1)", border: "1px solid rgba(30,58,138,.25)",
            color: "#1E3A8A", textDecoration: "none",
          }}>
            Ir al panel →
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Hero */}
        <div className="text-center mb-10">
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "#1E3A8A",
            display: "grid", placeItems: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 32px rgba(30,58,138,.3)",
          }}>
            <Monitor size={34} color="#fff" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3" style={{ letterSpacing: "-0.03em" }}>
            Venta Simple Hub para Windows
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed" style={{ maxWidth: 460, margin: "0 auto" }}>
            Gestioná ventas, stock y clientes sin depender de internet.
            Sincronización automática cuando hay conexión.
          </p>
        </div>

        {/* Botón descarga */}
        <div className="text-center mb-10">
          {loading ? (
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Buscando versión más reciente…
            </div>
          ) : release?.downloadUrl ? (
            <>
              <a
                href={release.downloadUrl}
                download
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "15px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16,
                  background: "#1E3A8A", color: "#fff", textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(30,58,138,.35)",
                  letterSpacing: "-0.01em",
                }}
              >
                <Download size={20} />
                Descargar para Windows
                <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>v{release.version}</span>
              </a>
              <p className="text-xs text-muted-foreground mt-3">
                Windows 10 / 11 · 64-bit
                {release.fileSize ? ` · ${release.fileSize}` : ""}
                {release.publishedAt ? ` · ${new Date(release.publishedAt).toLocaleDateString("es-AR")}` : ""}
              </p>
            </>
          ) : (
            <>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "15px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16,
                background: "rgba(30,58,138,.08)", border: "1px solid rgba(30,58,138,.2)",
                color: "#1E3A8A", cursor: "not-allowed",
              }}>
                <Download size={20} />
                Descarga disponible próximamente
              </div>
              <p className="text-xs text-muted-foreground mt-3">El instalador estará disponible en breve.</p>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-5 mb-12 pb-10 border-b" style={{ borderColor: "var(--border)" }}>
          {[
            { icon: Zap,     title: "Funciona offline",  desc: "Trabajá sin internet. Sincroniza al reconectar." },
            { icon: Shield,  title: "Backup automático", desc: "Tus datos siempre seguros en la nube." },
            { icon: Monitor, title: "Multi-PC",          desc: "Usalo en más de una PC con el plan Pro." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div style={{
                width: 40, height: 40, borderRadius: 10, margin: "0 auto 10px",
                background: "rgba(30,58,138,.1)", display: "grid", placeItems: "center",
              }}>
                <Icon size={18} style={{ color: "#1E3A8A" }} />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Guía de instalación */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
              Guía de instalación y problemas comunes
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Windows puede mostrar alertas al instalar apps nuevas. Es normal. Expandí el problema que tenés para ver cómo resolverlo.
          </p>

          <div className="space-y-2">
            {GUIA.map(item => (
              <GuiaItem
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>

          {/* ¿Necesitás más ayuda? */}
          <div className="mt-6 flex items-start gap-3 px-4 py-3.5 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">¿Seguís con problemas?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Escribinos por WhatsApp — soporte humano 24/7, respondemos en menos de 5 minutos.
                También podés escribir a{" "}
                <a href="mailto:ventas@ventasimple.app" style={{ color: "#1E3A8A", fontWeight: 600 }}>
                  ventas@ventasimple.app
                </a>
              </p>
            </div>
          </div>

          {/* Link repo */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Código fuente disponible en{" "}
            <a
              href="https://github.com/molinerisit/venta-simple-pos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
              style={{ color: "#1E3A8A", fontWeight: 600 }}
            >
              github.com/molinerisit/venta-simple-pos
              <ExternalLink size={11} />
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
