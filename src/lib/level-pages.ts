import type { Metadata } from "next";
import { LEVELS, type Difficulty } from "./config";

export const LEVEL_PAGES: Record<Difficulty, {
  slug: string;
  intro: string;
  details: string;
  sampleIds: readonly [string, string, string];
}> = {
  easy: {
    slug: "kolay-bilgi-yarismasi",
    intro: "Genel kültür sorularına keyifli bir başlangıç yap. Bilim, coğrafya, sanat ve tarihten tanıdık konularla bilgini sınarken yeni ayrıntılar öğren.",
    details: "Kolay seviyede hız kadar dikkat de önemli. Her turda bu seviyenin soru havuzundan rastgele 10 farklı soru seçilir. Cevabının ardından doğru seçenek ve kısa bir açıklama gösterilir.",
    sampleIds: ["e01", "e04", "e11"],
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
    sampleIds: ["h01", "h05", "h09"],
  },
  expert: {
    slug: "cok-zor-bilgi-yarismasi",
    intro: "Merakını ayrıntılara taşı. Çok zor seviyede gezegenlerin özelliklerinden arkeolojik dönemlere, sanat tarihinden okyanus coğrafyasına kadar daha az bilinen bilgilerle karşılaşırsın.",
    details: "Soruların her biri dört seçeneklidir ve yalnızca tek doğru yanıtı vardır. Süre dolarsa doğru yanıt ve açıklaması yine gösterilir; böylece tur boyunca öğrenmeye devam edebilirsin.",
    sampleIds: ["x02", "x07", "x12"],
  },
};

export function levelPath(difficulty: Difficulty): string {
  return `/${LEVEL_PAGES[difficulty].slug}`;
}

export function levelTitle(difficulty: Difficulty): string {
  return `${LEVELS[difficulty].label} Bilgi Yarışması`;
}

export function levelMetadata(difficulty: Difficulty): Metadata {
  const title = levelTitle(difficulty);
  const description = LEVEL_PAGES[difficulty].intro;
  const path = levelPath(difficulty);
  return {
    title: `${title} | Yeni Nesil Bilgi Yarışması`,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Yeni Nesil Bilgi Yarışması" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image.png"] },
  };
}
