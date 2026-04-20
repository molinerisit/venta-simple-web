"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, TrendingUp, QrCode, Brain, Package, Wallet } from "lucide-react";
import { C, T } from "./tokens";

const CHECKS_TRANS = [
  "Ves las transferencias que entran en tiempo real",
  "Todo directo en la PC — sin usar el celular",
  "El cajero solo ve los pagos que entran, sin acceso a tu cuenta de Mercado Pago",
];

const STEPS_QR = [
  { n: "1", text: "Escaneás los productos" },
  { n: "2", text: "El sistema genera el cobro" },
  { n: "3", text: "El cliente paga" },
];

const UPDATES = [
  "Cobro automático con QR — sin escribir montos",
  "Base de +10.000 productos listos",
  "IA que analiza tu negocio en tiempo real",
  "Transferencias sin usar el celular",
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map(item => (
        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
          <Check size={13} strokeWidth={3} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ArrowItems({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(item => (
        <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, color: C.text }}>
          <span style={{ color: C.orange, fontSize: 16, lineHeight: 1 }}>→</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealDiv({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function LandingFeatures() {
  return (
    <section style={{ background: C.surface, padding: "112px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="l-container">

        {/* Header */}
        <RevealDiv style={{ marginBottom: 56 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Diferenciales</div>
          <h2 style={{ ...T.h2, margin: "0 0 16px", maxWidth: 560 }}>
            No es otro sistema de caja.
          </h2>
          <p style={{ ...T.body, maxWidth: 480, margin: 0 }}>
            VentaSimple hace cosas que otros sistemas directamente no pueden.
          </p>
        </RevealDiv>

        {/* Block 1: Mercado Pago */}
        <RevealDiv delay={80} style={{ marginBottom: 14 }}>
          <div className="l-feat-mp-block" style={{
            background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "36px 40px",
            transition: "box-shadow .25s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: "#009EE3", display: "grid", placeItems: "center",
              }}>
                <Wallet size={26} strokeWidth={2} style={{ color: "#fff" }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.orange }}>
                Integración con Mercado Pago
              </span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.muted, margin: "0 0 24px" }}>
              Para que puedas:
            </p>

            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />

            <div className="l-feat-mp-sub">

              {/* Sub 1: QR */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: C.orangeBg, border: `1px solid ${C.orangeBdr}`,
                    display: "grid", placeItems: "center",
                  }}>
                    <QrCode size={22} strokeWidth={2} style={{ color: C.orange }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 900, color: C.text, letterSpacing: "-0.01em" }}>Cobrás con QR en segundos.</span>
                </div>
                <p style={{ fontSize: 13, color: C.light, fontWeight: 600, margin: "0 0 20px" }}>
                  Sin escribir. Sin errores. Sin vueltas.
                </p>

                <div style={{ display: "flex", flexDirection: "column" as const }}>
                  {STEPS_QR.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 99,
                          background: C.orange, color: "#fff",
                          display: "grid", placeItems: "center",
                          fontSize: 11, fontWeight: 900, flexShrink: 0,
                        }}>
                          {s.n}
                        </div>
                        {i < STEPS_QR.length - 1 && (
                          <div style={{ width: 2, height: 20, background: C.border, margin: "4px 0" }} />
                        )}
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, paddingTop: 4, lineHeight: 1.45 }}>
                        {s.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="l-feat-mp-divider" style={{ width: 1, background: C.border, alignSelf: "stretch" }} />

              {/* Sub 2: Transfers */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenBg, border: `1px solid ${C.greenBdr}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <TrendingUp size={20} strokeWidth={2.5} style={{ color: C.green }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 900, color: C.text, letterSpacing: "-0.01em" }}>Ves las transferencias en tiempo real</span>
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px", lineHeight: 1.65 }}>
                  Sin abrir el celular. Sin darle acceso a tu cuenta al cajero. Solo ves los pagos que entran — directo en la PC de caja.
                </p>
                <CheckList items={CHECKS_TRANS} />
              </div>
            </div>
          </div>
        </RevealDiv>

        {/* Blocks 2 + 3 */}
        <div className="l-feat-cards" style={{ marginBottom: 14 }}>

          {/* Block 2: Productos */}
          <RevealDiv delay={100}>
            <div className="l-feat-diff-card" style={{
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: "36px 32px",
              height: "100%", boxSizing: "border-box",
              transition: "box-shadow .2s, transform .2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: C.blueBg, border: `1px solid rgba(30,58,138,.15)`,
                  display: "grid", placeItems: "center",
                }}>
                  <Package size={18} strokeWidth={2} style={{ color: C.blue }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.blue }}>
                  Base de datos
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 10px" }}>
                No cargás productos.<br />Ya están.
              </h3>
              <p style={{ ...T.body, fontSize: 14, margin: "0 0 20px", lineHeight: 1.7 }}>
                Más de <strong>10.000 productos listos para usar</strong>.<br />
                Buscás. Seleccionás. Vendés.
              </p>
              <ArrowItems items={["Empezás a vender desde el día 1"]} />
            </div>
          </RevealDiv>

          {/* Block 3: IA Kairos */}
          <RevealDiv delay={160}>
            <div className="l-feat-diff-card" style={{
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: "36px 32px",
              height: "100%", boxSizing: "border-box",
              transition: "box-shadow .2s, transform .2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: C.blueBg, border: `1px solid rgba(30,58,138,.15)`,
                  display: "grid", placeItems: "center",
                }}>
                  <Brain size={18} strokeWidth={2} style={{ color: C.blue }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.blue }}>
                  Inteligencia artificial
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 10px" }}>
                Sabés qué te hace<br />ganar más plata.
              </h3>
              <p style={{ ...T.body, fontSize: 14, margin: "0 0 20px", lineHeight: 1.7 }}>
                <strong>Kairos</strong> analiza tus ventas y te dice:
              </p>
              <ArrowItems items={[
                "qué productos te convienen",
                "qué te falta reponer",
                "dónde estás perdiendo plata",
              ]} />
            </div>
          </RevealDiv>
        </div>

        {/* En constante evolución */}
        <RevealDiv delay={120} style={{ marginBottom: 48 }}>
          <div className="l-feat-updates" style={{
            background: C.heroBg, borderRadius: 20,
            padding: "36px 40px",
          }}>
            <div>
              <div style={{ ...T.label, color: "rgba(255,255,255,.3)", marginBottom: 12 }}>Actualizaciones</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 10px" }}>
                En constante evolución
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>Siempre estamos mejorando el sistema.</span>
                <br />
                <span style={{ color: "rgba(255,255,255,.45)" }}>Y vos lo aprovechás sin hacer nada.</span>
              </p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {UPDATES.map((u, i) => (
                <li key={u} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="l-feat-badge-pulse" style={{
                    fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                    background: C.orange, color: "#fff", padding: "3px 9px", borderRadius: 4,
                    flexShrink: 0,
                    animationDelay: `${i * 0.4}s`,
                  }}>
                    Nuevo
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.5 }}>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealDiv>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 9, fontWeight: 700, fontSize: 14,
            background: C.orange, color: "#fff", textDecoration: "none",
          }}>
            Empezar gratis <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
