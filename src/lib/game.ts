import { GAME_CONFIG, type Difficulty } from "./config";
import { matchesCategory, type GameCategory } from "./categories";
import type { Answer, Question } from "./types";
import type { RoundMode } from "./rounds";
import type { PaceMode } from "./pace";
import { evaluateQuestion, questionSeconds, questionType, pointsForEvaluation, type QuestionResponse } from "./question-engine";
import type { AdaptiveProgress } from "./adaptive-difficulty";

export function shuffle<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function selectQuestions(
  pool: readonly Question[],
  difficulty: Difficulty,
  { category = "mixed", random = Math.random, seenQuestionIds = [], count = GAME_CONFIG.questionCount, includeExpertAtHard = false }: { category?: GameCategory; random?: () => number; seenQuestionIds?: readonly string[]; count?: number; includeExpertAtHard?: boolean } = {},
): Question[] {
  const eligible = [
    ...new Map(
      pool.filter((q) => q.active !== false && (q.difficulty === difficulty || includeExpertAtHard && difficulty === "hard" && q.difficulty === "expert") && matchesCategory(q.category, category)).map((q) => [q.id, q]),
    ).values(),
  ];
  if (!Number.isSafeInteger(count) || count < 1 || eligible.length < count)
    throw new Error("Bu kategori ve seviye için yeterli soru bulunamadı.");
  const seenOrder = new Map(seenQuestionIds.map((id, index) => [id, index]));
  const ordered = (items: readonly Question[]) => [
    ...shuffle(items.filter(q => !seenOrder.has(q.id)), random),
    ...items.filter(q => seenOrder.has(q.id)).sort((a, b) => seenOrder.get(a.id)! - seenOrder.get(b.id)!),
  ];
  let selected: Question[];
  if (category === "mixed") {
    const byCategory = new Map<string, Question[]>();
    for (const question of eligible) byCategory.set(question.category, [...byCategory.get(question.category) ?? [], question]);
    const groups = shuffle([...byCategory.values()].map(ordered), random);
    selected = [];
    while (selected.length < count) {
      let added = false;
      for (const group of shuffle(groups, random)) {
        const question = group.shift();
        if (question) { selected.push(question); added = true; }
        if (selected.length === count) break;
      }
      if (!added) break;
    }
  } else selected = ordered(eligible).slice(0, count);
  return selected
    .map((q) => ({
      ...q,
      choices: shuffle(q.choices, random) as unknown as Question["choices"],
    }));
}

export function secondsLeft(deadline: number, now: number, limit: number = GAME_CONFIG.secondsPerQuestion): number {
  return Math.max(
    0,
    Math.min(
      limit,
      Math.ceil((deadline - now) / 1000),
    ),
  );
}

export function calculatePoints(correct: boolean, seconds: number): number {
  if (!correct || !Number.isFinite(seconds) || seconds <= 0) return 0;
  return (
    GAME_CONFIG.basePoints +
    Math.min(GAME_CONFIG.secondsPerQuestion, Math.floor(seconds)) *
      GAME_CONFIG.pointsPerSecond
  );
}
export function pointsForPace(correct: boolean, seconds: number, pace: PaceMode): number {
  return pace === "relaxed" ? correct ? GAME_CONFIG.basePoints : 0 : calculatePoints(correct, seconds);
}

export function summarize(answers: readonly Answer[]) {
  const correct = answers.filter((a) => a.correct).length;
  return {
    total: answers.reduce((sum, a) => sum + a.points, 0),
    correct,
    wrong: answers.length - correct,
    percentage: answers.length
      ? Math.round((correct / answers.length) * 100)
      : 0,
  };
}

export function missedQuestions(state: GameState): { question: Question; answer: Answer; number: number }[] {
  return state.answers.flatMap((answer, index) => {
    const question = state.questions[index];
    return !answer.correct && question ? [{ question, answer, number: index + 1 }] : [];
  });
}

