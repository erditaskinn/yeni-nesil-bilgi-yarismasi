import { notFound } from "next/navigation";
import { CategoryGuide } from "../../../components/category-guide";
import { LegacyCategoryGuide } from "../../../components/legacy-category-guide";
import { CATEGORY_PAGES, TOPIC_CATEGORIES, LEGACY_CATEGORY_SLUG, categoryMetadata } from "../../../lib/category-pages";
import { localizedMetadata } from "../../../lib/site-metadata";
export const dynamicParams = false;
export function generateStaticParams() { return [...TOPIC_CATEGORIES.map(category => ({ categorySlug: CATEGORY_PAGES[category].slug })), { categorySlug: LEGACY_CATEGORY_SLUG[0] }]; }
async function getCategory(params: Promise<{ categorySlug: string }>) {
  const { categorySlug } = await params;
  if (categorySlug === LEGACY_CATEGORY_SLUG[0]) return "legacy" as const;
  return TOPIC_CATEGORIES.find(category => CATEGORY_PAGES[category].slug === categorySlug) ?? notFound();
}
export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) { const category = await getCategory(params); return category === "legacy" ? localizedMetadata("tr", "Tarih ve Coğrafya Bilgi Yarışması", "Tarih ve Coğrafya yarışmaları artık ayrı kategorilerde. Doğru konuya buradan ulaş.", `/${LEGACY_CATEGORY_SLUG[0]}`, `/en/${LEGACY_CATEGORY_SLUG[1]}`) : categoryMetadata(category); }
export default async function Page({ params }: { params: Promise<{ categorySlug: string }> }) { const category = await getCategory(params); return category === "legacy" ? <LegacyCategoryGuide locale="tr" /> : <CategoryGuide category={category} />; }
