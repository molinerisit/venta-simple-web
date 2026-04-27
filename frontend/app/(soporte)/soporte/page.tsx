"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  getSupportConversations, getSupportMessages, sendSupportReply,
  resolveConversation, reopenConversation, getSupportTenants,
  getCommandCatalog, sendRemoteCommand, getCommandHistory,
  getAdminStats, getAdminTenants, adminActivarLicencia, suspenderTenant,
  reactivarTenant, getLicencias, generarLicencia, revocarLicencia,
  type SupportConversation, type SupportMessage, type TenantStatus,
  type CommandCatalogItem, type RemoteCommand, type AdminStats,
  type TenantAdmin, type Licencia,
} from "@/lib/api";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
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
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 0.25);
      osc.start(ctx.currentTime + i * 0.35);
      osc.stop(ctx.currentTime + i * 0.35 + 0.3);
    }
  } catch { /* sin audio */ }
}

const AGENT_QUICK_REPLIES = [
  "¡Hola! Soy Lucas del equipo de soporte de VentaSimple. Voy a ayudarte con tu consulta.",
  "Espere un momento mientras reviso su caso.",
  "¿Me puede describir el problema con más detalle?",
  "Entiendo. Ya identifiqué el problema y lo estoy resolviendo.",
  "Listo, el problema fue resuelto. ¿Hay algo más en lo que pueda ayudarte?",
  "Por favor, reinicie la aplicación e intente nuevamente.",
];

