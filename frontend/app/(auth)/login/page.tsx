"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, resendVerification } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";

const C = {
  orange: "#F97316",
  blue:   "#1E3A8A",
  border: "#E2E8F0",
  text:   "#0F172A",
  muted:  "#64748B",
  light:  "#94A3B8",
};

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: "100%", height: 48,
    padding: "0 14px",
    border: `1.5px solid ${focused ? C.blue : C.border}`,
    borderRadius: 10,
    fontSize: 14, color: C.text,
    background: "#fff",
    outline: "none",
    boxShadow: focused ? "0 0 0 3px rgba(30,58,138,.10)" : "none",
    transition: "border-color .15s, box-shadow .15s",
  };
}

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const next         = searchParams.get("next") ?? "/dashboard";

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [unverified,  setUnverified]  = useState(false);
  const [resending,   setResending]   = useState(false);
  const [resendOk,    setResendOk]    = useState(false);
  const [focus,       setFocus]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setUnverified(false); setLoading(true);
    try {
      const { data } = await login(email, password);
      saveToken(data.token);
      saveUser({ nombre: data.nombre, rol: data.rol as "superadmin" | "owner" | "admin", tenant_id: data.tenant_id });
      router.push(next);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (detail === "EMAIL_NOT_VERIFIED") setUnverified(true);
      else setError("Credenciales inválidas. Verificá email y contraseña.");
    } finally { setLoading(false); }
  }

  async function handleResend() {
    setResending(true); setResendOk(false);
    try { await resendVerification(email); setResendOk(true); } catch { }
    finally { setResending(false); }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      background: "linear-gradient(150deg, #EFF6FF 0%, #F5F8FF 40%, #FFFFFF 75%)",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <Image src="/brand/logoletras.png" alt="VentaSimple" width={240} height={75}
            style={{ height: 36, width: "auto", objectFit: "contain" }} priority />
        </div>

        {/* Card */}
        <div style={{
          background: "#FFFFFF", borderRadius: 16,
          padding: "36px 32px",
          boxShadow: "0 4px 6px rgba(0,0,0,.04), 0 20px 60px rgba(30,58,138,.09)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              {next === "/cuenta" ? "Ingresá para suscribirte" : "Bienvenido de nuevo"}
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
              {next === "/cuenta" ? "Necesitás una cuenta para elegir tu plan" : "Ingresá con tu cuenta"}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 7 }}>
                Email
              </label>
              <input
                id="email" type="email" autoComplete="email" placeholder="tu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                required style={inputStyle(focus === "email")}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Contraseña</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: C.blue, textDecoration: "none", fontWeight: 500 }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password" type={showPwd ? "text" : "password"} autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocus("password")} onBlur={() => setFocus(null)}
                  required style={{ ...inputStyle(focus === "password"), paddingRight: 44 }}
                />
                <button
                  type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: C.light, padding: 0, display: "flex", alignItems: "center",
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, fontSize: 13,
                background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", color: "#DC2626",
              }}>
                {error}
              </div>
            )}

            {/* Unverified */}
            {unverified && (
              <div style={{
                padding: "12px 14px", borderRadius: 8,
                background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.22)",
              }}>
                <p style={{ fontSize: 13, color: "#D97706", margin: "0 0 6px" }}>
                  Verificá tu email antes de ingresar.
                </p>
                {resendOk ? (
                  <p style={{ fontSize: 12, color: "#16A34A", margin: 0 }}>✓ Email reenviado</p>
                ) : (
                  <button type="button" onClick={handleResend} disabled={resending}
                    style={{ fontSize: 12, color: C.blue, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontWeight: 500 }}>
                    {resending ? "Reenviando…" : "Reenviar email de verificación"}
                  </button>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                height: 50, width: "100%", borderRadius: 10, marginTop: 4,
                background: loading ? "#FDA16B" : C.orange,
                color: "#fff", fontWeight: 800, fontSize: 15,
                border: "none", cursor: loading ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 16px rgba(249,115,22,.35)",
                transition: "background .15s",
                letterSpacing: "-0.01em",
              }}
            >
              {loading ? "Ingresando…" : <><span>Ingresar</span><ArrowRight size={15} strokeWidth={2.5} /></>}
            </button>

            {/* Trust */}
            <p style={{ fontSize: 12, color: C.light, textAlign: "center", margin: "2px 0 0", fontWeight: 500 }}>
              +500 negocios ya usan VentaSimple
            </p>
          </form>
        </div>

        {/* Bottom link */}
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 20, color: C.muted }}>
          ¿No tenés cuenta?{" "}
          <Link href="/registro" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>
            Registrate gratis
          </Link>
        </p>
        <p style={{ textAlign: "center", fontSize: 11, marginTop: 8, color: "rgba(148,163,184,.35)" }}>
          Superadmin: admin@ventasimple.com / ventasimple
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
