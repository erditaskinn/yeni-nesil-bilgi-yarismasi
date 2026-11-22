import type { Locale } from "./locale";

export const PACE_MODES = ["competition", "relaxed"] as const;
export type PaceMode = (typeof PACE_MODES)[number];
export function paceLabel(mode: PaceMode, locale: Locale) {
  return mode === "competition" ? locale === "tr" ? "Yarışma Modu" : "Challenge Mode" : locale === "tr" ? "Rahat Mod" : "Relaxed Mode";
}
