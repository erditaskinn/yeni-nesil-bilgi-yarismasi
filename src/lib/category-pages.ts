import type { Metadata } from "next";
import { CATEGORIES } from "./categories";
import { SITE_URL } from "./config";

export const CATEGORY_PAGES = {
  space: { slug: "uzay-bilgi-yarismasi", intro: "Gezegenlerin özelliklerinden yıldızların yaşamına, Ay'dan uzay araştırmalarına uzanan bir keşif. Uzay sorularında kendi seviyeni seç ve her cevabın ardındaki bilimsel bilgiyi öğren.", detail: "Güneş Sistemi, gök cisimleri ve gözlem tarihinden örneklerle başlayabilirsin. Kaynak bağlantıları NASA gibi bilim kurumlarının açıklamalarına götürür." },
  science: { slug: "bilim-ve-doga-bilgi-yarismasi", intro: "Elementler, canlılar, okyanuslar ve bilimsel keşifler. Bilim ve doğa yarışmasında günlük hayatta karşına çıkan olguları ve onları açıklayan bilgileri test et.", detail: "Kimya, biyoloji ve doğa bilimlerinden sorular farklı zorluklarda sunulur. Yanlış cevap da öğrenmenin bir parçası: kısa açıklamalar ve birincil kaynaklar her turda seninle." },
  history: { slug: "tarih-ve-cografya-bilgi-yarismasi", intro: "Antik yerleşimlerden dünya mirasına, şehirlerden coğrafi özelliklere. Tarih ve coğrafya sorularıyla yerlerin hikâyelerini ve geçmişten kalan izleri keşfet.", detail: "Arkeoloji, tarih ve coğrafya aynı kategoride buluşur. UNESCO dünya mirası kayıtları gibi kaynaklar, soruların dayandığı bilgileri doğrudan incelemene yardımcı olur." },
  culture: { slug: "sanat-ve-kultur-bilgi-yarismasi", intro: "Resimden edebiyata, müzikten mimariye, oyunlardan spora uzanan kültür turu. Tanıdığın eserleri yeniden keşfet veya yeni bir sanatçıyla tanış.", detail: "Müzelerin koleksiyon kayıtları, yazarların eserleri ve spor kuralları bu kategorinin farklı yüzlerini oluşturur. Örnekleri incele, ardından sana uygun zorluğu seç." },
} as const;
export type TopicCategory = keyof typeof CATEGORY_PAGES;
export const TOPIC_CATEGORIES = Object.keys(CATEGORY_PAGES) as TopicCategory[];
export function categoryPath(category: TopicCategory) { return `/${CATEGORY_PAGES[category].slug}`; }
export function categoryTitle(category: TopicCategory) { return `${CATEGORIES[category].label} Bilgi Yarışması`; }
export function categoryMetadata(category: TopicCategory): Metadata {
  const title = categoryTitle(category);
  const description = CATEGORY_PAGES[category].intro;
  const url = `${SITE_URL}${categoryPath(category)}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, locale: "tr_TR", type: "website", images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630 }] }, twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/opengraph-image.png`] } };
}
