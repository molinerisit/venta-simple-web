"use client";

import { useEffect, useState } from "react";
import {
  getClientes, crearCliente, actualizarCliente, eliminarCliente, type Cliente, type ClienteCreate,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, RefreshCw, Pencil, Trash2, Lock, Zap } from "lucide-react";
import { getSuscripcionEstado } from "@/lib/api";
import Link from "next/link";

const EMPTY: ClienteCreate = { nombre: "", email: "", telefono: "", direccion: "", dni: "", deuda: 0, notas: "" };

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

export default function ClientesPage() {
  const [items, setItems] = useState<Cliente[]>([]);
  const [filtered, setFiltered] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("FREE");
  const [q, setQ] = useState("");
  const [soloDeuda, setSoloDeuda] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState<ClienteCreate>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const isFree = plan === "FREE";

  async function load() {
    setLoading(true);
    try {
      const { data } = await getClientes({ con_deuda: soloDeuda || undefined });
      setItems(data);
      setFiltered(data);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    getSuscripcionEstado().then(r => setPlan(r.data.plan ?? "FREE")).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [soloDeuda]);
  useEffect(() => {
    setFiltered(q ? items.filter(c => c.nombre.toLowerCase().includes(q.toLowerCase()) || (c.telefono ?? "").includes(q)) : items);
  }, [q, items]);

  function openNew() { setEditing(null); setForm(EMPTY); setErr(""); setOpen(true); }
  function openEdit(c: Cliente) {
    setEditing(c);
    setForm({ nombre: c.nombre, email: c.email ?? "", telefono: c.telefono ?? "",
      direccion: c.direccion ?? "", dni: c.dni ?? "", deuda: c.deuda, notas: c.notas ?? "" });
    setErr(""); setOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      if (editing) await actualizarCliente(editing.id, form);
      else await crearCliente(form);
      setOpen(false); load();
    } catch { setErr("Error al guardar."); }
    finally { setSaving(false); }
  }

  async function handleDelete(c: Cliente) {
    if (!confirm(`¿Eliminar "${c.nombre}"?`)) return;
    await eliminarCliente(c.id); load();
  }

  const set = (k: keyof ClienteCreate, v: string | number) => setForm(f => ({ ...f, [k]: v }));
  const totalDeuda = items.reduce((s, c) => s + (c.deuda ?? 0), 0);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Banner plan FREE */}
      {isFree && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <Lock size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              La creación de clientes requiere un plan pago
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              Podés ver los clientes sincronizados desde la app, pero no crear ni editar desde el panel web en el plan gratuito.
            </p>
          </div>
          <Link href="/cuenta">
            <Button size="sm" className="shrink-0 gap-1.5 text-xs h-7">
              <Zap size={11} /> Upgradear
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-slate-500">
            {items.length} clientes
            {totalDeuda > 0 && <span className="text-red-500 ml-2">· Deuda total: {fmt(totalDeuda)}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button size="sm" onClick={openNew} disabled={isFree}>
            <Plus size={14} className="mr-1" /> Nuevo
            {isFree && <Lock size={11} className="ml-1 opacity-60" />}
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Buscar por nombre, teléfono…" className="pl-8" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <Switch checked={soloDeuda} onCheckedChange={setSoloDeuda} />
          Solo con deuda
        </label>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? <p className="px-4 py-8 text-sm text-slate-400 text-center">Cargando…</p> :
           filtered.length === 0 ? <p className="px-4 py-8 text-sm text-slate-400 text-center">Sin resultados.</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-400">
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Teléfono</th>
                  <th className="text-left px-4 py-2">DNI</th>
                  <th className="text-right px-4 py-2">Deuda</th>
                  <th className="text-left px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-white/5">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-foreground">{c.nombre}</p>
                      {c.email && <p className="text-xs text-slate-400">{c.email}</p>}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{c.telefono ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{c.dni ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right">
                      {c.deuda > 0
                        ? <Badge variant="destructive">{fmt(c.deuda)}</Badge>
                        : <span className="text-slate-300 text-xs">$0</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openEdit(c)}><Pencil size={12} /></Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500" onClick={() => handleDelete(c)}><Trash2 size={12} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1"><Label>Nombre *</Label><Input value={form.nombre} onChange={e => set("nombre", e.target.value)} required /></div>
              <div className="space-y-1"><Label>Teléfono</Label><Input value={form.telefono ?? ""} onChange={e => set("telefono", e.target.value)} /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)} /></div>
              <div className="space-y-1"><Label>DNI</Label><Input value={form.dni ?? ""} onChange={e => set("dni", e.target.value)} /></div>
              <div className="space-y-1"><Label>Deuda actual ($)</Label><Input type="number" min={0} step={0.01} value={form.deuda} onChange={e => set("deuda", parseFloat(e.target.value) || 0)} /></div>
              <div className="col-span-2 space-y-1"><Label>Dirección</Label><Input value={form.direccion ?? ""} onChange={e => set("direccion", e.target.value)} /></div>
              <div className="col-span-2 space-y-1"><Label>Notas</Label><Input value={form.notas ?? ""} onChange={e => set("notas", e.target.value)} /></div>
            </div>
            {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
