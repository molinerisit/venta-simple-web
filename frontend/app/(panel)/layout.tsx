"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/panel/Sidebar";
import { useTheme } from "@/components/ThemeProvider";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme } = useTheme();
  const [isMobile, setIsMobile]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, sidebarOpen]);

  const isDark      = theme === "dark";
  const topbarBg    = isDark ? "#0D1B38" : "#F3F4F6";
  const topbarBdr   = isDark ? "rgba(0,0,0,.35)" : "#E5E7EB";
  const iconColor   = isDark ? "#C4D5EC" : "#374151";

  return (
    <div className="flex h-full">

      {/* ── Mobile topbar ── */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
          height: 56, background: topbarBg,
          borderBottom: `1px solid ${topbarBdr}`,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px",
        }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Menú"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 6, color: iconColor, display: "flex", alignItems: "center",
            }}
          >
            {sidebarOpen
              ? <X    size={20} strokeWidth={2} />
              : <Menu size={20} strokeWidth={2} />}
          </button>

          <Image
            src="/brand/logoletras.png"
            alt="VentaSimple"
            width={160} height={50}
            style={{
              height: 22, width: "auto", objectFit: "contain",
              filter: isDark ? "brightness(0) invert(1) opacity(.85)" : "none",
            }}
          />

          <div style={{ width: 32 }} />
        </div>
      )}

      {/* ── Sidebar ── */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobileLayout={isMobile}
      />

      {/* ── Backdrop ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 49,
            background: "rgba(0,0,0,.52)",
          }}
        />
      )}

      {/* ── Main ── */}
      <main
        className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-transparent"
        style={{ padding: isMobile ? "72px 16px 24px" : "32px" }}
      >
        {children}
      </main>

    </div>
  );
}
