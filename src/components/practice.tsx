"use client";
import { useI18n } from "./locale-provider";


import { useEffect, useReducer, useRef } from "react";
import { QuestionImage } from "./question-image";
import { QuestionAnswer, correctAnswerText, solutionDetail } from "./question-answer";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Lightbulb, RotateCcw } from "lucide-react";
import { initialPracticeState, practiceReducer } from "../lib/practice";
import { evaluateQuestion } from "../lib/question-engine";
import type { Question } from "../lib/types";

export function Practice({ questions, onBack, onCorrect }: { questions: readonly Question[]; onBack: () => void; onCorrect?: (id: string) => void }) {
  const { t } = useI18n();
  const [state, dispatch] = useReducer(
    (current: typeof initialPracticeState, action: Parameters<typeof practiceReducer>[1]) =>
      practiceReducer(current, action, questions),
    initialPracticeState,
  );
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [state.index, state.phase]);

  if (state.phase === "finished") return (
    <section className="study-page wrap" aria-labelledby="study-title">
      <span className="eyebrow">{t("practiceFinished")}</span>
      <h1 id="study-title" ref={heading} tabIndex={-1}>{t("practiceTitle")}</h1>
      <p>{t("practiceSummary", { total: questions.length, correct: state.correct })}</p>
      <div className="study-actions">
        <button className="button primary" onClick={() => dispatch({ type: "restart" })}><RotateCcw size={17} />{t("practiceAgain")}</button>
        <button className="button secondary" onClick={onBack}><ArrowLeft size={17} />{t("resultsBack")}</button>
      </div>
    </section>
  );

  const question = questions[state.index]!;
  const locked = state.phase === "feedback";
  return (
    <section className="study-page wrap" aria-labelledby="study-title">
      <button className="text-button" onClick={onBack}><ArrowLeft size={17} />{t("resultsBack")}</button>
      <div className="study-topline"><span className="eyebrow">{t("practiceEyebrow")}</span><span>{t("progress", { n: state.index + 1, total: questions.length })}</span></div>
      <p className="study-mode">{t("untimed")}</p>
      <progress className="question-progress" value={state.index + 1} max={questions.length} aria-label={t("practiceProgress", { n: state.index + 1, total: questions.length })} />
      <h1 id="study-title" ref={heading} tabIndex={-1}>{question.question}</h1>
      {question.image && <QuestionImage key={question.id} image={question.image} showCredit={locked} />}
      <QuestionAnswer key={question.id} question={question} locked={locked} selectedId={state.selectedId}
        initialText={state.response?.type === "text" ? state.response.value : ""}
        onAnswer={(response, selectedId) => {
          if (evaluateQuestion(question, response)?.isCorrect) onCorrect?.(question.id);
          dispatch({ type: "answer", questionId: question.id, selectedId, response });
        }} />
      {locked && <div className="feedback" role="status">
        <div className="feedback-heading">{evaluateQuestion(question, state.response ?? { type: "choice", id: state.selectedId ?? "" })?.isCorrect ? <Check size={21} /> : <Lightbulb size={21} />}<h2>{evaluateQuestion(question, state.response ?? { type: "choice", id: state.selectedId ?? "" })?.isCorrect ? t("practiceCorrect") : t("correctAnswer")}</h2></div>
        <p><b>{correctAnswerText(question)}.</b> {solutionDetail(question) && <>{solutionDetail(question)} </>}{question.explanation}</p>
        <a href={question.sourceUrl} target="_blank" rel="noreferrer">{t("source")}<ExternalLink size={13} /><span className="sr-only">{t("newTab")}</span></a>
      </div>}
      {locked && <div className="next-row"><span>{t("practiceNote")}</span><button className="button primary" onClick={() => dispatch({ type: "next", questionId: question.id })}>{state.index === questions.length - 1 ? t("finishPractice") : t("next")} <ArrowRight size={18} /></button></div>}
    </section>
  );
}
