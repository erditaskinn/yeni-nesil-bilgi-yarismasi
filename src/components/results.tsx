"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Trophy,
  X,
} from "lucide-react";
import { LEVELS, SITE_URL } from "../lib/config";
import { summarize, type GameState } from "../lib/game";
import { saveHighScore } from "../lib/storage";

export function Results({
  state,
  onReplay,
  onLevels,
  onHome,
}: {
  state: GameState;
  onReplay: () => void;
  onLevels: () => void;
  onHome: () => void;
}) {
  const summary = summarize(state.answers);
  const [shareStatus, setShareStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const [sharing, setSharing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const text = `Yeni Nesil Bilgi Yarışması'nda ${LEVELS[state.difficulty].label} seviyede ${state.questions.length} sorudan ${summary.correct} tanesini doğru cevapladım! Sen de bilgini test et: ${SITE_URL}`;

  useEffect(() => {
    saveHighScore(state.difficulty, summary.total);
    heading.current?.focus();
  }, [state.difficulty, summary.total]);

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

  return (
    <section className="results-page wrap" aria-labelledby="result-title">
      <div className="result-emblem">
        <Trophy size={38} strokeWidth={1.6} />
      </div>
      <span className="eyebrow">
        {LEVELS[state.difficulty].label.toLocaleUpperCase("tr-TR")} SEVİYE
        TAMAMLANDI
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
      <div className="result-actions">
        <button className="button primary" onClick={onReplay}>
          <RotateCcw size={18} /> Tekrar Oyna
        </button>
        <button className="button secondary" onClick={onLevels}>
          <SlidersHorizontal size={18} /> Seviye Değiştir
        </button>
      </div>
      <button
        className="text-button share-button"
        disabled={sharing}
        onClick={share}
      >
        <Share2 size={18} /> Sonucumu Paylaş
      </button>
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
