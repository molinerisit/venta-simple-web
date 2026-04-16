import Link from "next/link";
import { CheckCircle2, Download, Monitor, ArrowRight } from "lucide-react";

const PASOS = [
  {
    n: 1, titulo: "Cuenta creada y verificada",
    desc: "Ya tenés acceso al panel web.",
    done: true, action: null, actionIcon: null,
  },
  {
    n: 2, titulo: "Descargá la app de escritorio",
    desc: "Funciona sin internet. Cuando te volvés a conectar, todo se sincroniza solo.",
    action: { label: "Descargar app", href: "/descargar" }, actionIcon: Download, done: false,
  },
  {
    n: 3, titulo: "Activá la app desde Mi Cuenta",
    desc: 'En Mi Cuenta hacé clic en "Activar en desktop" y la app se configura sola.',
    action: { label: "Ir a Mi Cuenta", href: "/cuenta" }, actionIcon: Monitor, done: false,
  },
  {
    n: 4, titulo: "Registrá tu primera venta",
    desc: "Tus ventas y stock quedan disponibles en este panel en tiempo real.",
    action: null, actionIcon: null, done: false,
  },
];

export default function DashboardProgressCard({ licenciaActiva }: { licenciaActiva: boolean }) {
  const completedCount = licenciaActiva ? 2 : 1;
  const pct = Math.round((completedCount / PASOS.length) * 100);

  return (
    <div style={{
      background: "#fff", border: "1px solid #E9EAEC",
      borderRadius: 16, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,.05)",
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: "#F1F3F5" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "#1E3A8A",
          transition: "width .5s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>

      <div style={{ padding: "8px 0 12px" }}>
        {PASOS.map((paso, i) => {
          const isDone = paso.done || i < completedCount;
          const isNext = i === completedCount;
          const isLocked = !isDone && !isNext;
          const ActionIcon = paso.actionIcon;

          return (
            <div key={paso.n} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              padding: "16px 24px",
              background: isNext ? "#FAFBFF" : "transparent",
              borderLeft: `3px solid ${isNext ? "#1E3A8A" : "transparent"}`,
              opacity: isLocked ? 0.38 : 1,
              transition: "opacity .2s",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                display: "grid", placeItems: "center",
                background: isDone ? "#DCFCE7" : isNext ? "#EEF2FF" : "#F8F9FB",
                border: `1.5px solid ${isDone ? "#BBF7D0" : isNext ? "#C7D2FE" : "#E9EAEC"}`,
                marginTop: 1,
              }}>
                {isDone
                  ? <CheckCircle2 size={15} strokeWidth={2.5} style={{ color: "#16A34A" }} />
                  : <span style={{ fontWeight: 800, fontSize: 12, color: isNext ? "#1E3A8A" : "#CBD5E1" }}>{paso.n}</span>
                }
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: isDone ? 500 : 600, fontSize: 14, color: isDone ? "#16A34A" : isNext ? "#0F172A" : "#64748B", margin: 0 }}>
                    {paso.titulo}
                  </p>
                  {isDone && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "1px 8px", borderRadius: 99, letterSpacing: "0.04em" }}>
                      Listo
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>{paso.desc}</p>
                {paso.action && isNext && (
                  <Link href={paso.action.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "8px 16px", borderRadius: 8,
                      fontWeight: 700, fontSize: 12,
                      background: "#1E3A8A", color: "#fff",
                      boxShadow: "0 2px 10px rgba(30,58,138,.22)",
                    }}>
                      {ActionIcon && <ActionIcon size={12} />}
                      {paso.action.label}
                      <ArrowRight size={11} />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
