"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Menu } from "lucide-react";
import { C, T } from "./tokens";

export default function LandingNavbar() {
  const [open, setOpen]       = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: isMobile ? "rgba(11,29,63,.97)" : "rgba(248,247,244,.93)",
        borderBottom: isMobile ? "none" : `1px solid ${C.border}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}>
        <div className="l-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Image src="/brand/logoletras.png" alt="VentaSimple" width={320} height={100}
              style={{ height: 26, width: "auto", objectFit: "contain", filter: isMobile ? "brightness(0) invert(1)" : "none" }} priority />
          </Link>

          {isMobile ? (
            /* Mobile: solo hamburguesa */
            <button
              onClick={() => setOpen(v => !v)}
              aria-label="Menú"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#fff", display: "flex", alignItems: "center" }}
            >
              {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          ) : (
            /* Desktop: links + acciones */
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <a href="#como-funciona" style={{ ...T.small, textDecoration: "none", color: C.muted }}>Cómo funciona</a>
                <a href="#pricing"       style={{ ...T.small, textDecoration: "none", color: C.muted }}>Precios</a>
                <a href="#faq"           style={{ ...T.small, textDecoration: "none", color: C.muted }}>FAQ</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            </>
          )}

        </div>
      </nav>

      {/* Backdrop */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 49, background: "rgba(0,0,0,.72)" }}
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        style={{
          position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 49,
          background: "#FAF9F7",
          display: "flex", flexDirection: "column",
          padding: "8px 20px 32px",
          gap: 4,
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform .22s cubic-bezier(.4,0,.2,1)",
          pointerEvents: open ? "auto" : "none",
          boxShadow: open ? "0 8px 40px rgba(0,0,0,.18)" : "none",
        }}
      >
        <a href="#como-funciona" onClick={close} style={{
          padding: "13px 4px", fontSize: 15, fontWeight: 600,
          color: C.text, textDecoration: "none",
          borderBottom: `1px solid ${C.border}`,
        }}>Cómo funciona</a>
        <a href="#pricing" onClick={close} style={{
          padding: "13px 4px", fontSize: 15, fontWeight: 600,
          color: C.text, textDecoration: "none",
          borderBottom: `1px solid ${C.border}`,
        }}>Precios</a>
        <a href="#faq" onClick={close} style={{
          padding: "13px 4px", fontSize: 15, fontWeight: 600,
          color: C.text, textDecoration: "none",
          borderBottom: `1px solid ${C.border}`,
        }}>FAQ</a>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          <Link href="/login" onClick={close} style={{
            display: "block", textAlign: "center",
            padding: "12px", borderRadius: 9, fontSize: 14, fontWeight: 600,
            color: C.text, textDecoration: "none",
            border: `1.5px solid ${C.border}`,
            background: C.surface,
          }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" onClick={close} style={{
            display: "block", textAlign: "center",
            padding: "13px", borderRadius: 9, fontSize: 14, fontWeight: 800,
            color: "#fff", textDecoration: "none",
            background: C.orange,
            boxShadow: "0 4px 14px rgba(249,115,22,.35)",
          }}>
            Empezar gratis →
          </Link>
        </div>
      </div>
    </>
  );
}
