import type { Difficulty } from "../lib/config";
import type { Question } from "../lib/types";

/** Each row keeps its source and editorial explanation beside the question. */
export type LevelBalanceRow = readonly [question: string, choices: readonly [string, string, string, string], explanation: string];
export function levelBalanceQuestions(prefix: string, category: string, difficulty: Difficulty, sourceUrl: string, rows: readonly LevelBalanceRow[]): readonly Question[] {
  return rows.map(([question, options, explanation], index) => {
    const id = `${prefix}${String(index + 1).padStart(3, "0")}`;
    return { id, category, difficulty, question,
      choices: options.map((text, choice) => ({ id: `${id}-${choice}`, text })) as unknown as Question["choices"],
      correctAnswer: `${id}-0`, explanation, sourceUrl, reviewedAt: "2026-11-22" };
  });
}
