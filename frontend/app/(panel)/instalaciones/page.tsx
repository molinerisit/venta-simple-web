"use client";

import { useEffect, useState } from "react";
import { getInstalaciones, crearInstalacion, type Instalacion } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Plus, Search, RefreshCw } from "lucide-react";

function OnlineDot({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-slate-300"}`}
    />
  );
}

function planColor(plan: string): "secondary" | "outline" | "default" | "destructive" {
  return (
    ({ FREE: "secondary", BASIC: "outline", PRO: "default", ENTERPRISE: "destructive" } as const)[
      plan as "FREE" | "BASIC" | "PRO" | "ENTERPRISE"
    ] ?? "secondary"
  );
}

function relativeTime(iso: string | null) {
  if (!iso) return "nunca";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "hace <1 min";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

export default function InstalacionesPage() {
  const [installs, setInstalls] = useState<Instalacion[]>([]);
  const [filtered, setFiltered] = useState<Instalacion[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);

  // New install form
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("FREE");
  const [saving, setSaving] = useState(false);
  const [newError, setNewError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { data } = await getInstalaciones();
      setInstalls(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      installs.filter(
        (i) =>
          i.nombreNegocio.toLowerCase().includes(q) ||
          i.emailContacto.toLowerCase().includes(q)
      )
    );
  }, [query, installs]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNewError("");
    try {
      await crearInstalacion({ nombreNegocio: newNombre, emailContacto: newEmail, plan: newPlan as Instalacion["plan"] });
      setOpenNew(false);
      setNewNombre("");
      setNewEmail("");
      setNewPlan("FREE");
      load();
    } catch {
      setNewError("No se pudo crear la instalación. Verificá los datos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Instalaciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {installs.length} instancia{installs.length !== 1 ? "s" : ""} registrada{installs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button size="sm" onClick={() => setOpenNew(true)}>
            <Plus size={14} className="mr-1" /> Nueva
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o email…"
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">Cargando…</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">Sin resultados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-400">
                  <th className="text-left px-4 py-2 font-medium">Estado</th>
                  <th className="text-left px-4 py-2 font-medium">Negocio</th>
                  <th className="text-left px-4 py-2 font-medium">Plan</th>
                  <th className="text-left px-4 py-2 font-medium">Versión</th>
                  <th className="text-left px-4 py-2 font-medium">Último contacto</th>
                  <th className="text-left px-4 py-2 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inst) => (
                  <tr key={inst.id} className="border-b last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <OnlineDot online={inst.online} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/instalaciones/${inst.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {inst.nombreNegocio}
                      </Link>
                      <p className="text-xs text-slate-400">{inst.emailContacto}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={planColor(inst.plan)}>{inst.plan}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{inst.versionApp ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{relativeTime(inst.lastSeenAt)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{inst.ipAddress ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* New installation dialog */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva instalación</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Nombre del negocio</Label>
              <Input
                placeholder="Ej: Almacén Don Pedro"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email de contacto</Label>
              <Input
                type="email"
                placeholder="contacto@negocio.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Plan inicial</Label>
              <Select value={newPlan} onValueChange={(v) => setNewPlan(v ?? "FREE")}>
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
            {newError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {newError}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenNew(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creando…" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
