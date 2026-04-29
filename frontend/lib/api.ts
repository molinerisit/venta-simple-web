// lib/api.ts — cliente HTTP centralizado para el backend FastAPI
import axios from "axios";

// Client: URL relativa → Next.js proxy (sin CORS). Server: URL directa al backend.
const BASE = typeof window === "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
  : "";

const http = axios.create({ baseURL: BASE });

http.interceptors.request.use((cfg) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("panel_token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("panel_token");
      localStorage.removeItem("panel_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  http.post<{ token: string; nombre: string; rol: string; tenant_id?: string }>(
    "/api/auth/login", { email, password }
  );

export const register = (email: string, password: string, nombre_negocio: string) =>
  http.post("/api/auth/register", { email, password, nombre_negocio });

export const forgotPassword = (email: string) =>
  http.post<{ message: string }>("/api/auth/forgot-password", { email });

export const resetPassword = (token: string, new_password: string) =>
  http.post<{ message: string }>("/api/auth/reset-password", { token, new_password });

export const verifyEmail = (token: string) =>
  http.get<{ token: string; nombre: string; rol: string; tenant_id: string }>(
    `/api/auth/verify-email?token=${token}`
  );

export const resendVerification = (email: string) =>
  http.post<{ message: string }>("/api/auth/resend-verification", { email });

export const activateLicense = (body: {
  key: string; email: string; password: string; nombre_negocio?: string;
}) => http.post<{ token: string; nombre: string; rol: string; tenant_id: string; plan: string; licencia: string }>(
  "/api/auth/activate-license", body
);

export const validateSession = () =>
  http.get<{ valid: boolean; plan: string; plan_expires_at?: string; plan_expired: boolean; tenant_id?: string }>("/api/auth/validate-session");

export const getLicencia = () =>
  http.get<{ licencia: { clave: string; plan: string; estado: string; activada_at: string; expira_at: string | null } | null }>("/api/cuenta/licencia");

export const getDesktopActivationToken = () =>
  http.post<{ activation_token: string; deep_link: string; expires_in: number }>("/api/cuenta/desktop-activation-token");

// ── Productos ──────────────────────────────────────────────────
export const getProductos    = (params?: ProductosParams)    => http.get<Producto[]>("/api/productos", { params });
export const getProducto     = (id: string, tid?: string)    => http.get<Producto>(`/api/productos/${id}`, { params: { tenant_id: tid } });
export const crearProducto   = (body: ProductoCreate)        => http.post<Producto>("/api/productos", body);
export const actualizarProducto = (id: string, body: Partial<Producto>) => http.put<Producto>(`/api/productos/${id}`, body);
export const eliminarProducto   = (id: string)               => http.delete(`/api/productos/${id}`);
export const ajustarStock       = (id: string, delta: number, motivo?: string) =>
  http.post(`/api/productos/${id}/stock`, { delta, motivo });
export const getCategorias   = ()                            => http.get<string[]>("/api/productos/categorias/lista");

// ── Proveedores ────────────────────────────────────────────────
export const getProveedores    = (params?: { q?: string; tenant_id?: string }) => http.get<Proveedor[]>("/api/proveedores", { params });
export const getProveedor      = (id: string)   => http.get<Proveedor>(`/api/proveedores/${id}`);
export const crearProveedor    = (body: ProveedorCreate) => http.post<Proveedor>("/api/proveedores", body);
export const actualizarProveedor = (id: string, body: Partial<Proveedor>) => http.put<Proveedor>(`/api/proveedores/${id}`, body);
export const eliminarProveedor = (id: string)   => http.delete(`/api/proveedores/${id}`);

// ── Clientes ───────────────────────────────────────────────────
export const getClientes    = (params?: { q?: string; con_deuda?: boolean; tenant_id?: string }) => http.get<Cliente[]>("/api/clientes", { params });
export const getCliente     = (id: string)       => http.get<Cliente>(`/api/clientes/${id}`);
export const crearCliente   = (body: ClienteCreate) => http.post<Cliente>("/api/clientes", body);
export const actualizarCliente = (id: string, body: Partial<Cliente>) => http.put<Cliente>(`/api/clientes/${id}`, body);
export const eliminarCliente   = (id: string)    => http.delete(`/api/clientes/${id}`);
export const getHistorialVentas = (clienteId: string) => http.get<Venta[]>(`/api/clientes/${clienteId}/ventas`);

// ── Ventas ─────────────────────────────────────────────────────
export const getVentas   = (params?: VentasParams)   => http.get<Venta[]>("/api/ventas", { params });
export const getVenta    = (id: string)               => http.get<Venta>(`/api/ventas/${id}`);
export const crearVenta  = (body: VentaCreate)        => http.post<{ id: string }>("/api/ventas", body);
export const anularVenta = (id: string)               => http.delete(`/api/ventas/${id}`);

// ── Métricas ───────────────────────────────────────────────────
export const getMetricas = (dias = 30, tenant_id?: string) =>
  http.get<Metricas>("/api/metricas/resumen", { params: { dias, tenant_id } });

// ── Admin (superadmin only) ────────────────────────────────────
export const getAdminStats       = ()             => http.get<AdminStats>("/api/admin/stats");
export const getAdminTenants     = (params?: { q?: string; plan?: string }) => http.get<TenantAdmin[]>("/api/admin/tenants", { params });
export const getAdminTenant      = (id: string)   => http.get<TenantAdmin>(`/api/admin/tenants/${id}`);
export const updateAdminTenant   = (id: string, body: Partial<TenantAdmin>) => http.put(`/api/admin/tenants/${id}`, body);
export const setAdminFeature     = (tid: string, nombre: string, habilitado: boolean) =>
  http.put(`/api/admin/tenants/${tid}/features/${nombre}`, { habilitado });
export const getAdminMetricas    = (id: string, dias = 30) =>
  http.get(`/api/admin/tenants/${id}/metricas`, { params: { dias } });

// ── Instalaciones (Java backend legacy — mantenido para compatibilidad) ──
export const getInstalaciones  = () => http.get<Instalacion[]>("/api/panel/instalaciones");
export const getInstalacion    = (id: string) => http.get<Instalacion>(`/api/panel/instalaciones/${id}`);
export const crearInstalacion  = (data: Partial<Instalacion>) => http.post("/api/panel/instalaciones", data);
export const getStats          = () => http.get<Stats>("/api/panel/stats");
export const getFeatures       = (id: string) => http.get<Record<string, boolean>>(`/api/panel/instalaciones/${id}/features`);
export const setFeature        = (id: string, nombre: string, habilitado: boolean) =>
  http.put(`/api/panel/instalaciones/${id}/features/${nombre}`, { habilitado });
export const enviarComando     = (id: string, tipo: string, payload: string) =>
  http.post(`/api/panel/instalaciones/${id}/comandos`, { tipo, payload });
export const getHeartbeats     = (id: string) => http.get<HeartbeatLog[]>(`/api/panel/instalaciones/${id}/heartbeats`);
export const crearSuscripcion  = (id: string, plan: string, dias: number) =>
  http.post(`/api/panel/instalaciones/${id}/suscripcion`, { plan, dias });
export const getLicencias      = ()             => http.get<Licencia[]>("/api/panel/licencias");
export const generarLicencia   = (plan: string) => http.post<{ claves: string[]; plan: string }>("/api/panel/licencias", { plan, cantidad: 1 });
export const revocarLicencia   = (clave: string) => http.delete(`/api/panel/licencias/${clave}`);
export const adminActivarLicencia = (tenantId: string, plan: string) =>
  http.post<{ clave: string; plan: string; ok: boolean }>(`/api/admin/tenants/${tenantId}/licencia`, { plan });
export const suspenderTenant   = (id: string)   => http.put(`/api/admin/tenants/${id}`, { activo: false });
export const reactivarTenant   = (id: string)   => http.put(`/api/admin/tenants/${id}`, { activo: true });

// ── Tipos ─────────────────────────────────────────────────────
export interface Producto {
  id: string;
  tenant_id: string;
  nombre: string;
  codigo: string | null;
  precio: number;
  precio_costo: number;
  stock: number;
  stock_minimo: number;
  categoria: string | null;
  descripcion: string | null;
  unidad: string;
  codigo_barras: string | null;
  plu: string | null;
  pesable: boolean;
  acceso_rapido: boolean;
  maneja_lotes: boolean;
  activo: boolean;
  local_id?: string | null;
  created_at: string;
  updated_at: string;
}
export type ProductoCreate = Omit<Producto, "id" | "tenant_id" | "created_at" | "updated_at" | "activo">;
export interface ProductosParams { q?: string; categoria?: string; solo_activos?: boolean; tenant_id?: string }

export interface Proveedor {
  id: string;
  tenant_id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  cuit: string | null;
  notas: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
export type ProveedorCreate = Omit<Proveedor, "id" | "tenant_id" | "created_at" | "updated_at" | "activo">;

export interface Cliente {
  id: string;
  tenant_id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  dni: string | null;
  deuda: number;
  notas: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
export type ClienteCreate = Omit<Cliente, "id" | "tenant_id" | "created_at" | "updated_at" | "activo">;

export interface DetalleVenta {
  id: string;
  venta_id: string;
  producto_id: string | null;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
export interface Venta {
  id: string;
  tenant_id: string;
  cliente_id: string | null;
  cliente_nombre?: string;
  total: number;
  descuento: number;
  metodo_pago: string;
  estado: string;
  notas: string | null;
  fecha: string;
  created_at: string;
  items?: DetalleVenta[];
}
export interface VentaCreate {
  cliente_id?: string;
  total: number;
  descuento?: number;
  metodo_pago?: string;
  estado?: string;
  notas?: string;
  fecha?: string;
  items: Omit<DetalleVenta, "id" | "venta_id">[];
  local_id?: string;
}
export interface VentasParams { desde?: string; hasta?: string; metodo_pago?: string; limit?: number; offset?: number; tenant_id?: string }

export interface Metricas {
  periodo_dias: number;
  ventas: { total: number; cantidad: number; ticket_promedio: number };
  ventas_por_dia: { dia: string; total: number; cantidad: number }[];
  top_productos: { nombre: string; unidades: number; total: number }[];
  ventas_por_metodo: { metodo: string; cantidad: number; total: number }[];
  stock_bajo_minimo: Producto[];
  clientes_con_deuda: Cliente[];
  totales: { total_productos: number; total_clientes: number; total_proveedores: number };
}

export interface AdminStats {
  total: number;
  activos: number;
  online: number;
  ventas_30d: number;
  cantidad_ventas_30d: number;
  total_productos: number;
  total_clientes: number;
}

export interface TenantAdmin {
  id: string;
  nombre_negocio: string;
  email: string;
  plan: string;
  plan_expires_at: string | null;
  activo: boolean;
  created_at: string;
  last_seen_at: string | null;
  online: boolean;
  ventas_mes?: number;
  features?: Record<string, boolean>;
}

// ── Suscripciones (Mercado Pago) ──────────────────────────────
export interface SuscripcionEstado {
  plan: string;
  mp_status: string | null;
  preapproval_id: string | null;
  next_payment_date?: string;
  last_modified?: string;
}

export const getSuscripcionEstado = () =>
  http.get<SuscripcionEstado>("/api/suscripciones/estado");

export const crearSuscripcionMP = (plan: string, back_url?: string, cupon?: string) =>
  http.post<{ init_point: string; preapproval_id: string; plan: string; amount: number; cupon?: string; descuento?: number }>(
    "/api/suscripciones/crear", { plan, back_url, ...(cupon ? { cupon } : {}) }
  );

export const cancelarSuscripcionMP = () =>
  http.post("/api/suscripciones/cancelar");

export const pausarSuscripcionMP = () =>
  http.post("/api/suscripciones/pausar");

export const reanudarSuscripcionMP = () =>
  http.post("/api/suscripciones/reanudar");

// ── Panel de soporte (rol support / superadmin) ────────────────
export interface SupportConversation {
  id: string;
  client_id: string;
  business_name: string | null;
  app_version: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  msg_count: number;
  last_message: string | null;
}

export interface SupportMessage {
  id: number;
  sender: string;
  text: string;
  created_at: string;
}

export const getSupportConversations = (status = "active") =>
  http.get<SupportConversation[]>("/api/support/conversations", { params: { status } });

export const getSupportMessages = (conv_id: string) =>
  http.get<SupportMessage[]>(`/api/support/messages/${conv_id}`);

export const sendSupportReply = (conversation_id: string, text: string) =>
  http.post<{ id: number; created_at: string }>("/api/support/messages", {
    conversation_id,
    sender: "support",
    text,
  });

export const resolveConversation = (conv_id: string) =>
  http.patch(`/api/support/conversations/${conv_id}`, { status: "resolved" });

export const reopenConversation = (conv_id: string) =>
  http.patch(`/api/support/conversations/${conv_id}`, { status: "active" });

// ── Monitoreo de negocios ────────────────────────────────────────────────────

export interface TenantHours {
  configured: boolean;
  is_open: boolean | null;
  open_time: string | null;
  close_time: string | null;
}

export interface TenantDiagnostic {
  cpu_pct?:     number;
  ram_pct?:     number;
  ram_free_mb?: number;
  disk_pct?:    number;
  db_ok?:       boolean;
}

export interface TenantStatus {
  id: string;
  nombre_negocio: string;
  email: string;
  plan: string;
  last_seen_at: string | null;
  version_app: string | null;
  created_at: string;
  hours: TenantHours;
  diagnostic: TenantDiagnostic;
}

export interface RemoteCommand {
  id: string;
  command_type: string;
  description: string;
  params: Record<string, unknown>;
  status: "pending" | "done" | "error" | "skipped";
  created_by: string;
  created_at: string;
  executed_at: string | null;
  result: Record<string, unknown> | null;
}

export interface CommandCatalogItem {
  type: string;
  description: string;
}

export const getSupportTenants       = () =>
  http.get<TenantStatus[]>("/api/support/tenants");

export const getCommandCatalog       = () =>
  http.get<CommandCatalogItem[]>("/api/support/commands-catalog");

export const sendRemoteCommand       = (tenant_id: string, command_type: string, params: Record<string, unknown> = {}) =>
  http.post<{ id: string }>(`/api/support/commands/${tenant_id}`, { command_type, params });

export const getCommandHistory       = (tenant_id: string) =>
  http.get<RemoteCommand[]>(`/api/support/commands/${tenant_id}`);

// Legacy types (instalaciones Java backend)
export interface Instalacion {
  id: string;
  nombreNegocio: string;
  emailContacto: string;
  plan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
  planExpiresAt: string | null;
  lastSeenAt: string | null;
  online: boolean;
  versionApp: string | null;
  ipAddress: string | null;
  activa: boolean;
  installToken?: string;
}
export interface HeartbeatLog { id: number; timestamp: string; ipAddress: string; versionApp: string; metrics: string }
export interface Licencia {
  id: string; clave: string; plan: string;
  estado: "DISPONIBLE" | "ACTIVA" | "EXPIRADA" | "REVOCADA";
  activada_at: string | null; expira_at: string | null; created_at: string;
  nombre_negocio?: string | null; tenant_email?: string | null;
}
export interface Stats { total: number; activas: number; online: number }
