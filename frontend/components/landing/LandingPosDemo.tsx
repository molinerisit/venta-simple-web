"use client";
import { useEffect, useRef, useState } from "react";
import { Usb, Receipt, Wifi } from "lucide-react";
import { C, T } from "./tokens";

const PRODS = [
  { name: "Coca-Cola 1.5L",  code: "7790338019411", price: "$950",   total: "$950",   amount: 950  },
  { name: "Galletitas Oreo", code: "7790315181030", price: "$480",   total: "$480",   amount: 480  },
  { name: "Yerba Mate 500g", code: "7790387019020", price: "$1.450", total: "$1.450", amount: 1450 },
];

const SUMS = [950, 1430, 2880];
const fmt  = (n: number) => `$${n.toLocaleString("es-AR")}`;

type Step =
  | "idle"
  | "scan1" | "add1"
  | "scan2" | "add2"
  | "scan3" | "add3"
  | "pay" | "confirm" | "success" | "print";

const NAV = ["Dashboard", "Caja", "Productos", "Ventas", "Reportes"];

export default function LandingPosDemo() {
  const [step, setStep]   = useState<Step>("idle");
  const [cartN, setCartN] = useState(0);
  const timers            = useRef<ReturnType<typeof setTimeout>[]>([]);

  const at = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  useEffect(() => {
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setStep("idle");
      setCartN(0);

      at(() => setStep("scan1"),                        1000);
      at(() => { setStep("add1"); setCartN(1); },       1900);
      at(() => setStep("scan2"),                        3400);
      at(() => { setStep("add2"); setCartN(2); },       4300);
      at(() => setStep("scan3"),                        5800);
      at(() => { setStep("add3"); setCartN(3); },       6700);
      at(() => setStep("pay"),                          7700);
      at(() => setStep("confirm"),                      8800);
      at(() => setStep("success"),                      9400);
      at(() => setStep("print"),                       10300);
      at(run,                                          14000);
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanning  = step === "scan1" || step === "scan2" || step === "scan3";
  const paid      = step === "pay" || step === "confirm" || step === "success" || step === "print";
  const showOk    = step === "success" || step === "print";
  const total     = cartN > 0 ? fmt(SUMS[cartN - 1]) : "$0";

  const newRowIdx =
    step === "add1" ? 0 :
    step === "add2" ? 1 :
    step === "add3" ? 2 : -1;

  return (
    <section style={{ background: C.bgAlt, padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ ...T.label, marginBottom: 12 }}>En acción</div>
          <h2 style={{ ...T.h2, margin: "0 0 12px" }}>
            Cobrá en menos de 10 segundos.
          </h2>
          <p style={{ fontSize: 16, color: C.muted, fontWeight: 500, margin: "0 0 10px" }}>
            Menos clics, menos espera, menos errores en caja.
          </p>
          <p style={{ fontSize: 13, color: C.light, fontWeight: 500, margin: 0 }}>
            Cada segundo menos en caja es una fila más corta y más ventas cerradas.
          </p>
        </div>

        {/* PC frame */}
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div style={{
            borderRadius: 12, overflow: "hidden",
            border: "1px solid #CBD5E1",
            boxShadow: "0 24px 64px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.08)",
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
                {["#EF4444", "#F59E0B", "#22C55E"].map((bg, i) => (
                  <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: bg, opacity: .7 }} />
                ))}
              </div>
            </div>

            {/* App body */}
            <div className="l-pos-demo-frame">

              {/* Sidebar */}
              <div className="l-pos-sidebar" style={{
                background: "#0F172A", padding: "14px 10px",
                flexDirection: "column", gap: 2, borderRight: "1px solid rgba(255,255,255,.06)",
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
                    display: "flex", alignItems: "center", gap: 7,
                  }}>
                    <span style={{ fontSize: 9, fontWeight: label === "Caja" ? 700 : 500, color: label === "Caja" ? "#93C5FD" : "rgba(255,255,255,.38)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Center: search + cart */}
              <div style={{
                display: "flex", flexDirection: "column", gap: 10, padding: "14px 12px",
                position: "relative", overflow: "hidden",
              }}>

                {/* Search / scanner bar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#fff",
                    border: `2px solid ${scanning ? "#2563EB" : "#E2E8F0"}`,
                    borderRadius: 10, padding: "9px 12px",
                    boxShadow: scanning ? "0 0 0 3px rgba(37,99,235,.12)" : "0 1px 3px rgba(0,0,0,.05)",
                    transition: "border-color .18s, box-shadow .18s",
                  }}>
                    {/* Search icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={scanning ? "#2563EB" : "#94A3B8"} strokeWidth="2.5"
                      style={{ flexShrink: 0, transition: "stroke .18s" }}>
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>

                    <span style={{
                      flex: 1, fontSize: 12,
                      color: scanning ? "#2563EB" : "#94A3B8",
                      fontWeight: scanning ? 600 : 400,
                      transition: "color .18s",
                    }}>
                      {scanning ? "Escaneando código de barras..." : "Escanear o buscar producto..."}
                    </span>

                    {/* Barcode scanner icon */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 3,
                      opacity: scanning ? 1 : 0.4, transition: "opacity .2s",
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke={scanning ? "#2563EB" : "#94A3B8"} strokeWidth="2"
                        style={{ transition: "stroke .18s" }}>
                        <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14"/>
                      </svg>
                    </div>
                  </div>

                  {/* Laser sweep */}
                  {scanning && (
                    <div
                      key={step}
                      className="pos-laser"
                      style={{
                        position: "absolute", bottom: -1, left: 12, right: 12, height: 2,
                        background: "linear-gradient(90deg, transparent, #2563EB 40%, #2563EB 60%, transparent)",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </div>

                {/* Cart table */}
                <div style={{
                  flex: 1, background: "#fff", borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                }}>
                  {/* Table header */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 48px 80px 80px",
                    padding: "7px 12px", borderBottom: "2px solid #E2E8F0", background: "#F8FAFC",
                  }}>
                    {["Producto", "Cant.", "P. Unit.", "Subtotal"].map(h => (
                      <span key={h} style={{ fontSize: 8.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    {cartN === 0 && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        <span style={{ fontSize: 10.5, color: "#94A3B8" }}>Carrito vacío</span>
                      </div>
                    )}
                    {PRODS.slice(0, cartN).map((p, i) => (
                      <div
                        key={p.code}
                        className={i === newRowIdx ? "pos-row-new" : undefined}
                        style={{
                          display: "grid", gridTemplateColumns: "1fr 48px 80px 80px",
                          padding: "8px 12px", borderBottom: "1px solid #F1F5F9", alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#1E293B" }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: "#64748B" }}>1</span>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{p.price}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1E293B" }}>{p.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total bar */}
                <div style={{
                  background: "#1E293B", borderRadius: 9, padding: "9px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>
                    Ítems: {cartN}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      TOTAL
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", transition: "all .3s" }}>
                      {total}
                    </span>
                  </div>
                </div>

                {/* Success overlay */}
                {showOk && (
                  <div className="pos-success" style={{
                    position: "absolute", inset: 0, background: "rgba(5,150,105,.93)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%", background: "#fff",
                      display: "grid", placeItems: "center",
                      boxShadow: "0 0 0 8px rgba(255,255,255,.15)",
                    }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>¡Venta registrada!</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>{fmt(SUMS[2])}</div>
                    </div>
                    {step === "print" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2.5">
                          <polyline points="6 9 6 2 18 2 18 9"/>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                          <rect x="6" y="14" width="12" height="8"/>
                        </svg>
                        <span style={{ fontSize: 10.5, color: "rgba(255,255,255,.75)", fontWeight: 600 }}>Imprimiendo ticket...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: payment + printer */}
              <div className="l-pos-payment-panel" style={{
                background: "#fff", borderLeft: "1px solid #E2E8F0",
                padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10,
              }}>
                {/* Payment methods */}
                <div>
                  <div style={{ fontSize: 8.5, fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 7 }}>
                    Medio de pago
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {["Efectivo", "Débito", "Crédito", "Mercado Pago QR"].map(m => (
                      <div key={m} style={{
                        padding: "8px 10px", borderRadius: 7,
                        border: `1.5px solid ${paid && m === "Efectivo" ? "#2563EB" : "#E2E8F0"}`,
                        background: paid && m === "Efectivo" ? "#EFF6FF" : "#F8FAFC",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        transition: "all .25s",
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: paid && m === "Efectivo" ? "#1D4ED8" : "#64748B" }}>
                          {m}
                        </span>
                        {paid && m === "Efectivo" && (
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563EB" }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen */}
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "9px 10px", border: "1px solid #E2E8F0" }}>
                  {[
                    { label: "Subtotal", val: total, muted: true },
                    { label: "Total",    val: total, muted: false },
                  ].map(({ label, val, muted }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: muted ? 4 : 0 }}>
                      <span style={{ fontSize: muted ? 9.5 : 11, color: muted ? "#94A3B8" : "#1E293B", fontWeight: muted ? 500 : 800 }}>{label}</span>
                      <span style={{ fontSize: muted ? 9.5 : 13, color: muted ? "#64748B" : "#1E293B", fontWeight: 700, letterSpacing: "-0.02em" }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Confirm button */}
                <button style={{
                  padding: "11px 10px", borderRadius: 9, border: "none",
                  background: showOk ? "#059669" : step === "confirm" ? "#1D4ED8" : "#2563EB",
                  color: "#fff", fontWeight: 800, fontSize: 12,
                  cursor: "default", letterSpacing: "-0.01em",
                  transform: step === "confirm" ? "scale(0.97)" : "scale(1)",
                  transition: "all .2s",
                  boxShadow: showOk
                    ? "0 4px 12px rgba(5,150,105,.4)"
                    : "0 4px 12px rgba(37,99,235,.35)",
                }}>
                  {showOk ? "✓ Venta confirmada" : "Confirmar venta"}
                </button>

                {/* Thermal printer */}
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 8.5, color: "#94A3B8", fontWeight: 600, marginBottom: 6, textAlign: "center" }}>
                    Impresora térmica
                  </div>

                  {/* Printer body */}
                  <div style={{
                    width: 100, background: "#E2E8F0", borderRadius: "8px 8px 0 0",
                    padding: "7px 10px 5px", border: "1px solid #CBD5E1", borderBottom: "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: step === "print" ? "#22C55E" : "#94A3B8",
                      transition: "background .3s",
                    }} />
                    <div style={{ flex: 1, height: 3, background: "#CBD5E1", borderRadius: 2, margin: "0 6px" }} />
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: step === "print" ? "#22C55E" : "#94A3B8",
                      transition: "background .3s",
                    }} />
                  </div>

                  {/* Paper slot */}
                  <div style={{
                    width: 100, height: 6, background: "#94A3B8", borderRadius: "0 0 3px 3px",
                    border: "1px solid #CBD5E1", borderTop: "none",
                    position: "relative",
                  }}>
                    {/* Ticket paper */}
                    {step === "print" && (
                      <div className="pos-paper" style={{
                        position: "absolute", top: "100%", left: "10%", right: "10%",
                        background: "#fff", border: "1px solid #E2E8F0", borderTop: "none",
                        padding: "5px 7px", display: "flex", flexDirection: "column", gap: 2,
                        overflow: "hidden",
                      }}>
                        <div style={{ fontSize: 6.5, fontWeight: 900, color: "#1E293B", textAlign: "center", marginBottom: 1 }}>VentaSimple</div>
                        <div style={{ height: 1, background: "#E2E8F0" }} />
                        {PRODS.map(p => (
                          <div key={p.code} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 6, color: "#64748B" }}>{p.name}</span>
                            <span style={{ fontSize: 6, fontWeight: 700, color: "#1E293B" }}>{p.price}</span>
                          </div>
                        ))}
                        <div style={{ height: 1, background: "#E2E8F0", marginTop: 2 }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 7, fontWeight: 800, color: "#1E293B" }}>TOTAL</span>
                          <span style={{ fontSize: 7, fontWeight: 900, color: "#1E293B" }}>{fmt(SUMS[2])}</span>
                        </div>
                        <div style={{ fontSize: 5.5, color: "#94A3B8", textAlign: "center", marginTop: 2 }}>Gracias por su compra</div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 24 }}>
          {([
            { Icon: Usb,     label: "Compatible con lector USB" },
            { Icon: Receipt, label: "Impresora térmica"         },
            { Icon: Wifi,    label: "Funciona sin internet"     },
          ] as const).map(({ Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.muted, fontWeight: 600 }}>
              <Icon size={15} strokeWidth={1.8} style={{ color: C.blue, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