export interface GameState {
  adaptive?: boolean;
  adaptiveProgress?: AdaptiveProgress;
  mode: RoundMode;
  pace: PaceMode;
  endReason: "completed" | "wrong" | "timeout" | "exhausted" | "exit" | null;
  sessionId: string;
  dailyDate: string | null;
  difficulty: Difficulty;
  category: GameCategory;
  questions: Question[];
  index: number;
  answers: Answer[];
  deadline: number;
  remaining: number;
  phase: "answering" | "feedback" | "finished";
}
export type GameAction =
  | { type: "exit"; questionId: string; now: number }
  | {
      type: "answer";
      questionId: string;
      selectedId: string | null;
      response?: QuestionResponse;
      now: number;
    }
  | { type: "tick"; questionId: string; now: number }
  | { type: "mediaReady"; questionId: string; now: number }
  | { type: "replace"; questionId: string; replacement: Question; now: number }
  | { type: "mediaUnavailable"; questionId: string; now: number }
  | { type: "next"; questionId: string; now: number; adaptiveDifficulty?: Difficulty; adaptiveCorrectCount?: number; replacements?: { index: number; question: Question }[]; appendQuestion?: Question; exhausted?: boolean };

export function createGame(
  questions: Question[],
  difficulty: Difficulty,
  now: number,
  category: GameCategory = "mixed",
  mode: RoundMode = "standard",
  pace: PaceMode = "competition",
  adaptive = false,
): GameState {
  if (!questions.length || new Set(questions.map(q => q.id)).size !== questions.length)
    throw new Error("Yarışma benzersiz sorulardan oluşmalıdır.");
  return {
    adaptive,
    ...(adaptive && mode === "adaptive" ? { adaptiveProgress: { start: difficulty, changes: [] } } : {}),
    mode,
    pace,
    endReason: null,
    sessionId: String(now),
    dailyDate: null,
    difficulty,
    category,
    questions,
    index: 0,
    answers: [],
    deadline: pace === "competition" ? now + questionSeconds(questions[0]!) * 1000 : 0,
    remaining: pace === "competition" ? questionSeconds(questions[0]!) : 0,
    phase: "answering",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const q = state.questions[state.index];
  if (!q || action.questionId !== q.id || state.phase === "finished")
    return state;
  if (action.type === "exit") return { ...state, phase: "finished", endReason: "exit" };
  if (action.type === "mediaUnavailable" && state.phase === "answering") return { ...state, phase: "finished", endReason: "exhausted" };
  if (action.type === "mediaReady" && state.phase === "answering")
    return { ...state, remaining: state.pace === "competition" ? questionSeconds(q) : 0, deadline: state.pace === "competition" ? action.now + questionSeconds(q) * 1000 : 0 };
  if (action.type === "replace" && state.phase === "answering") {
    const replacement = action.replacement;
    if (replacement.id === q.id || replacement.difficulty !== state.difficulty || !matchesCategory(replacement.category, state.category) || state.questions.some(item => item.id === replacement.id)) return state;
    const questions = [...state.questions];
    questions[state.index] = replacement;
    return { ...state, questions, remaining: state.pace === "competition" ? questionSeconds(replacement) : 0, deadline: state.pace === "competition" ? action.now + questionSeconds(replacement) * 1000 : 0 };
  }
  if (action.type === "next") {
    if (state.phase !== "feedback") return state;
    if (state.adaptive && state.mode === "adaptive" && action.exhausted)
      return { ...state, phase: "finished", endReason: "exhausted" };
    if (roundEndsAfterFeedback(state)) {
      const last = state.answers[state.answers.length - 1];
      const endReason = state.mode === "endless"
        ? !last?.correct ? last?.selectedId === null ? "timeout" : "wrong" : "exhausted"
        : "completed";
      return { ...state, phase: "finished", endReason };
    }
    const questions = [...state.questions];
    if (state.adaptive && state.mode === "adaptive" && action.appendQuestion) {
      const appended = action.appendQuestion;
      if (action.adaptiveDifficulty && appended.difficulty !== action.adaptiveDifficulty || questions.some(item => item.id === appended.id) || !matchesCategory(appended.category, state.category)) return state;
      questions.push(appended);
    }
    if (state.adaptive && action.adaptiveDifficulty && action.replacements) {
      const used = new Set(questions.slice(0, state.index + 1).map(item => item.id));
      for (const replacement of action.replacements) {
        if (replacement.index <= state.index || replacement.index >= questions.length || action.adaptiveDifficulty && replacement.question.difficulty !== action.adaptiveDifficulty || used.has(replacement.question.id) || !matchesCategory(replacement.question.category, state.category)) return state;
        used.add(replacement.question.id);
        questions[replacement.index] = replacement.question;
      }
    }
    const nextIndex = state.index + 1;
    const progress = state.adaptiveProgress;
    const adaptiveProgress = state.adaptive && state.mode === "adaptive" && progress && action.adaptiveDifficulty && action.adaptiveDifficulty !== state.difficulty
      ? { ...progress, changes: [...progress.changes, { afterAnswer: state.answers.length, from: state.difficulty, to: action.adaptiveDifficulty, correctInWindow: action.adaptiveCorrectCount ?? null }] }
      : progress;
    return {
      ...state,
      ...(adaptiveProgress ? { adaptiveProgress } : {}),
      ...(state.adaptive && action.adaptiveDifficulty ? { difficulty: action.adaptiveDifficulty } : {}),
      questions,
      index: nextIndex,
      phase: "answering",
      remaining: state.pace === "competition" ? questionSeconds(questions[nextIndex]!) : 0,
      deadline: state.pace === "competition" ? action.now + questionSeconds(questions[nextIndex]!) * 1000 : 0,
    };
  }
  if (state.phase !== "answering") return state;
  if (state.pace === "relaxed" && action.type === "tick") return state;
  const remaining = state.pace === "relaxed" ? 0 : secondsLeft(state.deadline, action.now, questionSeconds(q));
  if (action.type === "tick" && remaining > 0)
    return state.remaining === remaining ? state : { ...state, remaining };
  const candidate = action.type === "answer" && (action.response ?? (action.selectedId === null ? null : { type: "choice" as const, id: action.selectedId }));
  const evaluation = candidate ? evaluateQuestion(q, candidate) : null;
  if (action.type === "answer" && action.response && action.selectedId === null) return state;
  if (action.type === "answer" && action.selectedId !== null && !evaluation) return state;
  const selectedId =
    action.type === "answer" && (state.pace === "relaxed" || remaining > 0) ? action.selectedId : null;
  const result = selectedId === null ? null : evaluation;
  const correct = result?.isCorrect ?? false;
  return {
    ...state,
    remaining,
    phase: "feedback",
    answers: [
      ...state.answers,
      {
        questionId: q.id,
        selectedId,
        correct,
        remainingSeconds: remaining,
        points: result ? pointsForEvaluation(result.scoreRatio, remaining, state.pace) : 0,
        scoreRatio: result?.scoreRatio ?? 0,
        questionType: questionType(q),
        answeredAt: new Date(action.now).toISOString(),
        responseTime: state.pace === "competition" ? questionSeconds(q) - remaining : 0,
        ...(result ? { response: result.selectedAnswer, correctResponse: result.correctAnswer } : {}),
      },
    ],
  };
}

export function roundEndsAfterFeedback(state: GameState) {
  if (state.adaptive && state.mode === "adaptive") return false;
  return state.index === state.questions.length - 1 || (state.mode === "endless" && state.answers[state.index]?.correct === false);
}

export function longestStreak(answers: readonly Answer[]) {
  let streak = 0, longest = 0;
  for (const answer of answers) { streak = answer.correct ? streak + 1 : 0; longest = Math.max(longest, streak); }
  return longest;
}
