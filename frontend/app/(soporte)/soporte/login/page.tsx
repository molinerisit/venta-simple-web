"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveUser } from "@/lib/auth";

const C = { blue: "#1E3A8A", border: "#E2E8F0", text: "#0F172A", muted: "#64748B" };

export default function SoporteLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("soporte@ventasimple.cloud");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [focus,    setFocus]    = useState<string | null>(null);

  const inputStyle = (key: string): React.CSSProperties => ({
    width: "100%", height: 46,
    padding: "0 14px",
    border: `1.5px solid ${focus === key ? C.blue : C.border}`,
    borderRadius: 8, fontSize: 14, color: C.text,
    background: "#fff", outline: "none",
    boxShadow: focus === key ? "0 0 0 3px rgba(30,58,138,.10)" : "none",
    transition: "border-color .15s, box-shadow .15s",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await login(email, password);
      if (!["support", "superadmin"].includes(data.rol)) {
        setError("Esta cuenta no tiene acceso al panel de soporte.");
        return;
      }
      saveUser({ nombre: data.nombre, rol: data.rol as "support" | "superadmin", tenant_id: data.tenant_id });
      router.push("/soporte");
    } catch {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, background: "linear-gradient(150deg, #EFF6FF 0%, #F5F8FF 50%, #FFFFFF 100%)",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: C.blue,
            display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14v2.92z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Panel de Soporte</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>VentaSimple — acceso interno</p>
        </div>

        <div style={{
          background: "#fff", borderRadius: 14, padding: "32px 28px",
          boxShadow: "0 4px 6px rgba(0,0,0,.04), 0 16px 48px rgba(30,58,138,.08)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                required style={inputStyle("email")}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Contraseña</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocus("pwd")} onBlur={() => setFocus(null)}
                required style={inputStyle("pwd")}
              />
            </div>

            {error && (
              <div style={{
                padding: "9px 12px", borderRadius: 7, fontSize: 13,
                background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", color: "#DC2626",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                height: 46, width: "100%", borderRadius: 8, marginTop: 4,
                background: loading ? "#93B4E8" : C.blue,
                color: "#fff", fontWeight: 700, fontSize: 14,
                border: "none", cursor: loading ? "default" : "pointer",
                transition: "background .15s",
              }}
            >
              {loading ? "Verificando…" : "Ingresar al panel"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#CBD5E1", marginTop: 16 }}>
          Acceso restringido — solo personal de VentaSimple
        </p>
      </div>
    </div>
  );
}
