"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getUser } from "@/lib/auth";
import { getSuscripcionEstado, getLicencia } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import {
  LayoutDashboard, Monitor, Package, Truck, Users, ShoppingCart,
  BarChart2, Key, CreditCard, Shield, LogOut, Sun, Moon, Zap, Download,
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
  { href: "/descargar",   label: "Descargas",   icon: Download },
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

// ── Paleta del sidebar — light (design system) / dark ─────────────────────────
const S_LIGHT = {
  bg:         "#F1F5F9",
  borderR:    "#E5E7EB",
  activeBg:   "#DBEAFE",
  hoverBg:    "#E2E8F0",
  divider:    "#E5E7EB",
  text:       "#64748B",
  textStrong: "#0F172A",
  textActive: "#1E3A8A",
  label:      "#94A3B8",
  iconNormal: "#94A3B8",
  iconActive: "#1E3A8A",
  accent:     "#1E3A8A",
};

const S_DARK = {
  bg:         "#0D1B38",
  borderR:    "rgba(0,0,0,.35)",
  activeBg:   "rgba(255,255,255,.10)",
  hoverBg:    "rgba(255,255,255,.05)",
  divider:    "rgba(255,255,255,.07)",
  text:       "#7A9BC6",
  textStrong: "#C4D5EC",
  textActive: "#FFFFFF",
  label:      "rgba(255,255,255,.28)",
  iconNormal: "#4D6A90",
  iconActive: "#FFFFFF",
  accent:     "#60A5FA",
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
        setDaysLeft(calcTrialDaysLeft(lRes.data.licencia?.activada_at ?? null));
      }
    } catch { /* silencioso */ }
  }

  const isSuperAdmin = user?.rol === "superadmin";
  const nav = isSuperAdmin ? ADMIN_NAV : OWNER_NAV;
  const isDark = theme === "dark";
  const S = isDark ? S_DARK : S_LIGHT;

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: S.bg,
      borderRight: `1px solid ${S.borderR}`,
    }}>

      {/* ── Logo + usuario ── */}
      <div style={{ padding: "22px 20px 16px" }}>
        <div>
          <Image
            src="/brand/texto.png"
            alt="VentaSimple"
            width={320} height={100}
            style={{
              width: "100%", height: "auto", objectFit: "contain", objectPosition: "left",
              filter: isDark ? "brightness(0) invert(1) opacity(.85)" : "none",
            }}
            priority
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: "#1E3A8A",
            border: "1.5px solid rgba(96,165,250,.30)",
            display: "grid", placeItems: "center",
            fontSize: 13, fontWeight: 800, color: "#fff",
            letterSpacing: "0.01em",
          }}>
            {(user?.nombre ?? "U")[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, lineHeight: 1.2,
              color: S.textStrong,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              margin: 0,
            }}>
              {user?.nombre ?? "Panel"}
            </p>
            <p style={{ fontSize: 11, color: S.text, marginTop: 2, margin: 0 }}>
              {isSuperAdmin ? "Superadmin" : "Propietario"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Plan badge ── */}
      {!isSuperAdmin && (
        <div style={{ padding: "0 12px 10px" }}>
          {plan === "FREE" ? (
            <Link href="/cuenta" style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                padding: "10px 12px", borderRadius: 10,
                background: isDark ? "rgba(249,115,22,.12)" : "#FFF7ED",
                border: isDark ? "1px solid rgba(249,115,22,.25)" : "1px solid #FED7AA",
                cursor: "pointer",
              }}>
                {daysLeft !== null && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#F97316", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Prueba gratuita
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: daysLeft <= 5 ? "#EF4444" : "#F97316" }}>
                        {daysLeft}d
                      </span>
                    </div>
                    <div style={{ height: 3, borderRadius: 99, background: "rgba(249,115,22,.18)", marginBottom: 7, overflow: "hidden" }}>
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
                  <Zap size={11} color="#F97316" fill="#F97316" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#F97316" }}>
                    {daysLeft === 0 ? "Prueba vencida · Activar" : "Activar plan →"}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div style={{
              padding: "7px 11px", borderRadius: 9,
              background: isDark ? "rgba(96,165,250,.10)" : "#DBEAFE",
              border: isDark ? "1px solid rgba(96,165,250,.22)" : "1px solid #BFDBFE",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: isDark ? "#60A5FA" : "#1E3A8A",
                boxShadow: isDark ? "0 0 0 2px rgba(96,165,250,.25)" : "0 0 0 2px rgba(30,58,138,.15)",
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#93C5FD" : "#1E3A8A", letterSpacing: "0.03em" }}>
                {planLabel[plan] ?? plan}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ height: 1, background: S.divider, margin: "0 12px 6px" }} />

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>

        {!isSuperAdmin && (
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.12em", color: S.label,
            padding: "8px 8px 4px", margin: 0,
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
              className={active ? "" : "vs-sidebar-item"}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                paddingTop: "9px", paddingBottom: "9px",
                paddingRight: "10px",
                paddingLeft: active ? "8px" : "10px",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                color: active ? S.textActive : S.text,
                background: active ? S.activeBg : "transparent",
                borderLeft: `2px solid ${active ? S.accent : "transparent"}`,
                transition: "background .15s, color .15s",
                opacity: isLocked && !active ? 0.45 : 1,
              }}
            >
              <Icon size={15} strokeWidth={active ? 2.2 : 1.8}
                style={{ color: active ? S.iconActive : S.iconNormal, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {isLocked && (
                <span style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 99,
                  background: "rgba(249,115,22,.15)",
                  color: "#FB923C", fontWeight: 800, letterSpacing: "0.06em",
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
            <div style={{ padding: "14px 8px 4px" }}>
              <p style={{
                fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.12em", color: S.label, margin: 0,
              }}>
                Vista Tenant
              </p>
            </div>
            {OWNER_NAV.filter(n => n.href !== "/cuenta").map(({ href, label, icon: Icon }) => (
              <Link
                key={`owner-${href}`}
                href={`${href}?superadmin=1`}
                className="vs-sidebar-item"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  textDecoration: "none",
                  color: S.text,
                }}
              >
                <Icon size={13} strokeWidth={1.7} style={{ color: S.iconNormal }} />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: "6px 10px 14px",
        borderTop: `1px solid ${S.divider}`,
        display: "flex", flexDirection: "column", gap: 1,
      }}>
        <button
          onClick={toggle}
          className="vs-sidebar-footer-btn"
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 8,
            fontSize: 12.5, fontWeight: 500, width: "100%",
            background: "none", border: "none", cursor: "pointer",
            color: S.text,
            transition: "background .15s, color .15s",
          }}
        >
          {isDark
            ? <><Sun size={14} strokeWidth={1.8} /><span>Modo claro</span></>
            : <><Moon size={14} strokeWidth={1.8} /><span>Modo oscuro</span></>}
        </button>

        <button
          onClick={logout}
          className="vs-sidebar-footer-btn"
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 8,
            fontSize: 12.5, fontWeight: 500, width: "100%",
            background: "none", border: "none", cursor: "pointer",
            color: S.text,
            transition: "background .15s, color .15s",
          }}
        >
          <LogOut size={14} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
