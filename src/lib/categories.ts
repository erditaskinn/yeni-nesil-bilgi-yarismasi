export const GAME_CATEGORIES = [
  "mixed", "space", "science_nature", "history", "geography", "arts_culture",
  "sports", "technology", "cinema_television", "language_literature", "turkiye", "general_knowledge",
] as const;
export type GameCategory = (typeof GAME_CATEGORIES)[number];
export type LegacyCategory = "science" | "culture" | "legacy_history_geography";
export type StoredCategory = GameCategory | LegacyCategory | "daily";

type CategoryDefinition = {
  label: readonly [string, string]; description: readonly [string, string];
  icon: CategoryIcon; color: string; slug: readonly [string, string];
};
export type CategoryIcon = "shuffle" | "orbit" | "flask" | "landmark" | "globe" | "palette" | "trophy" | "cpu" | "clapperboard" | "book" | "map" | "lightbulb";
export const CATEGORIES: Record<GameCategory, CategoryDefinition> = {
  mixed: { label: ["Karışık Sorular", "Mixed Questions"], description: ["Her konudan sürpriz sorular", "Surprises from every topic."], icon: "shuffle", color: "teal", slug: ["", ""] },
  space: { label: ["Uzay", "Space"], description: ["Gezegenler, yıldızlar ve evren.", "Planets, stars and the universe."], icon: "orbit", color: "violet", slug: ["uzay-bilgi-yarismasi", "space-trivia-quiz"] },
  science_nature: { label: ["Bilim ve Doğa", "Science & Nature"], description: ["Bilim, canlılar, doğa ve keşifler.", "Science, living things and discovery."], icon: "flask", color: "green", slug: ["bilim-ve-doga-bilgi-yarismasi", "science-and-nature-trivia-quiz"] },
  history: { label: ["Tarih", "History"], description: ["Uygarlıklar, olaylar ve geçmişin izleri.", "Civilizations, events and traces of the past."], icon: "landmark", color: "amber", slug: ["tarih-bilgi-yarismasi", "history-trivia-quiz"] },
  geography: { label: ["Coğrafya", "Geography"], description: ["Ülkeler, şehirler ve dünyamız.", "Countries, cities and our world."], icon: "globe", color: "blue", slug: ["cografya-bilgi-yarismasi", "geography-trivia-quiz"] },
  arts_culture: { label: ["Sanat ve Kültür", "Arts & Culture"], description: ["Sanat, müzik, mimari ve kültürel miras.", "Art, music, architecture and heritage."], icon: "palette", color: "rose", slug: ["sanat-ve-kultur-bilgi-yarismasi", "arts-and-culture-trivia-quiz"] },
  sports: { label: ["Spor", "Sports"], description: ["Branşlar, sporcular ve unutulmaz karşılaşmalar.", "Sports, athletes and memorable matches."], icon: "trophy", color: "orange", slug: ["spor-bilgi-yarismasi", "sports-trivia-quiz"] },
  technology: { label: ["Teknoloji", "Technology"], description: ["Buluşlar, dijital dünya ve teknolojik gelişmeler.", "Inventions, the digital world and technology."], icon: "cpu", color: "cyan", slug: ["teknoloji-bilgi-yarismasi", "technology-trivia-quiz"] },
  cinema_television: { label: ["Sinema ve Televizyon", "Film & Television"], description: ["Filmler, diziler, karakterler ve ekran dünyası.", "Films, series and the world on screen."], icon: "clapperboard", color: "pink", slug: ["sinema-ve-televizyon-bilgi-yarismasi", "film-and-television-trivia-quiz"] },
  language_literature: { label: ["Dil ve Edebiyat", "Language & Literature"], description: ["Yazarlar, eserler, kelimeler ve diller.", "Writers, works, words and languages."], icon: "book", color: "indigo", slug: ["dil-ve-edebiyat-bilgi-yarismasi", "language-and-literature-trivia-quiz"] },
  turkiye: { label: ["Türkiye", "Türkiye"], description: ["Türkiye'nin tarihi, coğrafyası ve kültürü.", "Türkiye's history, geography and culture."], icon: "map", color: "red", slug: ["turkiye-bilgi-yarismasi", "turkiye-trivia-quiz"] },
  general_knowledge: { label: ["Genel Kültür", "General Knowledge"], description: ["Hayatın her alanından farklı bilgiler.", "Facts from every part of life."], icon: "lightbulb", color: "gold", slug: ["genel-kultur-bilgi-yarismasi", "general-knowledge-trivia-quiz"] },
};

// Curated Turkish-local questions; IDs remain identical in both languages and in saved mistakes.
const TURKIYE_IDS = new Set(`e07 e08 e23 e31 e34 e35 e37 e49 e50 e51 e52 e53 e57 e59 m05 m06 m34 m36 m37 m38 m39 m51 m52 m53 m60 h05 h06 h16 h32 h34 h37 h38 h51 h52 h53 h54 x06 x07 x22 x23 x24 x25 x33 x34 x36 x39 x51 x52 x53 x60 e98 e99 e100 e102 e103 e104 e105 e106 e107 e108 e109 m94 m95 m96 m97 m98 m99 m100 m102 m103 m104 m105 m106 m107 h93 h94 h95 h96 h97 h98 h99 h100 h101 h102 h103 h104 h105 h106 x94 x95 x96 x97 x98 x99 x100 x101 x102 x103 x104 x105 x106 x107`.split(" "));

export function categoryForQuestion(id: string, topic: string): Exclude<GameCategory, "mixed"> {
  if (TURKIYE_IDS.has(id)) return "turkiye";
  if (topic === "Uzay") return "space";
  if (["Bilim", "Doğa", "Bilim Tarihi"].includes(topic)) return "science_nature";
  if (["Tarih", "Arkeoloji"].includes(topic)) return "history";
  if (topic === "Coğrafya") return "geography";
  if (["Sanat", "Sanat Tarihi", "Müzik", "Mimari"].includes(topic)) return "arts_culture";
  if (topic === "Edebiyat") return "language_literature";
  if (topic === "Oyun ve Spor") return /^r0(67|68|69|70|75|76|77|78|79|80)$/.test(id) ? "sports" : "general_knowledge";
  if (topic === "technology" || topic === "cinema_television") return topic;
  throw new Error(`Unmapped question category: ${id} / ${topic}`);
}

export function matchesCategory(topic: string, category: GameCategory): boolean {
  return category === "mixed" || topic === category;
}
