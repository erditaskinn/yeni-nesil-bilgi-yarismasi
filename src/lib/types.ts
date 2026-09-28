import type { Difficulty } from "./config";

export interface Choice {
  id: string;
  text: string;
}
export interface Question {
  id: string;
  difficulty: Difficulty;
  category: string;
  question: string;
  choices: readonly [Choice, Choice, Choice, Choice];
  correctAnswer: string;
  explanation: string;
  sourceUrl: string;
  reviewedAt: string;
  image?: { src: string; alt: string; width: number; height: number; credit: string; licenseUrl: string };
}
export interface Answer {
  questionId: string;
  selectedId: string | null;
  correct: boolean;
  remainingSeconds: number;
  points: number;
}
