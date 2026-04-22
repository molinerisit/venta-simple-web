"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ChevronDown, Zap } from "lucide-react";
import { getLicencia } from "@/lib/api";

/* ── Tipos ────────────────────────────────────────────────────── */
interface KState {
  step:      number;  // 0=intro 1=download 2=activate 3=sale 4=done
  mode:      "activation" | "help";
  dismissed: boolean;
  reminders: number;
  lastRem:   number;
}

const KEY       = "vs_kairos_v1";
const TOTAL     = 3;
const REM_DELAY = 45_000;
const MAX_REMS  = 2;

function load(): KState {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r) as KState;
  } catch { }
  return { step: 0, mode: "activation", dismissed: false, reminders: 0, lastRem: 0 };
}
function save(s: KState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { }
}

/* ── Highlight ────────────────────────────────────────────────── */
export function highlightElement(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("vs-highlight");
  setTimeout(() => el.classList.remove("vs-highlight"), 3600);
}

/* ── Mensajes contextuales (modo ayuda — sin API) ─────────────── */
const HELP_MSGS: Record<string, string> = {
  "/cuenta":     "Estás en el lugar correcto.\nAcá activás la app de escritorio.",
  "/ventas":     "Desde acá ves todas tus ventas registradas.",
  "/productos":  "Acá manejás tu catálogo de productos y el stock.",
  "/metricas":   "Acá vas a ver ventas, productos y tendencias del negocio.",
  "/clientes":   "Acá están tus clientes y su historial de compras.",
  "/proveedores":"Acá gestionás tus proveedores.",
  "/descargar":  "Desde acá descargás la app de escritorio para empezar a cobrar.",
};

/* ── Sub-componentes UI ───────────────────────────────────────── */
function Bubble({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: 13.5, color: "#0F172A", lineHeight: 1.6, margin: "0 0 16px",
      whiteSpace: "pre-line",
    }}>
      {text}
    </p>
  );
}

function PrimaryBtn({ label, onClick, href }: { label: string; onClick?: () => void; href?: string }) {
  const s: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: 40, width: "100%", borderRadius: 9,
    background: "#1E3A8A", color: "#fff",
    fontWeight: 600, fontSize: 13.5, border: "none", cursor: "pointer",
    textDecoration: "none",
    marginBottom: 8,
    transition: "background .15s",
  };
  if (href) return <Link href={href} style={s} onClick={onClick}>{label}</Link>;
  return <button type="button" style={s} onClick={onClick}>{label}</button>;
}

function GhostBtn({ label, onClick, href }: { label: string; onClick?: () => void; href?: string }) {
  const s: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: 36, width: "100%", borderRadius: 9,
    background: "transparent", color: "#64748B",
    fontWeight: 500, fontSize: 13,
    border: "1.5px solid #E2E8F0", cursor: "pointer",
    textDecoration: "none",
  };
  if (href) return <Link href={href} style={s} onClick={onClick}>{label}</Link>;
  return <button type="button" style={s} onClick={onClick}>{label}</button>;
}

function CelebMsg({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 13.5, color: "#16A34A", fontWeight: 600, lineHeight: 1.55, margin: 0, textAlign: "center" }}>
      {text}
    </p>
  );
}

/* ── Componente principal ─────────────────────────────────────── */
interface Props { licenciaActiva?: boolean; hasData?: boolean; }

