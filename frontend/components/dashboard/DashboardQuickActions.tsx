import Link from "next/link";
import { Package, Users, BarChart2, ChevronRight } from "lucide-react";

const ACTIONS = [
  { icon: Package,   color: "#1E3A8A", bg: "#EEF2FF", label: "Productos", sub: "Cargá tu catálogo",     href: "/productos" },
  { icon: Users,     color: "#0A6E45", bg: "#DCFCE7", label: "Clientes",  sub: "Gestioná tus clientes", href: "/clientes"  },
  { icon: BarChart2, color: "#7C3AED", bg: "#F5F3FF", label: "Métricas",  sub: "Ver reportes y KPIs",   href: "/metricas"  },
];

export default function DashboardQuickActions() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 4px" }}>
        Accesos rápidos
      </p>
      {ACTIONS.map(({ icon: Icon, color, bg, label, sub, href }) => (
        <Link key={href} href={href} style={{ textDecoration: "none" }}>
          <div style={{
            background: "#fff", border: "1px solid #E9EAEC", borderRadius: 12,
            padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,.04)",
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: bg, display: "grid", placeItems: "center" }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", margin: "0 0 1px" }}>{label}</p>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>{sub}</p>
            </div>
            <ChevronRight size={13} style={{ color: "#CBD5E1", flexShrink: 0 }} />
          </div>
        </Link>
      ))}
    </div>
  );
}
