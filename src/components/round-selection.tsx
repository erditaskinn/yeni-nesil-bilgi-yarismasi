"use client";
import { ArrowLeft, BookOpen, Check, Clock3, Infinity as InfinityIcon, ListChecks, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { categoryInfo, levelInfo } from "../lib/locale";
import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import { ROUND_CONFIG, SELECTABLE_ROUNDS, roundCount, roundLabel, type SelectableRound } from "../lib/rounds";
import { readHighScores } from "../lib/storage";
import { paceLabel, type PaceMode } from "../lib/pace";
import { useI18n } from "./locale-provider";

export function RoundSelection({ category, difficulty, available, mistakes, owner, loading, error, adaptive = false, onBack, onSelect }: { category: GameCategory; difficulty: Difficulty; available: number; mistakes: number; owner?: string; loading: boolean; error: string; adaptive?: boolean; onBack: () => void; onSelect: (mode: SelectableRound, pace: PaceMode) => void }) {
  const { locale, t } = useI18n();
  const [selectedRound, setSelectedRound] = useState<SelectableRound | null>(null);
  const [selectedPace, setSelectedPace] = useState<PaceMode | null>(null);
  const paceSectionRef = useRef<HTMLDivElement>(null);
  const chooseRound = (mode: SelectableRound) => {
    setSelectedRound(mode);
    requestAnimationFrame(() => {
      paceSectionRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "center",
      });
    });
  };
  return <section className="wrap level-page round-selection-page" aria-labelledby="round-title">
    <button className="text-button back-button" onClick={onBack}><ArrowLeft size={17} />{t("changeLevel")}</button>
    <div className="page-heading">
      <span className="eyebrow">{categoryInfo(locale, category).label} · {levelInfo(locale, difficulty).label}</span>
      <h1 id="round-title" tabIndex={-1}>{t("roundHeading")}</h1><p>{t("roundIntro")}</p>
    </div>
    <div className="level-grid round-grid" aria-busy={loading}>
      {SELECTABLE_ROUNDS.filter(mode => adaptive ? mode === "adaptive" : mode !== "adaptive").map(mode => {
        const count = mode === "mistakes" ? mistakes : roundCount(mode, available);
        const requested = ROUND_CONFIG[mode].count;
        const scores = selectedPace ? readHighScores(undefined, category, owner, mode, selectedPace) : {};
        const best = selectedPace ? difficulty === "hard"
          ? Math.max(scores.hard ?? 0, scores.expert ?? 0) || undefined
          : scores[difficulty] : undefined;
        const Icon = mode === "endless" || mode === "adaptive" ? InfinityIcon : mode === "mistakes" ? BookOpen : ListChecks;
        return <button key={mode} type="button" data-testid={`round-${mode}`} aria-pressed={selectedRound === mode} className={`level-card round-card round-${mode}${selectedRound === mode ? " is-selected" : ""}`} disabled={loading || !count} onClick={() => chooseRound(mode)}>
          <div className="level-top"><Icon size={25} />{selectedRound === mode && <Check size={24} aria-hidden="true" />}</div>
          <div className="selection-copy">
            <h2>{roundLabel(mode, locale)}</h2>
            <p>{mode === "adaptive" ? "Yanlış cevapta tur bitmez. Seviyen performansına göre ayarlanır." : t(mode === "endless" ? "roundEndless" : mode === "mistakes" ? "roundMistakes" : mode === "short" ? "roundShort" : mode === "long" ? "roundLong" : "roundStandard", { count })}</p>
          </div>
          <div className="level-bottom">{loading ? t("preparingQuestions") : !count ? t(mode === "mistakes" ? "noMistakes" : "poolError") : requested && count < requested ? t("limitedPool", { count, requested }) : mode === "mistakes" ? t("questionCount", { count }) : best !== undefined ? <><Trophy size={16} />{t("modeRecord", { score: best })}</> : t("roundStart")}</div>
        </button>;
      })}
    </div>
    <div className="pace-section" ref={paceSectionRef} role="group" aria-label={t("paceHeading")}>
      <h2>{t("paceHeading")}</h2>
      <div className="pace-grid">{(["competition", "relaxed"] as PaceMode[]).map(pace => <button key={pace} type="button" data-testid={`pace-${pace}`} aria-pressed={selectedPace === pace} className={`pace-option${selectedPace === pace ? " is-selected" : ""}`} onClick={() => setSelectedPace(pace)}>
        {pace === "competition" ? <Clock3 size={22} /> : <BookOpen size={22} />}
        <span><strong>{paceLabel(pace, locale)}</strong><small>{t(pace === "competition" ? "paceCompetitionDescription" : "paceRelaxedDescription")}</small></span>
        {selectedPace === pace && <Check size={21} aria-hidden="true" />}
      </button>)}</div>
    </div>
    <button className="button primary start-round-button" data-testid="start-round" disabled={!selectedRound || !selectedPace || loading} onClick={() => selectedRound && selectedPace && onSelect(selectedRound, selectedPace)}>{t("start")}</button>
    <p className="level-meta">{t("roundRecordNote")}</p>
    {error && <p className="error-message" role="alert">{error}</p>}
  </section>;
}
