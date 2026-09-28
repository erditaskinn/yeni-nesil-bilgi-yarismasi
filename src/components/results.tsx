"use client";

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
import { LEVELS, SITE_URL } from "../lib/config";
import { CATEGORIES } from "../lib/categories";
import { missedQuestions, summarize, type GameState } from "../lib/game";
import { saveHighScore } from "../lib/storage";
import { Practice } from "./practice";
import { dailyLabel } from "../lib/daily";
import { recordGame } from "../lib/statistics";
import { QuestionImage } from "./question-image";

export function Results({
  state,
  onReplay,
  onLevels,
  onCategories,
  onHome,
}: {
  state: GameState;
  onReplay: () => void;
  onLevels: () => void;
  onCategories: () => void;
  onHome: () => void;
}) {
  const summary = summarize(state.answers);
  const [shareStatus, setShareStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [view, setView] = useState<"summary" | "review" | "practice">("summary");
  const heading = useRef<HTMLHeadingElement>(null);
  const missed = missedQuestions(state);
  const categoryText = state.category === "mixed" ? "" : `${CATEGORIES[state.category].label} kategorisinde `;
  const text = state.dailyDate ? `Yeni Nesil Bilgi Yarışması'nda ${dailyLabel(state.dailyDate)} günlük turunda 10 sorudan ${summary.correct} tanesini doğru cevapladım! Bugünün turunu oyna: ${SITE_URL}/?mod=gunluk` : `Yeni Nesil Bilgi Yarışması'nda ${categoryText}${LEVELS[state.difficulty].label} seviyede ${state.questions.length} sorudan ${summary.correct} tanesini doğru cevapladım! Sen de bilgini test et: ${SITE_URL}`;

  useEffect(() => {
    if (!state.dailyDate) saveHighScore(state.difficulty, summary.total, undefined, state.category);
    recordGame(state);
  }, [state, summary.total]);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Sonucun panoya kopyalandı!");
    } catch {
      setManualCopy(true);
      setShareStatus(
        "Otomatik kopyalama kullanılamıyor. Paylaşım metnini seçip kopyalayabilirsin.",
      );
    }
  }
  async function share() {
    if (sharing) return;
    setSharing(true);
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: "Yeni Nesil Bilgi Yarışması", text });
          setShareStatus("Paylaşım tamamlandı.");
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
          await copy();
        }
      } else await copy();
    } finally {
      setSharing(false);
    }
  }

  if (view === "practice") return <Practice questions={missed.map((item) => item.question)} onBack={() => setView("summary")} />;

  if (view === "review") return (
    <section className="review-page wrap" aria-labelledby="review-title">
      <button className="text-button" onClick={() => setView("summary")}><ArrowLeft size={17} /> Sonuçlarıma Dön</button>
      <span className="eyebrow">TURUNUN ARDINDAN</span>
      <h1 id="review-title" ref={heading} tabIndex={-1}>Yanlışlarımı İncele</h1>
      <p>{missed.length} soruyu kaçırdın. Doğru cevaplara ve kaynaklarına buradan dönebilirsin.</p>
      <ol className="review-list">
        {missed.map(({ question, answer, number }) => <li key={question.id}>
          <span className="eyebrow">{number}. SORU · {question.category.toLocaleUpperCase("tr-TR")}</span>
          <h2>{question.question}</h2>
          {question.image && <QuestionImage image={question.image} showCredit />}
          <dl>
            <div><dt>Senin cevabın</dt><dd>{answer.selectedId === null ? "Süre doldu" : question.choices.find((choice) => choice.id === answer.selectedId)?.text}</dd></div>
            <div><dt>Doğru cevap</dt><dd>{question.choices.find((choice) => choice.id === question.correctAnswer)?.text}</dd></div>
          </dl>
          <p>{question.explanation}</p>
          <a href={question.sourceUrl} target="_blank" rel="noreferrer">Kaynağı incele <ExternalLink size={14} /><span className="sr-only"> (yeni sekmede açılır)</span></a>
        </li>)}
      </ol>
      <div className="study-actions"><button className="button primary" onClick={() => setView("practice")}><BookOpen size={18} /> Yanlışlarımı Çalış</button><button className="button secondary" onClick={() => setView("summary")}><ArrowLeft size={18} /> Sonuçlarıma Dön</button></div>
    </section>
  );

  return (
    <section className="results-page wrap" aria-labelledby="result-title">
      <div className="result-emblem">
        <Trophy size={38} strokeWidth={1.6} />
      </div>
      <span className="eyebrow">
        {state.dailyDate ? `GÜNLÜK 10 SORU · ${dailyLabel(state.dailyDate)}` : `${CATEGORIES[state.category].label.toLocaleUpperCase("tr-TR")} · ${LEVELS[state.difficulty].label.toLocaleUpperCase("tr-TR")} SEVİYE`}
      </span>
      <h1 id="result-title" ref={heading} tabIndex={-1}>
        {summary.percentage >= 80
          ? "Bilginle fark yarattın!"
          : summary.percentage >= 50
            ? "Güzel bir tur çıkardın!"
            : "Her soru yeni bir başlangıç!"}
      </h1>
      <p className="result-message">
        {summary.percentage >= 80
          ? "Merakın ve bilgin harika bir ikili. Yeni bir rekora hazır mısın?"
          : summary.percentage >= 50
            ? "Bildiğin çok şey var, keşfedeceğin daha da çok. Bir tur daha?"
            : "Bugün yeni bilgiler keşfettin. Bir sonraki turda bunlar seninle!"}
      </p>
      <div className="total-score">
        <span>TOPLAM PUANIN</span>
        <strong data-testid="total-score">
          {summary.total.toLocaleString("tr-TR")}
        </strong>
        <span>PUAN</span>
      </div>
      <dl className="result-stats">
        <div>
          <dt>
            <Check size={17} /> Doğru
          </dt>
          <dd data-testid="result-correct">{summary.correct}</dd>
        </div>
        <div>
          <dt>
            <X size={17} /> Yanlış
          </dt>
          <dd data-testid="result-wrong">{summary.wrong}</dd>
        </div>
        <div>
          <dt>Başarı</dt>
          <dd data-testid="result-percentage">%{summary.percentage}</dd>
        </div>
      </dl>
      <div className="answer-trail" role="group" aria-label="Soruların sonuçları">
        {state.answers.map((answer, i) => (
          <span
            key={answer.questionId}
            role="img"
            className={answer.correct ? "trail-correct" : "trail-wrong"}
            title={`${i + 1}. soru: ${answer.correct ? "Doğru" : "Yanlış"}`}
            aria-label={`${i + 1}. soru: ${answer.correct ? "Doğru" : "Yanlış"}`}
          >
            {answer.correct ? <Check size={18} /> : <X size={18} />}
          </span>
        ))}
      </div>
      {missed.length > 0 ? <div className="study-prompt">
        <p>{missed.length} soruya yeniden göz atabilirsin.</p>
        <div className="study-actions">
          <button className="button secondary" onClick={() => setView("review")}><BookOpen size={18} /> Yanlışlarımı İncele</button>
          <button className="button secondary" onClick={() => setView("practice")}><RotateCcw size={18} /> Yanlışlarımı Çalış</button>
        </div>
      </div> : <p className="study-perfect">Tüm soruları doğru cevapladın!</p>}
      <div className="result-actions">
        <button className="button primary" onClick={onReplay}>
          <RotateCcw size={18} /> Tekrar Oyna
        </button>
        <button className="button secondary" onClick={onLevels}>
          <SlidersHorizontal size={18} /> Seviye Değiştir
        </button>
      </div>
      <div className="result-secondary-actions">
        <button className="text-button" onClick={onCategories}>
          <SlidersHorizontal size={17} /> Kategori Değiştir
        </button>
        <button
          className="text-button share-button"
          disabled={sharing}
          onClick={share}
        >
          <Share2 size={18} /> Sonucumu Paylaş
        </button>
      </div>
      <p className="share-status" role="status">
        {shareStatus}
      </p>
      {manualCopy && (
        <div className="manual-copy">
          <label htmlFor="share-text">
            <Copy size={16} /> Paylaşım metnin
          </label>
          <textarea
            id="share-text"
            readOnly
            value={text}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
      <button className="text-button result-home" onClick={onHome}>
        <ArrowLeft size={16} /> Ana sayfaya dön
      </button>
    </section>
  );
}
