import { DIFFICULTIES, type Difficulty } from "./config";
import type { GameCategory } from "./categories";

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
export function readHighScores(
  storage: StorageLike | undefined = browserStorage(),
  category: GameCategory = "mixed",
): HighScores {
  try {
    const key = category === "mixed" ? STORAGE_KEY : `${STORAGE_KEY}:${category}`;
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
  category: GameCategory = "mixed",
): HighScores {
  const scores = readHighScores(storage, category);
  if (!Number.isSafeInteger(score) || score < 0) return scores;
  scores[difficulty] = Math.max(scores[difficulty] ?? 0, score);
  try {
    const key = category === "mixed" ? STORAGE_KEY : `${STORAGE_KEY}:${category}`;
    storage?.setItem(key, JSON.stringify(scores));
  } catch {
    /* Private browsing can disable storage. */
  }
  return scores;
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
