import { GAME_CONFIG } from "./config";
import type { Question, QuestionType } from "./types";
import type { PaceMode } from "./pace";

export type QuestionResponse =
  | { type: "choice"; id: string }
  | { type: "map"; id: string }
  | { type: "order"; ids: readonly string[] }
  | { type: "matches"; pairs: Readonly<Record<string, string>> }
  | { type: "text"; value: string };

export interface QuestionEvaluation {
  isCorrect: boolean;
  scoreRatio: number;
  selectedAnswer: QuestionResponse;
  correctAnswer: QuestionResponse;
}

const DEFAULT_SECONDS: Record<QuestionType, number> = {
  multiple_choice: 20,
  image_question: 20,
  map_selection: 30,
  chronological_order: 45,
  matching: 45,
  audio_question: 30,
  true_false: 20,
  odd_one_out: 20,
  fill_in_blank: 20,
};

export function questionType(question: Question): QuestionType {
  return question.format?.type ?? "multiple_choice";
}

export function questionSeconds(question: Question): number {
  const override = question.timeLimitSeconds;
  return override === undefined ? DEFAULT_SECONDS[questionType(question)] : Number.isSafeInteger(override) && override >= 5 && override <= 120 ? override : DEFAULT_SECONDS[questionType(question)];
}

function normalizedAnswer(value: string): string {
  return value.normalize("NFC").trim().replace(/\s+/g, " ").replace(/[.,!?;:]+$/g, "").toLocaleLowerCase("tr-TR");
}

export function evaluateQuestion(question: Question, response: QuestionResponse): QuestionEvaluation | null {
  const format = question.format;
  if (format?.type === "chronological_order") {
    if (response.type !== "order" || format.order.length < 2 || response.ids.length !== format.order.length || new Set(response.ids).size !== response.ids.length || response.ids.some(id => !format.order.includes(id))) return null;
    const scoreRatio = response.ids.filter((id, index) => id === format.order[index]).length / format.order.length;
    return { isCorrect: scoreRatio === 1, scoreRatio, selectedAnswer: response, correctAnswer: { type: "order", ids: format.order } };
  }
  if (format?.type === "matching") {
    const leftIds = format.left.map(item => item.id);
    const rightIds = format.right.map(item => item.id);
    if (response.type !== "matches" || leftIds.length === 0 || leftIds.length !== rightIds.length || Object.keys(response.pairs).length !== leftIds.length || new Set(Object.values(response.pairs)).size !== leftIds.length || leftIds.some(id => !rightIds.includes(response.pairs[id] ?? ""))) return null;
    const scoreRatio = leftIds.filter(id => response.pairs[id] === format.pairs[id]).length / leftIds.length;
    return { isCorrect: scoreRatio === 1, scoreRatio, selectedAnswer: response, correctAnswer: { type: "matches", pairs: format.pairs } };
  }
  if (format?.type === "fill_in_blank" && format.mode === "text") {
    if (response.type !== "text" || response.value.length > 200 || !response.value.trim()) return null;
    const accepted = format.acceptedAnswers?.length ? format.acceptedAnswers : [question.correctAnswer];
    const correct = accepted.some(answer => normalizedAnswer(answer) === normalizedAnswer(response.value));
    return { isCorrect: correct, scoreRatio: Number(correct), selectedAnswer: response, correctAnswer: { type: "text", value: question.correctAnswer } };
  }
  const expectedType = format?.type === "map_selection" ? "map" : "choice";
  if (response.type !== expectedType) return null;
  const id = response.id;
  const valid = format?.type === "map_selection" ? format.regions.some(region => region.id === id) : question.choices.some(choice => choice.id === id);
  if (!valid) return null;
  const correct = id === question.correctAnswer;
  return { isCorrect: correct, scoreRatio: Number(correct), selectedAnswer: response, correctAnswer: { type: expectedType, id: question.correctAnswer } };
}

export function pointsForEvaluation(scoreRatio: number, seconds: number, pace: PaceMode): number {
  if (!Number.isFinite(scoreRatio) || scoreRatio <= 0 || scoreRatio > 1) return 0;
  const base = Math.round(GAME_CONFIG.basePoints * scoreRatio);
  return pace === "competition" && scoreRatio === 1 && seconds > 0
    ? base + Math.min(GAME_CONFIG.secondsPerQuestion, Math.floor(seconds)) * GAME_CONFIG.pointsPerSecond
    : base;
}
