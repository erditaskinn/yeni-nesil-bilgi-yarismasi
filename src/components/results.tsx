"use client";
import { useI18n } from "./locale-provider";
import { categoryInfo, levelInfo, numberLocale, topicLabel, formatPercentage } from "../lib/locale";
import { sharingText } from "../lib/sharing";


import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Trophy,
  X,
} from "lucide-react";
import { longestStreak, missedQuestions, summarize, type GameState } from "../lib/game";
import { ROUND_CONFIG, roundLabel } from "../lib/rounds";
import { paceLabel } from "../lib/pace";
import { saveHighScore } from "../lib/storage";
import { rememberAnswer } from "../lib/mistakes";
import { useAccount } from "./account-provider";
import { Practice } from "./practice";
import { dailyLabel } from "../lib/daily";
import { gameRecord, readStatistics, recordGame } from "../lib/statistics";
import { afterProfileClear, buildKnowledgeProfile } from "../lib/knowledge-profile";
import { questions } from "../data/questions";
import { QuestionImage } from "./question-image";
import { correctAnswerText, selectedAnswerText, solutionDetail } from "./question-answer";
import { Capacitor } from "@capacitor/core";
import { useAndroidBack } from "./use-android-back";
import { DIFFICULTIES } from "../lib/config";
import { ADAPTIVE_ANSWER_WINDOW } from "../lib/adaptive-difficulty";

