import { notFound } from "next/navigation";
import { CategoryGuide } from "../../components/category-guide";
import { CATEGORY_PAGES, TOPIC_CATEGORIES, categoryMetadata } from "../../lib/category-pages";
export const dynamicParams = false;
export function generateStaticParams() { return TOPIC_CATEGORIES.map(category => ({ categorySlug: CATEGORY_PAGES[category].slug })); }
async function getCategory(params: Promise<{ categorySlug: string }>) {
  const { categorySlug } = await params;
  return TOPIC_CATEGORIES.find(category => CATEGORY_PAGES[category].slug === categorySlug) ?? notFound();
}
export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) { return categoryMetadata(await getCategory(params)); }
export default async function Page({ params }: { params: Promise<{ categorySlug: string }> }) { return <CategoryGuide category={await getCategory(params)} />; }
