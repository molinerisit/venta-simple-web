"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getInstalacion,
  getFeatures,
  setFeature,
  enviarComando,
  getHeartbeats,
  crearSuscripcion,
  type Instalacion,
  type HeartbeatLog,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, RefreshCw, Send, Wifi, WifiOff } from "lucide-react";

const FEATURE_LABELS: Record<string, string> = {
  caja:           "Módulo Caja",
  productos:      "Catálogo de productos",
  proveedores:    "Proveedores",
  clientes:       "Clientes",
  ofertas:        "Ofertas / descuentos",
  lotes:          "Control de lotes",
  remoto:         "Acceso remoto",
  reportes:       "Reportes avanzados",
  facturacion:    "Facturación",
  multiusuario:   "Multi-usuario",
};

function relativeTime(iso: string | null) {
  if (!iso) return "nunca";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "hace <1 min";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

function planColor(plan: string): "secondary" | "outline" | "default" | "destructive" {
  return (
    ({ FREE: "secondary", BASIC: "outline", PRO: "default", ENTERPRISE: "destructive" } as const)[
      plan as "FREE" | "BASIC" | "PRO" | "ENTERPRISE"
    ] ?? "secondary"
  );
}

export default function InstalacionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [inst, setInst] = useState<Instalacion | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Command form
  const [cmdTipo, setCmdTipo] = useState("CMD");
  const [cmdPayload, setCmdPayload] = useState("");
  const [cmdSending, setCmdSending] = useState(false);
  const [cmdMsg, setCmdMsg] = useState("");

  // Subscription form
  const [subPlan, setSubPlan] = useState("PRO");
  const [subDias, setSubDias] = useState("30");
  const [subSaving, setSubSaving] = useState(false);
  const [subMsg, setSubMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [iRes, fRes, hRes] = await Promise.all([
        getInstalacion(id),
        getFeatures(id),
        getHeartbeats(id),
      ]);
      setInst(iRes.data);
      setFeatures(fRes.data);
      setHeartbeats(hRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function toggleFeature(nombre: string, val: boolean) {
    setFeatures((prev) => ({ ...prev, [nombre]: val }));
    try {
      await setFeature(id, nombre, val);
    } catch {
      setFeatures((prev) => ({ ...prev, [nombre]: !val }));
    }
  }

  async function sendCmd(e: React.FormEvent) {
    e.preventDefault();
    setCmdSending(true);
    setCmdMsg("");
    try {
      await enviarComando(id, cmdTipo, cmdPayload);
      setCmdMsg("Comando encolado correctamente.");
      setCmdPayload("");
    } catch {
      setCmdMsg("Error al enviar el comando.");
    } finally {
      setCmdSending(false);
    }
  }

  async function createSub(e: React.FormEvent) {
    e.preventDefault();
    setSubSaving(true);
    setSubMsg("");
    try {
      await crearSuscripcion(id, subPlan, parseInt(subDias));
      setSubMsg("Suscripción creada. La instalación la recibirá en el próximo heartbeat.");
      load();
    } catch {
      setSubMsg("Error al crear la suscripción.");
    } finally {
      setSubSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400 py-8 text-center">Cargando…</p>;
  }

  if (!inst) {
    return <p className="text-sm text-red-500 py-8 text-center">Instalación no encontrada.</p>;
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={14} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{inst.nombreNegocio}</h1>
            <Badge variant={planColor(inst.plan)}>{inst.plan}</Badge>
            <span className="flex items-center gap-1.5 text-sm">
              {inst.online ? (
                <><Wifi size={14} className="text-green-500" /><span className="text-green-600">Online</span></>
              ) : (
                <><WifiOff size={14} className="text-slate-400" /><span className="text-slate-400">Offline</span></>
              )}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {inst.emailContacto} · {inst.ipAddress ?? "IP desconocida"} · v{inst.versionApp ?? "—"} · último contacto {relativeTime(inst.lastSeenAt)}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw size={14} />
        </Button>
      </div>

      <Tabs defaultValue="features">
        <TabsList>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="comandos">Comandos</TabsTrigger>
          <TabsTrigger value="suscripcion">Suscripción</TabsTrigger>
          <TabsTrigger value="heartbeats">Heartbeats</TabsTrigger>
        </TabsList>

        {/* Features tab */}
        <TabsContent value="features" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">
                Activar / desactivar módulos para esta instalación
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(features).map(([nombre, habilitado]) => (
                <div key={nombre} className="flex items-center justify-between py-2 border-b last:border-0">
                  <Label htmlFor={`feat-${nombre}`} className="cursor-pointer">
                    {FEATURE_LABELS[nombre] ?? nombre}
                  </Label>
                  <Switch
                    id={`feat-${nombre}`}
                    checked={habilitado}
                    onCheckedChange={(val) => toggleFeature(nombre, val)}
                  />
                </div>
              ))}
              {Object.keys(features).length === 0 && (
                <p className="text-sm text-slate-400 col-span-2">Sin funcionalidades configuradas.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commands tab */}
        <TabsContent value="comandos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">
                Enviar comando a la instalación (se ejecuta en el próximo heartbeat)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendCmd} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Tipo de comando</Label>
                  <Select value={cmdTipo} onValueChange={(v) => setCmdTipo(v ?? "CMD")}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CMD">CMD — Ejecutar comando</SelectItem>
                      <SelectItem value="FEATURE_UPDATE">FEATURE_UPDATE — Actualizar features</SelectItem>
                      <SelectItem value="CONFIG_UPDATE">CONFIG_UPDATE — Actualizar config</SelectItem>
                      <SelectItem value="RESTART">RESTART — Reiniciar app</SelectItem>
                      <SelectItem value="CUSTOM">CUSTOM — Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Payload (JSON o texto)</Label>
                  <Textarea
                    placeholder='{"cmd": "disk-info"}'
                    value={cmdPayload}
                    onChange={(e) => setCmdPayload(e.target.value)}
                    rows={4}
                  />
                </div>
                {cmdMsg && (
                  <p className={`text-sm px-3 py-2 rounded border ${cmdMsg.startsWith("Error") ? "text-red-600 bg-red-50 border-red-200" : "text-green-700 bg-green-50 border-green-200"}`}>
                    {cmdMsg}
                  </p>
                )}
                <Button type="submit" disabled={cmdSending}>
                  <Send size={14} className="mr-1.5" />
                  {cmdSending ? "Enviando…" : "Enviar comando"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription tab */}
        <TabsContent value="suscripcion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">
                Crear / renovar suscripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createSub} className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <Label>Plan</Label>
                  <Select value={subPlan} onValueChange={(v) => setSubPlan(v ?? "FREE")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="BASIC">BASIC</SelectItem>
                      <SelectItem value="PRO">PRO</SelectItem>
                      <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Duración (días)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={3650}
                    value={subDias}
                    onChange={(e) => setSubDias(e.target.value)}
                  />
                </div>
                {subMsg && (
                  <p className={`text-sm px-3 py-2 rounded border ${subMsg.startsWith("Error") ? "text-red-600 bg-red-50 border-red-200" : "text-green-700 bg-green-50 border-green-200"}`}>
                    {subMsg}
                  </p>
                )}
                <Button type="submit" disabled={subSaving}>
                  {subSaving ? "Guardando…" : "Crear suscripción"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heartbeats tab */}
        <TabsContent value="heartbeats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">
                Últimos 50 heartbeats recibidos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {heartbeats.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">Sin heartbeats registrados.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-slate-400">
                      <th className="text-left px-4 py-2 font-medium">Timestamp</th>
                      <th className="text-left px-4 py-2 font-medium">IP</th>
                      <th className="text-left px-4 py-2 font-medium">Versión</th>
                      <th className="text-left px-4 py-2 font-medium">Métricas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heartbeats.map((h) => (
                      <tr key={h.id} className="border-b last:border-0 hover:bg-white/5">
                        <td className="px-4 py-2 font-mono text-slate-500">
                          {new Date(h.timestamp).toLocaleString("es-AR")}
                        </td>
                        <td className="px-4 py-2 font-mono text-slate-400">{h.ipAddress}</td>
                        <td className="px-4 py-2">{h.versionApp}</td>
                        <td className="px-4 py-2 text-slate-400 truncate max-w-xs">{h.metrics}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
