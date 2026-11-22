import type { Metadata } from "next";
import { CATEGORIES, type GameCategory } from "./categories";
import { categoryInfo, type Locale } from "./locale";
import { localizedMetadata } from "./site-metadata";

export const TOPIC_CATEGORIES = ["space", "science_nature", "history", "geography", "arts_culture", "sports", "technology", "cinema_television", "language_literature", "turkiye", "general_knowledge"] as const satisfies readonly GameCategory[];
export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];
export const LEGACY_CATEGORY_SLUG = ["tarih-ve-cografya-bilgi-yarismasi", "history-and-geography-trivia-quiz"] as const;

export const CATEGORY_PAGES = Object.fromEntries(TOPIC_CATEGORIES.map(category => [category, {
  slug: CATEGORIES[category].slug[0],
}])) as Record<TopicCategory, { slug: string }>;

export function categoryPage(category: TopicCategory, locale: Locale = "tr") {
  const info = categoryInfo(locale, category);
  return {
    slug: CATEGORIES[category].slug[locale === "en" ? 1 : 0],
    intro: locale === "tr" ? `${info.description} ${info.label} bilgi yarışmasında seviyeni ve turunu seç; her cevabın açıklamasını ve kaynağını incele.` : `${info.description} Choose your difficulty and round in the ${info.label} quiz, then explore the explanation and source for every answer.`,
    detail: locale === "tr" ? `${info.label} soruları doğrulanmış kaynaklara dayanır. Soruların ardından doğru cevabı ve kısa açıklamayı görebilirsin.` : `${info.label} questions are supported by cited sources. Review the correct answer and a short explanation after each question.`,
  };
}
export function categoryPath(category: TopicCategory, locale: Locale = "tr") { return `${locale === "en" ? "/en" : ""}/${categoryPage(category, locale).slug}`; }
export function categoryTitle(category: TopicCategory, locale: Locale = "tr") { return `${categoryInfo(locale, category).label} ${locale === "en" ? "Trivia Quiz" : "Bilgi Yarışması"}`; }
export function categoryMetadata(category: TopicCategory, locale: Locale = "tr"): Metadata {
  return localizedMetadata(locale, categoryTitle(category, locale), categoryPage(category, locale).intro, categoryPath(category), categoryPath(category, "en"));
}
