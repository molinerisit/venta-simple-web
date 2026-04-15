"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

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
        <div className="flex items-center justify-center mb-8">
          <Image src="/brand/texto.png" alt="Venta Simple" width={320} height={100}
            style={{ height: 56, width: "auto", objectFit: "contain" }} priority />
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
                  <div className="vs-status-circle vs-status-circle-success">
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Si <strong className="text-foreground">{email}</strong> tiene una cuenta,
                    recibirás las instrucciones en breve.
                  </p>
                  <p className="text-xs text-center text-muted-foreground/60">
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
                  <p className="vs-alert vs-alert-error text-sm">
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

        <p className="text-center text-xs mt-4 text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">← Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}
