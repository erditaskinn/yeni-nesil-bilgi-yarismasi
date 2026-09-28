import type { MetadataRoute } from "next";
import { DIFFICULTIES, SITE_URL } from "../lib/config";
import { levelPath } from "../lib/level-pages";
import { TOPIC_CATEGORIES, categoryPath } from "../lib/category-pages";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...TOPIC_CATEGORIES.map(category => ({ url: `${SITE_URL}${categoryPath(category)}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...DIFFICULTIES.map(level => ({ url: `${SITE_URL}${levelPath(level)}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
