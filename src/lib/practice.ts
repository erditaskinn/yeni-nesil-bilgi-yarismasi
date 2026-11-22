import type { Question } from "./types";
import { evaluateQuestion, type QuestionResponse } from "./question-engine";

export interface PracticeState {
  index: number;
  selectedId: string | null;
  response: QuestionResponse | null;
  correct: number;
  phase: "answering" | "feedback" | "finished";
}

export const initialPracticeState: PracticeState = {
  index: 0,
  selectedId: null,
  response: null,
  correct: 0,
  phase: "answering",
};

export type PracticeAction =
  | { type: "answer"; questionId: string; selectedId: string; response?: QuestionResponse }
  | { type: "next"; questionId: string }
  | { type: "restart" };

export function practiceReducer(
  state: PracticeState,
  action: PracticeAction,
  questions: readonly Question[],
): PracticeState {
  if (action.type === "restart") return initialPracticeState;
  const question = questions[state.index];
  if (!question || action.questionId !== question.id) return state;
  if (action.type === "answer") {
    if (state.phase !== "answering") return state;
    const evaluation = evaluateQuestion(question, action.response ?? { type: "choice", id: action.selectedId });
    if (!evaluation) return state;
    return {
      ...state,
      selectedId: action.selectedId,
      response: evaluation.selectedAnswer,
      correct: state.correct + Number(evaluation.isCorrect),
      phase: "feedback",
    };
  }
  if (state.phase !== "feedback") return state;
  return state.index === questions.length - 1
    ? { ...state, phase: "finished" }
    : { ...state, index: state.index + 1, selectedId: null, response: null, phase: "answering" };
}
