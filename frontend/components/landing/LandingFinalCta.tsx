import Link from "next/link";
import { ArrowRight, Download, Check } from "lucide-react";
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
          Soporte 24/7 incluido desde el día uno
        </div>

        <h2 style={{
          fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 900,
          letterSpacing: "-0.04em", color: "#fff",
          margin: "0 0 18px", lineHeight: 1.08,
        }}>
          Tu negocio merece<br />un sistema a la altura.
        </h2>

        <p style={{ fontSize: 16, color: "rgba(255,255,255,.55)", lineHeight: 1.75, margin: "0 auto 40px", maxWidth: 460 }}>
          Empezá gratis hoy. Sin tarjeta, sin compromisos. Y con soporte real para que nunca estés solo ante un problema.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 34px", borderRadius: 9, fontWeight: 800, fontSize: 15,
            background: C.orange, color: "#fff", textDecoration: "none",
            letterSpacing: "-0.02em",
            boxShadow: "0 8px 32px rgba(249,115,22,.40)",
          }}>
            Empezar gratis ahora <ArrowRight size={15} />
          </Link>
          <Link href="/descargar" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 26px", borderRadius: 9, fontWeight: 600, fontSize: 14,
            background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.80)",
            textDecoration: "none", border: "1px solid rgba(255,255,255,.14)",
          }}>
            <Download size={14} />
            Descargar la app
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 24px" }}>
          {["Sin tarjeta de crédito", "Cancelás cuando querés", "Soporte 24/7 incluido"].map(t => (
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
