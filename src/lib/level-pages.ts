import type { Metadata } from "next";
import { type Difficulty } from "./config";
import { levelInfo, translate, type Locale } from "./locale";
import { ENGLISH_LEVEL_PAGES } from "./english-pages";
import { localizedMetadata } from "./site-metadata";

export const LEVEL_PAGES: Record<Difficulty, {
  slug: string;
  intro: string;
  details: string;
  sampleIds: readonly [string, string, string];
}> = {
  easy: {
    slug: "kolay-bilgi-yarismasi",
    intro: "Genel kültür sorularına keyifli bir başlangıç yap. Bilim, coğrafya, sanat ve tarihten tanıdık konularla bilgini sınarken yeni ayrıntılar öğren.",
    details: "Kolay seviyede hız kadar dikkat de önemli. Her turda bu seviyenin soru havuzundan seçtiğin tur uzunluğuna göre farklı sorular seçilir. Cevabının ardından doğru seçenek ve kısa bir açıklama gösterilir.",
    sampleIds: ["e01", "r021", "e11"],
  },
  medium: {
    slug: "orta-bilgi-yarismasi",
    intro: "Bildiklerinin arasındaki bağlantıları kurmaya hazır mısın? Orta seviye; uzay, tarih, edebiyat ve bilim gibi alanlarda bir adım daha düşünmeni ister.",
    details: "Sorular tek bir alanda uzmanlık gerektirmez. Örneğin bir uygarlığın başkentini, bir bilim insanının çalışma alanını veya dünya coğrafyasından bir ayrıntıyı hatırlaman gerekebilir.",
    sampleIds: ["m05", "m08", "m11"],
  },
  hard: {
    slug: "zor-bilgi-yarismasi",
    intro: "Ayrıntıları hatırlamak ve seçenekleri dikkatle karşılaştırmak isteyenler için. Zor seviyede sanat eserleri, tarihî yerler ve bilimsel bilgiler daha yakından sorulur.",
    details: "Her sorudan sonra verilen açıklama, yalnızca doğru seçeneği göstermekle kalmaz; cevabın arkasındaki kısa bilgiyi de paylaşır. Yanlış yanıtlar da bir sonraki tur için öğrenme fırsatıdır.",
    sampleIds: ["m14", "h05", "h09"],
  },
  expert: {
    slug: "cok-zor-bilgi-yarismasi",
    intro: "Merakını ayrıntılara taşı. Çok zor seviyede gezegenlerin özelliklerinden arkeolojik dönemlere, sanat tarihinden okyanus coğrafyasına kadar daha az bilinen bilgilerle karşılaşırsın.",
    details: "Soruların her biri dört seçeneklidir ve yalnızca tek doğru yanıtı vardır. Süre dolarsa doğru yanıt ve açıklaması yine gösterilir; böylece tur boyunca öğrenmeye devam edebilirsin.",
    sampleIds: ["x13", "x24", "x10"],
  },
};

export function levelPage(difficulty: Difficulty, locale: Locale = "tr") {
  return locale === "en" ? { ...LEVEL_PAGES[difficulty], ...ENGLISH_LEVEL_PAGES[difficulty] } : LEVEL_PAGES[difficulty];
}
export function levelPath(difficulty: Difficulty, locale: Locale = "tr"): string {
  return `${locale === "en" ? "/en" : ""}/${levelPage(difficulty, locale).slug}`;
}
export function levelTitle(difficulty: Difficulty, locale: Locale = "tr"): string {
  return `${levelInfo(locale, difficulty).label} ${locale === "en" ? "Trivia Quiz" : "Bilgi Yarışması"}`;
}
export function levelMetadata(difficulty: Difficulty, locale: Locale = "tr"): Metadata {
  if (difficulty === "expert") return {
    ...localizedMetadata(locale, `${levelTitle("hard", locale)} | ${translate(locale, "brand")}`, levelPage("hard", locale).intro, levelPath("hard"), levelPath("hard", "en")),
    robots: { index: false, follow: true },
  };
  return localizedMetadata(locale, `${levelTitle(difficulty, locale)} | ${translate(locale, "brand")}`, levelPage(difficulty, locale).intro, levelPath(difficulty), levelPath(difficulty, "en"));
}
