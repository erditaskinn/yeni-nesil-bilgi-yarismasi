import { SITE_URL } from "./config";
import { categoryInfo, homePath, levelInfo, type Locale } from "./locale";
import { summarize, type GameState } from "./game";
import { paceLabel } from "./pace";
import { roundLabel } from "./rounds";

export function sharingText(state: GameState, locale: Locale) {
  const { correct, percentage, total } = summarize(state.answers);
  const pace = paceLabel(state.pace, locale);
  const round = roundLabel(state.mode, locale);
  if (locale === "en") {
    const category = categoryInfo(locale, state.category).label;
    return `Next Gen Trivia Quiz · ${category} · ${levelInfo(locale, state.difficulty).label} · ${round} · ${pace}: ${correct}/${state.answers.length} correct (${percentage}%), ${total} points. Try it: ${SITE_URL}${homePath(locale)}${state.dailyDate ? "?mod=gunluk" : ""}`;
  }
  return `Yeni Nesil Bilgi Yarışması · ${categoryInfo(locale, state.category).label} · ${levelInfo(locale, state.difficulty).label} · ${round} · ${pace}: ${state.answers.length} soruda ${correct} doğru (%${percentage}), ${total} puan. Sen de dene: ${SITE_URL}${state.dailyDate ? "/?mod=gunluk" : ""}`;
}
