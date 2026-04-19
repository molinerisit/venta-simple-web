import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { C } from "./tokens";

export default function LandingFinalCta() {
  return (
    <section style={{ background: C.heroBg, padding: "96px 0" }}>
      <div className="l-container" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
          color: "rgba(255,255,255,.40)",
        }}>
          Cada día que esperás es un día más manejando a ojo.
        </div>

        <h2 style={{
          fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 900,
          letterSpacing: "-0.04em", color: "#fff",
          margin: "0 0 18px", lineHeight: 1.08,
        }}>
          ¿Cuánto más vas a esperar<br />para controlar tu negocio de verdad?
        </h2>

        <p style={{ fontSize: 16, color: "rgba(255,255,255,.55)", lineHeight: 1.75, margin: "0 auto 40px", maxWidth: 460 }}>
          Más de 500 negocios ya arrancaron.<br />
          7 días de prueba gratis. Sin tarjeta. Sin riesgo.<br />
          Si no convence, no cobramos nada.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 34px", borderRadius: 9, fontWeight: 800, fontSize: 15,
            background: C.orange, color: "#fff", textDecoration: "none",
            letterSpacing: "-0.02em",
          }}>
            Empezar gratis ahora <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 24px" }}>
          {["7 días de prueba del plan completo", "Sin tarjeta de crédito", "Soporte 24/7 desde el primer día"].map(t => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.35)" }}>
              <Check size={11} strokeWidth={3} style={{ color: "#22C55E" }} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
