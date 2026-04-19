import Image from "next/image";
import Link from "next/link";
import { C } from "@/components/landing/tokens";
import LandingNavbar      from "@/components/landing/LandingNavbar";
import LandingHero        from "@/components/landing/LandingHero";
import LandingStats       from "@/components/landing/LandingStats";
import LandingProblem     from "@/components/landing/LandingProblem";
import LandingSolucion    from "@/components/landing/LandingSolucion";
import LandingCambio      from "@/components/landing/LandingCambio";
import LandingFeatures    from "@/components/landing/LandingFeatures";
import LandingPosDemo     from "@/components/landing/LandingPosDemo";
import LandingLocal       from "@/components/landing/LandingLocal";
import LandingSteps       from "@/components/landing/LandingSteps";
import LandingSupport     from "@/components/landing/LandingSupport";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingPricing     from "@/components/landing/LandingPricing";
import LandingFaq         from "@/components/landing/LandingFaq";
import LandingFinalCta    from "@/components/landing/LandingFinalCta";

const FOOTER_LINKS = [
  { label: "Cómo funciona", href: "#como-funciona", ext: false },
  { label: "Precios",       href: "#pricing",       ext: false },
  { label: "FAQ",           href: "#faq",           ext: false },
  { label: "Privacidad",    href: "/privacidad",    ext: true  },
  { label: "Términos",      href: "/terminos",      ext: true  },
  { label: "Contacto",      href: "mailto:ventas@ventasimple.app", ext: true },
];

export default function LandingPage() {
  return (
    <div className="vs-landing">
      <LandingNavbar />
      <LandingHero />
      <LandingPosDemo />
      <LandingStats />
      <LandingProblem />
      <LandingSolucion />
      <LandingCambio />
      <LandingFeatures />
      <LandingLocal />
      <LandingSteps />
      <LandingSupport />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFaq />
      <LandingFinalCta />

      <footer style={{ background: "#071429", borderTop: "1px solid rgba(255,255,255,.08)", padding: "36px 0" }}>
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ marginBottom: 8 }}>
              <Image src="/brand/logoletras.png" alt="VentaSimple" width={320} height={100}
                style={{ height: 32, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1) opacity(.75)" }} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.28)" }}>
              © {new Date().getFullYear()} Venta Simple · Soporte 24/7 disponible
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {FOOTER_LINKS.map(l => (
              l.ext
                ? <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.32)", textDecoration: "none" }}>{l.label}</Link>
                : <a key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.32)", textDecoration: "none" }}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
