import { GAME_CATEGORIES } from "./categories";
import { GAME_CONFIG } from "./config";
import { summarize, type GameState } from "./game";

export const STATISTICS_KEY = "ynby:statistics:v1";
export const MAX_RECORDED_GAMES = 100;
type StorageLike = Pick<Storage, "getItem" | "setItem">;
export interface GameRecord { id: string; category: string; correct: number; total: number; points: number }
export interface Statistics { enabled: boolean; games: GameRecord[] }
function browserStorage(): StorageLike | undefined {
  try { return typeof window === "undefined" ? undefined : window.localStorage; } catch { return undefined; }
}
export function readStatistics(storage: StorageLike | undefined = browserStorage()): Statistics {
  try {
    const value = JSON.parse(storage?.getItem(STATISTICS_KEY) ?? "null") as Partial<Statistics> | null;
    if (!value || value.enabled !== true || !Array.isArray(value.games)) return { enabled: false, games: [] };
    const maxPoints = GAME_CONFIG.questionCount * (GAME_CONFIG.basePoints + GAME_CONFIG.secondsPerQuestion * GAME_CONFIG.pointsPerSecond);
    const valid = value.games.filter((game): game is GameRecord => !!game && typeof game.id === "string" && game.id.length > 0 && [...GAME_CATEGORIES, "daily"].includes(game.category) && Number.isSafeInteger(game.total) && game.total === GAME_CONFIG.questionCount && Number.isSafeInteger(game.correct) && game.correct >= 0 && game.correct <= game.total && Number.isSafeInteger(game.points) && game.points >= 0 && game.points <= maxPoints);
    return { enabled: true, games: [...new Map(valid.map(game => [game.id, game])).values()].slice(-MAX_RECORDED_GAMES) };
  } catch { return { enabled: false, games: [] }; }
}
function writeStatistics(value: Statistics, storage: StorageLike | undefined): boolean {
  try { if (!storage) return false; storage.setItem(STATISTICS_KEY, JSON.stringify(value)); return true; } catch { return false; }
}
export function configureStatistics(enabled: boolean, clear = false, storage: StorageLike | undefined = browserStorage()): boolean {
  return writeStatistics({ enabled, games: !enabled || clear ? [] : readStatistics(storage).games }, storage);
}
export function recordGame(state: GameState, storage: StorageLike | undefined = browserStorage()): void {
  const current = readStatistics(storage);
  if (!current.enabled || state.phase !== "finished" || state.answers.length !== GAME_CONFIG.questionCount || current.games.some(game => game.id === state.sessionId)) return;
  const summary = summarize(state.answers);
  writeStatistics({ enabled: true, games: [...current.games, { id: state.sessionId, category: state.dailyDate ? "daily" : state.category, correct: summary.correct, total: state.answers.length, points: summary.total }].slice(-MAX_RECORDED_GAMES) }, storage);
}
export function statisticsSummary(games: readonly GameRecord[]) {
  const total = games.reduce((sum, game) => sum + game.total, 0);
  const correct = games.reduce((sum, game) => sum + game.correct, 0);
  return { games: games.length, total, correct, percentage: total ? Math.round(100 * correct / total) : 0 };
}
