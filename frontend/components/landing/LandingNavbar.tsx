import Link from "next/link";
import Image from "next/image";
import { C, T } from "./tokens";

export default function LandingNavbar() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(248,247,244,.93)",
      borderBottom: `1px solid ${C.border}`,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }}>
      <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Image src="/brand/logoletras.png" alt="VentaSimple" width={320} height={100}
            style={{ height: 30, width: "auto", objectFit: "contain" }} priority />
        </Link>

        <div className="l-nav-links">
          <a href="#como-funciona" style={{ ...T.small, textDecoration: "none", color: C.muted }}>Cómo funciona</a>
          <a href="#pricing"       style={{ ...T.small, textDecoration: "none", color: C.muted }}>Precios</a>
          <a href="#faq"           style={{ ...T.small, textDecoration: "none", color: C.muted }}>FAQ</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login" style={{ ...T.small, textDecoration: "none", color: C.muted, padding: "8px 14px" }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 20px", borderRadius: 8, textDecoration: "none",
            fontWeight: 700, fontSize: 13, color: "#fff",
            background: C.orange,
          }}>
            Empezar gratis →
          </Link>
        </div>
      </div>
    </nav>
  );
}
