"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { categoryInfo, translate, type Locale } from "../lib/locale";
import { GAME_CATEGORIES, type GameCategory } from "../lib/categories";

const categoryOrder: readonly GameCategory[] = [
  "space", "science_nature", "history", "geography", "technology", "arts_culture",
  "sports", "cinema_television", "language_literature", "turkiye", "general_knowledge",
];

export function NativeExplore({ locale, onSelect }: { locale: Locale; onSelect: (category: GameCategory) => void }) {
  const [search, setSearch] = useState("");
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const language = locale === "tr" ? "tr-TR" : "en-US";
  const query = search.trim().toLocaleLowerCase(language);
  const matchesSearch = (category: GameCategory) => {
    const info = categoryInfo(locale, category);
    return `${info.label} ${info.description}`.toLocaleLowerCase(language).includes(query);
  };
  const showMixed = matchesSearch("mixed");
  const visible = categoryOrder.filter(category =>
    GAME_CATEGORIES.includes(category) &&
    matchesSearch(category)
  );

  return <section className="native-game-explore" aria-labelledby="native-explore-title">
    <div className="native-game-explore-heading">
      <span>{t("nativeExplore").toLocaleUpperCase(language)}</span>
      <h1 id="native-explore-title" tabIndex={-1}>{t("nativeExploreTitle")}</h1>
    </div>
    <label className="native-game-search">
      <Search size={19} aria-hidden="true" />
      <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={t("categorySearch")} aria-label={t("categorySearch")} />
    </label>

    {showMixed && <button className="native-game-mixed" type="button" onClick={() => onSelect("mixed")}>
      <span className="native-game-mixed-art"><Image src="/category-icons/mixed.webp" alt="" width={62} height={62} unoptimized /></span>
      <span><strong>{categoryInfo(locale, "mixed").label}</strong><small>{t("mixedDescription")}</small></span>
      <ChevronRight size={21} aria-hidden="true" />
    </button>}

    {visible.length > 0 && <div className="native-game-category-grid">
      {visible.map(category => <button key={category} type="button" className="native-game-category" data-category={category} data-testid={`category-${category}`} onClick={() => onSelect(category)}>
        <Image src={`/category-icons/${category}.webp`} alt="" width={68} height={68} unoptimized />
        <strong>{categoryInfo(locale, category).label}</strong>
      </button>)}
    </div>}
    {!showMixed && visible.length === 0 && <p className="native-game-no-results" role="status">{t("categoryEmpty")}</p>}
  </section>;
}
