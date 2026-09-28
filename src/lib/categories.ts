export const GAME_CATEGORIES = [
  "mixed",
  "space",
  "science",
  "history",
  "culture",
] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];

export const CATEGORIES: Record<
  GameCategory,
  { label: string; description: string; topics: readonly string[] }
> = {
  mixed: {
    label: "Karışık Sorular",
    description: "Her konudan sürpriz sorularla klasik yarışma.",
    topics: [],
  },
  space: {
    label: "Uzay",
    description: "Gezegenler, uydular ve gökyüzü.",
    topics: ["Uzay"],
  },
  science: {
    label: "Bilim ve Doğa",
    description: "Bilim, canlılar ve keşiflerin öyküsü.",
    topics: ["Bilim", "Doğa", "Bilim Tarihi"],
  },
  history: {
    label: "Tarih ve Coğrafya",
    description: "Uygarlıklar, yerler ve geçmişin izleri.",
    topics: ["Tarih", "Coğrafya", "Arkeoloji"],
  },
  culture: {
    label: "Sanat ve Kültür",
    description: "Sanat, edebiyat, mimari ve oyunlar.",
    topics: ["Sanat", "Sanat Tarihi", "Edebiyat", "Müzik", "Mimari", "Oyun ve Spor"],
  },
};

export function matchesCategory(topic: string, category: GameCategory): boolean {
  return category === "mixed" || CATEGORIES[category].topics.includes(topic);
}
