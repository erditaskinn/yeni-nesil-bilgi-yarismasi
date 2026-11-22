import { ROUND_CONFIG } from "./rounds";

export const GAME_CONFIG = {
  questionCount: ROUND_CONFIG.standard.count,
  secondsPerQuestion: 20,
  basePoints: 100,
  pointsPerSecond: 5,
} as const;

export const SITE_URL = "https://yeninesilbilgiyarismasi.com";
export const DIFFICULTIES = ["easy", "medium", "hard", "expert"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const TURKISH_DIFFICULTIES = ["easy", "medium", "hard"] as const satisfies readonly Difficulty[];

export const LEVELS: Record<
  Difficulty,
  { label: string; description: string; tag: string }
> = {
  easy: {
    label: "Kolay",
    description: "Tanıdık bilgilerle keyifli bir başlangıç.",
    tag: "Isınma turu",
  },
  medium: {
    label: "Orta",
    description: "Biraz düşün, bildiklerini bir araya getir.",
    tag: "Bir adım ileri",
  },
  hard: {
    label: "Zor",
    description: "Ayrıntılara güven, bilgine meydan oku.",
    tag: "İddianı göster",
  },
  expert: {
    label: "Çok Zor",
    description: "Meraklı zihinler için sıra dışı sorular.",
    tag: "Sınırlarını keşfet",
  },
};
