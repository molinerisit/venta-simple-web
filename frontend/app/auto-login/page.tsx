"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveToken, saveUser, type PanelUser } from "@/lib/auth";
import { validateSession } from "@/lib/api";

export default function AutoLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const next  = searchParams.get("next") || "/cuenta";
    const safePath = next.startsWith("/") ? next : "/cuenta";

    if (!token) {
      router.replace("/login");
      return;
    }

    saveToken(token);

    validateSession()
      .then(({ data }) => {
        saveUser({
          nombre:    "",
          rol:       "owner",
          tenant_id: data.tenant_id,
        } as PanelUser);
        router.replace(safePath);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#64748B", fontSize: 14 }}>
      Redirigiendo…
    </div>
  );
}
