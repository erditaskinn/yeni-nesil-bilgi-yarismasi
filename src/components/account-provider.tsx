"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getMembershipClient } from "../lib/supabase-client";
import { GAME_CATEGORIES } from "../lib/categories";
import { DIFFICULTIES } from "../lib/config";
import { MAX_SCORE, parseMemberScores, cloudCategory, type MemberScore } from "../lib/membership";
import { readHighScores, saveHighScore } from "../lib/storage";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { accountPath } from "../lib/account-copy";
import { exchangeGoogleCode, parseGoogleCallback } from "../lib/google-auth";
import { readStatistics, type GameRecord } from "../lib/statistics";
import { afterProfileClear } from "../lib/knowledge-profile";

type AccountContextValue = {
  client: SupabaseClient | null; ready: boolean; user: User | null;
  googleError: boolean;
  nickname: string; scores: MemberScore[]; revision: number;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  sync: () => Promise<void>; setNickname: (name: string) => void;
  saveResult: (owner: string | undefined, score: MemberScore) => void;
  profileRecords: GameRecord[]; profileCutoff: string | null; profileSyncStatus: "idle" | "syncing" | "synced" | "error";
  saveProfileRecord: (record: GameRecord) => void;
  syncProfile: () => Promise<void>; clearProfile: () => Promise<boolean>;
};
const AccountContext = createContext<AccountContextValue | null>(null);
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [scores, setScores] = useState<MemberScore[]>([]);
  const [revision, setRevision] = useState(0);
  const [syncStatus, setSyncStatus] = useState<AccountContextValue["syncStatus"]>("idle");
  const [profileRecords, setProfileRecords] = useState<GameRecord[]>([]);
  const [profileCutoff, setProfileCutoff] = useState<string | null>(null);
  const [profileSyncStatus, setProfileSyncStatus] = useState<AccountContextValue["profileSyncStatus"]>("idle");
  const pendingProfile = useRef(new Map<string, GameRecord>());
  const profileSyncRun = useRef<Promise<void> | null>(null);
  const profileClearing = useRef(false);
  const ownerRef = useRef<string | undefined>(undefined);
  const userId = user?.id;
  const syncing = useRef(new Set<string>());
  const queued = useRef(new Set<string>());
  const pendingScores = useRef(new Map<string, Map<string, MemberScore>>());

  useEffect(() => {
    const sdk = getMembershipClient();
    let active = true;
    let events = 0;
    let nativeListener: PluginListenerHandle | undefined;
    const finishGoogle = async (value: string, native = false) => {
      const callback = parseGoogleCallback(value, native ? undefined : window.location.origin);
      if (!callback || !sdk || !active) return;
      if (!native) window.history.replaceState(null, "", accountPath(callback.locale));
      const success = !callback.failed && callback.code && await exchangeGoogleCode(sdk, callback.code);
      if (!active) return;
      setGoogleError(!success);
      if (native && success && window.location.pathname.replace(/\/$/, "") !== accountPath(callback.locale)) window.location.assign(accountPath(callback.locale));
    };
    const subscription = sdk?.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      events++;
      ownerRef.current = session?.user.id;
      setUser(session?.user ?? null);
      setReady(true);
    }).data.subscription;
    // No awaited SDK calls inside onAuthStateChange: it holds the auth lock.
    Promise.resolve().then(async () => {
      if (!active) return;
      setClient(sdk);
      if (sdk) {
        try {
          await finishGoogle(window.location.href);
          if (Capacitor.isNativePlatform()) {
            const { App } = await import("@capacitor/app");
            const handle = await App.addListener("appUrlOpen", event => { void finishGoogle(event.url, true); });
            if (!active) { await handle.remove(); return; }
            nativeListener = handle;
            const launch = await App.getLaunchUrl();
            if (launch?.url) await finishGoogle(launch.url, true);
          }
          const generation = events;
          const { data } = await sdk.auth.getSession();
          if (active && events === generation) { ownerRef.current = data.session?.user.id; setUser(data.session?.user ?? null); }
        } catch { /* Offline guest play remains available. */ }
      }
      if (active) setReady(true);
    });
    return () => { active = false; subscription?.unsubscribe(); void nativeListener?.remove(); };
  }, []);

  const sync = useCallback(async function syncScores() {
    const owner = userId;
    if (!client || !owner) return;
    if (syncing.current.has(owner)) { queued.current.add(owner); return; }
    syncing.current.add(owner);
    setSyncStatus("syncing");
    try {
      const remote = await client.from("personal_bests").select("category,difficulty,score").eq("user_id", owner);
      if (remote.error) throw remote.error;
      if (ownerRef.current !== owner) return;
      const merged = parseMemberScores(remote.data);
      for (const row of merged) saveHighScore(row.difficulty, row.score, undefined, row.category, owner);
      const local = parseMemberScores([...GAME_CATEGORIES.flatMap(category => DIFFICULTIES.flatMap(difficulty => {
        const score = readHighScores(undefined, category, owner)[difficulty];
        return score !== undefined && score <= MAX_SCORE ? [{ category, difficulty, score }] : [];
      })), ...pendingScores.current.get(owner)?.values() ?? []]);
      // The RPC performs an atomic maximum, avoiding lower-score overwrites.
      for (const score of local) {
        if (ownerRef.current !== owner) return;
        const result = await client.rpc("save_personal_best", { p_owner: owner, p_category: cloudCategory(score.category), p_difficulty: score.difficulty, p_score: score.score });
        if (result.error) throw result.error;
        const key = `${score.category}:${score.difficulty}`;
        const pending = pendingScores.current.get(owner);
        if ((pending?.get(key)?.score ?? Infinity) <= score.score) pending?.delete(key);
        for (const row of parseMemberScores(result.data)) { merged.push(row); saveHighScore(row.difficulty, row.score, undefined, row.category, owner); }
      }
      if (ownerRef.current === owner) {
        setScores(parseMemberScores([...merged, ...local]));
        setSyncStatus("synced");
        setRevision(n => n + 1);
      }
    } catch { if (ownerRef.current === owner) setSyncStatus("error"); }
    finally {
      syncing.current.delete(owner);
      if (queued.current.delete(owner) && ownerRef.current === owner) void syncScores();
    }
  }, [client, userId]);

  const syncProfile = useCallback(async () => {
    const owner = userId;
    if (!client || !owner || !readStatistics().enabled || profileClearing.current) return;
    if (profileSyncRun.current) { await profileSyncRun.current; return; }
    const run = (async () => {
    setProfileSyncStatus("syncing");
    try {
      const settings = await client.from("knowledge_profile_settings").select("cleared_at").eq("user_id", owner).maybeSingle();
      if (settings.error) throw settings.error;
      const cutoff = settings.data?.cleared_at === "-infinity" ? null : settings.data?.cleared_at ?? null;
      if (ownerRef.current !== owner || profileClearing.current || !readStatistics().enabled) return;
      setProfileCutoff(cutoff);
      const local = readStatistics().games.filter(record => record.owner === owner).map((record, index) => ({
        ...record,
        completedAt: record.completedAt ?? new Date(index + 1).toISOString(),
        answers: record.answers ?? (record.missedIds ?? []).map(questionId => ({ questionId, correct: false })).concat((record.correctIds ?? []).map(questionId => ({ questionId, correct: true }))),
      })).filter(record => record.answers.length);
      const upload = [...new Map([...local, ...pendingProfile.current.values()].filter(record => record.owner === owner && afterProfileClear(record, cutoff)).map(record => [record.id, record])).values()];
      if (upload.length) {
        const rows = upload.map(record => ({ id: record.id, user_id: owner, completed_at: record.completedAt ?? new Date(0).toISOString(), answers: record.answers }));
        const result = await client.from("knowledge_rounds").upsert(rows, { onConflict: "id", ignoreDuplicates: true });
        if (result.error) throw result.error;
      }
      const rows: { id: string; completed_at: string; answers: unknown }[] = [];
      for (let offset = 0; ; offset += 500) {
        const page = await client.from("knowledge_rounds").select("id,completed_at,answers").eq("user_id", owner).order("completed_at", { ascending: true }).order("id", { ascending: true }).range(offset, offset + 499);
        if (page.error) throw page.error;
        rows.push(...page.data ?? []);
        if (!page.data || page.data.length < 500) break;
      }
      if (ownerRef.current !== owner || profileClearing.current || !readStatistics().enabled) return;
      const parsed = rows.flatMap(row => {
        if (!Array.isArray(row.answers)) return [];
        const answers = row.answers.filter((answer: unknown): answer is { questionId: string; correct: boolean } => !!answer && typeof answer === "object" && "questionId" in answer && typeof answer.questionId === "string" && "correct" in answer && typeof answer.correct === "boolean");
        if (!answers.length) return [];
        return [{ id: row.id, owner, completedAt: row.completed_at, category: "mixed" as const, categoryVersion: 2 as const, correct: answers.filter(answer => answer.correct).length, total: answers.length, points: 0, answers }];
      });
      setProfileRecords(parsed);
      for (const record of upload) pendingProfile.current.delete(record.id);
      setProfileSyncStatus("synced");
      setRevision(n => n + 1);
    } catch { if (ownerRef.current === owner && !profileClearing.current) setProfileSyncStatus("error"); }
    })();
    profileSyncRun.current = run;
    try { await run; } finally { if (profileSyncRun.current === run) profileSyncRun.current = null; }
  }, [client, userId]);

  async function clearProfile() {
    profileClearing.current = true;
    pendingProfile.current.clear();
    setProfileRecords([]);
    setProfileCutoff(new Date().toISOString());
    try {
      await profileSyncRun.current;
      if (!client || !userId) return true;
      const result = await client.rpc("clear_knowledge_profile");
      if (result.error) { setProfileSyncStatus("error"); return false; }
      setProfileSyncStatus("idle");
      return true;
    } finally { profileClearing.current = false; }
  }

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      if (!active) return;
      setScores([]);
      setNickname("");
      setSyncStatus("idle");
      setProfileRecords([]);
      setProfileCutoff(null);
      setProfileSyncStatus("idle");
      if (!userId || !client) return;
      const profile = await client.from("profiles").select("nickname").eq("id", userId).maybeSingle();
      if (active && typeof profile.data?.nickname === "string") setNickname(profile.data.nickname);
      if (active) await sync();
      if (active) await syncProfile();
    }).catch(() => { if (active && userId) setSyncStatus("error"); });
    const reconnect = () => { void sync(); void syncProfile(); };
    window.addEventListener("online", reconnect);
    window.addEventListener("ynby-resume", reconnect);
    return () => { active = false; window.removeEventListener("online", reconnect); window.removeEventListener("ynby-resume", reconnect); };
  }, [client, userId, sync, syncProfile]); // Profile is fetched only when identity changes.

  function saveProfileRecord(record: GameRecord) {
    if (!userId || record.owner !== userId || !readStatistics().enabled) return;
    pendingProfile.current.set(record.id, record);
    setProfileRecords(current => [...new Map([...current, record].map(item => [item.id, item])).values()]);
    void syncProfile();
  }

  function saveResult(owner: string | undefined, row: MemberScore) {
    saveHighScore(row.difficulty, row.score, undefined, row.category, owner);
    setRevision(n => n + 1);
    if (owner && ownerRef.current === owner) {
      const pending = pendingScores.current.get(owner) ?? new Map<string, MemberScore>();
      const key = `${row.category}:${row.difficulty}`;
      if (row.score > (pending.get(key)?.score ?? -1)) pending.set(key, row);
      pendingScores.current.set(owner, pending);
      void sync();
    }
  }
  return <AccountContext value={{ client, ready, user, googleError, nickname, scores, revision, syncStatus, sync, setNickname, saveResult, profileRecords, profileCutoff, profileSyncStatus, saveProfileRecord, syncProfile, clearProfile }}>{children}</AccountContext>;
}
export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("AccountProvider is required");
  return value;
}
