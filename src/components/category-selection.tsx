import {
  ArrowLeft,
  ArrowUpRight,
  FlaskConical,
  Landmark,
  Orbit,
  Palette,
  Shuffle,
} from "lucide-react";
import {
  CATEGORIES,
  GAME_CATEGORIES,
  type GameCategory,
} from "../lib/categories";

const ICONS = {
  mixed: Shuffle,
  space: Orbit,
  science: FlaskConical,
  history: Landmark,
  culture: Palette,
};

export function CategorySelection({
  onSelect,
  onBack,
}: {
  onSelect: (category: GameCategory) => void;
  onBack: () => void;
}) {
  return (
    <section className="wrap category-page" aria-labelledby="category-title">
      <button className="text-button back-button" onClick={onBack}>
        <ArrowLeft size={17} /> Ana sayfa
      </button>
      <div className="page-heading">
        <span className="eyebrow">OYUNUNU SEÇ</span>
        <h1 id="category-title" tabIndex={-1}>
          Bugün neyi keşfedeceksin?
        </h1>
        <p>Karışık sorularla başla ya da ilgini çeken konuya yönel.</p>
      </div>
      <div className="category-grid">
        {GAME_CATEGORIES.map((category) => {
          const Icon = ICONS[category];
          return (
            <button
              key={category}
              className={`category-option category-${category}`}
              data-testid={`category-${category}`}
              onClick={() => onSelect(category)}
            >
              <span className="category-icon" aria-hidden="true">
                <Icon size={25} strokeWidth={1.8} />
              </span>
              <span className="category-copy">
                <strong>{CATEGORIES[category].label}</strong>
                <small>{CATEGORIES[category].description}</small>
              </span>
              <ArrowUpRight className="category-arrow" size={21} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
