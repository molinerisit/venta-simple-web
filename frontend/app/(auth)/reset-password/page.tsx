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
import Image from "next/image";

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
        <div className="flex items-center justify-center mb-8">
          <Image src="/brand/texto.png" alt="Venta Simple" width={320} height={100}
            style={{ height: 56, width: "auto", objectFit: "contain" }} priority />
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
                <div className="vs-alert vs-alert-error">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-sm">Link inválido o faltante.</p>
                </div>
                <Link href="/forgot-password">
                  <Button variant="outline" className="w-full">Solicitar nuevo link</Button>
                </Link>
              </div>
            ) : done ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="vs-status-circle vs-status-circle-success">
                  <CheckCircle size={24} />
                </div>
                <p className="text-sm text-center text-muted-foreground">
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
                  <p className="vs-alert vs-alert-error text-sm">
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

        <p className="text-center text-xs mt-4 text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">← Volver al inicio de sesión</Link>
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
