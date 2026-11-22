import { DIFFICULTIES, type Difficulty } from "./config";
import { GAME_CATEGORIES, type GameCategory, type LegacyCategory } from "./categories";
import { SELECTABLE_ROUNDS, type RoundMode } from "./rounds";
import type { PaceMode } from "./pace";

export const STORAGE_KEY = "ynby:high-scores:v1";
export const SEEN_STORAGE_KEY = "ynby:seen-questions:v1";
const MAX_SEEN_QUESTIONS = 500;
export type HighScores = Partial<Record<Difficulty, number>>;
type StorageLike = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}
function scoreKey(category: GameCategory | LegacyCategory, owner?: string, mode: RoundMode = "standard", pace: PaceMode = "competition") {
  if (owner && !/^[0-9a-f-]{36}$/i.test(owner)) throw new Error("Invalid score owner");
  const key = owner ? `${STORAGE_KEY}:user:${owner}` : STORAGE_KEY;
  const storedCategory = category === "history" ? "history:v2" : category === "legacy_history_geography" ? "history" : category;
  const categoryKey = category === "mixed" ? key : `${key}:${storedCategory}`;
  const roundKey = mode === "standard" ? categoryKey : `${categoryKey}:round:${mode}`;
  return pace === "competition" ? roundKey : `${roundKey}:pace:relaxed`;
}
export function readHighScores(
  storage: StorageLike | undefined = browserStorage(),
  category: GameCategory | LegacyCategory = "mixed",
  owner?: string,
  mode: RoundMode = "standard",
  pace: PaceMode = "competition",
): HighScores {
  try {
    const key = scoreKey(category, owner, mode, pace);
    const value: unknown = JSON.parse(storage?.getItem(key) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const result: HighScores = {};
    for (const level of DIFFICULTIES) {
      const score = (value as Record<string, unknown>)[level];
      if (
        typeof score === "number" &&
        Number.isSafeInteger(score) &&
        score >= 0
      )
        result[level] = score;
    }
    return result;
  } catch {
    return {};
  }
}
export function saveHighScore(
  difficulty: Difficulty,
  score: number,
  storage: StorageLike | undefined = browserStorage(),
  category: GameCategory | LegacyCategory = "mixed",
  owner?: string,
  mode: RoundMode = "standard",
  pace: PaceMode = "competition",
): HighScores {
  const scores = readHighScores(storage, category, owner, mode, pace);
  if (!Number.isSafeInteger(score) || score < 0) return scores;
  scores[difficulty] = Math.max(scores[difficulty] ?? 0, score);
  try {
    const key = scoreKey(category, owner, mode, pace);
    storage?.setItem(key, JSON.stringify(scores));
  } catch {
    /* Private browsing can disable storage. */
  }
  return scores;
}

export function clearMemberScores(owner: string) {
  try {
    const storage = window.localStorage;
    for (const category of [...GAME_CATEGORIES, "science", "culture", "legacy_history_geography"] as const) {
      for (const mode of SELECTABLE_ROUNDS) for (const pace of ["competition", "relaxed"] as const) storage.removeItem(scoreKey(category, owner, mode, pace));
    }
  } catch { /* Account deletion still works if browser storage is blocked. */ }
}

export function readSeenQuestions(
  storage: StorageLike | undefined = browserStorage(),
): string[] {
  try {
    const value: unknown = JSON.parse(storage?.getItem(SEEN_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((id): id is string => typeof id === "string" && id.length > 0))]
      .slice(-MAX_SEEN_QUESTIONS);
  } catch {
    return [];
  }
}

export function saveSeenQuestions(
  questionIds: readonly string[],
  storage: StorageLike | undefined = browserStorage(),
): string[] {
  const recent = new Set(questionIds.filter((id) => typeof id === "string" && id.length > 0));
  const seen = [...readSeenQuestions(storage).filter((id) => !recent.has(id)), ...recent]
    .slice(-MAX_SEEN_QUESTIONS);
  try {
    storage?.setItem(SEEN_STORAGE_KEY, JSON.stringify(seen));
  } catch {
    /* Private browsing can disable storage. */
  }
  return seen;
}
