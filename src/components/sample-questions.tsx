"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { formatQuestionsEnglish, formatQuestionsTurkish } from "../data/format-questions";
import { evaluateQuestion, type QuestionResponse } from "../lib/question-engine";
import { topicLabel, type Locale } from "../lib/locale";
import { QuestionAnswer, correctAnswerText, solutionDetail } from "./question-answer";
import { QuestionImage } from "./question-image";

export function SampleQuestions({ locale, onExit }: { locale: Locale; onExit: () => void }) {
  const questions = [...(locale === "en" ? formatQuestionsEnglish : formatQuestionsTurkish)].sort((a, b) => a.id.localeCompare(b.id));
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QuestionResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const question = questions[index]!;
  const evaluation = response && evaluateQuestion(question, response);
  const last = index === questions.length - 1;

  return <main id="main" className="quiz-page wrap">
    <button className="text-button" type="button" onClick={onExit}>{locale === "en" ? "Back to home" : "Ana sayfaya dön"}</button>
    <div className="game-stats">
      <strong>{locale === "en" ? "Sample questions" : "Örnek sorular"}</strong>
      <strong>{index + 1} / {questions.length}</strong>
    </div>
    <div className="question-content">
      <span className="eyebrow">{topicLabel(locale, question.category)}</span>
      <h1>{question.question}</h1>
      {question.image && <QuestionImage key={question.id} image={question.image} showCredit={Boolean(response)} />}
      <QuestionAnswer key={question.id} question={question} locked={Boolean(response)} selectedId={selectedId}
        onAnswer={(nextResponse, nextSelectedId) => {
          if (response) return;
          setResponse(nextResponse);
          setSelectedId(nextSelectedId);
        }} />
    </div>
    {evaluation && <div className={`feedback ${evaluation.isCorrect ? "positive" : "negative"}`} role="status">
      <h2>{locale === "en" ? evaluation.isCorrect ? "Correct" : "Not quite" : evaluation.isCorrect ? "Doğru" : "Bir daha deneyebilirsin"}</h2>
      <p><b>{locale === "en" ? "Correct answer" : "Doğru cevap"}: {correctAnswerText(question)}.</b> {solutionDetail(question)} {question.explanation}</p>
      <a href={question.sourceUrl} target="_blank" rel="noreferrer">{locale === "en" ? "Source" : "Kaynak"}</a>
    </div>}
    {response && <div className="next-row"><button className="button primary" type="button" onClick={() => {
      setIndex(last ? 0 : index + 1);
      setResponse(null);
      setSelectedId(null);
    }}>{locale === "en" ? last ? "Start Again" : "Next Sample" : last ? "Baştan Başla" : "Sonraki Örnek"}<ArrowRight size={18} /></button></div>}
  </main>;
}
