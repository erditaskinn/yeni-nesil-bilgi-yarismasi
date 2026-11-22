import type { MetadataRoute } from "next";
import { TURKISH_DIFFICULTIES, SITE_URL } from "../lib/config";
import { levelPath } from "../lib/level-pages";
import { TOPIC_CATEGORIES, categoryPath } from "../lib/category-pages";
import { homePath, type Locale } from "../lib/locale";
import { languageAlternates } from "../lib/site-metadata";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return (["tr", "en"] as Locale[]).flatMap(locale => [
    { url: locale === "tr" ? SITE_URL : `${SITE_URL}${homePath(locale)}`, changeFrequency: "monthly" as const, priority: 1, alternates: { languages: languageAlternates("/", "/en") } },
    ...TOPIC_CATEGORIES.map(category => ({ url: `${SITE_URL}${categoryPath(category, locale)}`, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages: languageAlternates(categoryPath(category), categoryPath(category, "en")) } })),
    ...TURKISH_DIFFICULTIES.map(level => {
      return { url: `${SITE_URL}${levelPath(level, locale)}`, changeFrequency: "monthly" as const, priority: 0.7, alternates: { languages: languageAlternates(levelPath(level), levelPath(level, "en")) } };
    }),
  ]);
}
