import { questions } from "../data/questions";
import type { Difficulty } from "./config";
import { matchesCategory, type GameCategory } from "./categories";
import type { Question } from "./types";

export interface QuestionRepository {
  getAll(): Promise<readonly Question[]>;
  getByDifficulty(difficulty: Difficulty, category?: GameCategory): Promise<readonly Question[]>;
}
export const questionRepository: QuestionRepository = {
  async getAll() { return questions; },
  async getByDifficulty(difficulty, category = "mixed") {
    return questions.filter((q) => q.difficulty === difficulty && matchesCategory(q.category, category));
  },
};
