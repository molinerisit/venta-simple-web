"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { register, resendVerification } from "@/lib/api";
import Link from "next/link";
import { CheckCircle, RefreshCw, ArrowRight } from "lucide-react";
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

function RegistroForm() {
  const searchParams = useSearchParams();
  const planParam    = searchParams.get("plan") ?? "";

  const [form,      setForm]      = useState({ email: "", password: "", nombre_negocio: "" });
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [resending, setResending] = useState(false);
  const [resendOk,  setResendOk]  = useState(false);
  const [focus,     setFocus]     = useState<string | null>(null);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.nombre_negocio);
      setDone(true);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (detail === "EMAIL_PENDING_VERIFICATION") { setDone(true); return; }
      setError(detail || "No se pudo crear la cuenta. El email podría estar en uso.");
    } finally { setLoading(false); }
  }

  async function handleResend() {
    setResending(true); setResendOk(false);
    try { await resendVerification(form.email); setResendOk(true); } catch { }
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
              {done ? "Verificá tu email" : "Crear cuenta"}
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
              {done
                ? `Te enviamos un link a ${form.email}`
                : planParam
                  ? `Registrate para activar el plan ${planParam}`
                  : "Empezá gratis. Sin tarjeta de crédito."}
            </p>
          </div>

          {done ? (
            /* ── Email sent ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "4px 0" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(30,58,138,.08)", border: "1px solid rgba(30,58,138,.18)",
                  display: "grid", placeItems: "center",
                }}>
                  <CheckCircle size={24} style={{ color: C.blue }} />
                </div>
                <p style={{ fontSize: 14, textAlign: "center", color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  Revisá tu bandeja de entrada y hacé clic en el link para activar tu cuenta.
                </p>
                <p style={{ fontSize: 12, textAlign: "center", color: C.light, margin: 0 }}>
                  El link expira en 24 horas. Revisá también el spam.
                </p>
              </div>

              {resendOk ? (
                <p style={{ fontSize: 13, textAlign: "center", color: "#16A34A", margin: 0 }}>
                  ✓ Email reenviado correctamente
                </p>
              ) : (
                <button
                  disabled={resending} onClick={handleResend}
                  style={{
                    height: 44, width: "100%", borderRadius: 10,
                    background: "transparent", color: C.text, fontWeight: 600, fontSize: 13,
                    border: `1.5px solid ${C.border}`, cursor: resending ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "background .15s",
                  }}
                >
                  <RefreshCw size={13} style={{ animation: resending ? "spin 1s linear infinite" : "none" }} />
                  {resending ? "Reenviando…" : "Reenviar email de verificación"}
                </button>
              )}
            </div>
          ) : (
            /* ── Registration form ── */
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div>
                <label htmlFor="nombre_negocio" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 7 }}>
                  Nombre del negocio
                </label>
                <input
                  id="nombre_negocio" placeholder="Ej: Kiosco Don Pedro"
                  value={form.nombre_negocio} onChange={set("nombre_negocio")}
                  onFocus={() => setFocus("nombre_negocio")} onBlur={() => setFocus(null)}
                  required style={inputStyle(focus === "nombre_negocio")}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 7 }}>
                  Email
                </label>
                <input
                  id="email" type="email" autoComplete="email" placeholder="tu@email.com"
                  value={form.email} onChange={set("email")}
                  onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                  required style={inputStyle(focus === "email")}
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 7 }}>
                  Contraseña
                </label>
                <input
                  id="password" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={set("password")}
                  onFocus={() => setFocus("password")} onBlur={() => setFocus(null)}
                  required style={inputStyle(focus === "password")}
                />
              </div>

              {error && (
                <div style={{
                  padding: "10px 14px", borderRadius: 8, fontSize: 13,
                  background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", color: "#DC2626",
                }}>
                  {error}
                </div>
              )}

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
                {loading ? "Creando cuenta…" : <><span>Crear cuenta gratis</span><ArrowRight size={15} strokeWidth={2.5} /></>}
              </button>

              <p style={{ fontSize: 12, color: C.light, textAlign: "center", margin: "2px 0 0", fontWeight: 500 }}>
                Sin tarjeta · Configuración en 2 minutos
              </p>
            </form>
          )}
        </div>

        {/* Bottom link */}
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 20, color: C.muted }}>
          {done ? (
            <Link href="/login" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>
              ← Volver al inicio de sesión
            </Link>
          ) : (
            <>
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>
                Iniciar sesión
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  );
}