// ── Plan badge ────────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
  const cfg: Record<string, string> = {
    PRO:        "bg-emerald-100 text-emerald-700",
    ENTERPRISE: "bg-purple-100 text-purple-700",
    BASIC:      "bg-blue-100 text-blue-700",
    FREE:       "bg-gray-100 text-gray-500",
  };
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", cfg[plan] ?? cfg.FREE)}>
      {plan}
    </span>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center text-[#93C5FD]">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-600">{title}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

// ── ChatPanel ────────────────────────────────────────────────────────────────

function ChatPanel() {
  const [conversations,   setConversations]   = useState<SupportConversation[]>([]);
  const [selected,        setSelected]        = useState<SupportConversation | null>(null);
  const [messages,        setMessages]        = useState<SupportMessage[]>([]);
  const [reply,           setReply]           = useState("");
  const [sending,         setSending]         = useState(false);
  const [statusFilter,    setStatusFilter]    = useState<"active" | "resolved" | "all">("active");
  const [loading,         setLoading]         = useState(true);
  const [showCmds,        setShowCmds]        = useState(false);
  const [tenants,         setTenants]         = useState<TenantStatus[]>([]);
  const [catalog,         setCatalog]         = useState<CommandCatalogItem[]>([]);
  const [cmdTenant,       setCmdTenant]       = useState<TenantStatus | null>(null);
  const [sendingCmd,      setSendingCmd]      = useState<string | null>(null);
  const [cmdHistory,      setCmdHistory]      = useState<RemoteCommand[]>([]);
  const [portInput,       setPortInput]       = useState("");
  const [notifInput,      setNotifInput]      = useState("");
  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const msgPollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const convPollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    setLoading(true);
    loadConversations();
    if (convPollRef.current) clearInterval(convPollRef.current);
    convPollRef.current = setInterval(loadConversations, 10000);
    return () => { if (convPollRef.current) clearInterval(convPollRef.current); };
  }, [loadConversations]);

  useEffect(() => {
    if (msgPollRef.current) clearInterval(msgPollRef.current);
    if (!selected) return;
    loadMessages(selected.id);
    msgPollRef.current = setInterval(() => loadMessages(selected.id), 4000);
    return () => { if (msgPollRef.current) clearInterval(msgPollRef.current); };
  }, [selected, loadMessages]);

  useEffect(() => {
    getSupportTenants().then(({ data }) => setTenants(data)).catch(() => {});
    getCommandCatalog().then(({ data }) => setCatalog(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected || tenants.length === 0) { setCmdTenant(null); return; }
    const match = tenants.find(t =>
      t.nombre_negocio?.toLowerCase() === selected.business_name?.toLowerCase()
    );
    setCmdTenant(match ?? null);
    setCmdHistory([]);
  }, [selected, tenants]);

  useEffect(() => {
    if (!cmdTenant) return;
    getCommandHistory(cmdTenant.id).then(({ data }) => setCmdHistory(data)).catch(() => {});
  }, [cmdTenant]);

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

  async function handleCommand(type: string) {
    if (!cmdTenant) return;
    setSendingCmd(type);
    try {
      let params: Record<string, unknown> = {};
      if (type === "KILL_PORT") params = { port: Number(portInput) };
      if (type === "NOTIFY")    params = { message: notifInput };
      await sendRemoteCommand(cmdTenant.id, type, params);
      const { data } = await getCommandHistory(cmdTenant.id);
      setCmdHistory(data);
    } catch { /* silencioso */ }
    setSendingCmd(null);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        <div className="px-3 py-2.5 border-b border-gray-100 flex gap-1.5">
          {(["active", "resolved", "all"] as const).map(s => (
            <button key={s}
              onClick={() => { setStatusFilter(s); setSelected(null); }}
              className={cn(
                "flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors",
                statusFilter === s ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}>
              {s === "active" ? "Activas" : s === "resolved" ? "Resueltas" : "Todas"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col gap-2 p-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          )}
          {!loading && conversations.length === 0 && (
            <EmptyState
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
              title={statusFilter === "active" ? "Sin conversaciones activas" : "Sin conversaciones"}
              sub="Aparecerán aquí cuando los clientes escriban"
            />
          )}
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => setSelected(conv)}
              className={cn(
                "w-full text-left px-3 py-3 border-b border-gray-100 transition-colors",
                selected?.id === conv.id
                  ? "bg-blue-50 border-l-2 border-l-[#1E3A8A]"
                  : "hover:bg-gray-50 border-l-2 border-l-transparent"
              )}>
              <div className="flex items-start gap-2.5">
                <div className={cn(
                  "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold",
                  conv.status === "active" ? "bg-blue-100 text-[#1E3A8A]" : "bg-gray-100 text-gray-500"
                )}>
                  {initials(conv.business_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-sm font-semibold text-gray-900 truncate">{conv.business_name || "Sin nombre"}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(conv.updated_at)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{conv.last_message || "Sin mensajes"}</div>
                  <div className="flex gap-1.5 mt-1 items-center">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-[10px] font-medium",
                      conv.status === "active" ? "text-green-600" : "text-gray-400"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", conv.status === "active" ? "bg-green-500" : "bg-gray-300")} />
                      {conv.status === "active" ? "activa" : "resuelta"}
                    </span>
                    {conv.app_version && <span className="text-[10px] bg-gray-100 text-gray-500 rounded px-1">v{conv.app_version}</span>}
                    <span className="text-[10px] text-gray-400">{conv.msg_count} msg</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {!selected ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <EmptyState
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
            title="Seleccioná una conversación"
            sub="Las conversaciones aparecen en el panel de la izquierda"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Header */}
          <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-sm font-bold">
                {initials(selected.business_name)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{selected.business_name || "Sin nombre"}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", selected.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                    {selected.status === "active" ? "Activa" : "Resuelta"}
                  </span>
                  {selected.app_version && <span className="text-[10px] text-gray-400">v{selected.app_version}</span>}
                  <span className="text-[10px] text-gray-400 font-mono">{selected.client_id.slice(0, 8)}…</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCmds(v => !v)} className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                showCmds ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              )}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
                Acciones remotas
              </button>
              {selected.status === "active" ? (
                <button onClick={handleResolve} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Marcar resuelto
                </button>
              ) : (
                <button onClick={handleReopen} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors">
                  Reabrir
                </button>
              )}
            </div>
          </div>

          {/* Acciones remotas */}
          {showCmds && (
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones remotas</span>
                <select value={cmdTenant?.id ?? ""} onChange={e => setCmdTenant(tenants.find(t => t.id === e.target.value) ?? null)}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 bg-white focus:outline-none focus:border-[#1E3A8A]">
                  <option value="">— Seleccionar negocio —</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.nombre_negocio} ({t.plan})</option>)}
                </select>
              </div>
              {cmdTenant ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {catalog.filter(c => c.type !== "KILL_PORT" && c.type !== "NOTIFY").map(cmd => (
                      <button key={cmd.type} onClick={() => handleCommand(cmd.type)} disabled={sendingCmd === cmd.type} title={cmd.description}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50 transition-colors">
                        {sendingCmd === cmd.type ? "Enviando…" : cmd.type.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex gap-1.5 items-center">
                      <input value={portInput} onChange={e => setPortInput(e.target.value)} placeholder="Puerto (ej: 8080)"
                        className="w-32 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1E3A8A]" />
                      <button onClick={() => handleCommand("KILL_PORT")} disabled={!portInput || sendingCmd === "KILL_PORT"}
                        className="px-2.5 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors">Kill port</button>
                    </div>
                    <div className="flex gap-1.5 items-center flex-1">
                      <input value={notifInput} onChange={e => setNotifInput(e.target.value)} placeholder="Mensaje para el usuario…"
                        className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1E3A8A]" />
                      <button onClick={() => handleCommand("NOTIFY")} disabled={!notifInput || sendingCmd === "NOTIFY"}
                        className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors whitespace-nowrap">Notificar</button>
                    </div>
                  </div>
                  {cmdHistory.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Últimas acciones</div>
                      {cmdHistory.slice(0, 4).map(cmd => (
                        <div key={cmd.id} className="flex items-center gap-2 text-xs py-1 border-t border-gray-100">
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                            cmd.status === "done" ? "bg-green-100 text-green-700" : cmd.status === "error" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                          )}>{cmd.status}</span>
                          <span className="text-gray-700">{cmd.command_type.replace(/_/g, " ")}</span>
                          {!!cmd.result?.message && <span className="text-gray-400">{String(cmd.result.message)}</span>}
                          <span className="text-gray-400 ml-auto">{timeAgo(cmd.executed_at || cmd.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-400">Seleccioná un negocio para ejecutar acciones remotas.</div>
              )}
            </div>
          )}

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex",
                msg.sender === "support" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"
              )}>
                {msg.sender === "system" ? (
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-[11px] text-gray-400 whitespace-pre-wrap text-center px-2">{msg.text}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                ) : (
                  <div className="max-w-[72%] flex flex-col gap-0.5">
                    <div className={cn("px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
                      msg.sender === "support"
                        ? "bg-[#1E3A8A] text-white rounded-2xl rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-sm shadow-sm"
                    )}>{msg.text}</div>
                    <div className={cn("text-[10px] text-gray-400 px-1", msg.sender === "support" ? "text-right" : "text-left")}>
                      {fmtTime(msg.created_at)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selected.status === "active" && (
            <>
              <div className="px-4 pt-2 pb-0 flex gap-2 flex-wrap bg-white border-t border-gray-100">
                {AGENT_QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => setReply(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors whitespace-nowrap">
                    {q.length > 40 ? q.slice(0, 38) + "…" : q}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 bg-white flex gap-2 items-end border-t border-gray-100">
                <textarea value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Escribí tu respuesta… (Enter para enviar)"
                  rows={1}
                  className="flex-1 resize-none border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] text-gray-900 min-h-[40px] max-h-[120px] leading-relaxed"
                  onInput={e => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }}
                />
                <button onClick={handleSend} disabled={sending || !reply.trim()}
                  className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    sending || !reply.trim() ? "bg-gray-200 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-blue-800 cursor-pointer"
                  )}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── ClientesPanel ─────────────────────────────────────────────────────────────

function DiagBar({ label, pct, warn = 80, danger = 90 }: { label: string; pct?: number; warn?: number; danger?: number }) {
  if (pct === undefined || pct === null) return null;
  const color = pct >= danger ? "#EF4444" : pct >= warn ? "#F59E0B" : "#22C55E";
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <span className="text-xs text-gray-500 w-9 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full transition-all duration-300" />
      </div>
      <span style={{ color }} className="text-xs font-semibold w-8 text-right">{pct}%</span>
    </div>
  );
}

function TenantCard({ tenant, catalog, onRefresh }: { tenant: TenantStatus; catalog: CommandCatalogItem[]; onRefresh: () => void }) {
  const [expanded,  setExpanded]  = useState(false);
  const [history,   setHistory]   = useState<RemoteCommand[]>([]);
  const [sending,   setSending]   = useState<string | null>(null);
  const [portInput, setPortInput] = useState("");
  const [notifMsg,  setNotifMsg]  = useState("");

  const { level, label } = computeStatus(tenant);
  const d = tenant.diagnostic || {};

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

  const dotColor  = level === "alert" ? "bg-red-500 shadow-[0_0_0_3px_#FEE2E2]" : label === "Conectado" ? "bg-green-500" : "bg-gray-300";
  const textColor = level === "alert" ? "text-red-600" : label === "Conectado" ? "text-green-700" : "text-gray-500";

  return (
    <div className={cn("bg-white rounded-xl border mb-3 overflow-hidden transition-shadow hover:shadow-sm", level === "alert" ? "border-red-200" : "border-gray-200")}>
      <button className="w-full text-left px-4 py-3.5 flex items-start gap-3" onClick={() => setExpanded(e => !e)}>
        <span className={cn("w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0", dotColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{tenant.nombre_negocio}</span>
            <PlanBadge plan={tenant.plan} />
            {tenant.version_app && <span className="text-[10px] text-gray-400">v{tenant.version_app}</span>}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{tenant.email}</div>
          <div className="flex gap-3 mt-1.5 flex-wrap text-xs">
            <span className={cn("font-medium", textColor)}>{label}</span>
            <span className="text-gray-400">Ping: {timeAgo(tenant.last_seen_at)}</span>
            {tenant.hours.configured && tenant.hours.is_open && <span className="text-gray-400">Hoy: {tenant.hours.open_time}–{tenant.hours.close_time}</span>}
            {tenant.hours.configured && !tenant.hours.is_open && <span className="text-gray-400">Hoy: cerrado</span>}
            {!tenant.hours.configured && <span className="text-yellow-600 font-medium">Sin horario</span>}
            {d.cpu_pct  !== undefined && <span className={d.cpu_pct  >= 90 ? "text-red-500 font-medium" : "text-gray-400"}>CPU {d.cpu_pct}%</span>}
            {d.ram_pct  !== undefined && <span className={d.ram_pct  >= 90 ? "text-red-500 font-medium" : "text-gray-400"}>RAM {d.ram_pct}%</span>}
            {d.disk_pct !== undefined && <span className={d.disk_pct >= 90 ? "text-red-500 font-medium" : "text-gray-400"}>Disco {d.disk_pct}%</span>}
          </div>
        </div>
        <svg className={cn("w-4 h-4 text-gray-400 mt-1 flex-shrink-0 transition-transform", expanded && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Diagnóstico</div>
            {Object.keys(d).length === 0
              ? <div className="text-xs text-gray-400">Sin datos de diagnóstico.</div>
              : <><DiagBar label="CPU" pct={d.cpu_pct} /><DiagBar label="RAM" pct={d.ram_pct} /><DiagBar label="Disco" pct={d.disk_pct} /></>}
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Acciones remotas</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {catalog.filter(c => c.type !== "KILL_PORT" && c.type !== "NOTIFY").map(cmd => (
                <button key={cmd.type} onClick={() => handleCommand(cmd.type)} disabled={sending === cmd.type} title={cmd.description}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 bg-white text-gray-700 rounded-lg hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50 transition-colors">
                  {sending === cmd.type ? "Enviando…" : cmd.type.replace(/_/g, " ")}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1.5 items-center">
                <input value={portInput} onChange={e => setPortInput(e.target.value)} placeholder="Puerto"
                  className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1E3A8A]" />
                <button onClick={() => handleCommand("KILL_PORT")} disabled={!portInput || sending === "KILL_PORT"}
                  className="px-2.5 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors">Kill port</button>
              </div>
              <div className="flex gap-1.5 items-center flex-1">
                <input value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Mensaje para el usuario…"
                  className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1E3A8A]" />
                <button onClick={() => handleCommand("NOTIFY")} disabled={!notifMsg || sending === "NOTIFY"}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors">Notificar</button>
              </div>
            </div>
            {history.length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Historial</div>
                {history.slice(0, 6).map(cmd => (
                  <div key={cmd.id} className="flex items-center gap-2 py-1.5 border-t border-gray-100 text-xs">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                      cmd.status === "done" ? "bg-green-100 text-green-700" : cmd.status === "error" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                    )}>{cmd.status}</span>
                    <span className="text-gray-700">{cmd.command_type.replace(/_/g, " ")}</span>
                    {!!cmd.result?.message && <span className="text-gray-400">{String(cmd.result.message)}</span>}
                    <span className="text-gray-400 ml-auto flex-shrink-0">{timeAgo(cmd.executed_at || cmd.created_at)}</span>
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

function ClientesPanel() {
  const [tenants,    setTenants]    = useState<TenantStatus[]>([]);
  const [catalog,    setCatalog]    = useState<CommandCatalogItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());
  const [blink,      setBlink]      = useState(false);
  const [search,     setSearch]     = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadTenants = useCallback(async () => {
    try {
      const { data } = await getSupportTenants();
      setTenants(data);
      const newAlerts = data.filter(t => computeStatus(t).level === "alert" && !alertedIds.has(t.id));
      if (newAlerts.length > 0) {
        playAlert(); setBlink(true);
        setTimeout(() => setBlink(false), 3000);
        setAlertedIds(prev => { const n = new Set(prev); newAlerts.forEach(t => n.add(t.id)); return n; });
      }
      setAlertedIds(prev => { const n = new Set(prev); data.filter(t => computeStatus(t).level === "ok").forEach(t => n.delete(t.id)); return n; });
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

  const filtered = tenants.filter(t =>
    !search || t.nombre_negocio?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase())
  );
  const alerts = filtered.filter(t => computeStatus(t).level === "alert");
  const ok     = filtered.filter(t => computeStatus(t).level === "ok");

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#1E3A8A] text-gray-900 placeholder:text-gray-400" />
        </div>
      </div>
      {alerts.length > 0 && (
        <div className={cn("flex items-center gap-3 rounded-xl border border-red-200 px-4 py-3 mb-4 transition-colors", blink ? "bg-red-100" : "bg-red-50")}>
          <span className="text-lg">🔴</span>
          <div className="flex-1">
            <div className="font-semibold text-red-800 text-sm">{alerts.length} negocio{alerts.length > 1 ? "s" : ""} sin conexión en horario comercial</div>
            <div className="text-xs text-red-600 mt-0.5">{alerts.map(t => t.nombre_negocio).join(", ")}</div>
          </div>
          <button onClick={loadTenants} className="text-xs font-semibold text-red-700 bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">Actualizar</button>
        </div>
      )}
      {loading && <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />)}</div>}
      {alerts.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Sin conexión · horario comercial activo</div>
          {alerts.map(t => <TenantCard key={t.id} tenant={t} catalog={catalog} onRefresh={loadTenants} />)}
        </div>
      )}
      {ok.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {alerts.length > 0 ? `Resto (${ok.length})` : `Todos los negocios (${ok.length})`}
          </div>
          {ok.map(t => <TenantCard key={t.id} tenant={t} catalog={catalog} onRefresh={loadTenants} />)}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
          title={search ? `Sin resultados para "${search}"` : "No hay negocios registrados"}
          sub={search ? undefined : "Los clientes aparecerán aquí cuando instalen la app"}
        />
      )}
    </div>
  );
}

// ── AdminPanel ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color = "text-gray-900" }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
      <div className={cn("text-2xl font-bold", color)}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function AdminPanel() {
  const [stats,       setStats]       = useState<AdminStats | null>(null);
  const [tenants,     setTenants]     = useState<TenantAdmin[]>([]);
  const [licencias,   setLicencias]   = useState<Licencia[]>([]);
  const [search,      setSearch]      = useState("");
  const [loading,     setLoading]     = useState(true);
  const [activating,  setActivating]  = useState<string | null>(null);
  const [suspending,  setSuspending]  = useState<string | null>(null);
  const [generating,  setGenerating]  = useState(false);
  const [revoking,    setRevoking]    = useState<string | null>(null);
  const [newPlan,     setNewPlan]     = useState<Record<string, string>>({});
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: s }, { data: t }, { data: l }] = await Promise.all([
        getAdminStats(), getAdminTenants(), getLicencias(),
      ]);
      setStats(s); setTenants(t); setLicencias(l);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = tenants.filter(t =>
    !search || t.nombre_negocio?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleActivar(tenantId: string) {
    const plan = newPlan[tenantId] || "PRO";
    setActivating(tenantId);
    try {
      const { data } = await adminActivarLicencia(tenantId, plan);
      showToast(`Licencia ${plan} activada: ${data.clave}`);
      load();
    } catch { showToast("Error al activar", false); }
    setActivating(null);
  }

  async function handleSuspender(tenantId: string, activo: boolean) {
    setSuspending(tenantId);
    try {
      if (activo) await suspenderTenant(tenantId);
      else await reactivarTenant(tenantId);
      showToast(activo ? "Cuenta suspendida" : "Cuenta reactivada");
      load();
    } catch { showToast("Error", false); }
    setSuspending(null);
  }

  async function handleGenerar() {
    setGenerating(true);
    try {
      const { data } = await generarLicencia("PRO");
      showToast(`Licencia generada: ${data.claves?.[0]}`);
      load();
    } catch { showToast("Error al generar", false); }
    setGenerating(false);
  }

  async function handleRevocar(clave: string) {
    if (!confirm(`¿Revocar licencia ${clave}?`)) return;
    setRevoking(clave);
    try {
      await revocarLicencia(clave);
      showToast("Licencia revocada");
      load();
    } catch { showToast("Error al revocar", false); }
    setRevoking(null);
  }

  const licenciasActivas   = licencias.filter(l => l.estado === "ACTIVA");
  const licenciasDisponibles = licencias.filter(l => l.estado === "DISPONIBLE");

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-gray-50">

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg border transition-all",
          toast.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
        )}>{toast.msg}</div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total negocios" value={stats.total} />
          <StatCard label="Activos" value={stats.activos} color="text-emerald-600" />
          <StatCard label="Online ahora" value={stats.online} color="text-blue-600" />
          <StatCard label="Ventas 30d" value={`$${(stats.ventas_30d / 1000).toFixed(0)}K`} color="text-[#1E3A8A]" />
        </div>
      )}

      {/* Licencias */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900">Licencias</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {licenciasActivas.length} activas · {licenciasDisponibles.length} disponibles
            </div>
          </div>
          <button onClick={handleGenerar} disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {generating ? "Generando…" : "Nueva licencia PRO"}
          </button>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
        ) : licencias.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay licencias generadas.</div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {licencias.slice(0, 20).map(lic => (
              <div key={lic.id} className="px-5 py-2.5 flex items-center gap-3">
                <span className="font-mono text-xs text-gray-800 flex-1 truncate">{lic.clave}</span>
                <PlanBadge plan={lic.plan} />
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded",
                  lic.estado === "ACTIVA"      ? "bg-emerald-100 text-emerald-700" :
                  lic.estado === "DISPONIBLE"  ? "bg-blue-100 text-blue-600" :
                  lic.estado === "REVOCADA"    ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                )}>{lic.estado}</span>
                {lic.nombre_negocio && <span className="text-xs text-gray-500 truncate max-w-[120px]">{lic.nombre_negocio}</span>}
                <span className="text-[10px] text-gray-400 flex-shrink-0">{fmtDate(lic.created_at)}</span>
                {lic.estado !== "REVOCADA" && lic.estado !== "EXPIRADA" && (
                  <button onClick={() => handleRevocar(lic.clave)} disabled={revoking === lic.clave}
                    className="text-[10px] text-red-500 hover:text-red-700 font-semibold flex-shrink-0 disabled:opacity-50">
                    {revoking === lic.clave ? "…" : "Revocar"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tenants */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-bold text-gray-900 mb-3">Negocios registrados</div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email…"
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#1E3A8A] text-gray-900 placeholder:text-gray-400" />
          </div>
        </div>
        {loading ? (
          <div className="p-4 flex flex-col gap-2">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">{search ? `Sin resultados` : "No hay negocios."}</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(t => (
              <div key={t.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {initials(t.nombre_negocio)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 truncate">{t.nombre_negocio}</span>
                    <PlanBadge plan={t.plan} />
                    {!t.activo && <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">suspendido</span>}
                    {t.online && <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />online</span>}
                  </div>
                  <div className="text-xs text-gray-400">{t.email} · Reg. {fmtDate(t.created_at)}</div>
                </div>
                {/* Activar plan */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <select value={newPlan[t.id] || "PRO"} onChange={e => setNewPlan(p => ({ ...p, [t.id]: e.target.value }))}
                    className="text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-white focus:outline-none focus:border-[#1E3A8A]">
                    {["FREE","BASIC","PRO","ENTERPRISE"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => handleActivar(t.id)} disabled={activating === t.id}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap">
                    {activating === t.id ? "…" : "Activar"}
                  </button>
                  <button onClick={() => handleSuspender(t.id, t.activo)} disabled={suspending === t.id}
                    className={cn("px-2.5 py-1 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors border whitespace-nowrap",
                      t.activo ? "text-red-600 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    )}>
                    {suspending === t.id ? "…" : t.activo ? "Suspender" : "Reactivar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SoportePage() {
  const [activeTab, setActiveTab] = useState<"chat" | "clientes" | "admin">("chat");

  const TABS = [
    { id: "chat",      label: "Chat de soporte" },
    { id: "clientes",  label: "Clientes" },
    { id: "admin",     label: "Admin" },
  ] as const;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 52px)" }}>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-white px-5 flex-shrink-0">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              "py-3 px-5 text-sm font-semibold border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-[#1E3A8A] text-[#1E3A8A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}>
            {tab.label}
            {tab.id === "admin" && (
              <span className="ml-1.5 text-[9px] font-bold bg-[#1E3A8A] text-white px-1.5 py-0.5 rounded-full align-middle">SA</span>
            )}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {activeTab === "chat"     && <ChatPanel />}
        {activeTab === "clientes" && <ClientesPanel />}
        {activeTab === "admin"    && <AdminPanel />}
      </div>
    </div>
  );
}
