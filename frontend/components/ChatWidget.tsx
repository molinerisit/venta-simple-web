"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message { role: "user" | "bot"; text: string; }

/* ── Proactive bubbles ───────────────────────────────── */
const PROACTIVE: { id: string; section: string | null; delay?: number; text: string }[] = [
  { id: "idle",    section: null,             delay: 30000, text: "¿Querés que te muestre cómo funciona en 1 minuto?" },
  { id: "pricing", section: "#pricing",       delay: 0,     text: "¿Querés que te recomiende el mejor plan para tu negocio?" },
  { id: "demo",    section: "#como-funciona", delay: 0,     text: "¿Tenés dudas sobre si funciona en tu PC?" },
];

/* ── Quick actions ───────────────────────────────────── */
const QUICK = [
  { label: "Cómo funciona",         q: "¿Cómo funciona el sistema?"        },
  { label: "Ver precios",           q: "¿Cuánto cuesta?"                   },
  { label: "¿Funciona sin internet?", q: "¿Funciona sin conexión a internet?" },
  { label: "¿Sirve para mi negocio?", q: "¿Sirve para mi negocio?"          },
];

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p.split("\n").map((line, j, arr) => (
              <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
            ))}</span>
      )}
    </span>
  );
}

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [bubble, setBubble]     = useState<string | null>(null);
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hola 👋\nSoy el asistente de VentaSimple.\nTe ayudo a ver si el sistema sirve para tu negocio.\n¿En qué estás?" },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const openRef    = useRef(open);
  openRef.current  = open;

  /* Show a bubble if chat is closed and this id hasn't been shown yet */
  const tryBubble = useCallback((id: string, text: string) => {
    if (openRef.current) return;
    setShownIds(prev => {
      if (prev.has(id)) return prev;
      setBubble(text);
      setTimeout(() => setBubble(b => b === text ? null : b), 8000);
      return new Set([...prev, id]);
    });
  }, []);

  /* Idle timer trigger */
  useEffect(() => {
    const entry = PROACTIVE.find(p => p.id === "idle");
    if (!entry) return;
    const t = setTimeout(() => tryBubble("idle", entry.text), entry.delay!);
    return () => clearTimeout(t);
  }, [tryBubble]);

  /* Scroll-based triggers via IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionTriggers = [
      { selector: "#pricing",        id: "pricing" },
      { selector: "#como-funciona",  id: "demo"    },
    ];
    sectionTriggers.forEach(({ selector, id }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const entry = PROACTIVE.find(p => p.id === id);
      if (!entry) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) tryBubble(id, entry.text); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [tryBubble]);

  /* Scroll bottom on new message */
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      if (messages[messages.length - 1]?.role === "bot") {
        setTimeout(() => inputRef.current?.focus(), 80);
      }
    }
  }, [open, messages]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setBubble(null);
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json() as { answer: string };
      setMessages(prev => [...prev, { role: "bot", text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Algo falló de nuestro lado. Escribinos a ventas@ventasimple.app y te respondemos al toque.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function openFromBubble() {
    setBubble(null);
    setOpen(true);
  }

  const isFirstMessage = messages.length === 1;

  return (
    <>
      {/* ── Proactive bubble ── */}
      {bubble && !open && (
        <button
          onClick={openFromBubble}
          style={{
            position: "fixed", bottom: 98, right: 28, zIndex: 9997,
            maxWidth: 240,
            background: "#fff",
            border: "1px solid #E2E0DA",
            borderRadius: "14px 14px 4px 14px",
            padding: "10px 14px",
            boxShadow: "0 8px 28px rgba(0,0,0,.10)",
            cursor: "pointer", textAlign: "left",
            animation: "chat-bubble-in 0.3s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1816", lineHeight: 1.45 }}>
            {bubble}
          </div>
          <div style={{ fontSize: 10, color: "#A39D97", marginTop: 4, fontWeight: 500 }}>
            VentaSimple · toca para responder
          </div>
        </button>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => { setOpen(v => !v); setBubble(null); }}
        aria-label="Abrir chat"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 52, height: 52, borderRadius: "50%",
          background: "#1E3A8A",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(30,58,138,.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .18s, box-shadow .18s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.07)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(30,58,138,.55)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,58,138,.45)"; }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {/* Online dot */}
        {!open && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            width: 10, height: 10, borderRadius: "50%",
            background: "#22C55E", border: "2px solid #fff",
          }}/>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 28, zIndex: 9998,
          width: 348, maxWidth: "calc(100vw - 40px)",
          borderRadius: 18, overflow: "hidden",
          background: "#fff",
          border: "1px solid #E2E0DA",
          boxShadow: "0 24px 64px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)",
          display: "flex", flexDirection: "column",
          animation: "chat-panel-in 0.25s cubic-bezier(.34,1.56,.64,1) both",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "#1E3A8A",
            display: "flex", alignItems: "center", gap: 11,
          }}>
            {/* Avatar — icono de chat en lugar de "VS" */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,.15)",
              display: "grid", placeItems: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>VentaSimple</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }}/>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 500 }}>
                  En línea ahora · &lt; 5 min de respuesta
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "grid", placeItems: "center", opacity: .6 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 14px 10px",
            maxHeight: 300, display: "flex", flexDirection: "column", gap: 8,
            background: "#FAFAF9",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "9px 13px",
                  borderRadius: m.role === "user"
                    ? "14px 14px 3px 14px"
                    : "14px 14px 14px 3px",
                  background: m.role === "user" ? "#1E3A8A" : "#fff",
                  border: m.role === "bot" ? "1px solid #E2E0DA" : "none",
                  fontSize: 13, lineHeight: 1.55,
                  color: m.role === "user" ? "#fff" : "#1A1816",
                  boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                }}>
                  <MarkdownText text={m.text} />
                </div>
              </div>
            ))}

            {loading && (
              <div style={{
                display: "flex", gap: 4, padding: "10px 13px",
                background: "#fff", border: "1px solid #E2E0DA",
                borderRadius: "14px 14px 14px 3px", width: "fit-content",
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#C4C0BB", display: "inline-block",
                    animation: `chat-dot 1.2s ease-in-out ${i * 0.18}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions — only on first message */}
          {isFirstMessage && (
            <div style={{
              padding: "10px 14px 4px",
              background: "#FAFAF9",
              borderTop: "1px solid #F0EEE9",
              display: "flex", flexWrap: "wrap", gap: 6,
            }}>
              {QUICK.map(({ label, q }) => (
                <button
                  key={label}
                  onClick={() => send(q)}
                  style={{
                    padding: "6px 12px", borderRadius: 99,
                    fontSize: 12, fontWeight: 600,
                    background: "#fff",
                    border: "1.5px solid #E2E0DA",
                    color: "#1E3A8A",
                    cursor: "pointer",
                    transition: "border-color .15s, background .15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1E3A8A"; e.currentTarget.style.background = "#EEF2FE"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E0DA"; e.currentTarget.style.background = "#fff"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid #E2E0DA",
            display: "flex", gap: 8, alignItems: "center",
            background: "#fff",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Escribí tu duda o tocá una opción ↑"
              disabled={loading}
              style={{
                flex: 1,
                background: "#F5F4F1",
                border: "1.5px solid transparent",
                borderRadius: 10, padding: "9px 12px",
                fontSize: 13, color: "#1A1816", outline: "none",
                transition: "border-color .15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#1E3A8A")}
              onBlur={e =>  (e.currentTarget.style.borderColor = "transparent")}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: input.trim() ? "#1E3A8A" : "#F0EEE9",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "grid", placeItems: "center",
                transition: "background .15s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() ? "#fff" : "#C4C0BB"}
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          <div style={{
            padding: "5px 14px 9px", textAlign: "center",
            fontSize: 10, color: "#C4C0BB", background: "#fff",
          }}>
            Respuesta en &lt; 5 min · soporte humano real
          </div>

        </div>
      )}

      <style>{`
        @keyframes chat-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chat-bubble-in {
          from { opacity: 0; transform: translateY(8px) scale(.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chat-panel-in {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
