import { questions } from "../data/questions";
import type { Difficulty } from "./config";
import { matchesCategory, type GameCategory } from "./categories";
import type { Question } from "./types";
import type { Locale } from "./locale";

export async function questionsForLocale(locale: Locale = "tr"): Promise<readonly Question[]> {
  return locale === "tr" ? questions : (await import("../data/questions-en")).englishQuestions;
}

export interface QuestionRepository {
  getAll(locale?: Locale): Promise<readonly Question[]>;
  getByDifficulty(difficulty: Difficulty, category?: GameCategory, locale?: Locale, includeExpertAtHard?: boolean): Promise<readonly Question[]>;
}
export const questionRepository: QuestionRepository = {
  async getAll(locale = "tr") { return questionsForLocale(locale); },
  async getByDifficulty(difficulty, category = "mixed", locale = "tr", includeExpertAtHard = false) {
    return (await questionsForLocale(locale)).filter((q) => (q.difficulty === difficulty || includeExpertAtHard && difficulty === "hard" && q.difficulty === "expert") && matchesCategory(q.category, category));
  },
};
