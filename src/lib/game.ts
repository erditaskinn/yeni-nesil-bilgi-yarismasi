import { GAME_CONFIG, type Difficulty } from "./config";
import { matchesCategory, type GameCategory } from "./categories";
import type { Answer, Question } from "./types";

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
  { category = "mixed", random = Math.random, seenQuestionIds = [] }: { category?: GameCategory; random?: () => number; seenQuestionIds?: readonly string[] } = {},
): Question[] {
  const eligible = [
    ...new Map(
      pool.filter((q) => q.difficulty === difficulty && matchesCategory(q.category, category)).map((q) => [q.id, q]),
    ).values(),
  ];
  if (eligible.length < GAME_CONFIG.questionCount)
    throw new Error("Bu kategori ve seviye için yeterli soru bulunamadı.");
  const seenOrder = new Map(seenQuestionIds.map((id, index) => [id, index]));
  const unseen = shuffle(eligible.filter((q) => !seenOrder.has(q.id)), random);
  const seen = eligible
    .filter((q) => seenOrder.has(q.id))
    .sort((a, b) => seenOrder.get(a.id)! - seenOrder.get(b.id)!);
  return [...unseen, ...seen]
    .slice(0, GAME_CONFIG.questionCount)
    .map((q) => ({
      ...q,
      choices: shuffle(q.choices, random) as unknown as Question["choices"],
    }));
}

export function secondsLeft(deadline: number, now: number): number {
  return Math.max(
    0,
    Math.min(
      GAME_CONFIG.secondsPerQuestion,
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
  | {
      type: "answer";
      questionId: string;
      selectedId: string | null;
      now: number;
    }
  | { type: "tick"; questionId: string; now: number }
  | { type: "next"; questionId: string; now: number };

export function createGame(
  questions: Question[],
  difficulty: Difficulty,
  now: number,
  category: GameCategory = "mixed",
): GameState {
  if (questions.length !== GAME_CONFIG.questionCount)
    throw new Error("Oyun 10 sorudan oluşmalıdır.");
  return {
    sessionId: String(now),
    dailyDate: null,
    difficulty,
    category,
    questions,
    index: 0,
    answers: [],
    deadline: now + GAME_CONFIG.secondsPerQuestion * 1000,
    remaining: GAME_CONFIG.secondsPerQuestion,
    phase: "answering",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const q = state.questions[state.index];
  if (!q || action.questionId !== q.id || state.phase === "finished")
    return state;
  if (action.type === "next") {
    if (state.phase !== "feedback") return state;
    if (state.index === state.questions.length - 1)
      return { ...state, phase: "finished" };
    return {
      ...state,
      index: state.index + 1,
      phase: "answering",
      remaining: GAME_CONFIG.secondsPerQuestion,
      deadline: action.now + GAME_CONFIG.secondsPerQuestion * 1000,
    };
  }
  if (state.phase !== "answering") return state;
  const remaining = secondsLeft(state.deadline, action.now);
  if (action.type === "tick" && remaining > 0)
    return state.remaining === remaining ? state : { ...state, remaining };
  if (
    action.type === "answer" &&
    action.selectedId !== null &&
    !q.choices.some((c) => c.id === action.selectedId)
  )
    return state;
  const selectedId =
    action.type === "answer" && remaining > 0 ? action.selectedId : null;
  const correct = selectedId === q.correctAnswer;
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
        points: calculatePoints(correct, remaining),
      },
    ],
  };
}
