"use client";
import { useI18n } from "./locale-provider";
import { categoryInfo, numberLocale, levelInfo } from "../lib/locale";

import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Trophy,
} from "lucide-react";
import {
  TURKISH_DIFFICULTIES,
  type Difficulty,
} from "../lib/config";
import type { HighScores } from "../lib/storage";
import type { GameCategory } from "../lib/categories";
import { matchesCategory } from "../lib/categories";
import { questions } from "../data/questions";
import { englishQuestions } from "../data/questions-en";

export function LevelSelection({
  onSelect,
  onBack,
  category,
  scores,
  loading,
  error,
}: {
  onSelect: (level: Difficulty) => void;
  onBack: () => void;
  category: GameCategory;
  scores: HighScores;
  loading: Difficulty | null;
  error: string;
}) {
  const { locale, t } = useI18n();
  const mergeExpertAtHard = true;
  const visibleDifficulties = TURKISH_DIFFICULTIES;
  const pool = locale === "tr" ? questions : englishQuestions;
  const counts = Object.fromEntries(visibleDifficulties.map(level => [level, pool.filter(question => (question.difficulty === level || mergeExpertAtHard && level === "hard" && question.difficulty === "expert") && matchesCategory(question.category, category)).length])) as Partial<Record<Difficulty, number>>;
  return (
    <section className="wrap level-page level-selection-page" aria-labelledby="level-title">
      <button className="text-button back-button" onClick={onBack}>
        <ArrowLeft size={17} />{t("categories")}</button>
      <div className="page-heading">
        <span className="eyebrow">{categoryInfo(locale, category).label.toLocaleUpperCase(numberLocale(locale))}</span>
        <h1 id="level-title" tabIndex={-1}>{t("levelHeading")}</h1>
        <p>{t("levelIntro")}</p>
      </div>
      <div className="level-grid">
        {visibleDifficulties.map((level, i) => {
          const hasRecord = mergeExpertAtHard && level === "hard"
            ? scores.hard !== undefined || scores.expert !== undefined
            : scores[level] !== undefined;
          const record = mergeExpertAtHard && level === "hard"
            ? Math.max(scores.hard ?? 0, scores.expert ?? 0)
            : scores[level];
          return <button
            key={level}
            data-testid={`level-${level}`}
            className={`level-card level-${level}`}
            disabled={loading !== null || counts[level] === 0}
            onClick={() => onSelect(level)}
          >
            <div className="level-top">
              <span className="level-bars" aria-hidden="true">
                {[0, 1, 2, 3].map((n) => (
                  <i
                    key={n}
                    className={n <= i ? "filled" : ""}
                    style={{ height: 10 + n * 7 }}
                  />
                ))}
              </span>
              <ArrowUpRight size={24} />
            </div>
            <div className="selection-copy">
              <span className="level-tag">{levelInfo(locale, level).tag}</span>
              <h2>{levelInfo(locale, level).label}</h2>
              <p>{levelInfo(locale, level).description}</p>
            </div>
            <div className="level-bottom">
              {counts[level] === 0 ? t("noQuestionsAtLevel") : loading === level ? (
                t("preparingQuestions")
              ) : hasRecord ? (
                <>
                  <Trophy size={16} /> {t("record", { score: record!.toLocaleString(numberLocale(locale)) })}</>
              ) : (
                <>
                  <BarChart3 size={16} />{t("questionCount", { count: counts[level] ?? 0 })}</>
              )}
            </div>
          </button>;
        })}
      </div>
      <p className="level-meta">
        <Clock3 size={17} /> {t("levelMeta")}
      </p>
      {error && (
        <p className="error-message" role="alert">
          {error} {t("retry")}</p>
      )}
    </section>
  );
}
