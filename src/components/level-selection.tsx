import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Trophy,
} from "lucide-react";
import {
  DIFFICULTIES,
  GAME_CONFIG,
  LEVELS,
  type Difficulty,
} from "../lib/config";
import type { HighScores } from "../lib/storage";

export function LevelSelection({
  onSelect,
  onBack,
  scores,
  loading,
  error,
}: {
  onSelect: (level: Difficulty) => void;
  onBack: () => void;
  scores: HighScores;
  loading: Difficulty | null;
  error: string;
}) {
  return (
    <section className="wrap level-page" aria-labelledby="level-title">
      <button className="text-button back-button" onClick={onBack}>
        <ArrowLeft size={17} /> Ana sayfa
      </button>
      <div className="page-heading">
        <span className="eyebrow">MEYDAN OKUMANI SEÇ</span>
        <h1 id="level-title" tabIndex={-1}>
          Bugün ne kadar iddialısın?
        </h1>
        <p>Bir seviye seç. İlk sorun seni bekliyor.</p>
      </div>
      <div className="level-grid">
        {DIFFICULTIES.map((level, i) => (
          <button
            key={level}
            data-testid={`level-${level}`}
            className={`level-card level-${level}`}
            disabled={loading !== null}
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
            <span className="level-tag">{LEVELS[level].tag}</span>
            <h2>{LEVELS[level].label}</h2>
            <p>{LEVELS[level].description}</p>
            <div className="level-bottom">
              {loading === level ? (
                "Sorular hazırlanıyor…"
              ) : scores[level] !== undefined ? (
                <>
                  <Trophy size={16} /> Rekorun:{" "}
                  {scores[level]?.toLocaleString("tr-TR")} puan
                </>
              ) : (
                <>
                  <BarChart3 size={16} /> İlk rekorunu oluştur
                </>
              )}
            </div>
          </button>
        ))}
      </div>
      <p className="level-meta">
        <Clock3 size={17} /> {GAME_CONFIG.questionCount} soru <span>·</span> Her
        soruya {GAME_CONFIG.secondsPerQuestion} saniye <span>·</span> Her
        cevapta yeni bir bilgi
      </p>
      {error && (
        <p className="error-message" role="alert">
          {error} Lütfen yeniden deneyin.
        </p>
      )}
    </section>
  );
}
