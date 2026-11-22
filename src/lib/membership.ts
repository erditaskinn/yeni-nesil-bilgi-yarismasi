import { GAME_CATEGORIES, type GameCategory, type LegacyCategory } from "./categories";
import { DIFFICULTIES, GAME_CONFIG, type Difficulty } from "./config";

export type MemberScore = { category: GameCategory | LegacyCategory; difficulty: Difficulty; score: number };
export function cloudCategory(category: MemberScore["category"]) {
  return category === "history" ? "history_v2" : category === "legacy_history_geography" ? "history" : category;
}
export const MAX_SCORE = GAME_CONFIG.questionCount * (GAME_CONFIG.basePoints + GAME_CONFIG.secondsPerQuestion * GAME_CONFIG.pointsPerSecond);

export function membershipConfig(url: string | undefined, key: string | undefined) {
  try {
    const parsed = new URL(url ?? "");
    if (parsed.protocol !== "https:" || !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname) || parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.username || parsed.password || parsed.port) return null;
    if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key ?? "")) return null;
    return { url: parsed.origin, key: key! };
  } catch { return null; }
}

export function validNickname(value: string) {
  const name = value.trim();
  return name.length >= 2 && name.length <= 30 && !/[\p{Cc}\p{Cf}<>]/u.test(name);
}
export function validPassword(value: string) {
  return value.length >= 6 && /[a-zA-Z]/.test(value) && /[0-9]/.test(value) && new TextEncoder().encode(value).length <= 72;
}
export function parseMemberScores(value: unknown): MemberScore[] {
  if (!Array.isArray(value)) return [];
  const scores = new Map<string, MemberScore>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const category = row.category === "history_v2" ? "history" : row.category === "history" ? "legacy_history_geography" : row.category;
    if (![...GAME_CATEGORIES, "science", "culture", "legacy_history_geography"].includes(category as GameCategory) || !DIFFICULTIES.includes(row.difficulty as Difficulty) || typeof row.score !== "number" || !Number.isSafeInteger(row.score) || row.score < 0 || row.score > MAX_SCORE) continue;
    const score = { category, difficulty: row.difficulty, score: row.score } as MemberScore;
    const key = `${score.category}:${score.difficulty}`;
    if (score.score > (scores.get(key)?.score ?? -1)) scores.set(key, { category: score.category, difficulty: score.difficulty, score: score.score });
  }
  return [...scores.values()];
}

// Tokens stay in this application's storage, never in URL query strings or logs.
// Memory fallback keeps sign-in usable when browser storage is blocked.
export function resilientAuthStorage(storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined) {
  const memory = new Map<string, string>();
  let blocked = !storage;
  return {
    getItem(key: string) {
      if (!blocked) { try { return storage?.getItem(key) ?? null; } catch { blocked = true; } }
      return memory.get(key) ?? null;
    },
    setItem(key: string, value: string) { memory.set(key, value); if (!blocked) try { storage?.setItem(key, value); } catch { blocked = true; } },
    removeItem(key: string) { memory.delete(key); if (!blocked) try { storage?.removeItem(key); } catch { blocked = true; } },
  };
}

export type AuthIssue = "credentials" | "emailUnverified" | "rateLimit" | "invalidCode" | "passwordWeak" | "network" | "unknown";
export function authIssue(error: unknown): AuthIssue {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "invalid_credentials") return "credentials";
  if (code === "email_not_confirmed") return "emailUnverified";
  if (["over_request_rate_limit", "over_email_send_rate_limit", "over_sms_send_rate_limit"].includes(code)) return "rateLimit";
  if (["otp_expired", "otp_disabled", "flow_state_expired", "flow_state_not_found"].includes(code)) return "invalidCode";
  if (code === "weak_password") return "passwordWeak";
  if (error instanceof TypeError || (error instanceof Error && ["AbortError", "TimeoutError", "AuthRetryableFetchError"].includes(error.name))) return "network";
  return "unknown";
}
