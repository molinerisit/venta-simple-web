"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="flex items-center justify-center gap-3 mb-10">
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
            display: "grid", placeItems: "center",
            fontWeight: 900, fontSize: 16, color: "#fff",
          }}>VS</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--vs-text)" }}>Venta Simple</span>
        </div>

        {state === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin" style={{ color: "#6d5dfc" }} />
            <p style={{ color: "#a3acbb" }}>Verificando tu cuenta…</p>
          </div>
        )}

        {state === "ok" && (
          <div className="flex flex-col items-center gap-4">
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(34,197,94,.12)",
              border: "1px solid rgba(34,197,94,.25)",
              display: "grid", placeItems: "center",
            }}>
              <CheckCircle size={30} style={{ color: "#86efac" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold mb-1">¡Email verificado!</h1>
              <p style={{ color: "#a3acbb", fontSize: 14 }}>
                Tu cuenta está activa. Redirigiendo al panel…
              </p>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.25)",
              display: "grid", placeItems: "center",
            }}>
              <AlertTriangle size={30} style={{ color: "#fca5a5" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold mb-1">Link inválido</h1>
              <p style={{ color: "#a3acbb", fontSize: 14, marginBottom: 20 }}>{errorMsg}</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Link href="/registro">
                <Button variant="outline" className="w-full">Volver al registro</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-sm" style={{ color: "#b3a7ff" }}>
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
