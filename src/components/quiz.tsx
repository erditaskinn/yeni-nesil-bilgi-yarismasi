"use client";
import { useI18n } from "./locale-provider";
import { levelInfo, categoryInfo, numberLocale, topicLabel } from "../lib/locale";


import { useEffect, useReducer, useRef, useState } from "react";
import { QuestionImage } from "./question-image";
import { QuestionAnswer, correctAnswerText, solutionDetail } from "./question-answer";
import {
  ArrowRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  Lightbulb,
  LogOut,
  Trophy,
} from "lucide-react";
import { GAME_CONFIG } from "../lib/config";
import { gameReducer, roundEndsAfterFeedback, shuffle, summarize, type GameState } from "../lib/game";
import { roundLabel } from "../lib/rounds";
import { paceLabel } from "../lib/pace";
import { rememberAnswer } from "../lib/mistakes";
import { saveRoundSession } from "../lib/round-session";
import { readSeenQuestions, saveSeenQuestions } from "../lib/storage";
import { ExitDialog } from "./exit-dialog";
import { Results } from "./results";
import { dailyLabel } from "../lib/daily";
import { useAndroidBack } from "./use-android-back";
import { questionRepository } from "../lib/question-repository";
import { playQuizFeedbackSound } from "../lib/sound-effects";
import { evaluateQuestion } from "../lib/question-engine";
import { ADAPTIVE_ANSWER_WINDOW, advanceAdaptiveDifficulty } from "../lib/adaptive-difficulty";
import { DIFFICULTIES, type Difficulty } from "../lib/config";
import { matchesCategory } from "../lib/categories";

