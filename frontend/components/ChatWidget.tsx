"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "¿Cuánto cuesta?",
  "¿Funciona sin internet?",
  "¿Cómo empiezo?",
  "¿Qué incluye el soporte?",
];

function MarkdownText({ text }: { text: string }) {
  // Convierte **texto** en <strong> y saltos de línea en <br>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p.split("\n").map((line, j) => (
              <span key={j}>{line}{j < p.split("\n").length - 1 && <br />}</span>
            ))}</span>
      )}
    </span>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hola! Soy el asistente de VentaSimple. Puedo responder tus dudas sobre el sistema, planes, precios o cómo empezar. ¿En qué te ayudo?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json() as { answer: string };
      setMessages(prev => [...prev, { role: "bot", text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Hubo un problema. Escribinos a ventas@ventasimple.app y te respondemos enseguida." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Botón flotante ── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Abrir chat de ayuda"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%",
          background: "#1E3A8A",
          border: "none", cursor: "pointer",
          boxShadow: "0 6px 24px rgba(30,58,138,.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {/* Indicador de en línea */}
        {!open && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 11, height: 11, borderRadius: "50%",
            background: "#22c55e", border: "2px solid #0b1020",
          }}/>
        )}
      </button>

      {/* ── Panel del chat ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9998,
          width: 360, maxWidth: "calc(100vw - 40px)",
          borderRadius: 20, overflow: "hidden",
          background: "#0f172a",
          border: "1px solid rgba(30,58,138,.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(30,58,138,.15)",
          display: "flex", flexDirection: "column",
        }}>

          {/* Header */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.08)",
            background: "linear-gradient(135deg,rgba(30,58,138,.2),rgba(81,198,255,.08))",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "linear-gradient(135deg,#1E3A8A,#51c6ff)",
              display: "grid", placeItems: "center",
              fontWeight: 900, fontSize: 13, color: "#fff", flexShrink: 0,
            }}>VS</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e6e8ef" }}>Asistente VentaSimple</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}/>
                <span style={{ fontSize: 11, color: "#4ade80" }}>En línea · responde al instante</span>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 16px 8px",
            maxHeight: 340, display: "flex", flexDirection: "column", gap: 10,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user"
                    ? "#1E3A8A"
                    : "rgba(255,255,255,.06)",
                  border: m.role === "bot" ? "1px solid rgba(255,255,255,.08)" : "none",
                  fontSize: 13, lineHeight: 1.6,
                  color: m.role === "user" ? "#fff" : "#c4cde4",
                }}>
                  <MarkdownText text={m.text} />
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", width: "fit-content" }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#1E3A8A", display: "inline-block",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias (solo si el primer mensaje del bot está visible) */}
          {messages.length === 1 && (
            <div style={{ padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    padding: "5px 11px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: "rgba(30,58,138,.15)", border: "1px solid rgba(30,58,138,.3)",
                    color: "#1E3A8A", cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,.07)",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Escribí tu pregunta..."
              disabled={loading}
              style={{
                flex: 1, background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 10, padding: "9px 12px",
                fontSize: 13, color: "#e6e8ef", outline: "none",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: input.trim() ? "linear-gradient(135deg,#1E3A8A,#8b7fff)" : "rgba(255,255,255,.06)",
                border: "none", cursor: input.trim() ? "pointer" : "default",
                display: "grid", placeItems: "center", transition: "background .2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          <div style={{ padding: "6px 16px 10px", textAlign: "center", fontSize: 10, color: "rgba(163,172,195,.4)" }}>
            Respondemos en &lt; 5 min · ventas@ventasimple.app
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
