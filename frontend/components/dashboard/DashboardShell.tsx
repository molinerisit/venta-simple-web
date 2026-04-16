import { Calendar } from "lucide-react";

export function StatCard({
  title, value, sub, icon: Icon, accent = false,
}: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: accent ? "1.5px solid #1E3A8A" : "1px solid #E9EAEC",
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14,
      boxShadow: accent ? "0 4px 20px rgba(30,58,138,.10)" : "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
          {title}
        </p>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: accent ? "#EEF2FF" : "#F8F9FB", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon size={15} style={{ color: accent ? "#1E3A8A" : "#94A3B8" }} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color: "#0F172A", margin: 0 }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: 12, color: "#94A3B8", margin: "5px 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

export function Skeleton({ w = "100%", h = 16, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#F1F3F5 25%,#E9EAEC 50%,#F1F3F5 75%)",
      backgroundSize: "400% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const dateLabel = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, fontWeight: 500 }}>{subtitle}</p>
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
        padding: "7px 13px", borderRadius: 8,
        background: "#F8F9FB", border: "1px solid #E9EAEC",
        fontSize: 12, color: "#64748B", fontWeight: 500,
      }}>
        <Calendar size={12} style={{ color: "#94A3B8" }} />
        {dateLabel}
      </div>
    </div>
  );
}
