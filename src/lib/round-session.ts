import { GAME_CATEGORIES, matchesCategory } from "./categories";
import { DIFFICULTIES } from "./config";
import { createGame, gameReducer, secondsLeft, type GameState } from "./game";
import { PACE_MODES, type PaceMode } from "./pace";
import type { Locale } from "./locale";
import { ROUND_CONFIG } from "./rounds";
import type { Question } from "./types";
import { evaluateQuestion, pointsForEvaluation, questionSeconds, questionType } from "./question-engine";
import { restoreAdaptiveProgress } from "./adaptive-difficulty";

export const ROUND_SESSION_KEY = "ynby:active-round:v1";
type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
function tabStorage() { try { return typeof window === "undefined" ? undefined : window.sessionStorage; } catch { return undefined; } }
export function saveRoundSession(state: GameState, locale: Locale, owner?: string, storage: SessionStorage | undefined = tabStorage()) {
  try { storage?.setItem(ROUND_SESSION_KEY, JSON.stringify({ version: 1, locale, owner: owner ?? null, state: { ...state, questions: state.questions.map(q => ({ id: q.id, choices: q.choices.map(c => c.id) })) } })); } catch { /* Memory-only rounds still work. */ }
}
export function clearRoundSession(storage: SessionStorage | undefined = tabStorage()) { try { storage?.removeItem(ROUND_SESSION_KEY); } catch { /* Storage may be blocked. */ } }

// Rehydrate only canonical questions and recompute points; stored content is untrusted.
export function restoreRoundSession(pool: readonly Question[], locale: Locale, owner?: string, now = Date.now(), storage: SessionStorage | undefined = tabStorage(), includeExpertAtHard = false): GameState | null {
  try {
    const raw = JSON.parse(storage?.getItem(ROUND_SESSION_KEY) ?? "null");
    if (!raw || raw.version !== 1 || raw.locale !== locale || raw.owner !== (owner ?? null)) return null;
    const s = raw.state as GameState;
    const pace: PaceMode = s?.pace ?? "competition";
    const oldCategory = s?.category as string;
    const category = (oldCategory === "science" ? "science_nature" : oldCategory === "culture" || oldCategory === "history" && s.pace === undefined ? "mixed" : oldCategory) as GameState["category"];
    if (!s || !Object.hasOwn(ROUND_CONFIG, s.mode) || !PACE_MODES.includes(pace) || (s.mode === "daily" && pace !== "competition") || !DIFFICULTIES.includes(s.difficulty) || !GAME_CATEGORIES.includes(category) || !Array.isArray(s.questions) || !s.questions.length || s.questions.length > pool.length || !Array.isArray(s.answers) || !Number.isSafeInteger(s.index) || s.index < 0 || s.index >= s.questions.length || !Number.isFinite(s.deadline) || pace === "relaxed" && s.deadline !== 0 || typeof s.sessionId !== "string" || !s.sessionId.length || s.sessionId.length > 100 || !["answering", "feedback", "finished"].includes(s.phase)) return null;
    if (s.mode === "daily" ? !s.dailyDate || !/^\d{4}-\d{2}-\d{2}$/.test(s.dailyDate) || s.questions.length !== ROUND_CONFIG.daily.count : s.dailyDate !== null) return null;
    const limit = ROUND_CONFIG[s.mode].count;
    if (limit !== null && s.questions.length > limit || s.phase === "finished" && s.endReason === "exit" && s.mode !== "endless" && s.mode !== "adaptive") return null;
    const bank = new Map(pool.map(q => [q.id, q]));
    const questions = s.questions.map(item => {
      const question = bank.get(item.id);
      const order = (item.choices as unknown as string[]);
      if (!question || (s.mode !== "daily" && (!s.adaptive && question.difficulty !== s.difficulty && !(includeExpertAtHard && s.difficulty === "hard" && question.difficulty === "expert") || !matchesCategory(question.category, category))) || !Array.isArray(order) || order.length !== question.choices.length || new Set(order).size !== order.length) throw new Error("Invalid question");
      const choices = order.map(id => question.choices.find(c => c.id === id));
      if (choices.some(c => !c)) throw new Error("Invalid choices");
      return { ...question, choices: choices as unknown as Question["choices"] };
    });
    // Adaptive rounds may still have queued questions at the preceding target level.
    if (s.adaptive && s.mode !== "adaptive" && questions[s.index]!.difficulty !== s.difficulty) return null;
    if (pace === "competition" && s.deadline > now + questionSeconds(questions[s.index]!) * 1000) return null;
    if (new Set(questions.map(q => q.id)).size !== questions.length || s.answers.length > questions.length || (s.phase === "answering" ? s.answers.length !== s.index : s.phase === "feedback" ? s.answers.length !== s.index + 1 : s.answers.length !== s.index && s.answers.length !== s.index + 1)) return null;
    const answers = s.answers.map((a, i) => {
      const q = questions[i]!;
      if (a.questionId !== q.id || !Number.isSafeInteger(a.remainingSeconds) || a.remainingSeconds < 0 || a.remainingSeconds > questionSeconds(q) || pace === "relaxed" && a.remainingSeconds !== 0 || a.selectedId !== null && pace === "competition" && a.remainingSeconds === 0) throw new Error("Invalid answer");
      const candidate = a.selectedId === null ? null : a.response ?? { type: "choice" as const, id: a.selectedId };
      const result = candidate ? evaluateQuestion(q, candidate) : null;
      if (candidate && !result) throw new Error("Invalid answer");
      const correct = result?.isCorrect ?? false;
      return { ...a, correct, scoreRatio: result?.scoreRatio ?? 0, questionType: questionType(q), points: result ? pointsForEvaluation(result.scoreRatio, a.remainingSeconds, pace) : 0, ...(result ? { response: result.selectedAnswer, correctResponse: result.correctAnswer } : {}) };
    });
    if (s.mode === "endless" && answers.slice(0, s.phase === "answering" ? answers.length : -1).some(a => !a.correct)) return null;
    let state: GameState = { ...createGame(questions, s.difficulty, now, category, s.mode, pace, s.adaptive === true), sessionId: s.sessionId, dailyDate: s.dailyDate, index: s.index, answers, deadline: s.deadline, remaining: pace === "relaxed" ? 0 : secondsLeft(s.deadline, now, questionSeconds(questions[s.index]!)), phase: s.phase === "finished" ? "feedback" : s.phase };
    state.adaptiveProgress = s.adaptive && s.mode === "adaptive" ? restoreAdaptiveProgress(s.adaptiveProgress, questions[0]!.difficulty, s.difficulty, answers.length) : undefined;
    if (s.phase === "finished") {
      state = gameReducer(state, { type: s.endReason === "exit" ? "exit" : "next", questionId: questions[s.index]!.id, now, exhausted: s.endReason === "exhausted" });
      if (state.phase !== "finished") return null;
    }
    return state;
  } catch { return null; }
}
