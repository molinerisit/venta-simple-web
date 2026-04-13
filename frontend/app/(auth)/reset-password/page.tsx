"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "El link es inválido o ya expiró. Solicitá uno nuevo.");
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
            <CardTitle className="text-xl">Nueva contraseña</CardTitle>
            <CardDescription>
              {done ? "Contraseña actualizada" : "Elegí una contraseña segura"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2" style={{ color: "#fca5a5" }}>
                  <AlertTriangle size={18} />
                  <p className="text-sm">Link inválido o faltante.</p>
                </div>
                <Link href="/forgot-password">
                  <Button variant="outline" className="w-full">Solicitar nuevo link</Button>
                </Link>
              </div>
            ) : done ? (
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
                  Tu contraseña fue actualizada. Redirigiendo al login…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirmar contraseña</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repetí la contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
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
                  {loading ? "Guardando…" : "Guardar contraseña"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
