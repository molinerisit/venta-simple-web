"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getSuscripcionEstado, crearSuscripcionMP, cancelarSuscripcionMP,
  pausarSuscripcionMP, reanudarSuscripcionMP, getLicencia, getDesktopActivationToken,
  type SuscripcionEstado,
} from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Pause, Play, X, CheckCircle, AlertTriangle, Monitor, Download, ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";

const PLANES = [
  {
    id: "BASIC",
    nombre: "Básico",
    precio: 30000,
    precioOriginal: 45000,
    features: ["Funciones premium", "1 dispositivo", "Sincronización en la nube"],
  },
  {
    id: "PRO",
    nombre: "Pro",
    precio: 55000,
    precioOriginal: 75000,
    features: ["Funciones premium", "Hasta 3 dispositivos", "Sincronización en la nube"],
    highlight: true,
  },
  {
    id: "ENTERPRISE",
    nombre: "Enterprise",
    precio: 120000,
    precioOriginal: 160000,
    features: ["Multisucursal", "POS ilimitados", "Soporte prioritario 24/7"],
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);
}

const PLAN_NAME: Record<string, string> = {
  FREE: "Gratis", BASIC: "Básico", PRO: "Pro", ENTERPRISE: "Enterprise",
};

type Licencia      = { clave: string; plan: string; estado: string; activada_at: string; expira_at: string | null };
type ActivationState = "idle" | "loading" | "waiting" | "error";

function Sk({ h, w = "100%" }: { h: number; w?: string | number }) {
  return <div style={{ height: h, width: w, borderRadius: 6, background: "#F1F3F5" }} />;
}

