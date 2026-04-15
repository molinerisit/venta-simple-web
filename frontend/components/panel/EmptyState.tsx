import { type LucideIcon, Loader2 } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Wrap in a dashed border container (default: true) */
  bordered?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  bordered = true,
}: EmptyStateProps) {
  const content = (
    <>
      {/* Icon container */}
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: "rgba(30,58,138,.07)",
        border: "1px solid rgba(30,58,138,.14)",
        display: "grid", placeItems: "center",
        marginBottom: 16,
      }}>
        <Icon size={24} style={{ color: "#1E3A8A", opacity: 0.75 }} />
      </div>

      {/* Text */}
      <p className="text-base font-semibold text-foreground mb-2">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed" style={{ marginBottom: action ? 0 : 0 }}>
          {description}
        </p>
      )}

      {/* CTA */}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </>
  );

  if (bordered) {
    return (
      <div className="vs-empty">
        {content}
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "48px 32px", textAlign: "center",
    }}>
      {content}
    </div>
  );
}

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "56px 32px", gap: 12,
      color: "var(--vs-muted)",
    }}>
      <Loader2 size={20} className="animate-spin" style={{ color: "#1E3A8A" }} />
      <p style={{ fontSize: 13 }}>{label}</p>
    </div>
  );
}
