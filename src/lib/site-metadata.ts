import type { Metadata } from "next";
import { SITE_URL } from "./config";
import { homePath, translate, type Locale } from "./locale";
export function languageAlternates(tr: string, en: string) {
  return { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}`, "x-default": `${SITE_URL}${tr}` };
}
export function localizedMetadata(locale: Locale, title: string, description: string, tr: string, en: string): Metadata {
  const path = locale === "en" ? en : tr;
  const image = `${locale === "en" ? "/en" : ""}/opengraph-image.png`;
  return { metadataBase: new URL(SITE_URL), title, description,
    alternates: { canonical: `${SITE_URL}${path}`, languages: languageAlternates(tr, en) },
    openGraph: { type: "website", title, description, url: path, siteName: translate(locale, "brand"), locale: locale === "en" ? "en_US" : "tr_TR", alternateLocale: locale === "en" ? "tr_TR" : "en_US", images: [{ url: image, width: 1200, height: 630, alt: translate(locale, "slogan") }] },
    twitter: { card: "summary_large_image", title, description, images: [image] }, icons: { icon: "/icon.svg" },
  };
}
export function homeMetadata(locale: Locale) {
  return localizedMetadata(locale, locale === "en" ? "Next Gen Trivia Quiz | Free Online General Knowledge Quiz" : "Yeni Nesil Bilgi Yarışması | Bilgini Göster, Eğlenerek Öğren!", locale === "en" ? "Take a free online trivia quiz. Pick a topic, difficulty and round length, learn from explanations and share your result. No sign-up required." : "Ücretsiz online bilgi yarışması: Kolay, Orta veya Zor seviyeni seç. Tur uzunluğunu seç, soruları cevapla, açıklamaları öğren ve sonucunu paylaş. Üyelik gerekmez.", homePath("tr"), homePath("en"));
}
