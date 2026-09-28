"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { QuestionImage } from "./question-image";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Clock3,
  ExternalLink,
  Lightbulb,
  LogOut,
  Trophy,
  X,
} from "lucide-react";
import { GAME_CONFIG, LEVELS } from "../lib/config";
import { CATEGORIES } from "../lib/categories";
import { gameReducer, summarize, type GameState } from "../lib/game";
import { ExitDialog } from "./exit-dialog";
import { Results } from "./results";
import { dailyLabel } from "../lib/daily";

export function Quiz({
  initialState,
  onExit,
  onReplay,
  onLevels,
  onCategories,
  onHome,
}: {
  initialState: GameState;
  onExit: () => void;
  onReplay: () => void;
  onLevels: () => void;
  onCategories: () => void;
  onHome: () => void;
}) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [exitOpen, setExitOpen] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const q = state.questions[state.index]!;
  const answer = state.answers[state.index];
  const locked = state.phase !== "answering";

  useEffect(() => {
    if (state.phase !== "answering") return;
    const tick = () =>
      dispatch({ type: "tick", questionId: q.id, now: Date.now() });
    const interval = window.setInterval(tick, 100);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [q.id, state.phase]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    questionHeading.current?.focus({ preventScroll: true });
  }, [q.id]);
  useEffect(() => {
    if (state.phase === "feedback" && !exitOpen) nextButton.current?.focus();
  }, [state.phase, exitOpen]);

  if (state.phase === "finished")
    return (
      <Results
        state={state}
        onReplay={onReplay}
        onLevels={onLevels}
        onCategories={onCategories}
        onHome={onHome}
      />
    );

  return (
    <section className="quiz-page wrap" aria-label="Bilgi yarışması">
      <div className="quiz-topbar">
        <div className="quiz-mode">
          <span className={`difficulty-label level-${state.difficulty}`}>
            <span />
            {state.dailyDate ? "Günlük 10 Soru" : LEVELS[state.difficulty].label}
          </span>
          <span className="quiz-category">{state.dailyDate ? dailyLabel(state.dailyDate) : CATEGORIES[state.category].label}</span>
        </div>
        <button className="text-button" onClick={() => setExitOpen(true)}>
          <LogOut size={17} /> Yarışmadan çık
        </button>
      </div>
      <div className="game-stats">
        <div>
          <span className="muted">SORU</span>
          <strong>
            <span data-testid="question-number">
              {String(state.index + 1).padStart(2, "0")}
            </span>
            <small> / {state.questions.length}</small>
          </strong>
        </div>
        <div className="live-score">
          <Trophy size={19} />
          <strong data-testid="live-score">
            {summarize(state.answers).total.toLocaleString("tr-TR")}{" "}
            <small>puan</small>
          </strong>
        </div>
        <div
          className={`timer ${state.remaining <= 5 && !locked ? "urgent" : ""}`}
          role="timer"
          aria-label={`Kalan süre: ${state.remaining} saniye`}
        >
          <Clock3 size={20} />
          <strong data-testid="timer">
            {state.remaining}
            <small> sn</small>
          </strong>
        </div>
      </div>
      <progress
        className="question-progress"
        value={state.index + 1}
        max={state.questions.length}
        aria-label={`Soru ${state.index + 1} / ${state.questions.length}`}
      />
      <div className="question-content">
        <span className="eyebrow">{q.category.toLocaleUpperCase("tr-TR")}</span>
        <h1 ref={questionHeading} tabIndex={-1}>
          {q.question}
        </h1>
        {q.image && (
          <QuestionImage key={q.id} image={q.image} showCredit={locked} />
        )}
        <div className="choices" role="group" aria-label="Cevap seçenekleri">
          {q.choices.map((choice, i) => {
            const isCorrect = locked && choice.id === q.correctAnswer;
            const isWrong =
              locked && choice.id === answer?.selectedId && !answer.correct;
            return (
              <button
                key={choice.id}
                className={`choice ${isCorrect ? "correct" : ""} ${isWrong ? "incorrect" : ""}`}
                disabled={locked}
                onClick={() =>
                  dispatch({
                    type: "answer",
                    questionId: q.id,
                    selectedId: choice.id,
                    now: Date.now(),
                  })
                }
              >
                <span className="choice-letter" aria-hidden="true">
                  {"ABCD"[i]}
                </span>
                <span className="choice-text">{choice.text}</span>
                {isCorrect ? (
                  <Check
                    aria-label="Doğru cevap"
                    className="choice-state"
                    size={21}
                  />
                ) : isWrong ? (
                  <X
                    aria-label="Yanlış cevabın"
                    className="choice-state"
                    size={21}
                  />
                ) : null}
                {isCorrect && <span className="sr-only">Doğru cevap</span>}
                {isWrong && <span className="sr-only">Yanlış cevabın</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="sr-only" role="status">
        {state.remaining <= 5 && !locked ? "Son 5 saniye." : ""}
      </div>
      {answer ? (
        <div
          className={`feedback ${answer.correct ? "positive" : "negative"}`}
          role="status"
        >
          <div className="feedback-heading">
            {answer.correct ? (
              <CircleCheck size={23} />
            ) : (
              <Lightbulb size={23} />
            )}
            <h2>
              {answer.correct
                ? "Doğru cevap, harika!"
                : answer.selectedId === null
                  ? "Süre doldu. Yeni bir bilgiye ne dersin?"
                  : "Bu da yeni bir bilgi!"}
            </h2>
            <strong>+{answer.points} puan</strong>
          </div>
          <p>
            <b>
              Doğru cevap:{" "}
              {q.choices.find((c) => c.id === q.correctAnswer)?.text}.
            </b>{" "}
            {q.explanation}
          </p>
          <a href={q.sourceUrl} target="_blank" rel="noreferrer">
            Kaynağı incele <ExternalLink size={13} />
            <span className="sr-only"> (yeni sekmede açılır)</span>
          </a>
        </div>
      ) : (
        <p className="score-hint">
          Doğru cevap <b>+{GAME_CONFIG.basePoints}</b> puan <span>·</span> Kalan
          her saniye <b>+{GAME_CONFIG.pointsPerSecond}</b> puan
        </p>
      )}
      {answer && (
        <div className="next-row">
          <span>
            {state.index + 1 < state.questions.length
              ? "Merak etmeye devam."
              : "Sonucun hazır!"}
          </span>
          <button
            className="button primary"
            ref={nextButton}
            onClick={() =>
              dispatch({ type: "next", questionId: q.id, now: Date.now() })
            }
          >
            {state.index + 1 === state.questions.length
              ? "Sonucumu Gör"
              : "Sonraki Soru"}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
      {exitOpen && (
        <ExitDialog onCancel={() => setExitOpen(false)} onExit={onExit} />
      )}
    </section>
  );
}
