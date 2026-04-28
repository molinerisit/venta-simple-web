"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getSuscripcionEstado, getLicencia, type SuscripcionEstado } from "./api";

export type Licencia = {
  clave: string; plan: string; estado: string;
  activada_at: string; expira_at: string | null;
};

interface PlanCtx {
  plan: string;
  daysLeft: number | null;
  estado: SuscripcionEstado | null;
  licencia: Licencia | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const CACHE_KEY = "vs_plan_ctx";
const CACHE_TTL = 2 * 60 * 1000; // 2 min

function readCache(): Omit<PlanCtx, "loading" | "refresh"> | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CACHE_KEY) : null;
    if (!raw) return null;
    const { d, ts } = JSON.parse(raw);
    return Date.now() - ts < CACHE_TTL ? d : null;
  } catch { return null; }
}

function writeCache(d: Omit<PlanCtx, "loading" | "refresh">) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ d, ts: Date.now() })); } catch {}
}

function calcTrialDaysLeft(activadaAt: string | null): number | null {
  if (!activadaAt) return null;
  return Math.max(0, 14 - Math.floor((Date.now() - new Date(activadaAt).getTime()) / 86_400_000));
}

const Ctx = createContext<PlanCtx>({
  plan: "FREE", daysLeft: null, estado: null, licencia: null, loading: true,
  refresh: async () => {},
});

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const cached = readCache();
  const [state, setState] = useState<Omit<PlanCtx, "refresh">>({
    plan: cached?.plan ?? "FREE",
    daysLeft: cached?.daysLeft ?? null,
    estado: cached?.estado ?? null,
    licencia: cached?.licencia ?? null,
    loading: !cached,
  });

  const fetch_ = useCallback(async () => {
    try {
      const [sRes, lRes] = await Promise.all([getSuscripcionEstado(), getLicencia()]);
      const plan     = sRes.data.plan ?? "FREE";
      const licencia = lRes.data.licencia ?? null;
      const daysLeft = plan === "FREE" ? calcTrialDaysLeft(licencia?.activada_at ?? null) : null;
      const next = { plan, daysLeft, estado: sRes.data, licencia, loading: false };
      setState(next);
      writeCache(next);
    } catch (e) {
      console.warn("[UserPlanContext] fetch failed:", e);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetch_();
    const onVisible = () => { if (!document.hidden) fetch_(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetch_]);

  return (
    <Ctx.Provider value={{ ...state, refresh: fetch_ }}>
      {children}
    </Ctx.Provider>
  );
}

export const useUserPlan = () => useContext(Ctx);
