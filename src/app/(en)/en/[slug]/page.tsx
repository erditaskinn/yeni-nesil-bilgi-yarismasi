import { notFound } from "next/navigation";
import { DIFFICULTIES } from "../../../../lib/config";
import { TOPIC_CATEGORIES, categoryMetadata } from "../../../../lib/category-pages";
import { levelMetadata } from "../../../../lib/level-pages";
import { ENGLISH_CATEGORY_PAGES, ENGLISH_LEVEL_PAGES } from "../../../../lib/english-pages";
import { LevelGuide } from "../../../../components/level-guide";
import { CategoryGuide } from "../../../../components/category-guide";
import { LegacyCategoryGuide } from "../../../../components/legacy-category-guide";
import { LEGACY_CATEGORY_SLUG } from "../../../../lib/category-pages";
import { localizedMetadata } from "../../../../lib/site-metadata";
export const dynamicParams = false;
export function generateStaticParams() { return [...DIFFICULTIES.map(level => ({ slug: ENGLISH_LEVEL_PAGES[level].slug })), ...TOPIC_CATEGORIES.map(category => ({ slug: ENGLISH_CATEGORY_PAGES[category].slug })), { slug: LEGACY_CATEGORY_SLUG[1] }]; }
async function resolve(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const level = DIFFICULTIES.find(level => ENGLISH_LEVEL_PAGES[level].slug === slug);
  const category = TOPIC_CATEGORIES.find(category => ENGLISH_CATEGORY_PAGES[category].slug === slug);
  if (!level && !category && slug !== LEGACY_CATEGORY_SLUG[1]) notFound();
  return { level, category, legacy: slug === LEGACY_CATEGORY_SLUG[1] };
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { level, category, legacy } = await resolve(params);
  return legacy ? localizedMetadata("en", "History & Geography Trivia Quiz", "History and Geography now have separate quizzes. Choose your topic here.", `/${LEGACY_CATEGORY_SLUG[0]}`, `/en/${LEGACY_CATEGORY_SLUG[1]}`) : level ? levelMetadata(level, "en") : categoryMetadata(category!, "en");
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { level, category, legacy } = await resolve(params);
  return legacy ? <LegacyCategoryGuide locale="en" /> : level ? <LevelGuide difficulty={level} locale="en" /> : <CategoryGuide category={category!} locale="en" />;
}
