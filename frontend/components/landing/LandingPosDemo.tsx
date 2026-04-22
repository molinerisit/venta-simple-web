"use client";
import { useEffect, useRef, useState } from "react";
import { Usb, Receipt, Smile } from "lucide-react";
import { C, T } from "./tokens";

const PRODS = [
  { name: "Coca-Cola 1.5L",  price: "$950",   amount: 950  },
  { name: "Galletitas Oreo", price: "$480",   amount: 480  },
  { name: "Yerba Mate 500g", price: "$1.450", amount: 1450 },
];
const SUMS = [950, 1430, 2880];
const fmt  = (n: number) => `$${n.toLocaleString("es-AR")}`;

type Step = "idle" | "scan1" | "add1" | "scan2" | "add2" | "scan3" | "add3"
           | "enter" | "confirm" | "success";

const NAV      = ["Dashboard", "Caja", "Productos", "Ventas", "Reportes"];
const PAY_OPTS = ["Efectivo", "Débito", "Crédito", "Mercado Pago QR"];

export default function LandingPosDemo() {
  const [step, setStep]   = useState<Step>("idle");
  const [cartN, setCartN] = useState(0);
  const timers            = useRef<ReturnType<typeof setTimeout>[]>([]);

  const at = (fn: () => void, ms: number) =>
    timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setStep("idle"); setCartN(0);

      at(() => setStep("scan1"),                        700);
      at(() => { setStep("add1"); setCartN(1); },      1400);
      at(() => setStep("scan2"),                        2500);
      at(() => { setStep("add2"); setCartN(2); },      3200);
      at(() => setStep("scan3"),                        4300);
      at(() => { setStep("add3"); setCartN(3); },      5000);
      at(() => setStep("enter"),                        5700);
      at(() => setStep("confirm"),                      6100);
      at(() => setStep("success"),                      6600);
      at(run,                                           8400);
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanning  = step === "scan1" || step === "scan2" || step === "scan3";
  const showOk    = step === "success";
  const pressing  = step === "confirm";
  const total     = cartN > 0 ? fmt(SUMS[cartN - 1]) : "$0";
  const newRowIdx = step === "add1" ? 0 : step === "add2" ? 1 : step === "add3" ? 2 : -1;

  return (
    <section style={{ background: C.bgAlt, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container" style={{ maxWidth: 960 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ ...T.label, marginBottom: 12 }}>En acción</div>
          <h2 style={{ ...T.h2, margin: "0 0 10px" }}>
            Cobrás en menos de 10 segundos.
          </h2>
          <p style={{ fontSize: 16, color: C.muted, fontWeight: 600, margin: "0 0 4px" }}>
            Menos clics, menos espera, menos errores en caja.
          </p>
          <p style={{ fontSize: 13, color: C.light, fontWeight: 400, margin: 0 }}>
            Cada segundo menos en caja es una fila más corta y más ventas cerradas.
          </p>
        </div>

        {/* PC frame */}
        <div style={{
          maxWidth: 960, margin: "0 auto",
          borderRadius: 12, overflow: "hidden",
          border: "1px solid #CBD5E1",
          boxShadow: "0 24px 64px rgba(0,0,0,.13), 0 4px 16px rgba(0,0,0,.07)",
        }}>
          {/* Title bar */}
          <div style={{
            background: "#1E293B", padding: "9px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                VentaSimple — Punto de Venta
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span className="sync-dot" />
                <span style={{ fontSize: 8.5, color: "#4ADE80", fontWeight: 700 }}>Caja abierta</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {["#EF4444","#F59E0B","#22C55E"].map((bg, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: bg, opacity: .7 }} />
              ))}
            </div>
          </div>

          {/* App body: sidebar + center + payment panel */}
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 190px", height: 360 }}>

            {/* Sidebar */}
            <div style={{
              background: "#0F172A", padding: "14px 10px",
              display: "flex", flexDirection: "column", gap: 2,
              borderRight: "1px solid rgba(255,255,255,.06)",
            }}>
              <div style={{ padding: "4px 8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>VentaSimple</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,.35)", marginTop: 2 }}>Almacén San Martín</div>
              </div>
              {NAV.map(label => (
                <div key={label} style={{
                  padding: "7px 8px", borderRadius: 7,
                  background: label === "Caja" ? "rgba(37,99,235,.25)" : "transparent",
                  borderLeft: label === "Caja" ? "2px solid #2563EB" : "2px solid transparent",
                }}>
                  <span style={{ fontSize: 9, fontWeight: label === "Caja" ? 700 : 500, color: label === "Caja" ? "#93C5FD" : "rgba(255,255,255,.38)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Center: scanner + cart */}
            <div style={{
              display: "flex", flexDirection: "column", gap: 10,
              padding: "14px", position: "relative", overflow: "hidden",
              background: "#F8FAFC", borderRight: "1px solid #E2E8F0",
            }}>
              {/* Scanner bar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, background: "#fff",
                  border: `2px solid ${scanning ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: 10, padding: "9px 12px",
                  boxShadow: scanning ? "0 0 0 3px rgba(37,99,235,.12)" : "0 1px 3px rgba(0,0,0,.05)",
                  transition: "border-color .18s, box-shadow .18s",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={scanning ? "#2563EB" : "#94A3B8"} strokeWidth="2.5" style={{ flexShrink: 0, transition: "stroke .18s" }}>
                    <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14"/>
                  </svg>
                  <span style={{
                    flex: 1, fontSize: 12,
                    color: scanning ? "#2563EB" : "#94A3B8",
                    fontWeight: scanning ? 600 : 400,
                    transition: "color .18s",
                  }}>
                    {scanning ? "Escaneando código de barras..." : "Listo para escanear..."}
                  </span>
                  {scanning && (
                    <span style={{ fontSize: 8, fontWeight: 800, color: "#2563EB", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      SCAN
                    </span>
                  )}
                </div>
                {scanning && (
                  <div key={step} className="pos-laser" style={{
                    position: "absolute", bottom: -1, left: 12, right: 12, height: 2,
                    background: "linear-gradient(90deg, transparent, #2563EB 35%, #60A5FA 50%, #2563EB 65%, transparent)",
                    borderRadius: 1,
                  }} />
                )}
              </div>

              {/* Cart table */}
              <div style={{
                flex: 1, background: "#fff", borderRadius: 10,
                border: "1px solid #E2E8F0", display: "flex", flexDirection: "column",
                overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)",
              }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 60px 72px",
                  padding: "7px 12px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC",
                }}>
                  {["Producto","P. Unit.","Subtotal"].map(h => (
                    <span key={h} style={{ fontSize: 8.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
                  ))}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  {cartN === 0 ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>Carrito vacío</span>
                    </div>
                  ) : (
                    PRODS.slice(0, cartN).map((p, i) => (
                      <div key={p.name}
                        className={i === newRowIdx ? "pos-row-new" : undefined}
                        style={{
                          display: "grid", gridTemplateColumns: "1fr 60px 72px",
                          padding: "9px 12px", borderBottom: "1px solid #F1F5F9", alignItems: "center",
                          background: i === newRowIdx ? "#EFF6FF" : "transparent",
                          transition: "background .8s ease",
                        }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#1E293B" }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{p.price}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1E293B" }}>{p.price}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Success overlay */}
              {showOk && (
                <div className="pos-success" style={{
                  position: "absolute", inset: 0,
                  backdropFilter: "blur(2px)",
                  background: "rgba(5,150,105,.88)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 12,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", background: "#fff",
                    display: "grid", placeItems: "center",
                    boxShadow: "0 0 0 10px rgba(255,255,255,.15)",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)", marginBottom: 4 }}>¡Venta registrada!</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.05em" }}>{fmt(SUMS[2])}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Payment panel */}
            <div style={{
              background: "#fff", padding: "14px 14px",
              display: "flex", flexDirection: "column", gap: 10,
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{ fontSize: 8.5, fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Medio de pago
              </div>

              {/* Payment options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {PAY_OPTS.map((opt, i) => {
                  const sel = i === 0;
                  return (
                    <div key={opt} style={{
                      padding: "8px 10px", borderRadius: 7,
                      border: `1px solid ${sel ? "#2563EB" : "#E5E7EB"}`,
                      background: sel ? "#EFF6FF" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "default",
                    }}>
                      <span style={{ fontSize: 11, fontWeight: sel ? 700 : 500, color: sel ? "#1D4ED8" : "#374151" }}>{opt}</span>
                      {sel && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563EB" }} />}
                    </div>
                  );
                })}
              </div>

              {/* Subtotal / Total */}
              <div style={{ marginTop: 4, paddingTop: 10, borderTop: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>Subtotal</span>
                  <span style={{ fontSize: 10, color: "#374151", fontWeight: 600 }}>{total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em" }}>{total}</span>
                </div>
              </div>

              {/* Confirm button */}
              <button style={{
                padding: "9px 0", borderRadius: 8, border: "none",
                background: showOk ? "#059669" : pressing ? "#1D4ED8" : "#2563EB",
                color: "#fff", fontWeight: 800, fontSize: 12,
                cursor: "default", letterSpacing: "-0.01em", width: "100%",
                transform: pressing ? "scale(0.97)" : "scale(1)",
                transition: "all .2s",
                boxShadow: showOk ? "0 4px 14px rgba(5,150,105,.4)" : "0 4px 14px rgba(37,99,235,.35)",
              }}>
                {showOk ? "✓ Venta confirmada" : "Confirmar venta"}
              </button>

            </div>

          </div>
        </div>

        {/* Trust strip */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginTop: 18 }}>
          {([
            { Icon: Usb,     label: "Compatible con lector USB" },
            { Icon: Receipt, label: "Impresora térmica" },
            { Icon: Smile,   label: "Fácil de usar" },
          ] as const).map(({ Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.light, fontWeight: 500 }}>
              <Icon size={13} strokeWidth={1.8} style={{ color: C.blue, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
