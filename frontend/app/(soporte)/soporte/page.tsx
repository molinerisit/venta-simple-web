"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  getSupportConversations, getSupportMessages, sendSupportReply,
  resolveConversation, reopenConversation, getSupportTenants,
  getCommandCatalog, sendRemoteCommand, getCommandHistory,
  type SupportConversation, type SupportMessage, type TenantStatus,
  type CommandCatalogItem, type RemoteCommand,
} from "@/lib/api";

const C = {
  blue:   "#1E3A8A",
  border: "#E2E8F0",
  bg:     "#F8FAFC",
  text:   "#0F172A",
  muted:  "#64748B",
};

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function timeAgo(iso: string | null) {
  if (!iso) return "nunca";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

type AlertLevel = "ok" | "alert" | "offline";

function computeStatus(t: TenantStatus): { level: AlertLevel; label: string } {
  const { hours, last_seen_at } = t;
  if (!hours.configured || !hours.is_open) return { level: "ok", label: "Fuera de horario" };

  const now  = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  const open  = toMinutes(hours.open_time!);
  const close = toMinutes(hours.close_time!) + 5;

  if (nowM < open || nowM > close) return { level: "ok", label: "Fuera de horario" };

  // Dentro del horario comercial
  if (!last_seen_at) return { level: "alert", label: "Sin conexión" };

  const minAgo = (Date.now() - new Date(last_seen_at).getTime()) / 60000;
  if (minAgo <= 75) return { level: "ok", label: "Conectado" };
  return { level: "alert", label: `Sin conexión · ${Math.round(minAgo)}m` };
}

function playAlert() {
  try {
    const ctx = new AudioContext();
    for (let i = 0; i < 3; i++) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 0.25);
      osc.start(ctx.currentTime + i * 0.35);
      osc.stop(ctx.currentTime + i * 0.35 + 0.3);
    }
  } catch { /* AudioContext no disponible */ }
}

// ── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel() {
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

  useEffect(() => { setLoading(true); loadConversations(); }, [loadConversations]);

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
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 300, borderRight: `1px solid ${C.border}`, background: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["active", "resolved", "all"] as const).map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setSelected(null); }}
                style={{
                  flex: 1, padding: "5px 0", border: "none", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer",
                  background: statusFilter === s ? C.blue : "#F1F5F9",
                  color:      statusFilter === s ? "#fff"  : C.muted,
                }}>
                {s === "active" ? "Activas" : s === "resolved" ? "Resueltas" : "Todas"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}>Cargando…</div>}
          {!loading && conversations.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}>
              Sin conversaciones {statusFilter === "active" ? "activas" : ""}
            </div>
          )}
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => setSelected(conv)} style={{
              padding: "12px 14px", borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
              background: selected?.id === conv.id ? "#EFF6FF" : "#fff",
              borderLeft: selected?.id === conv.id ? `3px solid ${C.blue}` : "3px solid transparent",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1, marginRight: 8 }}>
                  {conv.business_name || "Sin nombre"}
                </span>
                <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{timeAgo(conv.updated_at)}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {conv.last_message || "Sin mensajes"}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 5, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: C.muted }}>{conv.msg_count} msg</span>
                {conv.app_version && (
                  <span style={{ fontSize: 10, background: "#F1F5F9", color: C.muted, borderRadius: 4, padding: "1px 5px" }}>v{conv.app_version}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel mensajes */}
      {!selected ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 14 }}>
          Seleccioná una conversación
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{selected.business_name || "Sin nombre"}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                {selected.client_id.slice(0, 8)}… · v{selected.app_version} · {selected.status}
              </div>
            </div>
            <div>
              {selected.status === "active" ? (
                <button onClick={handleResolve} style={{ padding: "6px 14px", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#22C55E", color: "#fff", cursor: "pointer" }}>
                  ✓ Marcar resuelto
                </button>
              ) : (
                <button onClick={handleReopen} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#F1F5F9", color: C.muted, cursor: "pointer", border: `1px solid ${C.border}` }}>
                  Reabrir
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "support" ? "flex-end" : msg.sender === "system" ? "center" : "flex-start" }}>
                <div style={{
                  maxWidth: "72%", padding: msg.sender === "system" ? "4px 12px" : "9px 13px",
                  borderRadius: msg.sender === "system" ? 10 : msg.sender === "support" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: msg.sender === "system" ? 11 : 13, lineHeight: 1.45,
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  background: msg.sender === "support" ? C.blue : msg.sender === "system" ? "#F1F5F9" : "#fff",
                  color: msg.sender === "support" ? "#fff" : msg.sender === "system" ? C.muted : C.text,
                  border: msg.sender === "user" ? `1px solid ${C.border}` : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selected.status === "active" && (
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, background: "#fff", display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Escribí tu respuesta… (Enter para enviar)" rows={1}
                style={{ flex: 1, resize: "none", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", minHeight: 38, maxHeight: 120, lineHeight: 1.4, color: C.text }}
                onInput={e => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }}
              />
              <button onClick={handleSend} disabled={sending || !reply.trim()} style={{
                width: 38, height: 38, borderRadius: "50%", border: "none",
                background: sending || !reply.trim() ? "#CBD5E1" : C.blue,
                color: "#fff", cursor: sending || !reply.trim() ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
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

// ── Clientes panel ───────────────────────────────────────────────────────────

function ClientesPanel() {
  const [tenants,    setTenants]    = useState<TenantStatus[]>([]);
  const [catalog,    setCatalog]    = useState<CommandCatalogItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());
  const [blink,      setBlink]      = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadTenants = useCallback(async () => {
    try {
      const { data } = await getSupportTenants();
      setTenants(data);

      // Detectar nuevos que entraron en alerta
      const newAlerts = data.filter(t => computeStatus(t).level === "alert" && !alertedIds.has(t.id));
      if (newAlerts.length > 0) {
        playAlert();
        setBlink(true);
        setTimeout(() => setBlink(false), 3000);
        setAlertedIds(prev => {
          const next = new Set(prev);
          newAlerts.forEach(t => next.add(t.id));
          return next;
        });
      }
      // Limpiar alertas resueltas
      setAlertedIds(prev => {
        const next = new Set(prev);
        data.filter(t => computeStatus(t).level === "ok").forEach(t => next.delete(t.id));
        return next;
      });
    } catch { /* silencioso */ }
    setLoading(false);
  }, [alertedIds]);

  useEffect(() => {
    getCommandCatalog().then(({ data }) => setCatalog(data)).catch(() => {});
    loadTenants();
    pollRef.current = setInterval(loadTenants, 60000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alerts  = tenants.filter(t => computeStatus(t).level === "alert");
  const ok      = tenants.filter(t => computeStatus(t).level === "ok");

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20, background: C.bg }}>

      {/* Banner de alerta global */}
      {alerts.length > 0 && (
        <div style={{
          background: blink ? "#FEE2E2" : "#FEF2F2",
          border: "1px solid #FECACA", borderRadius: 10,
          padding: "12px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
          transition: "background .3s",
          animation: blink ? "pulse 0.5s ease-in-out 6" : "none",
        }}>
          <span style={{ fontSize: 20 }}>🔴</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 14 }}>
              {alerts.length} negocio{alerts.length > 1 ? "s" : ""} sin conexión en horario comercial
            </div>
            <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 2 }}>
              {alerts.map(t => t.nombre_negocio).join(", ")}
            </div>
          </div>
          <button onClick={loadTenants} style={{ marginLeft: "auto", padding: "5px 12px", border: "none", borderRadius: 6, background: "#FEE2E2", color: "#991B1B", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
            Actualizar
          </button>
        </div>
      )}

      {loading && <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Cargando…</div>}

      {/* Sección alertas */}
      {alerts.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
            Sin conexión · horario comercial activo
          </div>
          {alerts.map(t => <TenantCard key={t.id} tenant={t} catalog={catalog} />)}
          <div style={{ height: 20 }} />
        </>
      )}

      {/* Sección OK */}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
        Todos los negocios ({ok.length})
      </div>
      {ok.map(t => <TenantCard key={t.id} tenant={t} catalog={catalog} />)}
      {!loading && tenants.length === 0 && (
        <div style={{ textAlign: "center", color: C.muted, padding: 40, fontSize: 14 }}>
          No hay negocios registrados todavía.
        </div>
      )}
    </div>
  );
}

function DiagBar({ label, pct, warn = 80, danger = 90 }: { label: string; pct?: number; warn?: number; danger?: number }) {
  if (pct === undefined || pct === null) return null;
  const color = pct >= danger ? "#EF4444" : pct >= warn ? "#F59E0B" : "#22C55E";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: C.muted, width: 36, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width .3s" }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600, width: 34, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

function TenantCard({ tenant, catalog }: { tenant: TenantStatus; catalog: CommandCatalogItem[] }) {
  const [expanded,  setExpanded]  = useState(false);
  const [history,   setHistory]   = useState<RemoteCommand[]>([]);
  const [sending,   setSending]   = useState<string | null>(null);
  const [portInput, setPortInput] = useState("");
  const [notifMsg,  setNotifMsg]  = useState("");

  const { level, label } = computeStatus(tenant);
  const statusColor = level === "alert" ? "#DC2626" : label === "Conectado" ? "#16A34A" : C.muted;
  const dot         = level === "alert" ? "#EF4444" : label === "Conectado" ? "#22C55E" : "#94A3B8";
  const d           = tenant.diagnostic || {};

  async function loadHistory() {
    try { const { data } = await getCommandHistory(tenant.id); setHistory(data); } catch { /* */ }
  }

  async function handleCommand(type: string) {
    setSending(type);
    try {
      let params: Record<string, unknown> = {};
      if (type === "KILL_PORT") params = { port: Number(portInput) };
      if (type === "NOTIFY")    params = { message: notifMsg };
      await sendRemoteCommand(tenant.id, type, params);
      await loadHistory();
    } catch { /* */ }
    setSending(null);
  }

  useEffect(() => { if (expanded) loadHistory(); }, [expanded]);

  return (
    <div style={{
      background: "#fff", border: `1px solid ${level === "alert" ? "#FECACA" : C.border}`,
      borderRadius: 10, marginBottom: 10, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: dot, marginTop: 5, flexShrink: 0, boxShadow: level === "alert" ? "0 0 0 3px #FEE2E2" : "none" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{tenant.nombre_negocio}</span>
            <span style={{ fontSize: 11, background: "#F1F5F9", color: C.muted, borderRadius: 4, padding: "1px 6px" }}>{tenant.plan}</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{tenant.email}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: statusColor, fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 12, color: C.muted }}>Ping: {timeAgo(tenant.last_seen_at)}</span>
            {tenant.version_app && <span style={{ fontSize: 12, color: C.muted }}>v{tenant.version_app}</span>}
            {tenant.hours.configured && tenant.hours.is_open && <span style={{ fontSize: 12, color: C.muted }}>Hoy: {tenant.hours.open_time}–{tenant.hours.close_time}</span>}
            {tenant.hours.configured && !tenant.hours.is_open && <span style={{ fontSize: 12, color: C.muted }}>Hoy: cerrado</span>}
            {!tenant.hours.configured && <span style={{ fontSize: 12, color: "#F59E0B" }}>Sin horario</span>}
            {/* Métricas rápidas */}
            {d.cpu_pct  !== undefined && <span style={{ fontSize: 12, color: d.cpu_pct  >= 90 ? "#EF4444" : C.muted }}>CPU {d.cpu_pct}%</span>}
            {d.ram_pct  !== undefined && <span style={{ fontSize: 12, color: d.ram_pct  >= 90 ? "#EF4444" : C.muted }}>RAM {d.ram_pct}%</span>}
            {d.disk_pct !== undefined && <span style={{ fontSize: 12, color: d.disk_pct >= 90 ? "#EF4444" : C.muted }}>Disco {d.disk_pct}%</span>}
          </div>
        </div>
        <span style={{ fontSize: 16, color: C.muted, marginLeft: 8 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Panel expandido */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 16px", background: "#FAFBFC" }}>

          {/* Diagnóstico */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Diagnóstico del sistema</div>
            {Object.keys(d).length === 0
              ? <div style={{ fontSize: 12, color: C.muted }}>Sin datos — el negocio no ha pingado con métricas aún</div>
              : <>
                  <DiagBar label="CPU"   pct={d.cpu_pct}  />
                  <DiagBar label="RAM"   pct={d.ram_pct}  />
                  <DiagBar label="Disco" pct={d.disk_pct} />
                  {d.ram_free_mb !== undefined && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{d.ram_free_mb} MB RAM libre</div>}
                </>
            }
          </div>

          {/* Comandos remotos */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Acciones remotas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {catalog.filter(c => c.type !== "KILL_PORT" && c.type !== "NOTIFY").map(cmd => (
                <button key={cmd.type} onClick={() => handleCommand(cmd.type)} disabled={sending === cmd.type}
                  title={cmd.description}
                  style={{
                    padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 6,
                    background: sending === cmd.type ? "#F1F5F9" : "#fff",
                    color: C.text, fontSize: 12, cursor: "pointer", fontWeight: 500,
                  }}>
                  {sending === cmd.type ? "..." : cmd.type.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* KILL_PORT con input */}
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={portInput} onChange={e => setPortInput(e.target.value)} placeholder="Puerto (ej: 8080)"
                style={{ width: 130, padding: "5px 8px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
              <button onClick={() => handleCommand("KILL_PORT")} disabled={!portInput || sending === "KILL_PORT"}
                style={{ padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", color: "#DC2626", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                {sending === "KILL_PORT" ? "..." : "Kill port"}
              </button>
            </div>

            {/* NOTIFY con input */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <input value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Mensaje para el usuario..."
                style={{ flex: 1, padding: "5px 8px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
              <button onClick={() => handleCommand("NOTIFY")} disabled={!notifMsg || sending === "NOTIFY"}
                style={{ padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 6, background: C.blue, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                {sending === "NOTIFY" ? "..." : "Notificar"}
              </button>
            </div>

            {/* Historial */}
            {history.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Historial de acciones</div>
                {history.slice(0, 8).map(cmd => (
                  <div key={cmd.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 10, background: cmd.status === "done" ? "#DCFCE7" : cmd.status === "error" ? "#FEE2E2" : "#F1F5F9", color: cmd.status === "done" ? "#15803D" : cmd.status === "error" ? "#DC2626" : C.muted, borderRadius: 4, padding: "1px 5px", flexShrink: 0 }}>
                      {cmd.status}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 12, color: C.text }}>{cmd.command_type}</span>
                      {cmd.result?.message && <span style={{ fontSize: 11, color: C.muted, marginLeft: 6 }}>{String(cmd.result.message)}</span>}
                    </div>
                    <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{timeAgo(cmd.executed_at || cmd.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function SoportePage() {
  const [activeTab, setActiveTab] = useState<"chat" | "clientes">("chat");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>

      {/* Tabs principales */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: "#fff", padding: "0 20px", flexShrink: 0 }}>
        {(["chat", "clientes"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "12px 20px", border: "none", background: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            color:        activeTab === tab ? C.blue : C.muted,
            borderBottom: activeTab === tab ? `2px solid ${C.blue}` : "2px solid transparent",
            marginBottom: -1,
          }}>
            {tab === "chat" ? "Chat de soporte" : "Clientes"}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        {activeTab === "chat"     && <ChatPanel />}
        {activeTab === "clientes" && <ClientesPanel />}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
