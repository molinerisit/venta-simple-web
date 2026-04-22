"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

/* ── Estado persistido en localStorage ───────────────────────── */
interface OState {
  step:        number;   // 0=intro 1=descarga 2=activar 3=primera-venta 4=done
  dismissed:   boolean;
  reminders:   number;   // cuántos recordatorios enviados
  lastRem:     number;   // timestamp del último recordatorio
}

const KEY = "vs_onboarding_v1";
const STEPS = 3;
const REM_DELAY = 45_000; // 45 segundos
const MAX_REMS  = 2;

function read(): OState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as OState;
  } catch { }
  return { step: 0, dismissed: false, reminders: 0, lastRem: 0 };
}

function write(s: OState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { }
}

/* ── Función de highlight exportable ─────────────────────────── */
export function highlightElement(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("vs-highlight");
  setTimeout(() => el.classList.remove("vs-highlight"), 3600);
}

/* ── Subcomponentes ───────────────────────────────────────────── */
function Bubble({ text }: { text: string }) {
  return (
    <div style={{
      background: "#F8FAFC", border: "1px solid #E9EAEC",
      borderRadius: "4px 12px 12px 12px",
      padding: "11px 14px", fontSize: 13.5, color: "#0F172A",
      lineHeight: 1.55, marginBottom: 14,
    }}>
      {text}
    </div>
  );
}

function PrimaryBtn({ label, onClick, href }: { label: string; onClick?: () => void; href?: string }) {
  const s: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: 40, width: "100%", borderRadius: 9,
    background: "#F97316", color: "#fff",
    fontWeight: 700, fontSize: 13.5, border: "none", cursor: "pointer",
    textDecoration: "none", letterSpacing: "-0.01em",
    boxShadow: "0 3px 12px rgba(249,115,22,.28)",
    marginBottom: 8,
  };
  if (href) return <Link href={href} style={s} onClick={onClick}>{label}</Link>;
  return <button type="button" style={s} onClick={onClick}>{label}</button>;
}

function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 36, width: "100%", borderRadius: 9,
      background: "transparent", color: "#64748B",
      fontWeight: 500, fontSize: 13,
      border: "1.5px solid #E2E8F0", cursor: "pointer",
    }}>
      {label}
    </button>
  );
}

/* ── Pasos ────────────────────────────────────────────────────── */
function StepIntro({ onStart, onDismiss }: { onStart: () => void; onDismiss: () => void }) {
  return (
    <>
      <Bubble text='Hola 👋 Te ayudo a configurar tu negocio en 2 minutos. ¿Arrancamos?' />
      <PrimaryBtn label="Sí, guiarme →" onClick={onStart} />
      <GhostBtn   label="Prefiero explorar solo" onClick={onDismiss} />
    </>
  );
}

function StepDownload({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Bubble text="Primero descargá la app de escritorio para empezar a cobrar desde tu PC." />
      <PrimaryBtn label="⬇ Descargar app" href="/descargar" onClick={onNext} />
      <GhostBtn   label="Ya la descargué →" onClick={onNext} />
    </>
  );
}

function StepActivate({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    // Highlight al ítem de Mi Cuenta en el sidebar
    setTimeout(() => highlightElement("sidebar-nav-cuenta"), 400);
  }, []);

  return (
    <>
      <Bubble text="Ahora activá la app desde Mi Cuenta. Vas a necesitar la clave de licencia." />
      <PrimaryBtn label="Ir a Mi Cuenta →" href="/cuenta" onClick={onNext} />
      <GhostBtn   label="Ya la activé →" onClick={onNext} />
    </>
  );
}

function StepFirstSale({ onDone }: { onDone: () => void }) {
  return (
    <>
      <Bubble text="¡Casi listo! Abrí la app de escritorio y registrá tu primera venta. Después volvé acá para ver las métricas en tiempo real." />
      <PrimaryBtn label="¡Entendido, empezar!" onClick={onDone} />
    </>
  );
}

/* ── Componente principal ─────────────────────────────────────── */
export default function OnboardingChat() {
  const [state,   setState]   = useState<OState | null>(null);
  const [min,     setMin]     = useState(false);
  const [visible, setVisible] = useState(false);
  const stepRef = useRef(0);

  /* Inicializar */
  useEffect(() => {
    const s = read();
    setState(s);
    stepRef.current = s.step;
    if (!s.dismissed && s.step < 4) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  /* Recordatorios */
  useEffect(() => {
    if (!state || state.dismissed || state.step === 0 || state.step >= 4) return;
    if (state.reminders >= MAX_REMS) return;

    const since = Date.now() - state.lastRem;
    const wait  = state.lastRem === 0 ? REM_DELAY : Math.max(0, REM_DELAY - since);

    const t = setTimeout(() => {
      setMin(false);
      setState(prev => {
        if (!prev || prev.step !== stepRef.current) return prev;
        const next = { ...prev, reminders: prev.reminders + 1, lastRem: Date.now() };
        write(next);
        return next;
      });
    }, wait);

    return () => clearTimeout(t);
  }, [state?.step, state?.reminders]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(partial: Partial<OState>) {
    setState(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      stepRef.current = next.step;
      write(next);
      return next;
    });
  }

  function dismiss() { update({ dismissed: true }); setVisible(false); }
  function advance(step: number) { update({ step, reminders: 0, lastRem: 0 }); }

  if (!state || !visible || state.dismissed || state.step >= 4) return null;

  const progress = state.step === 0 ? 0 : Math.round((state.step / STEPS) * 100);
  const stepsLeft = STEPS - state.step;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 200,
      width: 320,
      borderRadius: 16,
      background: "#fff",
      border: "1px solid #E2E8F0",
      boxShadow: "0 8px 40px rgba(30,58,138,.15), 0 2px 10px rgba(0,0,0,.07)",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        background: "#1E3A8A", padding: "11px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(255,255,255,.15)",
            display: "grid", placeItems: "center",
          }}>
            <Sparkles size={14} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
              Asistente VentaSimple
            </p>
            {state.step > 0 && state.step < 4 && (
              <p style={{ fontSize: 10.5, color: "rgba(255,255,255,.6)", margin: 0 }}>
                {stepsLeft === 1
                  ? "Te falta 1 paso para empezar a vender"
                  : `Te faltan ${stepsLeft} pasos · Paso ${state.step}/${STEPS}`}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 2 }}>
          <button
            onClick={() => setMin(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.65)", padding: 5, display: "flex" }}
          >
            {min ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={dismiss}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.65)", padding: 5, display: "flex" }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      {state.step > 0 && (
        <div style={{ height: 3, background: "#EEF2FF" }}>
          <div style={{
            height: "100%", background: "#F97316",
            width: `${progress}%`,
            borderRadius: "0 2px 2px 0",
            transition: "width .45s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>
      )}

      {/* Cuerpo */}
      {!min && (
        <div style={{ padding: "16px 18px 18px" }}>
          {state.step === 0 && <StepIntro    onStart={() => advance(1)} onDismiss={dismiss} />}
          {state.step === 1 && <StepDownload onNext={() => advance(2)} />}
          {state.step === 2 && <StepActivate onNext={() => advance(3)} />}
          {state.step === 3 && <StepFirstSale onDone={() => advance(4)} />}
        </div>
      )}
    </div>
  );
}
