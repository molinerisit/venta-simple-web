import { type ReactElement } from "react";
import { Monitor, Globe, RefreshCw, Check } from "lucide-react";
import { C, T } from "./tokens";

const POS: { main: string; bold: string[] }[] = [
  { main: "Ventas rápidas y sin errores",      bold: ["rápidas", "sin errores"]    },
  { main: "Funciona sin internet",              bold: ["sin internet"]              },
  { main: "Ticket e impresora térmica",         bold: ["Ticket"]                    },
  { main: "Gestión de productos y stock",       bold: ["productos y stock"]         },
];

const DASH: { main: string; bold: string[] }[] = [
  { main: "Ventas, ganancias y productos",      bold: ["ganancias"]                 },
  { main: "Informes claros en tiempo real",     bold: ["en tiempo real"]            },
  { main: "Control desde el celular",           bold: ["desde el celular"]          },
  { main: "Sin instalaciones, siempre actualizado", bold: ["siempre actualizado"]   },
];

function Bullet({ main, bold, color, bg }: { main: string; bold: string[]; color: string; bg: string }) {
  let parts: (string | ReactElement)[] = [main];
  bold.forEach(b => {
    parts = parts.flatMap(p => {
      if (typeof p !== "string") return [p];
      const idx = p.indexOf(b);
      if (idx === -1) return [p];
      return [
        p.slice(0, idx),
        <strong key={b} style={{ fontWeight: 700, color }}>{b}</strong>,
        p.slice(idx + b.length),
      ].filter(x => x !== "");
    });
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
        background: bg, display: "grid", placeItems: "center",
      }}>
        <Check size={13} strokeWidth={3} style={{ color }} />
      </div>
      <span style={{ fontSize: 14.5, color: C.text, fontWeight: 500, lineHeight: 1.45 }}>{parts}</span>
    </div>
  );
}

export default function LandingArquitectura() {
  return (
    <section style={{ background: C.bg, padding: "96px 0 104px", borderBottom: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Un sistema, dos partes</div>
          <h2 style={{
            fontSize: "clamp(30px, 3.6vw, 46px)", fontWeight: 900,
            letterSpacing: "-0.035em", lineHeight: 1.08,
            color: C.text, margin: "0 0 16px",
          }}>
            Todo lo que necesitás para vender<br />y controlar tu negocio.
          </h2>
          <p style={{ fontSize: 16, color: C.muted, fontWeight: 400, margin: 0, lineHeight: 1.6 }}>
            Diseñado para trabajar junto y simplificar tu día a día.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 24, maxWidth: 940, margin: "0 auto" }}>

          {/* ── Punto de venta ── */}
          <div className="arq-card arq-card-blue" style={{
            flex: 1,
            background: "linear-gradient(148deg, #EFF6FF 0%, #DBEAFE 100%)",
            border: "1.5px solid #93C5FD",
            borderRadius: 22,
            padding: "40px 36px",
            boxShadow: "0 6px 32px rgba(30,58,138,.10)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: C.blue,
              display: "grid", placeItems: "center", marginBottom: 24,
              boxShadow: "0 8px 24px rgba(30,58,138,.35)",
            }}>
              <Monitor size={30} strokeWidth={1.6} style={{ color: "#fff" }} />
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 6 }}>
              Punto de venta
            </div>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700,
              color: C.blue, background: "#DBEAFE", borderRadius: 99,
              padding: "3px 12px", marginBottom: 28, letterSpacing: "0.02em",
            }}>
              App para Windows
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {POS.map(f => (
                <Bullet key={f.main} main={f.main} bold={f.bold} color={C.blue} bg="#BFDBFE" />
              ))}
            </div>
          </div>

          {/* ── Elemento central ── */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div className="arq-center" style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#fff",
              border: `1.5px solid ${C.border}`,
              boxShadow: "0 4px 20px rgba(0,0,0,.10)",
              display: "grid", placeItems: "center",
            }}>
              <RefreshCw size={22} strokeWidth={1.8} style={{ color: C.blue }} />
            </div>
          </div>

          {/* ── Dashboard de gestión ── */}
          <div className="arq-card arq-card-green" style={{
            flex: 1,
            background: "linear-gradient(148deg, #ECFDF5 0%, #D1FAE5 100%)",
            border: "1.5px solid #6EE7B7",
            borderRadius: 22,
            padding: "40px 36px",
            boxShadow: "0 6px 32px rgba(10,110,69,.10)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: C.green,
              display: "grid", placeItems: "center", marginBottom: 24,
              boxShadow: "0 8px 24px rgba(10,110,69,.32)",
            }}>
              <Globe size={30} strokeWidth={1.6} style={{ color: "#fff" }} />
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 6 }}>
              Dashboard de gestión
            </div>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700,
              color: C.green, background: "#A7F3D0", borderRadius: 99,
              padding: "3px 12px", marginBottom: 28, letterSpacing: "0.02em",
            }}>
              Panel web desde cualquier lugar
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {DASH.map(f => (
                <Bullet key={f.main} main={f.main} bold={f.bold} color={C.green} bg="#6EE7B7" />
              ))}
            </div>
          </div>

        </div>

        {/* Sync strip */}
        <div style={{
          maxWidth: 860, margin: "52px auto 0",
          background: C.surface,
          border: `1.5px solid ${C.border}`,
          borderRadius: 16,
          padding: "26px 36px",
          display: "flex", alignItems: "center", gap: 22,
          boxShadow: "0 4px 24px rgba(0,0,0,.06)",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, #EEF2FE, #DBEAFE)",
            border: "1px solid #BFDBFE",
            display: "grid", placeItems: "center",
            boxShadow: "0 4px 14px rgba(30,58,138,.12)",
          }}>
            <RefreshCw size={24} strokeWidth={1.8} style={{ color: C.blue }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: 6 }}>
              Ambas partes se sincronizan automáticamente.
            </div>
            <div style={{ fontSize: 14, color: C.muted, fontWeight: 400, lineHeight: 1.5 }}>
              Vendé en tu local, controlá desde donde estés.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
