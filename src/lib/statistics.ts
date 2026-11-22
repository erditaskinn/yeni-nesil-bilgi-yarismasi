import { GAME_CATEGORIES, type StoredCategory } from "./categories";
import type { PaceMode } from "./pace";
import { GAME_CONFIG } from "./config";
import { summarize, type GameState } from "./game";
import { ROUND_CONFIG, type RoundMode } from "./rounds";

export const STATISTICS_KEY = "ynby:statistics:v1";
export const MAX_RECORDED_GAMES = 100;
type StorageLike = Pick<Storage, "getItem" | "setItem">;
export interface GameRecord { id: string; category: StoredCategory; categoryVersion?: 2; correct: number; total: number; points: number; mode?: RoundMode; pace?: PaceMode; owner?: string; missedIds?: string[]; correctIds?: string[]; completedAt?: string; answers?: { questionId: string; correct: boolean }[] }
export interface Statistics { enabled: boolean; games: GameRecord[] }
function browserStorage(): StorageLike | undefined {
  try { return typeof window === "undefined" ? undefined : window.localStorage; } catch { return undefined; }
}
export function readStatistics(storage: StorageLike | undefined = browserStorage()): Statistics {
  try {
    const value = JSON.parse(storage?.getItem(STATISTICS_KEY) ?? "null") as Partial<Statistics> | null;
    if (!value || value.enabled !== true || !Array.isArray(value.games)) return { enabled: false, games: [] };
    const maxPoints = GAME_CONFIG.basePoints + GAME_CONFIG.secondsPerQuestion * GAME_CONFIG.pointsPerSecond;
    const validIds = (ids: unknown) => ids === undefined || Array.isArray(ids) && ids.length <= 10000 && ids.every(id => typeof id === "string" && id.length > 0 && id.length < 100);
    const valid = value.games.filter((game): game is GameRecord => !!game && typeof game.id === "string" && game.id.length > 0 && [...GAME_CATEGORIES, "daily", "science", "culture", "legacy_history_geography"].includes(game.category) && Number.isSafeInteger(game.total) && game.total > 0 && game.total <= 10000 && Number.isSafeInteger(game.correct) && game.correct >= 0 && game.correct <= game.total && Number.isSafeInteger(game.points) && game.points >= 0 && game.points <= game.total * maxPoints && (game.mode === undefined || Object.hasOwn(ROUND_CONFIG, game.mode)) && (game.pace === undefined || ["competition", "relaxed"].includes(game.pace)) && (game.owner === undefined || typeof game.owner === "string" && /^[0-9a-f-]{36}$/i.test(game.owner)) && validIds(game.missedIds) && validIds(game.correctIds) && (game.completedAt === undefined || typeof game.completedAt === "string" && !Number.isNaN(Date.parse(game.completedAt))) && (game.answers === undefined || Array.isArray(game.answers) && game.answers.length <= game.total && game.answers.every(answer => answer && typeof answer.questionId === "string" && answer.questionId.length < 100 && typeof answer.correct === "boolean")));
    const migrated = valid.map(game => ({ ...game, pace: game.pace ?? "competition" as PaceMode, category: game.categoryVersion === 2 ? game.category : game.category === "history" ? "legacy_history_geography" as const : game.category }));
    return { enabled: true, games: [...new Map(migrated.map(game => [game.id, game])).values()].slice(-MAX_RECORDED_GAMES) };
  } catch { return { enabled: false, games: [] }; }
}
function writeStatistics(value: Statistics, storage: StorageLike | undefined): boolean {
  try { if (!storage) return false; storage.setItem(STATISTICS_KEY, JSON.stringify(value)); return true; } catch { return false; }
}
export function configureStatistics(enabled: boolean, clear = false, storage: StorageLike | undefined = browserStorage()): boolean {
  return writeStatistics({ enabled, games: !enabled || clear ? [] : readStatistics(storage).games }, storage);
}
export function clearOwnerStatistics(owner: string, storage: StorageLike | undefined = browserStorage()): boolean {
  const current = readStatistics(storage);
  return writeStatistics({ ...current, games: current.games.filter(record => record.owner !== owner) }, storage);
}
export function gameRecord(state: GameState, owner?: string, completedAt = new Date().toISOString()): GameRecord {
  const summary = summarize(state.answers);
  return { id: state.sessionId, category: state.dailyDate ? "daily" : state.category, categoryVersion: 2, correct: summary.correct, total: state.answers.length, points: summary.total, mode: state.mode, pace: state.pace, ...(owner ? { owner } : {}), completedAt, answers: state.answers.map(answer => ({ questionId: answer.questionId, correct: answer.correct })), missedIds: state.answers.filter(a => !a.correct).map(a => a.questionId), correctIds: state.answers.filter(a => a.correct).map(a => a.questionId) };
}
export function recordGame(state: GameState, storage: StorageLike | undefined = browserStorage(), owner?: string): GameRecord | undefined {
  const current = readStatistics(storage);
  if (!current.enabled || state.phase !== "finished" || !state.answers.length || current.games.some(game => game.id === state.sessionId)) return;
  const record = gameRecord(state, owner);
  writeStatistics({ enabled: true, games: [...current.games, record].slice(-MAX_RECORDED_GAMES) }, storage);
  return record;
}

export function storedMistakes(owner?: string, storage: StorageLike | undefined = browserStorage()): Set<string> {
  const ids = new Set<string>();
  for (const record of readStatistics(storage).games) {
    if (record.owner !== owner) continue;
    record.missedIds?.forEach(id => ids.add(id));
    record.correctIds?.forEach(id => ids.delete(id));
  }
  return ids;
}

export function correctStoredMistake(id: string, owner?: string, storage: StorageLike | undefined = browserStorage()) {
  const current = readStatistics(storage);
  if (!current.enabled) return;
  writeStatistics({ ...current, games: current.games.map(record => record.owner !== owner ? record : { ...record, missedIds: record.missedIds?.filter(item => item !== id) }) }, storage);
}
export function statisticsSummary(games: readonly GameRecord[]) {
  const total = games.reduce((sum, game) => sum + game.total, 0);
  const correct = games.reduce((sum, game) => sum + game.correct, 0);
  return { games: games.length, total, correct, percentage: total ? Math.round(100 * correct / total) : 0 };
}
