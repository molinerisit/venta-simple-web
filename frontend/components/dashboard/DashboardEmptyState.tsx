import { ShoppingCart } from "lucide-react";
import DashboardProgressCard from "./DashboardProgressCard";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardSupportCard from "./DashboardSupportCard";

export default function DashboardEmptyState({ licenciaActiva, nombre }: { licenciaActiva: boolean; nombre: string }) {
  const completedCount = licenciaActiva ? 2 : 1;
  const pct = Math.round((completedCount / 4) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "100%" }}>

      {/* Bienvenida + progreso */}
      <div style={{
        background: "#fff", border: "1px solid #E9EAEC", borderRadius: 16,
        padding: "28px 32px", display: "flex", alignItems: "center", gap: 24,
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, background: "#1E3A8A", display: "grid", placeItems: "center" }}>
          <ShoppingCart size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 4px" }}>
            Bienvenido
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            {nombre}
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
            Configurá la app en minutos y empezá a vender con control total.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#1E3A8A", margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>
            {pct}%
          </p>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            completado
          </p>
        </div>
      </div>

      {/* Steps + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "flex-start" }}>
        <DashboardProgressCard licenciaActiva={licenciaActiva} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <DashboardQuickActions />
          <DashboardSupportCard />
        </div>
      </div>

    </div>
  );
}
