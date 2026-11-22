"use client";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "./locale-provider";
import { categoryInfo } from "../lib/locale";

import {
  ArrowLeft, ArrowUpRight, FlaskConical, Landmark, Orbit, Palette, Search, Shuffle,
  Globe2, Trophy, Cpu, Clapperboard, BookOpen, Map, Lightbulb,
} from "lucide-react";
import { questions } from "../data/questions";
import { englishQuestions } from "../data/questions-en";
import {
  GAME_CATEGORIES,
  CATEGORIES,
  type CategoryIcon,
  type GameCategory,
} from "../lib/categories";

// The profile still uses these compact vector icons; category cards use the supplied artwork.
export const CATEGORY_ICONS = {
  shuffle: Shuffle,
  orbit: Orbit,
  flask: FlaskConical,
  landmark: Landmark,
  globe: Globe2,
  palette: Palette,
  trophy: Trophy,
  cpu: Cpu,
  clapperboard: Clapperboard,
  book: BookOpen,
  map: Map,
  lightbulb: Lightbulb,
} satisfies Record<CategoryIcon, typeof Shuffle>;

export function CategorySelection({
  onSelect,
  onBack,
}: {
  onSelect: (category: GameCategory) => void;
  onBack: () => void;
}) {
  const { locale, t } = useI18n();
  const pool = locale === "tr" ? questions : englishQuestions;
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US");
  const matchesSearch = (category: GameCategory) => {
    if (!query) return true;
    const info = categoryInfo(locale, category);
    return `${info.label} ${info.description}`.toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US").includes(query);
  };
  const visibleCategories = GAME_CATEGORIES.filter(matchesSearch);
  return (
    <section className="wrap category-page" aria-labelledby="category-title">
      <button className="text-button back-button" onClick={onBack}>
        <ArrowLeft size={17} />{t("home")}</button>
      <div className="page-heading">
        <span className="eyebrow">{t("categoryEyebrow")}</span>
        <h1 id="category-title" tabIndex={-1}>{t("categoryHeading")}</h1>
        <p>{t("categoryIntro")}</p>
      </div>
      <label className="web-category-search">
        <Search size={20} aria-hidden="true" />
        <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={t("categorySearch")} aria-label={t("categorySearch")} />
      </label>
      <div className="category-grid">
        {visibleCategories.map((category) => {
          const unavailable = !pool.some(question => category === "mixed" || question.category === category);
          return (
            <button
              key={category}
              className={`category-option category-${category}`}
              data-accent={CATEGORIES[category].color}
              data-testid={`category-${category}`}
              disabled={unavailable}
              aria-label={`${categoryInfo(locale, category).label}${unavailable ? locale === "tr" ? " · Yakında, henüz kullanılamıyor" : " · Coming soon, not available yet" : ""}`}
              onClick={() => onSelect(category)}
            >
              <span className="category-icon" aria-hidden="true">
                <Image src={`/category-icons/${category}.webp`} width={38} height={38} alt="" unoptimized />
              </span>
              <span className="category-copy">
                <strong>{categoryInfo(locale, category).label}</strong>
                <small>{categoryInfo(locale, category).description}</small>
                {unavailable && <small className="soon-label">{locale === "tr" ? "Yakında" : "Coming soon"}</small>}
              </span>
              {!unavailable && <ArrowUpRight className="category-arrow" size={21} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {visibleCategories.length === 0 && <p className="web-category-empty" role="status">{t("categoryEmpty")}</p>}
    </section>
  );
}
