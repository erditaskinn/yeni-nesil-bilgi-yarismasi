import { GAME_CATEGORIES, type GameCategory } from "./categories";
import type { Question } from "./types";
import type { GameRecord } from "./statistics";

export type ProfileCategory = Exclude<GameCategory, "mixed">;
export type CategoryProfile = { category: ProfileCategory; answered: number; correct: number; percentage: number; lastAnsweredAt: string | null; trend: number | null; trendState: "rising" | "steady" | "revisit" | "building"; sufficient: boolean };
export type KnowledgeProfile = { rounds: number; answered: number; correct: number; percentage: number; triedCategories: number; ready: boolean; categories: CategoryProfile[]; radar: CategoryProfile[]; strongest: CategoryProfile | null; mostImproved: CategoryProfile | null; readyToExplore: CategoryProfile | null; updatedAt: string | null };

export const PROFILE_CATEGORIES = GAME_CATEGORIES.filter((category): category is ProfileCategory => category !== "mixed");

export function afterProfileClear(record: GameRecord, cutoff: string | null) {
  return !cutoff || !!record.completedAt && Date.parse(record.completedAt) > Date.parse(cutoff);
}

export function buildKnowledgeProfile(records: readonly GameRecord[], questions: readonly Question[]): KnowledgeProfile {
  const bank = new Map(questions.map(question => [question.id, question]));
  const latest = new Map<string, { category: ProfileCategory; correct: boolean; at: string; order: number }>();
  const uniqueRounds = [...new Map(records.map(record => [record.id, record])).values()];
  uniqueRounds.forEach((record, recordIndex) => {
    const answers = record.answers ?? [
      ...(record.missedIds ?? []).map(questionId => ({ questionId, correct: false })),
      ...(record.correctIds ?? []).map(questionId => ({ questionId, correct: true })),
    ];
    answers.forEach((answer, answerIndex) => {
      const category = bank.get(answer.questionId)?.category;
      if (!category || category === "mixed" || !PROFILE_CATEGORIES.includes(category as ProfileCategory)) return;
      const at = record.completedAt ?? "";
      const order = recordIndex * 10000 + answerIndex;
      const previous = latest.get(answer.questionId);
      if (!previous || at > previous.at || at === previous.at && order > previous.order)
        latest.set(answer.questionId, { category: category as ProfileCategory, correct: answer.correct, at, order });
    });
  });
  const categories = PROFILE_CATEGORIES.map(category => {
    const entries = [...latest.values()].filter(entry => entry.category === category).sort((a, b) => a.at.localeCompare(b.at) || a.order - b.order);
    const answered = entries.length;
    const correct = entries.filter(entry => entry.correct).length;
    const recent = entries.slice(-10);
    const previous = entries.slice(-20, -10);
    const trend = recent.length === 10 && previous.length === 10 ? (recent.filter(entry => entry.correct).length - previous.filter(entry => entry.correct).length) * 10 : null;
    return { category, answered, correct, percentage: answered ? Math.round(correct * 100 / answered) : 0, lastAnsweredAt: entries.at(-1)?.at || null, trend, trendState: trend === null ? "building" as const : trend > 0 ? "rising" as const : trend < 0 ? "revisit" as const : "steady" as const, sufficient: answered >= 5 };
  });
  const eligible = categories.filter(item => item.sufficient);
  const byStrength = [...eligible].sort((a, b) => b.percentage - a.percentage || b.answered - a.answered || a.category.localeCompare(b.category));
  const byTrend = [...eligible].filter(item => item.trend !== null && item.trend > 0).sort((a, b) => b.trend! - a.trend! || b.answered - a.answered);
  const radar = [...eligible].sort((a, b) => b.answered - a.answered || (b.lastAnsweredAt ?? "").localeCompare(a.lastAnsweredAt ?? "") || a.category.localeCompare(b.category)).slice(0, 6);
  const answered = latest.size;
  const correct = [...latest.values()].filter(entry => entry.correct).length;
  const triedCategories = categories.filter(item => item.answered).length;
  const weakest = byStrength.at(-1);
  return { rounds: uniqueRounds.length, answered, correct, percentage: answered ? Math.round(correct * 100 / answered) : 0, triedCategories, ready: uniqueRounds.length >= 3 && answered >= 15 && triedCategories >= 3, categories, radar: radar.length >= 3 ? radar : [], strongest: byStrength[0] ?? null, mostImproved: byTrend[0] ?? null, readyToExplore: weakest && weakest.percentage < byStrength[0]!.percentage ? weakest : null, updatedAt: [...latest.values()].map(entry => entry.at).sort().at(-1) || null };
}
