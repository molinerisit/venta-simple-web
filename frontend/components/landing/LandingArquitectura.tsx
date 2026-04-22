import { Monitor, Globe, RefreshCw, Check } from "lucide-react";
import { C, T } from "./tokens";

const POS = [
  "Ventas rápidas y sin errores",
  "Funciona sin internet",
  "Ticket e impresora térmica",
  "Gestión de productos y stock",
];

const DASH = [
  "Ventas, ganancias y productos",
  "Informes claros en tiempo real",
  "Control desde el celular",
  "Sin instalaciones, siempre actualizado",
];

export default function LandingArquitectura() {
  return (
    <section style={{ background: C.bg, padding: "88px 0", borderBottom: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Un sistema, dos partes</div>
          <h2 style={{ ...T.h2, margin: "0 0 14px" }}>
            Todo lo que necesitás para vender<br />y controlar tu negocio.
          </h2>
          <p style={{ ...T.body, margin: 0 }}>
            Diseñado para trabajar junto y simplificar tu día a día.
          </p>
        </div>

        {/* Cards + separador */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 20, maxWidth: 900, margin: "0 auto",
        }}>

          {/* Punto de venta */}
          <div style={{
            flex: 1,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 20,
            padding: "36px 32px",
            boxShadow: "0 4px 24px rgba(30,58,138,.07)",
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              background: C.blue, display: "grid", placeItems: "center", marginBottom: 20,
              boxShadow: "0 4px 16px rgba(30,58,138,.30)",
            }}>
              <Monitor size={26} strokeWidth={1.7} style={{ color: "#fff" }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.025em", marginBottom: 4, lineHeight: 1.2 }}>
              Punto de venta
            </div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 28 }}>
              App para Windows
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {POS.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "#DBEAFE", display: "grid", placeItems: "center",
                  }}>
                    <Check size={12} strokeWidth={3} style={{ color: C.blue }} />
                  </div>
                  <span style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Elemento central */}
          <div style={{
            width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
            background: C.surface,
            border: `1.5px solid ${C.border}`,
            boxShadow: "0 4px 18px rgba(0,0,0,.09)",
            display: "grid", placeItems: "center",
          }}>
            <span style={{ fontSize: 24, fontWeight: 300, color: C.muted, lineHeight: 1, marginTop: -2 }}>+</span>
          </div>

          {/* Dashboard de gestión */}
          <div style={{
            flex: 1,
            background: "#ECFDF5",
            border: `1px solid ${C.greenBdr}`,
            borderRadius: 20,
            padding: "36px 32px",
            boxShadow: "0 4px 24px rgba(10,110,69,.07)",
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              background: C.green, display: "grid", placeItems: "center", marginBottom: 20,
              boxShadow: "0 4px 16px rgba(10,110,69,.28)",
            }}>
              <Globe size={26} strokeWidth={1.7} style={{ color: "#fff" }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.025em", marginBottom: 4, lineHeight: 1.2 }}>
              Dashboard de gestión
            </div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 28 }}>
              Panel web desde cualquier lugar
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {DASH.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "#A7F3D0", display: "grid", placeItems: "center",
                  }}>
                    <Check size={12} strokeWidth={3} style={{ color: C.green }} />
                  </div>
                  <span style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sync strip */}
        <div style={{
          maxWidth: 660, margin: "36px auto 0",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "20px 28px",
          display: "flex", alignItems: "center", gap: 18,
          boxShadow: "0 2px 14px rgba(0,0,0,.05)",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, flexShrink: 0,
            background: C.blueBg, display: "grid", placeItems: "center",
          }}>
            <RefreshCw size={20} strokeWidth={1.8} style={{ color: C.blue }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
              Ambas partes se sincronizan automáticamente.
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 400 }}>
              Vendé en tu local, controlá desde donde estés.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
