import { ArrowRight } from "lucide-react";

export default function DashboardSupportCard() {
  return (
    <div style={{
      background: "#F8FAFF", border: "1px solid #C7D2FE",
      borderRadius: 12, padding: "14px 16px",
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", margin: "0 0 4px" }}>
        ¿Necesitás ayuda?
      </p>
      <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6, margin: "0 0 10px" }}>
        Soporte humano 24/7 por WhatsApp. Respondemos en menos de 5 min.
      </p>
      <a
        href="mailto:ventas@ventasimple.app"
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#1E3A8A", textDecoration: "none" }}
      >
        Contactar soporte <ArrowRight size={10} />
      </a>
    </div>
  );
}
