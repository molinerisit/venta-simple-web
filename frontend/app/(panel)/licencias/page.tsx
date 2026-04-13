"use client";

import { useEffect, useState } from "react";
import { getLicencias, generarLicencia, type Licencia } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Plus, RefreshCw, Check } from "lucide-react";

function estadoColor(
  estado: string
): "default" | "secondary" | "outline" | "destructive" {
  const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    DISPONIBLE: "default",
    ACTIVA: "secondary",
    EXPIRADA: "outline",
    REVOCADA: "destructive",
  };
  return map[estado] ?? "secondary";
}

function planColor(plan: string): "default" | "secondary" | "outline" | "destructive" {
  const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    FREE: "secondary",
    BASIC: "outline",
    PRO: "default",
    ENTERPRISE: "destructive",
  };
  return map[plan] ?? "secondary";
}

export default function LicenciasPage() {
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState("PRO");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await getLicencias();
      setLicencias(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await generarLicencia(newPlan);
      load();
    } finally {
      setGenerating(false);
    }
  }

  async function copyKey(clave: string) {
    await navigator.clipboard.writeText(clave);
    setCopied(clave);
    setTimeout(() => setCopied(null), 2000);
  }

  const disponibles = licencias.filter((l) => l.estado === "DISPONIBLE").length;
  const activas = licencias.filter((l) => l.estado === "ACTIVA").length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Licencias</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {disponibles} disponible{disponibles !== 1 ? "s" : ""} · {activas} activa{activas !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Generate new license */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-slate-700">Generar nueva licencia:</p>
            <Select value={newPlan} onValueChange={(v) => setNewPlan(v ?? "FREE")}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="BASIC">BASIC</SelectItem>
                <SelectItem value="PRO">PRO</SelectItem>
                <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleGenerate} disabled={generating}>
              <Plus size={14} className="mr-1" />
              {generating ? "Generando…" : "Generar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* License table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">Cargando…</p>
          ) : licencias.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">
              No hay licencias generadas aún.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-400">
                  <th className="text-left px-4 py-2 font-medium">Clave</th>
                  <th className="text-left px-4 py-2 font-medium">Plan</th>
                  <th className="text-left px-4 py-2 font-medium">Estado</th>
                  <th className="text-left px-4 py-2 font-medium">Activada</th>
                  <th className="text-left px-4 py-2 font-medium">Expira</th>
                  <th className="text-left px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {licencias.map((lic) => (
                  <tr key={lic.id} className="border-b last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-xs tracking-wider text-slate-700">
                      {lic.clave}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={planColor(lic.plan)}>{lic.plan}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={estadoColor(lic.estado)}>{lic.estado}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {lic.activadaAt
                        ? new Date(lic.activadaAt).toLocaleDateString("es-AR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {lic.expiraAt
                        ? new Date(lic.expiraAt).toLocaleDateString("es-AR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {lic.estado === "DISPONIBLE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyKey(lic.clave)}
                          className="h-7 px-2"
                        >
                          {copied === lic.clave ? (
                            <Check size={12} className="text-green-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
