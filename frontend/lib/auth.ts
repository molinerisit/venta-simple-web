export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("panel_token");
}

export function saveToken(token: string) {
  localStorage.setItem("panel_token", token);
}

export function clearToken() {
  localStorage.removeItem("panel_token");
  localStorage.removeItem("panel_user");
}

export function isAuthenticated() {
  return !!getToken();
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
