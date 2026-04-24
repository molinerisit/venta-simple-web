"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, clearToken } from "@/lib/auth";

export default function SoporteLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/soporte/login") return;
    const user = getUser();
    if (!user || !["support", "superadmin"].includes(user.rol)) {
      router.replace("/soporte/login");
    }
  }, [pathname, router]);

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Topbar */}
      {pathname !== "/soporte/login" && (
        <div style={{
          height: 52, background: "#1E3A8A", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", boxShadow: "0 1px 4px rgba(0,0,0,.18)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14v2.92z"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Panel de Soporte</span>
            <span style={{ fontSize: 12, color: "#93C5FD", marginLeft: 4 }}>VentaSimple</span>
          </div>
          <button
            onClick={() => { clearToken(); router.push("/soporte/login"); }}
            style={{
              background: "rgba(255,255,255,.12)", border: "none", color: "#fff",
              borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
