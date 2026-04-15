"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { register, resendVerification } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, RefreshCw } from "lucide-react";
import Image from "next/image";

function RegistroForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";

  const [form, setForm] = useState({ email: "", password: "", nombre_negocio: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendOk, setResendOk] = useState(false);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.nombre_negocio);
      setDone(true);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (detail === "EMAIL_PENDING_VERIFICATION") {
        // Ya existe pero no verificó — reenviamos y mostramos el mismo estado
        setDone(true);
        return;
      }
      setError(detail || "No se pudo crear la cuenta. El email podría estar en uso.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setResendOk(false);
    try {
      await resendVerification(form.email);
      setResendOk(true);
    } catch {
      // ignora
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Image src="/brand/texto.png" alt="Venta Simple" width={320} height={100}
            style={{ height: 56, width: "auto", objectFit: "contain" }} priority />
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">
              {done ? "Verificá tu email" : "Crear cuenta"}
            </CardTitle>
            <CardDescription>
              {done
                ? `Te enviamos un link a ${form.email}`
                : planParam
                  ? `Registrate para activar el plan ${planParam}`
                  : "Empezá gratis, sin tarjeta de crédito"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {done ? (
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-3 py-2">
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(30,58,138,.12)",
                    border: "1px solid rgba(30,58,138,.25)",
                    display: "grid", placeItems: "center",
                  }}>
                    <CheckCircle size={24} style={{ color: "#1E3A8A" }} />
                  </div>
                  <p className="text-sm text-center" style={{ color: "#a3acbb" }}>
                    Revisá tu bandeja de entrada y hacé clic en el link para activar tu cuenta.
                  </p>
                  <p className="text-xs text-center" style={{ color: "#5a6070" }}>
                    El link expira en 24 horas. Revisá también el spam.
                  </p>
                </div>

                {resendOk ? (
                  <p className="text-xs text-center" style={{ color: "#86efac" }}>
                    ✓ Email reenviado correctamente
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={resending}
                    onClick={handleResend}
                  >
                    <RefreshCw size={13} className={`mr-1.5 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Reenviando…" : "Reenviar email de verificación"}
                  </Button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre_negocio">Nombre del negocio</Label>
                  <Input
                    id="nombre_negocio"
                    placeholder="Ej: Kiosco Don Pedro"
                    value={form.nombre_negocio}
                    onChange={set("nombre_negocio")}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={set("password")}
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
                  {loading ? "Creando cuenta…" : "Crear cuenta"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {!done && (
          <p className="text-center text-xs mt-4" style={{ color: "var(--vs-muted)" }}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" style={{ color: "#1E3A8A" }}>Iniciar sesión</Link>
          </p>
        )}
        {done && (
          <p className="text-center text-xs mt-4" style={{ color: "var(--vs-muted)" }}>
            <Link href="/login" style={{ color: "#1E3A8A" }}>← Volver al inicio de sesión</Link>
          </p>
        )}
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
