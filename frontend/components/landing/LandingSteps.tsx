"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UserPlus, Wrench, ShoppingCart } from "lucide-react";
import { C, T } from "./tokens";

const STEPS = [
  {
    n: 1,
    icon: UserPlus,
    title: "Creá tu cuenta",
    sub: "2 minutos. Sin tarjeta.",
    badge: null,
    highlight: false,
  },
  {
    n: 2,
    icon: Wrench,
    title: "Lo dejamos funcionando",
    sub: "Nosotros lo configuramos con vos.",
    badge: "Incluido en el plan",
    highlight: true,
  },
  {
    n: 3,
    icon: ShoppingCart,
    title: "Empezá a cobrar",
    sub: "Primera venta el mismo día.",
    badge: null,
    highlight: false,
  },
];

export default function LandingSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="como-funciona"
      ref={ref}
      style={{ background: C.bgAlt, padding: "112px 0", borderTop: `1px solid ${C.border}` }}
    >
      <div className="l-container" style={{ maxWidth: 880 }}>

        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: 72,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <div style={{ ...T.label, marginBottom: 16 }}>Simple de arrancar</div>
          <h2 style={{ ...T.h2, margin: "0 0 14px" }}>
            Instalás hoy.<br />Vendés hoy.
          </h2>
          <p style={{ fontSize: 17, color: C.muted, fontWeight: 500, margin: "0 auto", maxWidth: 360 }}>
            Sin técnicos. Sin vueltas.<br />En 5 minutos estás listo.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>

          {/* Connecting line — desktop only */}
          <div className="l-steps-line-track">
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg, ${C.blue}, ${C.orange})`,
              width: visible ? "100%" : "0%",
              transition: "width 1.1s cubic-bezier(.4,0,.2,1) 0.45s",
              borderRadius: 1,
            }} />
          </div>

          {/* Steps row */}
          <div className="l-steps-timeline-grid">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.n} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${0.28 + i * 0.14}s, transform 0.5s ease ${0.28 + i * 0.14}s`,
                }}>

                  {/* Node */}
                  <div className={s.highlight ? "l-steps-node-highlight" : "l-steps-node"} style={{
                    width: s.highlight ? 80 : 64,
                    height: s.highlight ? 80 : 64,
                    borderRadius: "50%",
                    background: s.highlight ? C.orange : C.surface,
                    border: `2px solid ${s.highlight ? C.orange : C.border}`,
                    display: "grid", placeItems: "center",
                    marginBottom: 20,
                    boxShadow: s.highlight
                      ? "0 10px 36px rgba(249,115,22,.40), 0 2px 8px rgba(249,115,22,.15)"
                      : "0 2px 12px rgba(0,0,0,.06)",
                    position: "relative", zIndex: 1,
                  }}>
                    <Icon
                      size={s.highlight ? 28 : 22}
                      style={{ color: s.highlight ? "#fff" : C.muted }}
                    />

                    {/* Step number */}
                    <div style={{
                      position: "absolute", top: -7, right: -7,
                      width: 22, height: 22, borderRadius: "50%",
                      background: s.highlight ? "#fff" : C.bgAlt,
                      border: `2px solid ${s.highlight ? C.orange : C.border}`,
                      display: "grid", placeItems: "center",
                      fontSize: 9, fontWeight: 900,
                      color: s.highlight ? C.orange : C.light,
                    }}>
                      {s.n}
                    </div>
                  </div>

                  {/* Badge (step 2) */}
                  {s.badge && (
                    <div style={{
                      padding: "3px 10px", borderRadius: 999, marginBottom: 10,
                      background: C.orangeBg, border: `1px solid ${C.orangeBdr}`,
                      fontSize: 11, fontWeight: 700, color: C.orange,
                    }}>
                      {s.badge}
                    </div>
                  )}

                  {/* Title */}
                  <div style={{
                    fontSize: s.highlight ? 18 : 15,
                    fontWeight: 800,
                    color: C.text,
                    letterSpacing: "-0.02em",
                    marginBottom: 7,
                    lineHeight: 1.2,
                  }}>
                    {s.title}
                  </div>

                  {/* Sub */}
                  <div style={{
                    fontSize: 13, color: C.muted, fontWeight: 500,
                    lineHeight: 1.55, maxWidth: 190,
                  }}>
                    {s.sub}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Fear eliminator + CTA */}
        <div style={{
          textAlign: "center", marginTop: 56,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(12px)",
          transition: "opacity 0.5s ease 0.85s, transform 0.5s ease 0.85s",
        }}>
          <p style={{
            fontSize: 15, color: C.muted, fontWeight: 600,
            margin: "0 0 28px", fontStyle: "italic",
          }}>
            "No lo hacés solo. Lo dejamos funcionando con vos."
          </p>

          <Link
            href="/registro"
            className="l-steps-cta"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 34px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: C.orange, color: "#fff", textDecoration: "none",
              boxShadow: "0 6px 24px rgba(249,115,22,.30)",
            }}
          >
            Empezar ahora — en 5 minutos estás vendiendo →
          </Link>
        </div>

      </div>
    </section>
  );
}
