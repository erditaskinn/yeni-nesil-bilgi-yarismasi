import type { Locale } from "./locale";

export const ROUND_CONFIG = {
  short: { count: 5, label: ["Kısa Tur", "Short Round"] },
  standard: { count: 10, label: ["Standart Tur", "Standard Round"] },
  long: { count: 20, label: ["Uzun Tur", "Long Round"] },
  endless: { count: null, label: ["Sonsuz Tur", "Endless Round"] },
  adaptive: { count: null, label: ["Uyarlanabilir Tur", "Adaptive Round"] },
  mistakes: { count: null, label: ["Yanlışlarım", "My Mistakes"] },
  daily: { count: 10, label: ["Günlük Tur", "Daily Round"] },
} as const;
export type RoundMode = keyof typeof ROUND_CONFIG;
export type SelectableRound = Exclude<RoundMode, "daily">;
export const SELECTABLE_ROUNDS: readonly SelectableRound[] = ["short", "standard", "long", "endless", "adaptive", "mistakes"];
export function roundLabel(mode: RoundMode, locale: Locale) { return ROUND_CONFIG[mode].label[locale === "en" ? 1 : 0]; }
export function roundCount(mode: RoundMode, available: number) {
  return Math.min(ROUND_CONFIG[mode].count ?? available, available);
}
