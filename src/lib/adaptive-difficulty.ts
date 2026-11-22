import { DIFFICULTIES, type Difficulty } from "./config";

/** The category-level profile becomes usable after this many distinct answers. */
export const ADAPTIVE_PROFILE_MIN_ANSWERS = 5;

/** Re-evaluate performance after each complete block of five answers. */
export const ADAPTIVE_ANSWER_WINDOW = 5;

export interface AdaptiveProgress {
  start: Difficulty;
  changes: { afterAnswer: number; from: Difficulty; to: Difficulty; correctInWindow: number | null }[];
}

/** Saved display history is optional for older rounds and never determines scores. */
export function restoreAdaptiveProgress(value: unknown, start: Difficulty, current: Difficulty, answered: number): AdaptiveProgress | undefined {
  if (!value || typeof value !== "object") return undefined;
  const progress = value as AdaptiveProgress;
  if (progress.start !== start || !Array.isArray(progress.changes) || progress.changes.length > answered) return undefined;
  let previous = start;
  let afterAnswer = 0;
  for (const change of progress.changes) {
    if (!change || !Number.isSafeInteger(change.afterAnswer) || change.afterAnswer <= afterAnswer || change.afterAnswer > answered || change.from !== previous || !DIFFICULTIES.includes(change.to) || change.from === change.to || change.correctInWindow !== null && (!Number.isInteger(change.correctInWindow) || change.correctInWindow < 0 || change.correctInWindow > ADAPTIVE_ANSWER_WINDOW || change.afterAnswer % ADAPTIVE_ANSWER_WINDOW !== 0)) return undefined;
    previous = change.to;
    afterAnswer = change.afterAnswer;
  }
  return previous === current ? { start, changes: progress.changes.map(change => ({ ...change })) } : undefined;
}

/** Starting bands are provisional heuristics, not player-calibrated cutoffs. */
export function startingDifficultyFromProfile(profile: {
  answered: number;
  percentage: number;
} | null | undefined): Difficulty {
  if (!profile || !Number.isSafeInteger(profile.answered) || profile.answered < ADAPTIVE_PROFILE_MIN_ANSWERS || !Number.isFinite(profile.percentage) || profile.percentage < 0 || profile.percentage > 100)
    return "medium";

  if (profile.percentage < 40) return "easy";
  if (profile.percentage < 65) return "medium";
  if (profile.percentage < 85) return "hard";
  return "expert";
}

/**
 * Move at most one step after a completed five-answer checkpoint. The caller
 * supplies only levels with an available pool, so a small category cannot
 * silently start an empty level. Ties resolve toward the easier level.
 */
export function advanceAdaptiveDifficulty(
  current: Difficulty,
  outcomes: readonly boolean[],
  available: readonly Difficulty[] = DIFFICULTIES,
): Difficulty | null {
  const levels = DIFFICULTIES.filter(level => available.includes(level));
  if (!levels.length) return null;

  const currentIndex = DIFFICULTIES.indexOf(current);
  let targetIndex = currentIndex;

  if (outcomes.length >= ADAPTIVE_ANSWER_WINDOW) {
    const window = outcomes.slice(-ADAPTIVE_ANSWER_WINDOW);
    const correct = window.filter(Boolean).length;
    if (correct >= 4) targetIndex = Math.min(DIFFICULTIES.length - 1, currentIndex + 1);
    else if (correct <= 2) targetIndex = Math.max(0, currentIndex - 1);
  }

  return levels.reduce((best, level) => {
    const distance = Math.abs(DIFFICULTIES.indexOf(level) - targetIndex);
    const bestDistance = Math.abs(DIFFICULTIES.indexOf(best) - targetIndex);
    return distance < bestDistance ? level : best;
  }, levels[0]!);
}

/** Choose an available starting level from a category profile, or medium cold-start. */
export function adaptiveStartingDifficulty(
  profile: { answered: number; percentage: number } | null | undefined,
  available: readonly Difficulty[] = DIFFICULTIES,
): Difficulty | null {
  const desired = startingDifficultyFromProfile(profile);
  const levels = DIFFICULTIES.filter(level => available.includes(level));
  if (!levels.length) return null;

  return levels.reduce((best, level) => {
    const distance = Math.abs(DIFFICULTIES.indexOf(level) - DIFFICULTIES.indexOf(desired));
    const bestDistance = Math.abs(DIFFICULTIES.indexOf(best) - DIFFICULTIES.indexOf(desired));
    return distance < bestDistance ? level : best;
  }, levels[0]!);
}
