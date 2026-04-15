import { type LucideIcon, Loader2 } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div
        style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(109,93,252,.08)",
          border: "1px solid rgba(109,93,252,.15)",
          display: "grid", placeItems: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={22} style={{ color: "#6d5dfc", opacity: 0.7 }} />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
      <Loader2 size={20} className="animate-spin" style={{ color: "#6d5dfc" }} />
      <p className="text-xs">{label}</p>
    </div>
  );
}
