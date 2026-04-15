"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setErrorMsg("Link inválido o faltante.");
      return;
    }
    verifyEmail(token)
      .then(({ data }) => {
        saveToken(data.token);
        saveUser({ nombre: data.nombre, rol: "owner", tenant_id: data.tenant_id });
        setState("ok");
        setTimeout(() => router.push("/dashboard"), 2000);
      })
      .catch((err) => {
        const detail = err?.response?.data?.detail;
        setState("error");
        setErrorMsg(detail || "El link es inválido o ya expiró.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <Image src="/brand/logotexto.png" alt="Venta Simple" width={160} height={44}
            style={{ height: 34, width: "auto", objectFit: "contain" }} priority />
        </div>

        {state === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando tu cuenta…</p>
          </div>
        )}

        {state === "ok" && (
          <div className="flex flex-col items-center gap-4">
            <div className="vs-status-circle vs-status-circle-success" style={{ width: 64, height: 64 }}>
              <CheckCircle size={30} />
            </div>
            <div>
              <h1 className="text-xl font-bold mb-1">¡Email verificado!</h1>
              <p className="text-muted-foreground text-sm">
                Tu cuenta está activa. Redirigiendo al panel…
              </p>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="vs-status-circle vs-status-circle-error" style={{ width: 64, height: 64 }}>
              <AlertTriangle size={30} />
            </div>
            <div>
              <h1 className="text-xl font-bold mb-1">Link inválido</h1>
              <p className="text-muted-foreground text-sm" style={{ marginBottom: 20 }}>{errorMsg}</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Link href="/registro">
                <Button variant="outline" className="w-full">Volver al registro</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-sm text-primary">
                  Ya verifiqué mi cuenta — Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
