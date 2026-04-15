"use client";

import { useEffect, useState } from "react";
import {
  getProveedores, crearProveedor, actualizarProveedor, eliminarProveedor, type Proveedor, type ProveedorCreate,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, RefreshCw, Pencil, Trash2, Lock, Zap, Truck } from "lucide-react";
import { getSuscripcionEstado } from "@/lib/api";
import Link from "next/link";
import { EmptyState, LoadingState } from "@/components/panel/EmptyState";

const EMPTY: ProveedorCreate = { nombre: "", email: "", telefono: "", direccion: "", cuit: "", notas: "" };

export default function ProveedoresPage() {
  const [items, setItems] = useState<Proveedor[]>([]);
  const [filtered, setFiltered] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("FREE");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [form, setForm] = useState<ProveedorCreate>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const isFree = plan === "FREE";

  async function load() {
    setLoading(true);
    try {
      const { data } = await getProveedores();
      setItems(data);
      setFiltered(data);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    getSuscripcionEstado().then(r => setPlan(r.data.plan ?? "FREE")).catch(() => {});
  }, []);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    setFiltered(q ? items.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase())) : items);
  }, [q, items]);

  function openNew() { setEditing(null); setForm(EMPTY); setErr(""); setOpen(true); }
  function openEdit(p: Proveedor) {
    setEditing(p);
    setForm({ nombre: p.nombre, email: p.email ?? "", telefono: p.telefono ?? "",
      direccion: p.direccion ?? "", cuit: p.cuit ?? "", notas: p.notas ?? "" });
    setErr(""); setOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      if (editing) await actualizarProveedor(editing.id, form);
      else await crearProveedor(form);
      setOpen(false); load();
    } catch { setErr("Error al guardar."); }
    finally { setSaving(false); }
  }

  async function handleDelete(p: Proveedor) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    await eliminarProveedor(p.id); load();
  }

  const set = (k: keyof ProveedorCreate, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Banner plan FREE */}
      {isFree && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <Lock size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              La creación de proveedores requiere un plan pago
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              Podés ver los proveedores sincronizados desde la app, pero no crear ni editar desde el panel web en el plan gratuito.
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
          <h1 className="text-3xl font-black tracking-tight text-foreground">Proveedores</h1>
          <p className="text-sm text-muted-foreground">{items.length} proveedores</p>
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

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar proveedor…" className="pl-8" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <Card className="vs-panel-card">
        <CardContent className="p-0">
          {loading ? <LoadingState /> :
           filtered.length === 0 ? (
            <EmptyState
              icon={Truck}
              title={q ? "Sin resultados" : "Sin proveedores"}
              description={q
                ? "No hay proveedores que coincidan con la búsqueda."
                : "Todavía no hay proveedores registrados. Podés agregarlos desde la app de escritorio."}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Teléfono</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">CUIT</th>
                  <th className="text-left px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b last:border-0 vs-table-row">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{p.nombre}</p>
                      {p.direccion && <p className="text-xs text-muted-foreground">{p.direccion}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.telefono ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.cuit ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openEdit(p)}><Pencil size={12} /></Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500" onClick={() => handleDelete(p)}><Trash2 size={12} /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1"><Label>Nombre *</Label><Input value={form.nombre} onChange={e => set("nombre", e.target.value)} required /></div>
              <div className="space-y-1"><Label>Teléfono</Label><Input value={form.telefono ?? ""} onChange={e => set("telefono", e.target.value)} /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)} /></div>
              <div className="space-y-1"><Label>CUIT</Label><Input value={form.cuit ?? ""} onChange={e => set("cuit", e.target.value)} /></div>
              <div className="space-y-1"><Label>Dirección</Label><Input value={form.direccion ?? ""} onChange={e => set("direccion", e.target.value)} /></div>
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
