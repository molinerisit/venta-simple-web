"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError("No se pudo enviar el email. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
            display: "grid", placeItems: "center",
            fontWeight: 900, fontSize: 16, color: "#fff",
          }}>VS</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--vs-text)" }}>Venta Simple</span>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
            <CardDescription>
              {sent
                ? "Revisá tu bandeja de entrada"
                : "Te enviamos un link para restablecer tu contraseña"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-4">
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(34,197,94,.12)",
                    border: "1px solid rgba(34,197,94,.25)",
                    display: "grid", placeItems: "center",
                  }}>
                    <CheckCircle size={24} style={{ color: "#86efac" }} />
                  </div>
                  <p className="text-sm text-center" style={{ color: "#a3acbb" }}>
                    Si <strong style={{ color: "#e2e8f0" }}>{email}</strong> tiene una cuenta,
                    recibirás las instrucciones en breve.
                  </p>
                  <p className="text-xs text-center" style={{ color: "#5a6070" }}>
                    El link expira en 60 minutos. Revisá también tu carpeta de spam.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Volver al inicio de sesión</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm rounded px-3 py-2" style={{
                    background: "rgba(239,68,68,.12)",
                    border: "1px solid rgba(239,68,68,.3)",
                    color: "#fca5a5",
                  }}>
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando…" : "Enviar instrucciones"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs mt-4" style={{ color: "var(--vs-muted)" }}>
          <Link href="/login" style={{ color: "#b3a7ff" }}>← Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}
