import { legacyQuestions } from "./questions";
import { easyEnglish } from "./en/easy";
import { mediumEnglish } from "./en/medium";
import { hardEnglish } from "./en/hard";
import { expertEnglish } from "./en/expert";
import { foundationEnglish } from "./en/foundations";
import { newTopicEnglish } from "./en/new-topics";
import type { Question } from "../lib/types";
import type { EnglishRow } from "./en/types";

const rows: readonly EnglishRow[] = [...easyEnglish, ...mediumEnglish, ...hardEnglish, ...expertEnglish, ...foundationEnglish, ...newTopicEnglish];
const translations = new Map(rows.map((row) => [row[0], row]));
if (translations.size !== rows.length || rows.length !== legacyQuestions.length) {
  throw new Error("English question translations must have complete, unique coverage.");
}
const imageDescriptions: Record<string, string> = {
  e11: "Physical world map showing continents and oceans without labels.",
  e64: "A depression's edge on the Moon, with rocks in the foreground and distant hills.",
  e118: "Japanese print showing a large wave, fishing boats and a mountain in the distance.",
  h108: "Japanese woodblock print showing a large wave above boats and a distant mountain.",
};
const translatedLegacy: readonly Question[] = legacyQuestions.map((original) => {
  const row = translations.get(original.id);
  if (!row) throw new Error(`Missing English translation: ${original.id}`);
  const alt = imageDescriptions[original.id];
  if (original.image && !alt) throw new Error(`Missing English image description: ${original.id}`);
  const choice = (index: 0 | 1 | 2 | 3) => ({ ...original.choices[index]!, text: row[2][index] });
  return {
    ...original,
    question: row[1],
    choices: [choice(0), choice(1), choice(2), choice(3)],
    explanation: row[3],
    ...(original.image ? { image: {
      ...original.image,
      alt: alt!,
      credit: original.image.credit.replace("Kamu malı", "Public domain"),
    } } : {}),
  };
});
export const englishQuestions: readonly Question[] = translatedLegacy;
