"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getSuscripcionEstado, crearSuscripcionMP, cancelarSuscripcionMP,
  pausarSuscripcionMP, reanudarSuscripcionMP, getLicencia, getDesktopActivationToken,
  type SuscripcionEstado,
} from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, Pause, Play, X, CheckCircle, AlertTriangle, Monitor, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

const PLANES = [
  {
    id: "BASIC",
    nombre: "Básico",
    precio: 2999,
    features: ["Funciones premium", "1 dispositivo", "Sincronización en la nube"],
  },
  {
    id: "PRO",
    nombre: "Pro",
    precio: 4499,
    features: ["Funciones premium", "Hasta 3 dispositivos", "Sincronización en la nube"],
    highlight: true,
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

function mpStatusLabel(status: string | null): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  switch (status) {
    case "authorized": return { label: "Activa", variant: "default" };
    case "paused":     return { label: "Pausada", variant: "secondary" };
    case "cancelled":  return { label: "Cancelada", variant: "destructive" };
    case "pending":    return { label: "Pendiente de pago", variant: "outline" };
    default:           return { label: "Sin suscripción", variant: "secondary" };
  }
}

type Licencia = { clave: string; plan: string; estado: string; activada_at: string; expira_at: string | null };

type ActivationState = "idle" | "loading" | "waiting" | "error";

function CuentaPageInner() {
  const searchParams = useSearchParams();
  const user = typeof window !== "undefined" ? getUser() : null;

  const [estado, setEstado] = useState<SuscripcionEstado | null>(null);
  const [licencia, setLicencia] = useState<Licencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"cancelar" | "pausar" | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [activation, setActivation] = useState<ActivationState>("idle");

  const fromReturn = searchParams.get("retorno") === "1";

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [sRes, lRes] = await Promise.all([getSuscripcionEstado(), getLicencia()]);
      setEstado(sRes.data);
      setLicencia(lRes.data.licencia);
    } catch {
      // ignora
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSuscribir(planId: string) {
    setActionLoading(true);
    try {
      const back = `${window.location.origin}/cuenta?retorno=1`;
      const { data } = await crearSuscripcionMP(planId, back);
      window.location.href = data.init_point;
    } catch {
      showToast("No se pudo iniciar la suscripción. Intentá de nuevo.", false);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancelar() {
    setActionLoading(true);
    setConfirmAction(null);
    try {
      await cancelarSuscripcionMP();
      showToast("Suscripción cancelada. Tu plan vuelve a FREE.");
      await load();
    } catch {
      showToast("No se pudo cancelar. Intentá de nuevo.", false);
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePausar() {
    setActionLoading(true);
    setConfirmAction(null);
    try {
      await pausarSuscripcionMP();
      showToast("Suscripción pausada.");
      await load();
    } catch {
      showToast("No se pudo pausar. Intentá de nuevo.", false);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReanudar() {
    setActionLoading(true);
    try {
      await reanudarSuscripcionMP();
      showToast("Suscripción reanudada.");
      await load();
    } catch {
      showToast("No se pudo reanudar. Intentá de nuevo.", false);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleActivarDesktop() {
    setActivation("loading");
    try {
      const { data } = await getDesktopActivationToken();
      // Abrir el deep link — el OS lo pasa al desktop si está instalado
      window.location.href = data.deep_link;
      // Mostrar mensaje de espera por si el desktop no está instalado
      setTimeout(() => setActivation("waiting"), 1200);
    } catch {
      setActivation("error");
    }
  }

  const mpInfo = estado ? mpStatusLabel(estado.mp_status) : mpStatusLabel(null);
  const isActive = estado?.mp_status === "authorized";
  const isPaused = estado?.mp_status === "paused";
  const currentPlan = estado?.plan ?? "FREE";
  const hasLicencia = !!licencia;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`vs-toast ${toast.ok ? "vs-toast-success" : "vs-toast-error"}`}>
          {toast.ok ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          <h1 className="text-3xl font-black tracking-tight">Mi cuenta</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {user?.nombre} · Gestioná tu suscripción y la app de escritorio
        </p>
      </div>

      {/* Retorno de MP */}
      {fromReturn && (
        <Card style={{ borderColor: "var(--success-bdr)", background: "var(--success-bg)" }}>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm font-medium" style={{ color: "var(--success-text)" }}>
              ✓ Pago recibido — tu suscripción se activará en unos minutos. Si no se refleja, recargá la página.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estado de suscripción */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estado de suscripción</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Plan actual</p>
                <p className="text-xl font-bold">{currentPlan}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Estado MP</p>
                <Badge variant={mpInfo.variant}>{mpInfo.label}</Badge>
              </div>
              {estado?.next_payment_date && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Próximo cobro</p>
                  <p className="text-sm font-medium">
                    {new Date(estado.next_payment_date).toLocaleDateString("es-AR")}
                  </p>
                </div>
              )}
              <div className="ml-auto flex gap-2 flex-wrap">
                {isPaused && (
                  <Button size="sm" onClick={handleReanudar} disabled={actionLoading}>
                    <Play size={13} className="mr-1.5" /> Reanudar
                  </Button>
                )}
                {isActive && (
                  <Button variant="outline" size="sm" onClick={() => setConfirmAction("pausar")} disabled={actionLoading}>
                    <Pause size={13} className="mr-1.5" /> Pausar
                  </Button>
                )}
                {(isActive || isPaused) && (
                  <Button variant="destructive" size="sm" onClick={() => setConfirmAction("cancelar")} disabled={actionLoading}>
                    <X size={13} className="mr-1.5" /> Cancelar
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App de escritorio */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Monitor size={14} /> App de escritorio
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : !hasLicencia ? (
            <p className="text-sm text-muted-foreground">
              Aún no tenés una licencia activa. Suscribite a un plan para obtenerla.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Info de licencia */}
              <div className="rounded-xl p-4" style={{
                background: "rgba(30,58,138,.08)",
                border: "1px solid rgba(30,58,138,.2)",
              }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Licencia activa</p>
                    <p className="font-mono font-bold text-base tracking-widest text-primary">
                      {licencia.clave}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Plan {licencia.plan}
                      {licencia.expira_at && (
                        <> · Renueva el {new Date(licencia.expira_at).toLocaleDateString("es-AR")}</>
                      )}
                    </p>
                  </div>
                  <Badge variant="default" className="shrink-0">Activa</Badge>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 flex-wrap">
                {/* Activar en desktop — deep link */}
                {activation === "idle" && (
                  <Button onClick={handleActivarDesktop} className="gap-2">
                    <Monitor size={14} />
                    Activar en desktop
                  </Button>
                )}
                {activation === "loading" && (
                  <Button disabled className="gap-2">
                    <Monitor size={14} />
                    Abriendo app…
                  </Button>
                )}
                {activation === "waiting" && (
                  <div className="w-full rounded-xl p-4" style={{
                    background: "var(--info-bg)",
                    border: "1px solid var(--info-bdr)",
                  }}>
                    <p className="text-sm font-medium mb-1 text-primary">
                      ¿No se abrió la app?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Primero descargá e instalá Venta Simple. Después volvé acá y hacé clic en "Activar en desktop".
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Link href="/descargar">
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Download size={13} /> Descargar app
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={() => setActivation("idle")} className="gap-1.5">
                        Reintentar
                      </Button>
                    </div>
                  </div>
                )}
                {activation === "error" && (
                  <p className="text-sm vs-alert vs-alert-error">
                    No se pudo generar el link de activación. Intentá de nuevo.
                  </p>
                )}

                {activation === "idle" && (
                  <Link href="/descargar">
                    <Button variant="outline" className="gap-2">
                      <Download size={14} />
                      Descargar app
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Planes disponibles */}
      {!isActive && !isPaused && (
        <div>
          <h2 className="text-base font-semibold mb-3">Elegí tu plan</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PLANES.map(plan => (
              <Card
                key={plan.id}
                className={plan.highlight ? "border-primary/40" : ""}
                style={plan.highlight ? { background: "linear-gradient(180deg, rgba(30,58,138,.1), rgba(30,58,138,.04))" } : {}}
              >
                <CardContent className="pt-5 pb-4">
                  {plan.highlight && (
                    <span className="vs-chip" style={{ marginBottom: 10, display: "inline-flex" }}>
                      Recomendado
                    </span>
                  )}
                  <h3 className="font-bold text-lg mb-1">{plan.nombre}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black">{fmt(plan.precio)}</span>
                    <span className="text-xs text-muted-foreground">/mes</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span style={{ color: "var(--vs-success)" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    disabled={actionLoading || currentPlan === plan.id}
                    onClick={() => handleSuscribir(plan.id)}
                  >
                    {currentPlan === plan.id ? "Plan actual" : `Suscribirse · ${fmt(plan.precio)}/mes`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade a PRO */}
      {(isActive || isPaused) && currentPlan !== "PRO" && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-medium mb-2">Actualizar al plan Pro</p>
            <p className="text-xs text-muted-foreground mb-3">
              Hasta 3 dispositivos, todas las funciones premium. {fmt(4499)}/mes.
            </p>
            <Button size="sm" disabled={actionLoading} onClick={() => handleSuscribir("PRO")}>
              Cambiar a Pro
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={confirmAction === "cancelar"} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar suscripción?</DialogTitle>
            <DialogDescription>
              Tu plan volverá a FREE al vencer el período actual. Esta acción no se puede deshacer fácilmente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Volver</Button>
            <Button variant="destructive" onClick={handleCancelar}>Sí, cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === "pausar"} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Pausar suscripción?</DialogTitle>
            <DialogDescription>
              Se pausarán los cobros automáticos. Podés reanudarla en cualquier momento.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Volver</Button>
            <Button onClick={handlePausar}>Sí, pausar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CuentaPage() {
  return (
    <Suspense>
      <CuentaPageInner />
    </Suspense>
  );
}