export function Results({
  state,
  scoreOwner,
  onReplay,
  onLevels,
  onCategories,
  onHome,
  onProfile,
}: {
  state: GameState;
  scoreOwner?: string;
  onReplay: () => void;
  onLevels: () => void;
  onCategories: () => void;
  onHome: () => void;
  onProfile: () => void;
}) {
  const { locale, t } = useI18n();
  const { saveResult, saveProfileRecord, profileRecords, profileCutoff } = useAccount();
  const saved = useRef(false);
  const summary = summarize(state.answers);
  const adaptive = locale === "tr" && state.mode === "adaptive" && state.adaptive;
  const progress = state.adaptiveProgress;
  const startingLevel = progress?.start ?? state.questions[0]!.difficulty;
  const highestLevel = progress ? [progress.start, ...progress.changes.map(change => change.to)].reduce((best, level) => DIFFICULTIES.indexOf(level) > DIFFICULTIES.indexOf(best) ? level : best) : null;
  const levelDifference = DIFFICULTIES.indexOf(state.difficulty) - DIFFICULTIES.indexOf(startingLevel);
  const [shareStatus, setShareStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [view, setView] = useState<"summary" | "review" | "practice">("summary");
  const heading = useRef<HTMLHeadingElement>(null);
  const missed = missedQuestions(state);
  const text = sharingText(state, locale);
  const profileRecord = gameRecord(state, scoreOwner);
  const ownRecords = readStatistics().games.filter(record => record.owner === scoreOwner);
  const profileReady = readStatistics().enabled && buildKnowledgeProfile([...ownRecords, ...profileRecords, profileRecord].filter(record => record.owner === scoreOwner && afterProfileClear(record, profileCutoff)), questions).ready;
  useAndroidBack(() => {
    if (view !== "summary") setView("summary");
    else onHome();
    return true;
  });

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    if (state.pace === "competition" && state.mode === "standard" && state.questions.length === ROUND_CONFIG.standard.count) saveResult(scoreOwner, { difficulty: state.difficulty, score: summary.total, category: state.category });
    else if (state.mode !== "mistakes" && state.mode !== "daily") saveHighScore(state.difficulty, summary.total, undefined, state.category, scoreOwner, state.mode, state.pace);
    recordGame(state, undefined, scoreOwner);
    saveProfileRecord(profileRecord);
  }, [state, summary.total, scoreOwner, saveResult, saveProfileRecord, profileRecord]);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus(t("shareCopied"));
    } catch {
      setManualCopy(true);
      setShareStatus(
        t("shareManual"),
      );
    }
  }
  async function share() {
    if (sharing) return;
    setSharing(true);
    try {
      if (Capacitor.isNativePlatform()) {
        try {
          const { Share } = await import("@capacitor/share");
          await Share.share({ title: t("brand"), text });
          setShareStatus(t("shared"));
        } catch {
          // Dismissing the native share sheet must not copy text unexpectedly.
          setShareStatus("");
        }
        return;
      }
      if (navigator.share) {
        try {
          await navigator.share({ title: t("brand"), text });
          setShareStatus(t("shared"));
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
          await copy();
        }
      } else await copy();
    } finally {
      setSharing(false);
    }
  }

  if (view === "practice") return <Practice questions={missed.map((item) => item.question)} onCorrect={id => rememberAnswer({ questionId: id, correct: true }, scoreOwner)} onBack={() => setView("summary")} />;

  if (view === "review") return (
    <section className="review-page wrap" aria-labelledby="review-title">
      <button className="text-button" onClick={() => setView("summary")}><ArrowLeft size={17} />{t("resultsBack")}</button>
      <span className="eyebrow">{t("reviewEyebrow")}</span>
      <h1 id="review-title" ref={heading} tabIndex={-1}>{t("review")}</h1>
      <p>{t("missedIntro", { count: missed.length })}</p>
      <ol className="review-list">
        {missed.map(({ question, answer, number }) => <li key={question.id}>
          <span className="eyebrow">{t("reviewQuestion", { n: number, topic: topicLabel(locale, question.category).toLocaleUpperCase(numberLocale(locale)) })}</span>
          <h2>{question.question}</h2>
          {question.image && <QuestionImage image={question.image} showCredit />}
          <dl>
            <div><dt>{t("yourAnswer")}</dt><dd>{answer.selectedId === null ? t("timedOut") : selectedAnswerText(question, answer)}</dd></div>
            <div><dt>{t("correctAnswer")}</dt><dd>{correctAnswerText(question)}</dd></div>
          </dl>
          {solutionDetail(question) && <p>{solutionDetail(question)}</p>}
          <p>{question.explanation}</p>
          <a href={question.sourceUrl} target="_blank" rel="noreferrer">{t("source")}<ExternalLink size={14} /><span className="sr-only">{t("newTab")}</span></a>
        </li>)}
      </ol>
      <div className="study-actions"><button className="button primary" onClick={() => setView("practice")}><BookOpen size={18} />{t("practice")}</button><button className="button secondary" onClick={() => setView("summary")}><ArrowLeft size={18} />{t("resultsBack")}</button></div>
    </section>
  );

  return (
    <section className="results-page wrap" aria-labelledby="result-title">
      <div className="result-emblem">
        <Trophy size={38} strokeWidth={1.6} />
      </div>
      <span className="eyebrow">
        {state.dailyDate ? `${t("daily").toLocaleUpperCase(numberLocale(locale))} · ${dailyLabel(state.dailyDate, locale)}` : `${categoryInfo(locale, state.category).label.toLocaleUpperCase(numberLocale(locale))} · ${levelInfo(locale, state.difficulty).label.toLocaleUpperCase(numberLocale(locale))}${locale === "tr" ? " SEVİYE" : ""}`}
      </span>
      <h1 id="result-title" ref={heading} tabIndex={-1}>
        {summary.percentage >= 80
          ? t("resultGreat")
          : summary.percentage >= 50
            ? t("resultGood")
            : t("resultLearning")}
      </h1>
      <p className="result-message">
        {summary.percentage >= 80
          ? t("resultGreatText")
          : summary.percentage >= 50
            ? t("resultGoodText")
            : t("resultLearningText")}
      </p>
      <p className="round-result-mode">{roundLabel(state.mode, locale)} · {paceLabel(state.pace, locale)} · {t("answeredCount", { count: state.answers.length })}</p>
      {(state.mode === "endless" || state.mode === "adaptive") && <div className="round-result-details"><p data-testid="end-reason">{state.mode === "adaptive" ? state.endReason === "exhausted" ? "Bu kategoride sorulmamış soru kalmadı." : "Uyarlanabilir turu sen bitirdin." : t(state.endReason === "exhausted" ? "endExhausted" : state.endReason === "timeout" ? "endTimeout" : state.endReason === "exit" ? "endExit" : "endWrong")}</p><p>{t("longestStreak", { count: longestStreak(state.answers) })}</p></div>}
      {state.mode === "mistakes" && <p data-testid="mistakes-corrected">{t("mistakesCorrected", { total: state.questions.length, correct: summary.correct })}</p>}
      {!state.dailyDate && <p className="round-record-note">{t(state.mode === "mistakes" || state.mode === "standard" && state.questions.length < ROUND_CONFIG.standard.count ? "mistakesRecordNote" : state.pace === "competition" && state.mode === "standard" ? "standardRecordNote" : "localRecordNote")}</p>}
      <div className="total-score">
        <span>{t("totalScore")}</span>
        <strong data-testid="total-score">
          {summary.total.toLocaleString(numberLocale(locale))}
        </strong>
        <span>{t("scoreUnit")}</span>
      </div>
      <dl className="result-stats">
        <div>
          <dt>
            <Check size={17} />{t("correct")}</dt>
          <dd data-testid="result-correct">{summary.correct}</dd>
        </div>
        <div>
          <dt>
            <X size={17} />{t("wrong")}</dt>
          <dd data-testid="result-wrong">{summary.wrong}</dd>
        </div>
        <div>
          <dt>{t("accuracy")}</dt>
          <dd data-testid="result-percentage">{formatPercentage(locale, summary.percentage)}</dd>
        </div>
      </dl>
      {adaptive && <section className="adaptive-result-progress" aria-labelledby="adaptive-result-title">
        <h2 id="adaptive-result-title">Bu turdaki ilerlemen</h2>
        <p>Seviyeler, sistemin bu tur için belirlediği soru zorluğu hedefini gösterir.</p>
        <dl className="adaptive-result-levels">
          <div><dt>Başlangıç hedefi</dt><dd>{levelInfo(locale, startingLevel).label}</dd></div>
          <div><dt>Bitiş hedefi</dt><dd>{levelInfo(locale, state.difficulty).label}</dd></div>
          {highestLevel && <div><dt>En yüksek hedef</dt><dd>{levelInfo(locale, highestLevel).label}</dd></div>}
        </dl>
        <p className="adaptive-result-verdict">{state.answers.length === 0 ? "Henüz soru yanıtlamadın. Bir sonraki turda ilerlemeni burada görebilirsin." : levelDifference > 0 ? `Turu başlangıca göre ${levelDifference} basamak daha yüksek bir hedefte bitirdin.` : levelDifference < 0 ? "Sistem, tur boyunca cevaplarına ve kullanılabilir sorulara göre daha düşük bir hedefe geçti. Açıklamaları inceleyip çalışmaya devam edebilirsin." : "Turu başladığın hedef seviyede bitirdin."}</p>
        {progress ? progress.changes.length > 0 ? <details className="adaptive-result-history">
          <summary>Seviye geçişlerini gör ({progress.changes.length})</summary>
          <ol>
            {progress.changes.map(change => <li key={change.afterAnswer}>
              <strong>{change.afterAnswer}. cevaptan sonra: {levelInfo(locale, change.from).label} → {levelInfo(locale, change.to).label}</strong>
              <span>{change.correctInWindow === null ? "Sorulmamış soruların bulunduğu bir seviyeye geçildi." : `Son ${ADAPTIVE_ANSWER_WINDOW} cevapta ${change.correctInWindow} doğru.`}</span>
            </li>)}
          </ol>
        </details> : state.answers.length > 0 && <p>{state.answers.length < ADAPTIVE_ANSWER_WINDOW ? `İlk seviye değerlendirmesi ${ADAPTIVE_ANSWER_WINDOW} cevaptan sonra yapılır; bu turda ${state.answers.length} soru yanıtladın.` : "Bu turda hedef seviyen değişmedi."}</p> : <p>Bu eski turun ayrıntılı seviye geçişleri kaydedilmemiş.</p>}
      </section>}
      <div className="answer-trail" role="group" aria-label={t("answerTrail")}>
        {state.answers.map((answer, i) => (
          <span
            key={answer.questionId}
            role="img"
            className={answer.correct ? "trail-correct" : "trail-wrong"}
            title={t("answerResult", { n: i + 1, result: answer.correct ? t("correct") : t("wrong") })}
            aria-label={t("answerResult", { n: i + 1, result: answer.correct ? t("correct") : t("wrong") })}
          >
            {answer.correct ? <Check size={18} /> : <X size={18} />}
          </span>
        ))}
      </div>
      {missed.length > 0 ? <div className="study-prompt">
        <p>{t("missedPrompt", { count: missed.length })}</p>
        <div className="study-actions">
          <button className="button secondary" onClick={() => setView("review")}><BookOpen size={18} />{t("review")}</button>
          <button className="button secondary" onClick={() => setView("practice")}><RotateCcw size={18} />{t("practice")}</button>
        </div>
      </div> : state.answers.length > 0 ? <p className="study-perfect">{t("perfect")}</p> : null}
      <div className="result-actions">
        <button className="button primary" onClick={onReplay}>
          <RotateCcw size={18} />{t("replay")}</button>
        <button className="button secondary" onClick={onLevels}>
          <SlidersHorizontal size={18} />{adaptive ? "Oyun modunu seç" : t("changeLevel")}</button>
      </div>
      <div className="result-secondary-actions">
        {profileReady && <button className="text-button" onClick={onProfile}><BookOpen size={17} />{t("profileTitle")}</button>}
        <button className="text-button" onClick={onCategories}>
          <SlidersHorizontal size={17} />{t("changeCategory")}</button>
        <button
          className="text-button share-button"
          disabled={sharing}
          onClick={share}
        >
          <Share2 size={18} />{t("share")}</button>
      </div>
      <p className="share-status" role="status">
        {shareStatus}
      </p>
      {manualCopy && (
        <div className="manual-copy">
          <label htmlFor="share-text">
            <Copy size={16} />{t("shareText")}</label>
          <textarea
            id="share-text"
            readOnly
            value={text}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
      <button className="text-button result-home" onClick={onHome}>
        <ArrowLeft size={16} />{t("homeBack")}</button>
    </section>
  );
}
