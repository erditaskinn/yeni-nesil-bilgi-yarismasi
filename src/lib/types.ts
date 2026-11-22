import type { Difficulty } from "./config";
import type { QuestionResponse } from "./question-engine";

export interface Choice {
  id: string;
  text: string;
}
export type QuestionType = "multiple_choice" | "image_question" | "map_selection" | "chronological_order" | "matching" | "audio_question" | "true_false" | "odd_one_out" | "fill_in_blank";
export type QuestionFormat =
  | { type: "image_question"; media: QuestionMedia }
  | { type: "map_selection"; viewBox: string; media?: QuestionMedia; regions: readonly { id: string; label: string; x?: number; y?: number; path: string }[] }
  | { type: "chronological_order"; events: readonly { id: string; text: string; date: string }[]; order: readonly string[] }
  | { type: "matching"; left: readonly Choice[]; right: readonly Choice[]; pairs: Readonly<Record<string, string>> }
  | { type: "audio_question"; media: QuestionMedia & { transcript: string; durationSeconds: number } }
  | { type: "true_false" }
  | { type: "odd_one_out"; commonFeature: string; difference: string }
  | { type: "fill_in_blank"; mode: "choices" | "text"; acceptedAnswers?: readonly string[]; completedText: string };
export interface QuestionMedia {
  src: string;
  credit: string;
  licenseUrl: string;
  alt?: string;
  width?: number;
  height?: number;
}
export interface Question {
  id: string;
  difficulty: Difficulty;
  category: string;
  question: string;
  choices: readonly [Choice, Choice, ...Choice[]];
  correctAnswer: string;
  explanation: string;
  sourceUrl: string;
  reviewedAt: string;
  image?: { src: string; alt: string; width: number; height: number; credit: string; licenseUrl: string };
  format?: QuestionFormat;
  timeLimitSeconds?: number;
  contentVersion?: number;
  active?: boolean;
}
export interface Answer {
  questionId: string;
  selectedId: string | null;
  correct: boolean;
  remainingSeconds: number;
  points: number;
  scoreRatio?: number;
  answeredAt?: string;
  questionType?: QuestionType;
  responseTime?: number;
  response?: QuestionResponse;
  correctResponse?: QuestionResponse;
}
