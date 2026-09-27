import { questions } from "../data/questions";
import type { Difficulty } from "./config";
import type { Question } from "./types";

export interface QuestionRepository {
  getByDifficulty(difficulty: Difficulty): Promise<readonly Question[]>;
}
export const questionRepository: QuestionRepository = {
  async getByDifficulty(difficulty) {
    return questions.filter((q) => q.difficulty === difficulty);
  },
};
