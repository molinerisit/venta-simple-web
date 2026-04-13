"use client";

import { useEffect, useState } from "react";
import { getInstalaciones, type Instalacion } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RefreshCw, Search, ExternalLink } from "lucide-react";

function planColor(plan: string): "default" | "secondary" | "outline" | "destructive" {
  const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    FREE: "secondary",
    BASIC: "outline",
    PRO: "default",
    ENTERPRISE: "destructive",
  };
  return map[plan] ?? "secondary";
}

function expiryStatus(expiry: string | null): { label: string; cls: string } {
  if (!expiry) return { label: "Sin vencimiento", cls: "text-slate-400" };
  const diff = (new Date(expiry).getTime() - Date.now()) / 86400000;
  if (diff < 0) return { label: "Vencida", cls: "text-red-600 font-semibold" };
  if (diff < 7) return { label: `Vence en ${Math.ceil(diff)} d`, cls: "text-orange-500 font-semibold" };
  if (diff < 30) return { label: `Vence en ${Math.ceil(diff)} d`, cls: "text-yellow-600" };
  return { label: new Date(expiry).toLocaleDateString("es-AR"), cls: "text-slate-500" };
}

export default function SuscripcionesPage() {
  const [installs, setInstalls] = useState<Instalacion[]>([]);
  const [filtered, setFiltered] = useState<Instalacion[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
          i.emailContacto.toLowerCase().includes(q) ||
          i.plan.toLowerCase().includes(q)
      )
    );
  }, [query, installs]);

  const expiringSoon = installs.filter((i) => {
    if (!i.planExpiresAt) return false;
    const diff = (new Date(i.planExpiresAt).getTime() - Date.now()) / 86400000;
    return diff >= 0 && diff < 14;
  });

  const expired = installs.filter((i) => {
    if (!i.planExpiresAt) return false;
    return new Date(i.planExpiresAt).getTime() < Date.now();
  });

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suscripciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {expiringSoon.length > 0 && (
              <span className="text-orange-500 font-medium mr-2">
                {expiringSoon.length} vencen pronto ·
              </span>
            )}
            {expired.length > 0 && (
              <span className="text-red-500 font-medium mr-2">
                {expired.length} vencidas ·
              </span>
            )}
            {installs.length} instalaciones totales
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Alerts */}
      {expiringSoon.length > 0 && (
        <Card style={{ borderColor: "rgba(245,158,11,.25)", background: "rgba(245,158,11,.08)" }}>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm font-medium text-orange-300 mb-2">
              Próximos vencimientos (14 días)
            </p>
            <div className="flex flex-wrap gap-2">
              {expiringSoon.map((i) => (
                <Link key={i.id} href={`/instalaciones/${i.id}`}>
                  <Badge variant="outline" className="border-orange-500/30 text-orange-300 cursor-pointer">
                    {i.nombreNegocio} · {i.planExpiresAt ? Math.ceil((new Date(i.planExpiresAt).getTime() - Date.now()) / 86400000) : "—"}d
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Filtrar por negocio, email o plan…"
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
                  <th className="text-left px-4 py-2 font-medium">Instalación</th>
                  <th className="text-left px-4 py-2 font-medium">Plan actual</th>
                  <th className="text-left px-4 py-2 font-medium">Vencimiento</th>
                  <th className="text-left px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inst) => {
                  const exp = expiryStatus(inst.planExpiresAt);
                  return (
                    <tr key={inst.id} className="border-b last:border-0 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{inst.nombreNegocio}</p>
                        <p className="text-xs text-slate-400">{inst.emailContacto}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={planColor(inst.plan)}>{inst.plan}</Badge>
                      </td>
                      <td className={`px-4 py-3 text-xs ${exp.cls}`}>{exp.label}</td>
                      <td className="px-4 py-3">
                        <Link href={`/instalaciones/${inst.id}#suscripcion`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                            Gestionar <ExternalLink size={10} />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
