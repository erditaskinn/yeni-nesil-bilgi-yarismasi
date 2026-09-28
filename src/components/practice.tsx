"use client";

import { useEffect, useReducer, useRef } from "react";
import { QuestionImage } from "./question-image";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Lightbulb, RotateCcw, X } from "lucide-react";
import { initialPracticeState, practiceReducer } from "../lib/practice";
import type { Question } from "../lib/types";

export function Practice({ questions, onBack }: { questions: readonly Question[]; onBack: () => void }) {
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
      <span className="eyebrow">ÇALIŞMA TAMAMLANDI</span>
      <h1 id="study-title" ref={heading} tabIndex={-1}>Güzel bir tekrar yaptın!</h1>
      <p>{questions.length} sorudan {state.correct} tanesini bu kez doğru cevapladın. Bu tur puanına ve rekoruna eklenmedi.</p>
      <div className="study-actions">
        <button className="button primary" onClick={() => dispatch({ type: "restart" })}><RotateCcw size={17} /> Tekrar Çalış</button>
        <button className="button secondary" onClick={onBack}><ArrowLeft size={17} /> Sonuçlarıma Dön</button>
      </div>
    </section>
  );

  const question = questions[state.index]!;
  const locked = state.phase === "feedback";
  return (
    <section className="study-page wrap" aria-labelledby="study-title">
      <button className="text-button" onClick={onBack}><ArrowLeft size={17} /> Sonuçlarıma Dön</button>
      <div className="study-topline"><span className="eyebrow">YANLIŞLARIMI ÇALIŞ</span><span>Soru {state.index + 1} / {questions.length}</span></div>
      <p className="study-mode">Süresiz · Puansız</p>
      <progress className="question-progress" value={state.index + 1} max={questions.length} aria-label={`Çalışma sorusu ${state.index + 1} / ${questions.length}`} />
      <h1 id="study-title" ref={heading} tabIndex={-1}>{question.question}</h1>
      {question.image && <QuestionImage key={question.id} image={question.image} showCredit={locked} />}
      <div className="choices" role="group" aria-label="Cevap seçenekleri">
        {question.choices.map((choice, index) => {
          const correct = locked && choice.id === question.correctAnswer;
          const wrong = locked && choice.id === state.selectedId && !correct;
          return <button key={choice.id} className={`choice ${correct ? "correct" : ""} ${wrong ? "incorrect" : ""}`} disabled={locked} onClick={() => dispatch({ type: "answer", questionId: question.id, selectedId: choice.id })}>
            <span className="choice-letter" aria-hidden="true">{"ABCD"[index]}</span>
            <span className="choice-text">{choice.text}</span>
            {correct && <><Check className="choice-state" size={20} /><span className="sr-only">Doğru cevap</span></>}
            {wrong && <><X className="choice-state" size={20} /><span className="sr-only">Yanlış cevabın</span></>}
          </button>;
        })}
      </div>
      {locked && <div className="feedback" role="status">
        <div className="feedback-heading">{state.selectedId === question.correctAnswer ? <Check size={21} /> : <Lightbulb size={21} />}<h2>{state.selectedId === question.correctAnswer ? "Doğru bildin!" : "Doğru cevap"}</h2></div>
        <p><b>{question.choices.find((choice) => choice.id === question.correctAnswer)?.text}.</b> {question.explanation}</p>
        <a href={question.sourceUrl} target="_blank" rel="noreferrer">Kaynağı incele <ExternalLink size={13} /><span className="sr-only"> (yeni sekmede açılır)</span></a>
      </div>}
      {locked && <div className="next-row"><span>Süresiz çalışma · Puan yok</span><button className="button primary" onClick={() => dispatch({ type: "next", questionId: question.id })}>{state.index === questions.length - 1 ? "Çalışmayı Bitir" : "Sonraki Soru"} <ArrowRight size={18} /></button></div>}
    </section>
  );
}
