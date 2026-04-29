// Token vive en cookie httpOnly — no accesible desde JS.
// Las funciones de token son stubs mantenidos por compatibilidad.

export function getToken() {
  return null;
}

export function saveToken(_token: string) {
  // no-op: el token se setea vía /api/auth/login o /api/auth/set-session
}

export async function setSessionCookie(token: string): Promise<void> {
  await fetch("/api/auth/set-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("panel_user");
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("panel_user");
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }
}

export function isAuthenticated() {
  return !!getUser();
}

export interface PanelUser {
  nombre: string;
  rol: "superadmin" | "owner" | "admin" | "support";
  tenant_id?: string;
}

export function saveUser(user: PanelUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("panel_user", JSON.stringify(user));
}

export function getUser(): PanelUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("panel_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isSuperAdmin(): boolean {
  return getUser()?.rol === "superadmin";
}
