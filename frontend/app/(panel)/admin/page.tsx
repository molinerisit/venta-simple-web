"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminStats, getAdminTenants, updateAdminTenant, setAdminFeature,
  type AdminStats, type TenantAdmin,
} from "@/lib/api";
import { isSuperAdmin } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, Shield, Users, TrendingUp, Wifi } from "lucide-react";

function relTime(iso: string | null) {
  if (!iso) return "nunca";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "<1 min";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} d`;
}

function planColor(plan: string): "default" | "secondary" | "outline" | "destructive" {
  return ({ FREE: "secondary", BASIC: "outline", PRO: "default", ENTERPRISE: "destructive" } as Record<string, "default" | "secondary" | "outline" | "destructive">)[plan] ?? "secondary";
}

const FEATURE_LABELS: Record<string, string> = {
  productos: "Productos", clientes: "Clientes", proveedores: "Proveedores",
  ventas: "Ventas", metricas: "Métricas", ofertas: "Ofertas",
  lotes: "Lotes", remoto: "Acceso remoto",
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tenants, setTenants] = useState<TenantAdmin[]>([]);
  const [filtered, setFiltered] = useState<TenantAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [planFilter, setPlanFilter] = useState("_all");
  const [selected, setSelected] = useState<TenantAdmin | null>(null);

  useEffect(() => {
    if (!isSuperAdmin()) { router.replace("/dashboard"); return; }
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [sRes, tRes] = await Promise.all([getAdminStats(), getAdminTenants()]);
      setStats(sRes.data);
      setTenants(tRes.data);
      setFiltered(tRes.data);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    let list = tenants;
    if (q) list = list.filter(t => t.nombre_negocio.toLowerCase().includes(q.toLowerCase()) || t.email.toLowerCase().includes(q.toLowerCase()));
    if (planFilter !== "_all") list = list.filter(t => t.plan === planFilter);
    setFiltered(list);
  }, [q, planFilter, tenants]);

  async function toggleActivo(t: TenantAdmin) {
    await updateAdminTenant(t.id, { activo: !t.activo });
    load();
  }

  async function changePlan(t: TenantAdmin, plan: string) {
    await updateAdminTenant(t.id, { plan });
    load();
    if (selected?.id === t.id) setSelected({ ...selected, plan });
  }

  async function toggleFeature(tid: string, nombre: string, val: boolean) {
    await setAdminFeature(tid, nombre, val);
    if (selected) {
      setSelected({ ...selected, features: { ...(selected.features ?? {}), [nombre]: val } });
    }
  }

  async function openDetail(t: TenantAdmin) {
    const { getAdminTenant } = await import("@/lib/api");
    const { data } = await getAdminTenant(t.id);
    setSelected(data);
  }

  const fmt = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <h1 className="text-3xl font-black tracking-tight text-foreground">Panel Superadmin</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión global de todos los clientes SaaS</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Stats globales */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tenants totales</CardTitle><Users size={16} className="text-muted-foreground/60" /></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground/60">{stats.activos} activos</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Online ahora</CardTitle><Wifi size={16} className="text-green-500" /></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{stats.online}</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Ventas (30d)</CardTitle><TrendingUp size={16} className="text-muted-foreground/60" /></CardHeader><CardContent><p className="text-2xl font-bold text-primary">{fmt(stats.ventas_30d)}</p><p className="text-xs text-muted-foreground/60">{stats.cantidad_ventas_30d} operaciones</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Productos registrados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total_productos.toLocaleString()}</p></CardContent></Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <Input placeholder="Buscar cliente…" className="pl-8" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v ?? "_all")}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todos los planes</SelectItem>
            {["FREE", "BASIC", "PRO", "ENTERPRISE"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla tenants */}
      <Card>
        <CardContent className="p-0">
          {loading ? <p className="px-4 py-8 text-sm text-muted-foreground/60 text-center">Cargando…</p> :
           filtered.length === 0 ? <p className="px-4 py-8 text-sm text-muted-foreground/60 text-center">Sin resultados.</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground/60">
                  <th className="text-left px-4 py-2">Estado</th>
                  <th className="text-left px-4 py-2">Negocio</th>
                  <th className="text-left px-4 py-2">Plan</th>
                  <th className="text-right px-4 py-2">Ventas mes</th>
                  <th className="text-left px-4 py-2">Último contacto</th>
                  <th className="text-center px-4 py-2">Activo</th>
                  <th className="text-left px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b last:border-0 vs-table-row">
                    <td className="px-4 py-2.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${t.online ? "bg-green-500" : "bg-border"}`} />
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-foreground">{t.nombre_negocio}</p>
                      <p className="text-xs text-muted-foreground/60">{t.email}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <Select value={t.plan} onValueChange={v => changePlan(t, v ?? t.plan)}>
                        <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["FREE", "BASIC", "PRO", "ENTERPRISE"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">{t.ventas_mes ?? 0}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground/60">{relTime(t.last_seen_at)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Switch checked={t.activo} onCheckedChange={() => toggleActivo(t)} />
                    </td>
                    <td className="px-4 py-2.5">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openDetail(t)}>
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Tenant detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.nombre_negocio}</DialogTitle>
          </DialogHeader>
          {selected && (
            <Tabs defaultValue="features">
              <TabsList>
                <TabsTrigger value="features">Funcionalidades</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="mt-4">
                <div className="space-y-3">
                  {Object.entries(selected.features ?? {}).map(([nombre, habilitado]) => (
                    <div key={nombre} className="flex items-center justify-between py-1 border-b last:border-0">
                      <span className="text-sm">{FEATURE_LABELS[nombre] ?? nombre}</span>
                      <Switch
                        checked={habilitado}
                        onCheckedChange={v => toggleFeature(selected.id, nombre, v)}
                      />
                    </div>
                  ))}
                  {!selected.features && <p className="text-sm text-muted-foreground/60 text-center py-4">Sin features configuradas.</p>}
                </div>
              </TabsContent>
              <TabsContent value="info" className="mt-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-xs text-muted-foreground/60">Email</p><p className="font-medium">{selected.email}</p></div>
                  <div><p className="text-xs text-muted-foreground/60">Plan</p><Badge variant={planColor(selected.plan)}>{selected.plan}</Badge></div>
                  <div><p className="text-xs text-muted-foreground/60">Vencimiento</p><p>{selected.plan_expires_at ? new Date(selected.plan_expires_at).toLocaleDateString("es-AR") : "Sin vencimiento"}</p></div>
                  <div><p className="text-xs text-muted-foreground/60">Registrado</p><p>{new Date(selected.created_at).toLocaleDateString("es-AR")}</p></div>
                  <div><p className="text-xs text-muted-foreground/60">Último contacto</p><p>{relTime(selected.last_seen_at)}</p></div>
                  <div><p className="text-xs text-muted-foreground/60">Estado</p><Badge variant={selected.activo ? "default" : "destructive"}>{selected.activo ? "Activo" : "Suspendido"}</Badge></div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
