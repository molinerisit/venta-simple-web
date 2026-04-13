"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getProductos, crearProducto, actualizarProducto, eliminarProducto,
  ajustarStock, getCategorias, type Producto, type ProductoCreate,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Search, RefreshCw, Pencil, Trash2, ArrowUpDown } from "lucide-react";

const EMPTY: ProductoCreate = {
  nombre: "", codigo: "", precio: 0, precio_costo: 0,
  stock: 0, stock_minimo: 0, categoria: "", descripcion: "", unidad: "unidad",
};

export default function ProductosPage() {
  const [items, setItems] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("_all");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState<ProductoCreate>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [stockDialog, setStockDialog] = useState<Producto | null>(null);
  const [stockDelta, setStockDelta] = useState(0);
  const [stockMotivo, setStockMotivo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([getProductos(), getCategorias()]);
      setItems(pRes.data);
      setFiltered(pRes.data);
      setCategorias(cRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = items;
    if (q) list = list.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()) || (p.codigo ?? "").toLowerCase().includes(q.toLowerCase()));
    if (catFilter !== "_all") list = list.filter(p => p.categoria === catFilter);
    setFiltered(list);
  }, [q, catFilter, items]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setFormError("");
    setOpen(true);
  }

  function openEdit(p: Producto) {
    setEditing(p);
    setForm({ nombre: p.nombre, codigo: p.codigo ?? "", precio: p.precio, precio_costo: p.precio_costo,
      stock: p.stock, stock_minimo: p.stock_minimo, categoria: p.categoria ?? "",
      descripcion: p.descripcion ?? "", unidad: p.unidad });
    setFormError("");
    setOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        await actualizarProducto(editing.id, form);
      } else {
        await crearProducto(form);
      }
      setOpen(false);
      load();
    } catch {
      setFormError("Error al guardar. Verificá los datos.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    await eliminarProducto(p.id);
    load();
  }

  async function handleStock() {
    if (!stockDialog) return;
    await ajustarStock(stockDialog.id, stockDelta, stockMotivo);
    setStockDialog(null);
    setStockDelta(0);
    setStockMotivo("");
    load();
  }

  const set = (k: keyof ProductoCreate, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-sm text-slate-500">{items.length} productos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button size="sm" onClick={openNew}>
            <Plus size={14} className="mr-1" /> Nuevo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Buscar por nombre o código…" className="pl-8" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={(v) => setCatFilter(v ?? "")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todas las categorías</SelectItem>
            {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          {loading ? <p className="px-4 py-8 text-sm text-slate-400 text-center">Cargando…</p> :
           filtered.length === 0 ? <p className="px-4 py-8 text-sm text-slate-400 text-center">Sin resultados.</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-400">
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Código</th>
                  <th className="text-right px-4 py-2">Precio</th>
                  <th className="text-right px-4 py-2">Costo</th>
                  <th className="text-center px-4 py-2">Stock</th>
                  <th className="text-left px-4 py-2">Categoría</th>
                  <th className="text-left px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-white/5">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-foreground">{p.nombre}</p>
                      <p className="text-xs text-slate-400">{p.unidad}</p>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.codigo ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right font-medium">${p.precio.toLocaleString("es-AR")}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400">${(p.precio_costo ?? 0).toLocaleString("es-AR")}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant={p.stock <= p.stock_minimo ? "destructive" : p.stock < p.stock_minimo * 2 ? "outline" : "secondary"}>
                        {p.stock}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">{p.categoria ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2"
                          onClick={() => { setStockDialog(p); setStockDelta(0); }}>
                          <ArrowUpDown size={12} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openEdit(p)}>
                          <Pencil size={12} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(p)}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Nombre *</Label>
                <Input value={form.nombre} onChange={e => set("nombre", e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Código</Label>
                <Input value={form.codigo ?? ""} onChange={e => set("codigo", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Categoría</Label>
                <Input value={form.categoria ?? ""} onChange={e => set("categoria", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Precio de venta *</Label>
                <Input type="number" min={0} step={0.01} value={form.precio} onChange={e => set("precio", parseFloat(e.target.value))} required />
              </div>
              <div className="space-y-1">
                <Label>Precio de costo</Label>
                <Input type="number" min={0} step={0.01} value={form.precio_costo ?? 0} onChange={e => set("precio_costo", parseFloat(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>Stock inicial</Label>
                <Input type="number" min={0} value={form.stock} onChange={e => set("stock", parseInt(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>Stock mínimo</Label>
                <Input type="number" min={0} value={form.stock_minimo} onChange={e => set("stock_minimo", parseInt(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>Unidad</Label>
                <Input value={form.unidad} onChange={e => set("unidad", e.target.value)} placeholder="unidad, kg, litro…" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Descripción</Label>
                <Input value={form.descripcion ?? ""} onChange={e => set("descripcion", e.target.value)} />
              </div>
            </div>
            {formError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock adjustment dialog */}
      <Dialog open={!!stockDialog} onOpenChange={() => setStockDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Ajuste de stock — {stockDialog?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-sm text-slate-500">Stock actual: <strong>{stockDialog?.stock}</strong></p>
            <div className="space-y-1">
              <Label>Delta (positivo = entrada, negativo = salida)</Label>
              <Input type="number" value={stockDelta} onChange={e => setStockDelta(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <Label>Motivo</Label>
              <Input value={stockMotivo} onChange={e => setStockMotivo(e.target.value)} placeholder="Ej: compra a proveedor" />
            </div>
            <p className="text-sm font-medium">Stock resultante: {(stockDialog?.stock ?? 0) + stockDelta}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialog(null)}>Cancelar</Button>
            <Button onClick={handleStock}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
