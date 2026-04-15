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
import { useEffect, useState } from "react";
import Image from "next/image";

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

const planLabel: Record<string, string> = {
  FREE: "Plan Gratuito", BASIC: "Plan Básico", PRO: "Plan Pro", ENTERPRISE: "Enterprise",
};
const planColor: Record<string, string> = {
  FREE: "#9CA3AF", BASIC: "#1E3A8A", PRO: "#0ea5e9", ENTERPRISE: "#f59e0b",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggle } = useTheme();

  const [user,     setUser]     = useState<{ nombre: string; rol: string } | null>(null);
  const [plan,     setPlan]     = useState<string>("FREE");
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

  const initial = (user?.nombre ?? "U")[0].toUpperCase();

  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--sidebar)",
      borderRight: "1px solid var(--sidebar-border)",
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--sidebar-border)" }}>
        <Image
          src="/brand/logotexto.png"
          alt="Venta Simple"
          width={132}
          height={36}
          style={{ objectFit: "contain", objectPosition: "left", height: 28, width: "auto" }}
          priority
        />

        {/* User row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: "#1E3A8A",
            display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 800, color: "#fff",
            letterSpacing: "0.02em",
          }}>
            {initial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: 12, fontWeight: 600, lineHeight: 1.2,
              color: "var(--sidebar-foreground)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {user?.nombre ?? "Panel"}
            </p>
            <p style={{ fontSize: 10, color: "var(--vs-muted)", marginTop: 1 }}>
              {isSuperAdmin ? "Superadmin" : "Propietario"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Plan badge (solo owners) ── */}
      {!isSuperAdmin && (
        <div style={{ padding: "10px 10px 2px" }}>
          {plan === "FREE" ? (
            /* ── Upgrade CTA — acento naranja ── */
            <Link href="/cuenta" style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                padding: "10px 12px", borderRadius: 10,
                background: isDark ? "rgba(249,115,22,.10)" : "#FFF7ED",
                border: `1px solid ${isDark ? "rgba(249,115,22,.22)" : "#FED7AA"}`,
                cursor: "pointer",
              }}>
                {daysLeft !== null && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#F97316", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Prueba gratuita
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: daysLeft <= 5 ? "#EF4444" : "#F97316",
                      }}>
                        {daysLeft}d restantes
                      </span>
                    </div>
                    <div style={{ height: 3, borderRadius: 99, background: isDark ? "rgba(249,115,22,.18)" : "#FED7AA", marginBottom: 8, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        width: `${Math.round((daysLeft / FREE_TRIAL_DAYS) * 100)}%`,
                        background: daysLeft <= 5 ? "#EF4444" : "#F97316",
                        transition: "width .4s",
                      }} />
                    </div>
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Zap size={10} color="#F97316" fill="#F97316" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#F97316" }}>
                    {daysLeft === 0 ? "Prueba vencida · Activar plan" : "Activar plan →"}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            /* ── Plan activo ── */
            <div style={{
              padding: "7px 12px", borderRadius: 10,
              background: isDark ? "rgba(30,58,138,.12)" : "rgba(30,58,138,.07)",
              border: "1px solid rgba(30,58,138,.18)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: planColor[plan] ?? "#1E3A8A",
                boxShadow: `0 0 0 2px ${(planColor[plan] ?? "#1E3A8A")}33`,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: planColor[plan] ?? "#1E3A8A",
                letterSpacing: "0.04em",
              }}>
                {planLabel[plan] ?? plan}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>

        {/* Section label */}
        {!isSuperAdmin && (
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.10em", color: "var(--vs-muted)", opacity: 0.5,
            padding: "8px 10px 4px",
          }}>
            Navegación
          </p>
        )}

        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          const isLocked = plan === "FREE" && !isSuperAdmin &&
            (href === "/proveedores" || href === "/clientes" || href === "/metricas");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "8px 10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                transition: "background .12s, color .12s",
                color: active ? "#1E3A8A" : "var(--sidebar-foreground)",
                background: active
                  ? (isDark ? "rgba(30,58,138,.18)" : "rgba(30,58,138,.08)")
                  : "transparent",
                opacity: isLocked && !active ? 0.4 : 1,
                position: "relative",
              }}
            >
              {/* Orange accent bar — active indicator */}
              {active && (
                <span style={{
                  position: "absolute", left: 0, top: "50%",
                  transform: "translateY(-50%)",
                  width: 3, height: 20, borderRadius: "0 3px 3px 0",
                  background: "#F97316",
                }} />
              )}
              <Icon
                size={15}
                strokeWidth={active ? 2.2 : 1.8}
                style={{ color: active ? "#1E3A8A" : "var(--vs-muted)", flexShrink: 0 }}
              />
              <span style={{ flex: 1 }}>{label}</span>
              {isLocked && (
                <span style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 99,
                  background: "rgba(249,115,22,.12)",
                  color: "#F97316", fontWeight: 800, letterSpacing: "0.06em",
                }}>
                  PRO
                </span>
              )}
            </Link>
          );
        })}

        {/* Vista Tenant (superadmin) */}
        {isSuperAdmin && (
          <>
            <div style={{ padding: "14px 10px 4px" }}>
              <p style={{
                fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.10em", color: "var(--vs-muted)", opacity: 0.5,
              }}>
                Vista Tenant
              </p>
            </div>
            {OWNER_NAV.filter(n => n.href !== "/cuenta").map(({ href, label, icon: Icon }) => (
              <Link
                key={`owner-${href}`}
                href={`${href}?superadmin=1`}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "7px 10px", borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  textDecoration: "none",
                  color: "var(--vs-muted)", opacity: 0.6,
                }}
              >
                <Icon size={13} strokeWidth={1.7} />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: "8px 8px 14px",
        borderTop: "1px solid var(--sidebar-border)",
        display: "flex", flexDirection: "column", gap: 1,
      }}>
        <button
          onClick={toggle}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 8,
            fontSize: 12, fontWeight: 500, width: "100%",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--vs-muted)",
            transition: "background .12s",
          }}
        >
          {isDark
            ? <><Sun size={14} strokeWidth={1.8} /><span>Modo claro</span></>
            : <><Moon size={14} strokeWidth={1.8} /><span>Modo oscuro</span></>}
        </button>

        <button
          onClick={logout}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 8,
            fontSize: 12, fontWeight: 500, width: "100%",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--vs-muted)",
            transition: "background .12s",
          }}
        >
          <LogOut size={14} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
