import { DIFFICULTIES, type Difficulty } from "./config";

export const STORAGE_KEY = "ynby:high-scores:v1";
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
): HighScores {
  try {
    const value: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "{}");
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
): HighScores {
  const scores = readHighScores(storage);
  if (!Number.isSafeInteger(score) || score < 0) return scores;
  scores[difficulty] = Math.max(scores[difficulty] ?? 0, score);
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    /* Private browsing can disable storage. */
  }
  return scores;
}
