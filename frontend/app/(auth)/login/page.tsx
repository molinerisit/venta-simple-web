"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, resendVerification } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendOk, setResendOk] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);
    try {
      const { data } = await login(email, password);
      saveToken(data.token);
      saveUser({ nombre: data.nombre, rol: data.rol as "superadmin" | "owner" | "admin", tenant_id: data.tenant_id });
      router.push(next);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (detail === "EMAIL_NOT_VERIFIED") {
        setUnverified(true);
      } else {
        setError("Credenciales inválidas. Verificá email y contraseña.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setResendOk(false);
    try {
      await resendVerification(email);
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
              {next === "/cuenta" ? "Ingresá para suscribirte" : "Panel Administrativo"}
            </CardTitle>
            <CardDescription>
              {next === "/cuenta" ? "Necesitás una cuenta para elegir tu plan" : "Ingresá con tu cuenta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
              {unverified && (
                <div className="rounded px-3 py-3 space-y-2" style={{
                  background: "rgba(245,158,11,.1)",
                  border: "1px solid rgba(245,158,11,.25)",
                }}>
                  <p className="text-sm" style={{ color: "#fcd34d" }}>
                    Necesitás verificar tu email antes de ingresar.
                  </p>
                  {resendOk ? (
                    <p className="text-xs" style={{ color: "#86efac" }}>✓ Email reenviado</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="text-xs underline"
                      style={{ color: "#1E3A8A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {resending ? "Reenviando…" : "Reenviar email de verificación"}
                    </button>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ingresando…" : "Ingresar"}
              </Button>
              <div className="text-center">
                <Link href="/forgot-password" className="text-xs" style={{ color: "#1E3A8A" }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs mt-4" style={{ color: "var(--vs-muted)" }}>
          ¿No tenés cuenta?{" "}
          <Link href="/registro" style={{ color: "#1E3A8A" }}>Registrarse gratis</Link>
        </p>
        <p className="text-center text-xs mt-2" style={{ color: "rgba(163,172,195,.4)" }}>
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
