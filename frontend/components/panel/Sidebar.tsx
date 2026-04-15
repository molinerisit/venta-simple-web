"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getUser } from "@/lib/auth";
import { getSuscripcionEstado, getLicencia } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import {
  LayoutDashboard, Monitor, Package, Truck, Users, ShoppingCart,
  BarChart2, Key, CreditCard, Shield, LogOut, Sun, Moon, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const OWNER_NAV = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/metricas",    label: "Métricas",    icon: BarChart2 },
  { href: "/productos",   label: "Productos",   icon: Package },
  { href: "/proveedores", label: "Proveedores", icon: Truck },
  { href: "/clientes",    label: "Clientes",    icon: Users },
  { href: "/ventas",      label: "Ventas",      icon: ShoppingCart },
  { href: "/cuenta",      label: "Mi cuenta",   icon: CreditCard },
];

const ADMIN_NAV = [
  { href: "/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin",         label: "Clientes SaaS", icon: Shield },
  { href: "/instalaciones", label: "Instalaciones", icon: Monitor },
  { href: "/licencias",     label: "Licencias",     icon: Key },
  { href: "/suscripciones", label: "Suscripciones", icon: CreditCard },
];

const FREE_TRIAL_DAYS = 30;

function calcTrialDaysLeft(activadaAt: string | null): number | null {
  if (!activadaAt) return null;
  const start = new Date(activadaAt).getTime();
  const end   = start + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const left  = Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(0, left);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggle } = useTheme();

  const [user,  setUser]  = useState<{ nombre: string; rol: string } | null>(null);
  const [plan,  setPlan]  = useState<string>("FREE");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    setUser(getUser());
    loadPlan();
  }, []);

  async function loadPlan() {
    try {
      const [sRes, lRes] = await Promise.all([getSuscripcionEstado(), getLicencia()]);
      setPlan(sRes.data.plan ?? "FREE");
      if ((sRes.data.plan ?? "FREE") === "FREE") {
        const days = calcTrialDaysLeft(lRes.data.licencia?.activada_at ?? null);
        setDaysLeft(days);
      }
    } catch { /* silencioso */ }
  }

  const isSuperAdmin = user?.rol === "superadmin";
  const nav = isSuperAdmin ? ADMIN_NAV : OWNER_NAV;
  const isDark = theme === "dark";

  function logout() {
    clearToken();
    router.push("/login");
  }

  const planLabel: Record<string, string> = {
    FREE: "Plan Gratuito", BASIC: "Plan Básico", PRO: "Plan Pro", ENTERPRISE: "Enterprise",
  };
  const planColor: Record<string, string> = {
    FREE: "#9CA3AF", BASIC: "#6d5dfc", PRO: "#0ea5e9", ENTERPRISE: "#f59e0b",
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col h-full" style={{
      background: "var(--sidebar)",
      borderRight: "1px solid var(--sidebar-border)",
    }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "#6d5dfc",
          display: "grid", placeItems: "center",
          fontWeight: 900, fontSize: 13, color: "#fff", flexShrink: 0,
        }}>VS</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none truncate" style={{ color: "var(--sidebar-foreground)" }}>
            {user?.nombre ?? "Panel"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--vs-muted)" }}>
            {isSuperAdmin ? "Superadmin" : "Mi negocio"}
          </p>
        </div>
      </div>

      {/* Plan + trial (solo owners) */}
      {!isSuperAdmin && (
        <div className="px-3 pt-3 pb-1">
          {plan === "FREE" ? (
            <Link href="/cuenta" style={{ textDecoration: "none" }}>
              <div style={{
                padding: "9px 12px", borderRadius: 10,
                background: isDark ? "rgba(239,68,68,.08)" : "#FEF2F2",
                border: `1px solid ${isDark ? "rgba(239,68,68,.2)" : "#FECACA"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em" }}>
                    PLAN GRATUITO
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444" }}>
                    {daysLeft !== null ? `${daysLeft}d` : "—"}
                  </span>
                </div>
                {daysLeft !== null && (
                  <>
                    {/* Barra de progreso */}
                    <div style={{ height: 4, borderRadius: 99, background: isDark ? "rgba(255,255,255,.1)" : "#FEE2E2", marginBottom: 5, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        width: `${Math.round((daysLeft / FREE_TRIAL_DAYS) * 100)}%`,
                        background: daysLeft <= 5 ? "#EF4444" : daysLeft <= 10 ? "#F59E0B" : "#6d5dfc",
                        transition: "width .3s",
                      }} />
                    </div>
                    <p style={{ fontSize: 10, color: "#B91C1C", margin: 0, lineHeight: 1.4 }}>
                      {daysLeft === 0
                        ? "Prueba vencida · Upgradeá para continuar"
                        : `${daysLeft} días de prueba restantes`}
                    </p>
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  <Zap size={10} color="#6d5dfc" />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#6d5dfc" }}>Upgradear →</span>
                </div>
              </div>
            </Link>
          ) : (
            <div style={{ padding: "7px 12px", borderRadius: 10, background: isDark ? "rgba(109,93,252,.1)" : "#F0EFFE", border: "1px solid rgba(109,93,252,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: planColor[plan] ?? "#6d5dfc", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: planColor[plan] ?? "#6d5dfc", letterSpacing: "0.04em" }}>
                  {planLabel[plan] ?? plan}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          const isLocked = plan === "FREE" && !isSuperAdmin &&
            (href === "/proveedores" || href === "/clientes" || href === "/metricas");
          return (
            <Link
              key={href}
              href={href}
              className={cn("flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors")}
              style={active ? {
                background: isDark ? "rgba(109,93,252,.18)" : "rgba(109,93,252,.10)",
                color: "#6d5dfc",
              } : {
                color: "var(--sidebar-foreground)",
                opacity: isLocked ? 0.45 : 0.75,
              }}
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              {isLocked && (
                <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 99, background: "rgba(109,93,252,.15)", color: "#6d5dfc", fontWeight: 700, letterSpacing: "0.04em" }}>
                  PRO
                </span>
              )}
            </Link>
          );
        })}

        {/* Vista Tenant (superadmin) */}
        {isSuperAdmin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--vs-muted)", opacity: 0.6 }}>
                Vista Tenant
              </p>
            </div>
            {OWNER_NAV.filter(n => n.href !== "/cuenta").map(({ href, label, icon: Icon }) => (
              <Link
                key={`owner-${href}`}
                href={`${href}?superadmin=1`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ color: "var(--vs-muted)", opacity: 0.65 }}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Footer: toggle tema + logout */}
      <div className="px-3 pb-4 pt-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        {/* Toggle tema */}
        <button
          onClick={toggle}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors mb-1"
          style={{ color: "var(--vs-muted)" }}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark
            ? <><Sun size={15} /><span>Modo claro</span></>
            : <><Moon size={15} /><span>Modo oscuro</span></>
          }
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors"
          style={{ color: "var(--vs-muted)" }}
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