export default function Kairos({ licenciaActiva = false, hasData = false }: Props) {
  const pathname              = usePathname();
  const [state, setState]     = useState<KState | null>(null);
  const [expanded, setExp]    = useState(false);
  const [visible, setVis]     = useState(false);
  const [celeb, setCeleb]     = useState<string | null>(null);
  const [verifying, setVerif] = useState(false);
  const [verifyErr, setVErr]  = useState(false);
  const stepRef               = useRef(0);

  /* Init */
  useEffect(() => {
    const s = load();
    setState(s);
    stepRef.current = s.step;
    if (s.mode === "help") { setVis(true); return; }
    if (!s.dismissed && s.step < 4) {
      const t = setTimeout(() => { setVis(true); setExp(true); }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  /* Smart detection: avanza si el usuario ya completó pasos fuera del chat */
  useEffect(() => {
    if (!state || state.step === 0 || state.dismissed || state.mode === "help") return;
    let target = state.step;
    if (hasData && state.step < 4)         target = 4;
    else if (licenciaActiva && state.step < 3) target = 3;
    if (target !== state.step) upd({ step: target, reminders: 0, lastRem: 0 });
  }, [licenciaActiva, hasData]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Recordatorios */
  useEffect(() => {
    if (!state || state.dismissed || state.step === 0 || state.step >= 4) return;
    if (state.mode === "help" || state.reminders >= MAX_REMS) return;
    const wait = state.lastRem === 0 ? REM_DELAY : Math.max(0, REM_DELAY - (Date.now() - state.lastRem));
    const t = setTimeout(() => {
      if (stepRef.current !== state.step) return;
      setExp(true);
      upd({ reminders: state.reminders + 1, lastRem: Date.now() });
    }, wait);
    return () => clearTimeout(t);
  }, [state?.step, state?.reminders]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Poll licencia while user is in verifying state at step 2 */
  useEffect(() => {
    if (!verifying || !state || state.step !== 2) return;
    if (licenciaActiva) { setVerif(false); advance(3, "Perfecto. Ya quedó conectada."); return; }
    const id = setInterval(async () => {
      try {
        const r = await getLicencia();
        if (r.data.licencia) { setVerif(false); advance(3, "Perfecto. Ya quedó conectada."); }
      } catch { /* silencioso */ }
    }, 15_000);
    return () => clearInterval(id);
  }, [verifying, state?.step, licenciaActiva]); // eslint-disable-line react-hooks/exhaustive-deps

  function upd(partial: Partial<KState>) {
    setState(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      stepRef.current = next.step;
      save(next);
      return next;
    });
  }

  function advance(step: number, celebText?: string) {
    if (celebText) {
      setCeleb(celebText);
      setTimeout(() => { setCeleb(null); upd({ step, reminders: 0, lastRem: 0 }); }, 1800);
    } else {
      upd({ step, reminders: 0, lastRem: 0 });
    }
  }

  function finishActivation() {
    upd({ step: 4, mode: "help", reminders: 0, lastRem: 0 });
    setExp(false);
  }

  function dismiss() {
    upd({ dismissed: true });
    setVis(false);
  }

  if (!state || !visible) return null;

  /* ── Modo ayuda (pill persistente) ── */
  if (state.mode === "help" || state.step >= 4) {
    const helpMsg = HELP_MSGS[pathname] ?? null;

    if (!expanded) {
      return (
        <button
          onClick={() => setExp(true)}
          style={{
            position: "fixed", bottom: 24, left: 24, zIndex: 200,
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 14px", borderRadius: 99,
            background: "#1E3A8A", color: "#fff",
            border: "none", cursor: "pointer",
            fontSize: 12.5, fontWeight: 600, letterSpacing: "-0.01em",
            boxShadow: "0 4px 16px rgba(30,58,138,.30)",
          }}
        >
          <Zap size={13} fill="#fff" />
          Kairos
        </button>
      );
    }

    return (
      <div style={{
        position: "fixed", bottom: 24, left: 24, zIndex: 200,
        width: 300, borderRadius: 14,
        background: "#fff", border: "1px solid #E2E8F0",
        boxShadow: "0 8px 32px rgba(30,58,138,.14), 0 2px 8px rgba(0,0,0,.06)",
        overflow: "hidden",
      }}>
        <div style={{ background: "#1E3A8A", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Zap size={13} color="#fff" fill="#fff" />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Kairos</span>
          </div>
          <button onClick={() => setExp(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.65)", padding: 4, display: "flex" }}>
            <ChevronDown size={14} />
          </button>
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          {helpMsg ? (
            <>
              <p style={{ fontSize: 13.5, color: "#0F172A", lineHeight: 1.6, margin: "0 0 14px", whiteSpace: "pre-line" }}>{helpMsg}</p>
              <GhostBtn label="Cerrar" onClick={() => setExp(false)} />
            </>
          ) : (
            <>
              <p style={{ fontSize: 13.5, color: "#0F172A", lineHeight: 1.6, margin: "0 0 14px" }}>
                ¿Necesitás ayuda con algo?
              </p>
              <PrimaryBtn label="Ir a soporte →" href="mailto:soporte@ventasimple.com" />
              <GhostBtn label="Cerrar" onClick={() => setExp(false)} />
            </>
          )}
        </div>
      </div>
    );
  }

  /* ── Modo activación (pill minimizado) ── */
  if (!expanded) {
    const reminder = state.reminders === 1
      ? "Cuando quieras, seguimos con la configuración.\nTe falta un paso para empezar a vender."
      : state.reminders >= 2
        ? "Si querés, te llevo al siguiente paso.\nLo resolvemos en menos de un minuto."
        : null;

    return (
      <button
        onClick={() => setExp(true)}
        style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 200,
          display: "flex", alignItems: "center", gap: 7,
          padding: "8px 14px", borderRadius: 99,
          background: "#1E3A8A", color: "#fff",
          border: "none", cursor: "pointer",
          fontSize: 12.5, fontWeight: 600, letterSpacing: "-0.01em",
          boxShadow: reminder ? "0 0 0 3px rgba(249,115,22,.4), 0 4px 16px rgba(30,58,138,.30)" : "0 4px 16px rgba(30,58,138,.30)",
          animation: reminder ? "vs-highlight-pulse 1.1s ease-out 2" : "none",
        }}
      >
        <Zap size={13} fill="#fff" />
        Kairos · {TOTAL - state.step + 1} paso{TOTAL - state.step + 1 !== 1 ? "s" : ""}
      </button>
    );
  }

  /* ── Modo activación (expandido) ── */
  const progress = state.step === 0 ? 0 : Math.round((state.step / TOTAL) * 100);

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 200,
      width: 320, borderRadius: 16,
      background: "#fff", border: "1px solid #E2E8F0",
      boxShadow: "0 8px 40px rgba(30,58,138,.15), 0 2px 10px rgba(0,0,0,.07)",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{ background: "#1E3A8A", padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "grid", placeItems: "center" }}>
            <Zap size={13} color="#fff" fill="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>Kairos</p>
            {state.step > 0 && (
              <p style={{ fontSize: 10.5, color: "rgba(255,255,255,.55)", margin: 0 }}>
                {TOTAL - state.step === 1
                  ? "Te falta 1 paso para empezar a vender"
                  : `Paso ${state.step} de ${TOTAL}`}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          <button onClick={() => setExp(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.6)", padding: 5, display: "flex" }}>
            <ChevronDown size={14} />
          </button>
          <button onClick={dismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.6)", padding: 5, display: "flex" }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {state.step > 0 && (
        <div style={{ height: 3, background: "#EEF2FF" }}>
          <div style={{ height: "100%", background: "#F97316", width: `${progress}%`, borderRadius: "0 2px 2px 0", transition: "width .45s cubic-bezier(.4,0,.2,1)" }} />
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "18px 18px 20px" }}>
        {celeb ? (
          <CelebMsg text={celeb} />
        ) : (
          <>
            {state.step === 0 && (
              <>
                <Bubble text={"Soy Kairos.\nTe ayudo a configurar tu negocio y empezar a vender sin perder tiempo.\n¿Querés que te guíe?"} />
                <PrimaryBtn label="Sí, guiarme" onClick={() => advance(1)} />
                <GhostBtn   label="Prefiero explorar" onClick={dismiss} />
              </>
            )}

            {state.step === 1 && (
              <>
                <Bubble text={"Perfecto. Vamos paso a paso.\nPrimero descargá la app de escritorio para poder cobrar desde tu local."} />
                <PrimaryBtn label="Descargar app" href="/descargar" onClick={() => advance(2, "App descargada. Seguimos con la activación.")} />
                <GhostBtn   label="Ya la descargué →" onClick={() => advance(2, "App descargada. Seguimos con la activación.")} />
              </>
            )}

            {state.step === 2 && (
              <>
                {verifying ? (
                  <>
                    <Bubble text={"Todavía no detectamos la conexión.\nVerificá en Mi Cuenta que la activación esté completa."} />
                    <PrimaryBtn label="Ir a Mi Cuenta" href="/cuenta" onClick={() => {
                      setTimeout(() => highlightElement("sidebar-nav-cuenta"), 300);
                    }} />
                    <GhostBtn label="Ya está activa" onClick={async () => {
                      try {
                        const r = await getLicencia();
                        if (r.data.licencia) { setVerif(false); advance(3, "Perfecto. Ya quedó conectada."); }
                        else { setVErr(true); setTimeout(() => setVErr(false), 3000); }
                      } catch { setVErr(true); setTimeout(() => setVErr(false), 3000); }
                    }} />
                    {verifyErr && (
                      <p style={{ fontSize: 12, color: "#EF4444", margin: "6px 0 0", textAlign: "center" }}>
                        Todavía no detectamos la activación.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Bubble text={"Bien. Ya tenés la app.\nAhora activala desde tu cuenta y queda conectada con el panel."} />
                    <PrimaryBtn label="Ir a Mi Cuenta" href="/cuenta" onClick={() => {
                      setTimeout(() => highlightElement("sidebar-nav-cuenta"), 300);
                      setVerif(true);
                    }} />
                    <GhostBtn label="Ya la activé →" onClick={() => {
                      if (licenciaActiva) advance(3, "Perfecto. Ya quedó conectada.");
                      else setVerif(true);
                    }} />
                  </>
                )}
              </>
            )}

            {state.step === 3 && (
              <>
                <Bubble text={"Listo. Ya está conectada.\nProbemos una venta para que veas cómo funciona en la práctica."} />
                <PrimaryBtn label="Abrir la app desktop" href="/descargar" onClick={finishActivation} />
                <GhostBtn   label="Ya hice una venta →" onClick={finishActivation} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
