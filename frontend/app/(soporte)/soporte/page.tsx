"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  getSupportConversations, getSupportMessages, sendSupportReply,
  resolveConversation, reopenConversation,
  type SupportConversation, type SupportMessage,
} from "@/lib/api";

const C = {
  blue:   "#1E3A8A",
  border: "#E2E8F0",
  bg:     "#F8FAFC",
  text:   "#0F172A",
  muted:  "#64748B",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function SoportePage() {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selected,      setSelected]      = useState<SupportConversation | null>(null);
  const [messages,      setMessages]      = useState<SupportMessage[]>([]);
  const [reply,         setReply]         = useState("");
  const [sending,       setSending]       = useState(false);
  const [statusFilter,  setStatusFilter]  = useState<"active" | "resolved" | "all">("active");
  const [loading,       setLoading]       = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await getSupportConversations(statusFilter);
      setConversations(data);
    } catch { /* silencioso */ }
    setLoading(false);
  }, [statusFilter]);

  const loadMessages = useCallback(async (convId: string) => {
    try {
      const { data } = await getSupportMessages(convId);
      setMessages(data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch { /* silencioso */ }
  }, []);

  // Cargar conversaciones
  useEffect(() => { setLoading(true); loadConversations(); }, [loadConversations]);

  // Polling mensajes del seleccionado
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!selected) return;
    loadMessages(selected.id);
    pollRef.current = setInterval(() => loadMessages(selected.id), 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selected, loadMessages]);

  async function handleSend() {
    if (!selected || !reply.trim() || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");
    try {
      await sendSupportReply(selected.id, text);
      await loadMessages(selected.id);
    } catch { setReply(text); }
    setSending(false);
  }

  async function handleResolve() {
    if (!selected) return;
    await resolveConversation(selected.id);
    setSelected(null);
    loadConversations();
  }

  async function handleReopen() {
    if (!selected) return;
    await reopenConversation(selected.id);
    loadConversations();
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 52px)", overflow: "hidden" }}>

      {/* ── Sidebar conversaciones ─────────────────────────────── */}
      <div style={{
        width: 300, borderRight: `1px solid ${C.border}`, background: "#fff",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        {/* Filtros */}
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["active", "resolved", "all"] as const).map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setSelected(null); }}
                style={{
                  flex: 1, padding: "5px 0", border: "none", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer",
                  background: statusFilter === s ? C.blue : "#F1F5F9",
                  color:      statusFilter === s ? "#fff"  : C.muted,
                  transition: "background .15s",
                }}
              >
                {s === "active" ? "Activas" : s === "resolved" ? "Resueltas" : "Todas"}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}>
              Cargando…
            </div>
          )}
          {!loading && conversations.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}>
              Sin conversaciones {statusFilter === "active" ? "activas" : ""}
            </div>
          )}
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelected(conv)}
              style={{
                padding: "12px 14px",
                borderBottom: `1px solid ${C.border}`,
                cursor: "pointer",
                background: selected?.id === conv.id ? "#EFF6FF" : "#fff",
                borderLeft: selected?.id === conv.id ? `3px solid ${C.blue}` : "3px solid transparent",
                transition: "background .1s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1, marginRight: 8 }}>
                  {conv.business_name || "Sin nombre"}
                </span>
                <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>
                  {timeAgo(conv.updated_at)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {conv.last_message || "Sin mensajes"}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 5, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: C.muted }}>{conv.msg_count} msg</span>
                {conv.app_version && (
                  <span style={{ fontSize: 10, background: "#F1F5F9", color: C.muted, borderRadius: 4, padding: "1px 5px" }}>
                    v{conv.app_version}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel mensajes ─────────────────────────────────────── */}
      {!selected ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 14 }}>
          Seleccioná una conversación
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header conversación */}
          <div style={{
            padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                {selected.business_name || "Sin nombre"}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                {selected.client_id.slice(0, 8)}… · v{selected.app_version} · {selected.status}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {selected.status === "active" ? (
                <button onClick={handleResolve} style={{
                  padding: "6px 14px", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: "#22C55E", color: "#fff", cursor: "pointer",
                }}>
                  ✓ Marcar resuelto
                </button>
              ) : (
                <button onClick={handleReopen} style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: "#F1F5F9", color: C.muted, cursor: "pointer", border: `1px solid ${C.border}`,
                }}>
                  Reabrir
                </button>
              )}
            </div>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: "flex",
                justifyContent: msg.sender === "support" ? "flex-end"
                  : msg.sender === "system" ? "center" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "72%",
                  padding: msg.sender === "system" ? "4px 12px" : "9px 13px",
                  borderRadius: msg.sender === "system" ? 10 : msg.sender === "support" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: msg.sender === "system" ? 11 : 13,
                  lineHeight: 1.45,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  background: msg.sender === "support" ? C.blue
                    : msg.sender === "system" ? "#F1F5F9" : "#fff",
                  color: msg.sender === "support" ? "#fff"
                    : msg.sender === "system" ? C.muted : C.text,
                  border: msg.sender === "user" ? `1px solid ${C.border}` : "none",
                  boxShadow: msg.sender === "user" ? "0 1px 3px rgba(0,0,0,.06)" : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input respuesta */}
          {selected.status === "active" && (
            <div style={{
              padding: "10px 16px", borderTop: `1px solid ${C.border}`,
              background: "#fff", display: "flex", gap: 8, alignItems: "flex-end",
            }}>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Escribí tu respuesta… (Enter para enviar)"
                rows={1}
                style={{
                  flex: 1, resize: "none", border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: "9px 14px", fontSize: 13,
                  fontFamily: "inherit", outline: "none", minHeight: 38, maxHeight: 120,
                  lineHeight: 1.4, color: C.text,
                }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={handleSend} disabled={sending || !reply.trim()}
                style={{
                  width: 38, height: 38, borderRadius: "50%", border: "none",
                  background: sending || !reply.trim() ? "#CBD5E1" : C.blue,
                  color: "#fff", cursor: sending || !reply.trim() ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  transition: "background .15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
