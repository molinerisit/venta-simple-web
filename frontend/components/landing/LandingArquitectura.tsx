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
      <span style={{ fontSize: 13.5, color: C.text, fontWeight: 500, lineHeight: 1.45 }}>{parts}</span>
    </div>
  );
}

export default function LandingArquitectura() {
  return (
    <section style={{ background: C.bg, padding: "72px 0 80px", borderBottom: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Un sistema, dos partes</div>
          <h2 style={{ ...T.h2, margin: "0 0 12px" }}>
            Todo lo que necesitás para vender<br />y controlar tu negocio.
          </h2>
          <p style={{ fontSize: 15, color: C.muted, fontWeight: 400, margin: 0, lineHeight: 1.6 }}>
            Vendé en el local, controlá desde donde estés.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 20, maxWidth: 860, margin: "0 auto" }}>

          {/* ── Punto de venta ── */}
          <div className="arq-card arq-card-blue" style={{
            flex: 1,
            background: "linear-gradient(148deg, #EFF6FF 0%, #DBEAFE 100%)",
            border: "1.5px solid #93C5FD",
            borderRadius: 18,
            padding: "32px 28px",
            boxShadow: "0 6px 32px rgba(30,58,138,.10)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: C.blue,
              display: "grid", placeItems: "center", marginBottom: 18,
              boxShadow: "0 6px 18px rgba(30,58,138,.35)",
            }}>
              <Monitor size={24} strokeWidth={1.6} style={{ color: "#fff" }} />
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 5 }}>
              Punto de venta
            </div>
            <div style={{
              display: "inline-block", fontSize: 11, fontWeight: 700,
              color: C.blue, background: "#DBEAFE", borderRadius: 99,
              padding: "2px 10px", marginBottom: 20, letterSpacing: "0.02em",
            }}>
              App para Windows
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {POS.map(f => (
                <Bullet key={f.main} main={f.main} bold={f.bold} color={C.blue} bg="#BFDBFE" />
              ))}
            </div>
          </div>

          {/* ── Elemento central ── */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div className="arq-center" style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "#fff",
              border: `1.5px solid ${C.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,.10)",
              display: "grid", placeItems: "center",
            }}>
              <RefreshCw size={18} strokeWidth={1.8} style={{ color: C.blue }} />
            </div>
          </div>

          {/* ── Dashboard de gestión ── */}
          <div className="arq-card arq-card-green" style={{
            flex: 1,
            background: "linear-gradient(148deg, #ECFDF5 0%, #D1FAE5 100%)",
            border: "1.5px solid #6EE7B7",
            borderRadius: 18,
            padding: "32px 28px",
            boxShadow: "0 6px 32px rgba(10,110,69,.10)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: C.green,
              display: "grid", placeItems: "center", marginBottom: 18,
              boxShadow: "0 6px 18px rgba(10,110,69,.32)",
            }}>
              <Globe size={24} strokeWidth={1.6} style={{ color: "#fff" }} />
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 5 }}>
              Dashboard de gestión
            </div>
            <div style={{
              display: "inline-block", fontSize: 11, fontWeight: 700,
              color: C.green, background: "#A7F3D0", borderRadius: 99,
              padding: "2px 10px", marginBottom: 20, letterSpacing: "0.02em",
            }}>
              Panel web desde cualquier lugar
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {DASH.map(f => (
                <Bullet key={f.main} main={f.main} bold={f.bold} color={C.green} bg="#6EE7B7" />
              ))}
            </div>
          </div>

        </div>

        {/* Sync strip */}
        <div style={{
          maxWidth: 760, margin: "36px auto 0",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "20px 28px",
          display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,.05)",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, flexShrink: 0,
            background: "linear-gradient(135deg, #EEF2FE, #DBEAFE)",
            border: "1px solid #BFDBFE",
            display: "grid", placeItems: "center",
          }}>
            <RefreshCw size={19} strokeWidth={1.8} style={{ color: C.blue }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: 4 }}>
              Ambas partes se sincronizan automáticamente.
            </div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 400, lineHeight: 1.5 }}>
              Vendé en tu local, controlá desde donde estés.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
