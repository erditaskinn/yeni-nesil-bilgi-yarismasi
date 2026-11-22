import type { Answer } from "./types";
import { correctStoredMistake, storedMistakes } from "./statistics";

const sessionAnswers = new Map<string, Map<string, boolean>>();
export function rememberAnswer(answer: Pick<Answer, "questionId" | "correct">, owner?: string) {
  const key = owner ?? "guest";
  const answers = sessionAnswers.get(key) ?? new Map<string, boolean>();
  answers.set(answer.questionId, answer.correct);
  sessionAnswers.set(key, answers);
  if (answer.correct) correctStoredMistake(answer.questionId, owner);
}
export function mistakeIds(owner?: string): Set<string> {
  const ids = storedMistakes(owner);
  for (const [id, correct] of sessionAnswers.get(owner ?? "guest") ?? []) {
    if (correct) ids.delete(id); else ids.add(id);
  }
  return ids;
}