function CuentaPageInner() {
  const searchParams = useSearchParams();
  const user = typeof window !== "undefined" ? getUser() : null;

  const [estado,        setEstado]       = useState<SuscripcionEstado | null>(null);
  const [licencia,      setLicencia]     = useState<Licencia | null>(null);
  const [loading,       setLoading]      = useState(true);
  const [loadError,     setLoadError]    = useState<string | null>(null);
  const [actionLoading, setActionLoad]   = useState(false);
  const [confirmAction, setConfirm]      = useState<"cancelar" | "pausar" | "cancelar-manual" | null>(null);
  const [toast,         setToast]        = useState<{ msg: string; ok: boolean } | null>(null);
  const [activation,    setActivation]   = useState<ActivationState>("idle");
  const [plansOpen,     setPlansOpen]    = useState(false);
  const [isMobile,      setIsMobile]     = useState(false);
  const [cupon,         setCupon]        = useState("");
  const [cuponValido,   setCuponValido]  = useState<{ descuento: number } | null>(null);
  const [cuponError,    setCuponError]   = useState("");
  const plansRef = useRef<HTMLDivElement>(null);

  const fromReturn = searchParams.get("retorno") === "1";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    load();
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [sRes, lRes] = await Promise.all([getSuscripcionEstado(), getLicencia()]);
      setEstado(sRes.data);
      setLicencia(lRes.data.licencia);
    } catch (e: unknown) {
      const msg = (e as { response?: { status?: number; data?: { detail?: string } } })?.response?.data?.detail
        ?? (e instanceof Error ? e.message : "Error al cargar el estado de la cuenta");
      setLoadError(msg);
      console.error("[cuenta] load error:", e);
    }
    finally { setLoading(false); }
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function aplicarCupon() {
    const code = cupon.trim().toUpperCase();
    if (!code) { setCuponError("Ingresá un código"); return; }
    // Validación client-side (el backend valida al crear la suscripción)
    const CUPONES_CONOCIDOS: Record<string, number> = { "MILICO": 0.90 };
    const descuento = CUPONES_CONOCIDOS[code];
    if (descuento === undefined) { setCuponError("Cupón inválido"); setCuponValido(null); return; }
    setCuponValido({ descuento });
    setCuponError("");
  }

  async function handleSuscribir(planId: string) {
    setActionLoad(true);
    try {
      const back = `${window.location.origin}/cuenta?retorno=1`;
      const { data } = await crearSuscripcionMP(planId, back, cuponValido ? cupon.trim().toUpperCase() : undefined);
      window.location.href = data.init_point;
    } catch {
      showToast("No se pudo iniciar la suscripción. Intentá de nuevo.", false);
    } finally {
      setActionLoad(false);
    }
  }

  async function handleCancelar() {
    setActionLoad(true);
    setConfirm(null);
    try {
      await cancelarSuscripcionMP();
      showToast("Suscripción cancelada. Tu plan vuelve a FREE.");
      await load();
    } catch {
      showToast("No se pudo cancelar. Intentá de nuevo.", false);
    } finally {
      setActionLoad(false);
    }
  }

  async function handlePausar() {
    setActionLoad(true);
    setConfirm(null);
    try {
      await pausarSuscripcionMP();
      showToast("Suscripción pausada.");
      await load();
    } catch {
      showToast("No se pudo pausar. Intentá de nuevo.", false);
    } finally {
      setActionLoad(false);
    }
  }

  async function handleReanudar() {
    setActionLoad(true);
    try {
      await reanudarSuscripcionMP();
      showToast("Suscripción reanudada.");
      await load();
    } catch {
      showToast("No se pudo reanudar. Intentá de nuevo.", false);
    } finally {
      setActionLoad(false);
    }
  }

  async function handleActivarDesktop() {
    setActivation("loading");
    try {
      const { data } = await getDesktopActivationToken();
      window.location.href = data.deep_link;
      setTimeout(() => setActivation("waiting"), 1200);
    } catch {
      setActivation("error");
    }
  }

  const isActive    = estado?.mp_status === "authorized";
  const isPaused    = estado?.mp_status === "paused";
  const currentPlan = estado?.plan ?? "FREE";
  const isManualPlan = currentPlan !== "FREE" && !estado?.preapproval_id && !isActive && !isPaused;
  const hasLicencia = !!licencia;
  // Plan activo: via MP (authorized/paused) O activado manualmente (plan != FREE, sin preapproval)
  const allDone     = hasLicencia && currentPlan !== "FREE" &&
    (!estado?.preapproval_id || isActive || isPaused);

  function openPlans() {
    setPlansOpen(true);
    setTimeout(() => plansRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 540 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", borderRadius: 10,
          background: toast.ok ? "#DCFCE7" : "#FEE2E2",
          border: `1px solid ${toast.ok ? "#86EFAC" : "#FCA5A5"}`,
          color: toast.ok ? "#15803D" : "#DC2626",
          fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 16px rgba(0,0,0,.08)",
          maxWidth: 320,
        }}>
          {toast.ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Mi cuenta
          </h1>
          <button onClick={load} disabled={loading} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: "#fff", border: "1px solid #E5E7EB", color: "#6B7280",
            cursor: loading ? "default" : "pointer", opacity: loading ? 0.5 : 1,
          }}>
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Actualizar
          </button>
        </div>
        {loadError && (
          <p style={{ fontSize: 11, color: "#EF4444", margin: "4px 0 0", fontFamily: "monospace" }}>
            Error: {loadError}
          </p>
        )}
        {!loading && (
          <p style={{
            fontSize: 13, fontWeight: 600, margin: "5px 0 0",
            color: allDone ? "#16A34A" : "#F97316",
          }}>
            {allDone
              ? "✓ Todo listo. Tu negocio está activo."
              : !hasLicencia
                ? "Activá un plan para empezar a vender"
                : "Te falta 1 paso para empezar a vender"}
          </p>
        )}
      </div>

      {/* Retorno de MP */}
      {fromReturn && (
        <div style={{
          background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <CheckCircle size={15} style={{ color: "#16A34A", flexShrink: 0 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: "#15803D", margin: 0 }}>
            Pago recibido — tu suscripción se activará en unos minutos.
          </p>
        </div>
      )}

      {/* ── CARD PRINCIPAL: activar desktop ── */}
      <div style={{
        background: "#fff",
        border: "1px solid #E9EAEC",
        borderTop: "3px solid #F97316",
        borderRadius: 16,
        padding: "22px 20px",
        boxShadow: "0 4px 20px rgba(249,115,22,.10), 0 1px 4px rgba(0,0,0,.05)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "#EEF2FF", display: "grid", placeItems: "center",
          }}>
            <Monitor size={20} style={{ color: "#1E3A8A" }} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
              Activar app de escritorio
            </p>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
              Necesario para empezar a cobrar en tu negocio
            </p>
          </div>
        </div>

        {loading ? (
          <Sk h={48} />
        ) : !hasLicencia ? (
          <>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 14px", lineHeight: 1.5 }}>
              Primero elegí un plan para obtener tu licencia de activación.
            </p>
            <button
              onClick={openPlans}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", height: 48, borderRadius: 10,
                background: "#F97316", color: "#fff",
                fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(249,115,22,.32)",
              }}
            >
              Ver planes disponibles
            </button>
          </>
        ) : activation === "idle" ? (
          <>
            <button
              onClick={handleActivarDesktop}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", height: 48, borderRadius: 10,
                background: "#F97316", color: "#fff",
                fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(249,115,22,.32)",
              }}
            >
              <Monitor size={15} />
              Activar ahora
            </button>
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "#F8FAFF", border: "1px solid #E0E7FF" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>
                Tu licencia
              </p>
              <p style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#1E3A8A", letterSpacing: "0.08em", margin: 0 }}>
                {licencia?.clave}
              </p>
            </div>
          </>
        ) : activation === "loading" ? (
          <button disabled style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: 48, borderRadius: 10,
            background: "#F97316", color: "#fff", opacity: 0.65,
            fontWeight: 700, fontSize: 14, border: "none", cursor: "default",
          }}>
            Abriendo app…
          </button>
        ) : activation === "waiting" ? (
          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1E3A8A", margin: "0 0 6px" }}>¿No se abrió la app?</p>
            <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 14px", lineHeight: 1.5 }}>
              Descargá e instalá Venta Simple primero. Después volvé acá y tocá "Activar ahora".
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/descargar" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "#fff", border: "1px solid #BFDBFE", color: "#1E3A8A",
                textDecoration: "none",
              }}>
                <Download size={12} /> Descargar app
              </Link>
              <button
                onClick={() => setActivation("idle")}
                style={{
                  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: "transparent", border: "1px solid #BFDBFE", color: "#64748B", cursor: "pointer",
                }}
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#EF4444", margin: 0, fontWeight: 500 }}>
            No se pudo generar el link. Intentá de nuevo.
          </p>
        )}
      </div>

      {/* ── Plan actual ── */}
      <div style={{
        background: "#FAFAFA", border: "1px solid #F1F3F5", borderRadius: 12,
        padding: "14px 16px",
      }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Sk h={11} w="38%" /><Sk h={22} w="30%" />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: (isActive || isPaused) ? 12 : 0 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>
                  Plan actual
                </p>
                <p style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
                  {PLAN_NAME[currentPlan] ?? currentPlan}
                </p>
                {currentPlan === "FREE" && (
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "3px 0 0", lineHeight: 1.4 }}>
                    Para empezar a vender necesitás activarlo
                  </p>
                )}
              </div>
              {(isActive || isPaused) && (
                <span style={{
                  padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: isActive ? "#DCFCE7" : "#FEF3C7",
                  color: isActive ? "#16A34A" : "#D97706",
                }}>
                  {isActive ? "Activa" : "Pausada"}
                </span>
              )}
            </div>

            {estado?.next_payment_date && (
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 12px" }}>
                Próximo cobro: {new Date(estado.next_payment_date).toLocaleDateString("es-AR")}
              </p>
            )}

            {(isActive || isPaused) && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {isPaused && (
                  <button onClick={handleReanudar} disabled={actionLoading} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: "#1E3A8A", color: "#fff", border: "none", cursor: "pointer",
                  }}>
                    <Play size={11} /> Reanudar
                  </button>
                )}
                {isActive && (
                  <button onClick={() => setConfirm("pausar")} disabled={actionLoading} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: "#fff", color: "#374151", border: "1px solid #E5E7EB", cursor: "pointer",
                  }}>
                    <Pause size={11} /> Pausar
                  </button>
                )}
                <button onClick={() => setConfirm("cancelar")} disabled={actionLoading} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: "#fff", color: "#EF4444", border: "1px solid #FCA5A5", cursor: "pointer",
                }}>
                  <X size={11} /> Cancelar suscripción
                </button>
              </div>
            )}
            {isManualPlan && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => setConfirm("cancelar-manual")} disabled={actionLoading} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: "#fff", color: "#EF4444", border: "1px solid #FCA5A5", cursor: "pointer",
                }}>
                  <X size={11} /> Cancelar suscripción
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Upgrade ── */}
      {!loading && (isActive || isPaused) && currentPlan === "BASIC" && (
        <div style={{
          background: "#FAFAFA", border: "1px solid #F1F3F5", borderRadius: 12,
          padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "0 0 2px" }}>Actualizar a Pro</p>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Hasta 3 dispositivos · {fmt(55000)}/mes</p>
          </div>
          <button onClick={() => handleSuscribir("PRO")} disabled={actionLoading} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: "#1E3A8A", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0,
          }}>
            Cambiar a Pro
          </button>
        </div>
      )}
      {!loading && (isActive || isPaused) && currentPlan === "PRO" && (
        <div style={{
          background: "#FAFAFA", border: "1px solid #F1F3F5", borderRadius: 12,
          padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "0 0 2px" }}>Actualizar a Enterprise</p>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Multisucursal · POS ilimitados · {fmt(120000)}/mes</p>
          </div>
          <button onClick={() => handleSuscribir("ENTERPRISE")} disabled={actionLoading} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: "#1E3A8A", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0,
          }}>
            Cambiar a Enterprise
          </button>
        </div>
      )}

      {/* ── Planes — colapsable ── */}
      {!loading && !isActive && !isPaused && (
        <div ref={plansRef}>
          <button
            onClick={() => setPlansOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "14px 0",
              background: "none", border: "none", borderTop: "1px solid #F1F3F5",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
              Ver planes disponibles
            </span>
            <ChevronDown
              size={15}
              style={{
                color: "#94A3B8", flexShrink: 0,
                transform: plansOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s",
              }}
            />
          </button>

          {plansOpen && (
            <>
            {/* ── Cupón de descuento ── */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Código de descuento"
                  value={cupon}
                  onChange={e => { setCupon(e.target.value.toUpperCase()); setCuponValido(null); setCuponError(""); }}
                  onKeyDown={e => e.key === "Enter" && aplicarCupon()}
                  style={{
                    width: "100%", height: 36, padding: "0 12px", borderRadius: 8, fontSize: 13,
                    border: `1px solid ${cuponValido ? "#86EFAC" : cuponError ? "#FCA5A5" : "#E5E7EB"}`,
                    outline: "none", fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.05em",
                    background: cuponValido ? "#F0FDF4" : "#fff",
                    boxSizing: "border-box",
                  }}
                />
                {cuponValido && (
                  <p style={{ fontSize: 11, color: "#16A34A", margin: "4px 0 0", fontWeight: 600 }}>
                    ✓ {Math.round(cuponValido.descuento * 100)}% de descuento aplicado
                  </p>
                )}
                {cuponError && (
                  <p style={{ fontSize: 11, color: "#EF4444", margin: "4px 0 0" }}>{cuponError}</p>
                )}
              </div>
              <button
                onClick={aplicarCupon}
                style={{
                  height: 36, padding: "0 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: "#1E3A8A", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Aplicar
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 12, paddingBottom: 8, paddingTop: 16,
            }}>
              {PLANES.map(plan => (
                <div key={plan.id} style={{ position: "relative" }}>
                  {plan.highlight && (
                    <span style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      padding: "3px 12px", borderRadius: 99, fontSize: 10, fontWeight: 800,
                      background: "#1E3A8A", color: "#fff",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      boxShadow: "0 2px 8px rgba(30,58,138,.30)",
                    }}>
                      Recomendado
                    </span>
                  )}
                  <div
                    style={{
                      background: plan.highlight
                        ? "linear-gradient(180deg, rgba(30,58,138,.08), rgba(30,58,138,.03))"
                        : "#fff",
                      border: `1px solid ${plan.highlight ? "rgba(30,58,138,.22)" : "#E9EAEC"}`,
                      borderRadius: 14,
                      padding: "18px 18px 16px",
                      boxShadow: plan.highlight
                        ? "0 2px 12px rgba(30,58,138,.10)"
                        : "0 1px 3px rgba(0,0,0,.04)",
                    }}
                  >
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                    {plan.nombre}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>
                      {fmt(plan.precio)}
                    </span>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>/mes</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: "0 0 12px", textDecoration: "line-through" }}>
                    {fmt(plan.precioOriginal)}/mes
                  </p>
                  {cuponValido && (
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#16A34A", margin: "-8px 0 12px" }}>
                      {fmt(Math.round(plan.precio * (1 - cuponValido.descuento)))}/mes con descuento
                    </p>
                  )}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 7 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748B" }}>
                        <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSuscribir(plan.id)}
                    disabled={actionLoading || currentPlan === plan.id}
                    style={{
                      width: "100%", height: 40, borderRadius: 9,
                      background: plan.highlight ? "#1E3A8A" : "#fff",
                      color: plan.highlight ? "#fff" : "#1E3A8A",
                      border: plan.highlight ? "none" : "1.5px solid #1E3A8A",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      opacity: actionLoading || currentPlan === plan.id ? 0.6 : 1,
                    }}
                  >
                    {currentPlan === plan.id
                      ? "Plan actual"
                      : cuponValido
                        ? `Suscribirse · ${fmt(Math.round(plan.precio * (1 - cuponValido.descuento)))}/mes`
                        : `Suscribirse · ${fmt(plan.precio)}/mes`}
                  </button>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      )}

      {/* ── Dialogs ── */}
      <Dialog open={confirmAction === "cancelar"} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar suscripción?</DialogTitle>
            <DialogDescription>
              Tu plan volverá a FREE al vencer el período actual. Esta acción no se puede deshacer fácilmente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setConfirm(null)}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1px solid #E5E7EB", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Volver
            </button>
            <button
              onClick={handleCancelar}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#EF4444", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Sí, cancelar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === "pausar"} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Pausar suscripción?</DialogTitle>
            <DialogDescription>
              Se pausarán los cobros automáticos. Podés reanudarla en cualquier momento.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setConfirm(null)}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1px solid #E5E7EB", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Volver
            </button>
            <button
              onClick={handlePausar}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#1E3A8A", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Sí, pausar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === "cancelar-manual"} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar suscripción</DialogTitle>
            <DialogDescription>
              Tu plan fue activado manualmente. Para cancelarlo, escribinos y lo gestionamos en el día.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 0 8px" }}>
            <a
              href="mailto:ventas@ventasimple.app?subject=Solicitud%20de%20cancelaci%C3%B3n%20de%20suscripci%C3%B3n"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "10px 16px", borderRadius: 8,
                background: "#EF4444", color: "#fff", border: "none",
                fontWeight: 600, fontSize: 13, textDecoration: "none", textAlign: "center",
              }}
            >
              Escribirnos por email
            </a>
            <a
              href="https://wa.me/5493512345678?text=Hola%2C%20quiero%20cancelar%20mi%20suscripci%C3%B3n%20de%20VentaSimple"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "10px 16px", borderRadius: 8,
                background: "#fff", color: "#374151", border: "1px solid #E5E7EB",
                fontWeight: 600, fontSize: 13, textDecoration: "none", textAlign: "center",
              }}
            >
              Contactar por WhatsApp
            </a>
          </div>
          <DialogFooter>
            <button
              onClick={() => setConfirm(null)}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1px solid #E5E7EB", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Cerrar
            </button>
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
