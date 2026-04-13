"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Monitor,
  Package,
  Truck,
  Users,
  ShoppingCart,
  BarChart2,
  Key,
  CreditCard,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const OWNER_NAV = [
  { href: "/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/metricas",      label: "Métricas",      icon: BarChart2 },
  { href: "/productos",     label: "Productos",     icon: Package },
  { href: "/proveedores",   label: "Proveedores",   icon: Truck },
  { href: "/clientes",      label: "Clientes",      icon: Users },
  { href: "/ventas",        label: "Ventas",        icon: ShoppingCart },
  { href: "/cuenta",        label: "Mi cuenta",     icon: CreditCard },
];

const ADMIN_NAV = [
  { href: "/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin",         label: "Clientes SaaS", icon: Shield },
  { href: "/instalaciones", label: "Instalaciones", icon: Monitor },
  { href: "/licencias",     label: "Licencias",     icon: Key },
  { href: "/suscripciones", label: "Suscripciones", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const isSuperAdmin = user?.rol === "superadmin";
  const nav = isSuperAdmin ? ADMIN_NAV : OWNER_NAV;

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col h-full" style={{
      background: "var(--sidebar)",
      borderRight: "1px solid var(--sidebar-border)",
    }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg, #6d5dfc, #51c6ff)",
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

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              )}
              style={active ? {
                background: "rgba(109,93,252,.18)",
                color: "#b3a7ff",
              } : {
                color: "var(--sidebar-foreground)",
                opacity: 0.75,
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}

        {/* Si es superadmin, también mostrar acceso rápido como owner */}
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

      {/* Logout */}
      <div className="px-3 pb-4 pt-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
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