export function Quiz({
  initialState,
  scoreOwner,
  onExit,
  onReplay,
  onLevels,
  onCategories,
  onHome,
  onProfile,
  enableSoundEffects = false,
  includeExpertAtHard = false,
}: {
  initialState: GameState;
  scoreOwner?: string;
  onExit: () => void;
  onReplay: () => void;
  onLevels: () => void;
  onCategories: () => void;
  onHome: () => void;
  onProfile: () => void;
  enableSoundEffects?: boolean;
  includeExpertAtHard?: boolean;
}) {
  const { locale, t } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [exitOpen, setExitOpen] = useState(false);
  const [mediaReadyId, setMediaReadyId] = useState<string | null>(null);
  const [mediaErrorId, setMediaErrorId] = useState<string | null>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const feedbackRegion = useRef<HTMLDivElement>(null);
  const recordedAnswers = useRef(initialState.phase === "finished" ? initialState.answers.length : 0);
  const lastSaved = useRef("");
  const q = state.questions[state.index]!;
  const answer = state.answers[state.index];
  const locked = state.phase !== "answering";
  const needsMedia = q.format?.type === "image_question" || q.format?.type === "map_selection" && Boolean(q.format.media);
  const handleMediaReady = () => {
    if (mediaReadyId === q.id) return;
    setMediaReadyId(q.id);
    dispatch({ type: "mediaReady", questionId: q.id, now: Date.now() });
  };
  const handleMediaError = async () => {
    if (mediaErrorId === q.id) return;
    setMediaErrorId(q.id);
    const pool = await questionRepository.getByDifficulty(state.difficulty, state.category, locale, !state.adaptive && includeExpertAtHard);
    const used = new Set(state.questions.map(item => item.id));
    const replacement = pool.find(item => !used.has(item.id) && item.active !== false && item.format?.type !== "image_question" && item.format?.type !== "map_selection" && !item.image);
    dispatch(replacement
      ? { type: "replace", questionId: q.id, replacement, now: Date.now() }
      : { type: "mediaUnavailable", questionId: q.id, now: Date.now() });
  };
  const handleNext = async () => {
    if (state.adaptive && state.mode === "adaptive") {
      try {
        const all = await questionRepository.getAll(locale);
        const used = new Set(state.questions.map(item => item.id));
        const pools = new Map<Difficulty, Array<(typeof all)[number]>>();
        for (const level of DIFFICULTIES) {
          const unique = new Map(all.filter(item => item.active !== false && item.difficulty === level && matchesCategory(item.category, state.category) && !used.has(item.id)).map(item => [item.id, item]));
          pools.set(level, [...unique.values()]);
        }
        const available = DIFFICULTIES.filter(level => pools.get(level)!.length > 0);
        const outcomes = state.answers.length % ADAPTIVE_ANSWER_WINDOW === 0 ? state.answers.slice(-ADAPTIVE_ANSWER_WINDOW).map(item => item.correct) : [];
        const target = advanceAdaptiveDifficulty(state.difficulty, outcomes, available);
        const candidates = target ? pools.get(target)! : [];
        if (!target || !candidates.length) {
          dispatch({ type: "next", questionId: q.id, now: Date.now(), exhausted: true });
          return;
        }
        const seen = new Set(readSeenQuestions());
        const unseen = shuffle(candidates.filter(item => !seen.has(item.id)));
        const seenCandidates = shuffle(candidates.filter(item => seen.has(item.id)));
        const candidate = (unseen.length ? unseen : seenCandidates)[0]!;
        const appendQuestion = { ...candidate, choices: shuffle(candidate.choices) as unknown as typeof candidate.choices };
        saveSeenQuestions([candidate.id]);
        const performanceTarget = advanceAdaptiveDifficulty(state.difficulty, outcomes);
        dispatch({ type: "next", questionId: q.id, now: Date.now(), adaptiveDifficulty: target, appendQuestion,
          ...(outcomes.length === ADAPTIVE_ANSWER_WINDOW && target === performanceTarget ? { adaptiveCorrectCount: outcomes.filter(Boolean).length } : {}) });
      } catch {
        dispatch({ type: "next", questionId: q.id, now: Date.now(), exhausted: true });
      }
      return;
    }
    if (!state.adaptive || state.answers.length === 0 || state.answers.length % ADAPTIVE_ANSWER_WINDOW !== 0 || state.index >= state.questions.length - 1) {
      dispatch({ type: "next", questionId: q.id, now: Date.now() });
      return;
    }
    const all = await questionRepository.getAll(locale);
    const pools = new Map<Difficulty, Array<(typeof all)[number]>>();
    for (const level of DIFFICULTIES) pools.set(level, all.filter(item => item.active !== false && item.difficulty === level && matchesCategory(item.category, state.category)));
    const end = Math.min(state.questions.length, state.index + ADAPTIVE_ANSWER_WINDOW + 1);
    const blockSize = end - state.index - 1;
    const past = new Set(state.questions.slice(0, state.index + 1).map(item => item.id));
    const reservedTail = new Set(state.questions.slice(end).map(item => item.id));
    const candidatesFor = (level: Difficulty) => pools.get(level)!.filter(item => !past.has(item.id) && !reservedTail.has(item.id));
    const availableLevels = DIFFICULTIES.filter(level => candidatesFor(level).length >= blockSize);
    const target = advanceAdaptiveDifficulty(state.difficulty, state.answers.slice(-ADAPTIVE_ANSWER_WINDOW).map(item => item.correct), availableLevels);
    if (!target) { dispatch({ type: "next", questionId: q.id, now: Date.now() }); return; }
    const seen = new Set(readSeenQuestions());
    const candidates = [...shuffle(candidatesFor(target).filter(item => !seen.has(item.id))), ...shuffle(candidatesFor(target).filter(item => seen.has(item.id)))];
    const replacements: { index: number; question: (typeof all)[number] }[] = [];
    for (let index = state.index + 1; index < end; index++) {
      const candidate = candidates.shift();
      if (!candidate) break;
      replacements.push({ index, question: { ...candidate, choices: [...candidate.choices].sort(() => Math.random() - 0.5) as unknown as typeof candidate.choices } });
    }
    saveSeenQuestions(replacements.map(item => item.question.id));
    dispatch({ type: "next", questionId: q.id, now: Date.now(), adaptiveDifficulty: target, replacements });
  };
  useEffect(() => {
    const signature = `${state.sessionId}:${state.index}:${state.phase}:${state.answers.length}:${locale}:${scoreOwner ?? "guest"}`;
    if (lastSaved.current === signature) return;
    lastSaved.current = signature;
    for (const answer of state.answers.slice(recordedAnswers.current)) rememberAnswer(answer, scoreOwner);
    recordedAnswers.current = state.answers.length;
    if (state.mode === "endless" || state.mode === "adaptive") saveSeenQuestions([state.questions[state.index]!.id]);
    saveRoundSession(state, locale, scoreOwner);
  }, [state.answers, state.index, state.phase, state.deadline, state, locale, scoreOwner]);
  useAndroidBack(() => {
    if (state.phase === "finished") return false;
    setExitOpen(!exitOpen);
    return true;
  });

  useEffect(() => {
    if (state.phase !== "answering" || state.pace === "relaxed" || (needsMedia && mediaReadyId !== q.id)) return;
    const tick = () =>
      dispatch({ type: "tick", questionId: q.id, now: Date.now() });
    const interval = window.setInterval(tick, 100);
    tick();
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("ynby-resume", tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("ynby-resume", tick);
    };
  }, [q.id, state.phase, state.pace, needsMedia, mediaReadyId]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    questionHeading.current?.focus({ preventScroll: true });
  }, [q.id]);
  useEffect(() => {
    if (state.phase === "feedback" && !exitOpen) feedbackRegion.current?.focus({ preventScroll: true });
  }, [state.phase, exitOpen]);

  if (state.phase === "finished")
    return (
      <Results
        state={state}
        scoreOwner={scoreOwner}
        onReplay={onReplay}
        onLevels={onLevels}
        onCategories={onCategories}
        onHome={onHome}
        onProfile={onProfile}
      />
    );

  return (
    <section className="quiz-page wrap" aria-label={t("quizLabel")}>
      <div className="quiz-topbar">
        <div className="quiz-mode">
          <span className={`difficulty-label level-${state.difficulty}`}>
            <span />
            {state.dailyDate ? t("daily") : levelInfo(locale, state.difficulty).label}
          </span>
          {state.adaptive && <span className="quiz-adaptive-label">Uyarlanabilir mod</span>}
          <span className="quiz-category">{state.dailyDate ? dailyLabel(state.dailyDate, locale) : `${categoryInfo(locale, state.category).label} · ${roundLabel(state.mode, locale)}`} · {paceLabel(state.pace, locale)}</span>
        </div>
        <button className="text-button" aria-label={state.mode === "adaptive" ? "Turu bitir" : t("exit")} title={state.mode === "adaptive" ? "Turu bitir" : t("exit")} onClick={() => setExitOpen(true)}>
          <LogOut size={17} /><span className="quiz-exit-label">{state.mode === "adaptive" ? "Turu bitir" : t("exit")}</span></button>
      </div>
      <div className="game-stats">
        <div>
          <span className="muted">{t("question")}</span>
          <strong>
            <span data-testid="question-number">
              {String(state.index + 1).padStart(2, "0")}
            </span>
            <small> / {state.mode === "endless" || state.mode === "adaptive" ? "∞" : state.questions.length}</small>
          </strong>
        </div>
        <div className="live-score">
          <Trophy size={19} />
          <strong data-testid="live-score">
            {summarize(state.answers).total.toLocaleString(numberLocale(locale))}{" "}
            <small>{t("points")}</small>
          </strong>
        </div>
        {state.pace === "competition" && <div
          className={`timer ${state.remaining <= 5 && !locked ? "urgent" : ""}`}
          role="timer"
          aria-label={t("remaining", { seconds: state.remaining })}
        >
          <Clock3 size={20} />
          <strong data-testid="timer">
            {state.remaining}
            <small>{t("seconds")}</small>
          </strong>
        </div>}
      </div>
      {state.adaptive && <div className="adaptive-level-meter">
        <div className="adaptive-level-heading"><span>Sistemin hedef seviyesi</span><strong>{levelInfo(locale, state.difficulty).label}</strong></div>
        <div className="adaptive-level-track" role="meter" aria-label="Uyarlanabilir zorluk seviyesi" aria-valuemin={1} aria-valuemax={DIFFICULTIES.length} aria-valuenow={DIFFICULTIES.indexOf(state.difficulty) + 1} aria-valuetext={levelInfo(locale, state.difficulty).label}>
          {DIFFICULTIES.map((level, index) => <span key={level} className={`adaptive-level-step${index <= DIFFICULTIES.indexOf(state.difficulty) ? " is-reached" : ""}${level === state.difficulty ? " is-current" : ""}`} aria-hidden="true"><i /><small>{levelInfo(locale, level).label}</small></span>)}
        </div>
        <small className="adaptive-level-note">Her {ADAPTIVE_ANSWER_WINDOW} cevapta bir, performansına göre ayarlanır.</small>
        <div className="adaptive-change-status" role="status" aria-live="polite" aria-atomic="true">
          {state.adaptiveProgress?.changes.slice(-1).map(change => change.afterAnswer === state.answers.length ? <p key={change.afterAnswer}>
            Hedef seviye: {levelInfo(locale, change.from).label} → {levelInfo(locale, change.to).label}.
            {change.correctInWindow === null ? " Sorulmamış soruların bulunduğu bir seviyeye geçildi." : ` Son ${ADAPTIVE_ANSWER_WINDOW} cevapta ${change.correctInWindow} doğru yaptın.`}
          </p> : null)}
        </div>
        {q.difficulty !== state.difficulty && <small className="adaptive-question-difficulty">Bu sorunun havuz seviyesi: {levelInfo(locale, q.difficulty).label}</small>}
      </div>}
      {state.mode !== "endless" && state.mode !== "adaptive" && <progress
        className="question-progress"
        value={state.index + 1}
        max={state.questions.length}
        aria-label={t("progress", { n: state.index + 1, total: state.questions.length })}
      />}
      {enableSoundEffects && state.mode !== "endless" && state.mode !== "adaptive" && <div className="native-game-progress-dots" aria-hidden="true">
        {state.questions.map((question, index) => <span key={question.id} className={index < state.index ? "is-complete" : index === state.index ? "is-current" : ""} />)}
      </div>}
      <div className="question-content">
        <span className="eyebrow">{topicLabel(locale, q.category).toLocaleUpperCase(numberLocale(locale))}</span>
        <h1 ref={questionHeading} tabIndex={-1}>
          {q.question}
        </h1>
        {q.image && (
          <QuestionImage key={q.id} image={q.image} showCredit={locked}
            onLoad={q.format?.type === "image_question" ? handleMediaReady : undefined}
            onError={q.format?.type === "image_question" ? handleMediaError : undefined} />
        )}
        <QuestionAnswer key={q.id} question={q} locked={locked} selectedId={answer?.selectedId ?? null}
          onMediaLoad={q.format?.type === "map_selection" ? handleMediaReady : undefined}
          onMediaError={q.format?.type === "map_selection" ? handleMediaError : undefined}
          initialText={answer?.response?.type === "text" ? answer.response.value : ""}
          onAnswer={(response, selectedId) => {
            if (enableSoundEffects) {
              const evaluation = evaluateQuestion(q, response);
              if (evaluation) playQuizFeedbackSound(evaluation.isCorrect);
            }
            dispatch({ type: "answer", questionId: q.id, response, selectedId, now: Date.now() });
          }} />
      </div>
      {state.pace === "competition" && <div className="sr-only" role="status">
        {state.remaining <= 5 && !locked ? t("lastSeconds") : ""}
      </div>}
      {answer && (
        <div className="next-row">
          <span>
            {!roundEndsAfterFeedback(state)
              ? t("keepCurious")
              : t("ready")}
          </span>
          <button
            className="button primary"
            onClick={() => void handleNext()}
          >
            {roundEndsAfterFeedback(state)
              ? t("seeResult")
              : t("next")}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
      {answer ? (
        <div
          ref={feedbackRegion}
          className={`feedback ${answer.correct ? "positive" : "negative"}`}
          role="status"
          tabIndex={-1}
        >
          <div className="feedback-heading">
            {answer.correct ? (
              <CircleCheck size={23} />
            ) : (
              <Lightbulb size={23} />
            )}
            <h2>
              {answer.correct
                ? t("correctFeedback")
                : answer.selectedId === null
                  ? t("timeoutFeedback")
                  : t("wrongFeedback")}
            </h2>
            <strong>+{answer.points} {t("points")}</strong>
          </div>
          <p>
            <b>
              {t("correctAnswer")}:{" "}
              {correctAnswerText(q)}.
            </b>{" "}
            {solutionDetail(q) && <>{solutionDetail(q)} </>}{q.explanation}
          </p>
          <a href={q.sourceUrl} target="_blank" rel="noreferrer">{t("source")}<ExternalLink size={13} />
            <span className="sr-only">{t("newTab")}</span>
          </a>
        </div>
      ) : (
        <p className="score-hint">{state.pace === "relaxed" ? t("relaxedScoreHint", { base: GAME_CONFIG.basePoints }) : t("scoreHint", { base: GAME_CONFIG.basePoints, bonus: GAME_CONFIG.pointsPerSecond })}</p>
      )}
      {exitOpen && (
        <ExitDialog adaptive={state.mode === "adaptive"} relaxed={state.pace === "relaxed"} onCancel={() => setExitOpen(false)} onExit={() => { if (state.mode === "endless" || state.mode === "adaptive") { setExitOpen(false); dispatch({ type: "exit", questionId: q.id, now: Date.now() }); } else onExit(); }} />
      )}
    </section>
  );
}
