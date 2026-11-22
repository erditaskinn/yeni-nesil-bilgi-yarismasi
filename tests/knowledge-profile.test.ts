import test from "node:test";
import assert from "node:assert/strict";
import { afterProfileClear, buildKnowledgeProfile, PROFILE_CATEGORIES } from "../src/lib/knowledge-profile";
import { cardContent, cardDimensions, profileComment } from "../src/lib/profile-sharing";
import type { GameRecord } from "../src/lib/statistics";
import type { Question } from "../src/lib/types";

const bank = PROFILE_CATEGORIES.flatMap((category, index) => Array.from({ length: 30 }, (_, n) => ({ id: `${index}-${n}`, category }))) as Question[];
function round(id: number, answers: { questionId: string; correct: boolean }[], at = id): GameRecord {
  return { id: `round-${id}`, category: "mixed", correct: answers.filter(item => item.correct).length, total: answers.length, points: id * 100, mode: "standard", pace: id % 2 ? "competition" : "relaxed", completedAt: new Date(2026, 0, at).toISOString(), answers };
}
const items = (category: number, count: number, correct = count) => Array.from({ length: count }, (_, n) => ({ questionId: `${category}-${n}`, correct: n < correct }));

test("cloud clear cutoff compares instants, not timestamp formatting", () => {
  const record = round(1, items(0, 1));
  record.completedAt = "2026-09-30T12:00:00.100Z";
  assert.equal(afterProfileClear(record, "2026-09-30T12:00:00+00:00"), true);
  assert.equal(afterProfileClear(record, "2026-09-30T12:00:01+00:00"), false);
  assert.equal(afterProfileClear({ ...record, completedAt: undefined }, "2026-09-30T12:00:00+00:00"), false);
});

test("profile stays locked before three rounds, fifteen unique answers and three categories", () => {
  const two = buildKnowledgeProfile([round(1, items(0, 5)), round(2, items(1, 5))], bank);
  assert.equal(two.ready, false); assert.equal(two.rounds, 2); assert.equal(two.answered, 10); assert.equal(two.radar.length, 0);
  const three = buildKnowledgeProfile([round(1, items(0, 8)), round(2, items(1, 7)), round(3, items(0, 1))], bank);
  assert.equal(three.ready, false); assert.equal(three.triedCategories, 2);
  const ready = buildKnowledgeProfile([round(1, items(0, 5)), round(2, items(1, 5)), round(3, items(2, 5))], bank);
  assert.equal(ready.ready, true); assert.equal(ready.radar.length, 3);
  assert.equal(ready.readyToExplore, null);
});

test("latest answer wins without inflating unique counts, regardless of pace or round score", () => {
  const first = round(1, items(0, 5, 5));
  const second = round(2, [{ questionId: "0-0", correct: false }]); second.points = 2000;
  const profile = buildKnowledgeProfile([first, second], bank);
  assert.equal(profile.answered, 5); assert.equal(profile.correct, 4); assert.equal(profile.categories[0]!.percentage, 80);
  assert.equal(profile.categories[0]!.lastAnsweredAt, second.completedAt);
});

test("mixed round answers use actual categories; no strong category from one to four questions", () => {
  const profile = buildKnowledgeProfile([round(1, [...items(0, 4), ...items(1, 5)]), round(2, items(2, 5)), round(3, items(3, 5))], bank);
  assert.equal(profile.ready, true);
  assert.equal(profile.categories[0]!.sufficient, false);
  assert.notEqual(profile.strongest?.category, PROFILE_CATEGORIES[0]);
  assert.equal(profile.radar.length, 3);
});

test("strongest ties favor more questions; radar uses at most six most attempted categories", () => {
  const records = [round(1, [...items(0, 5), ...items(1, 8)]), round(2, [...items(2, 7), ...items(3, 6)]), round(3, [...items(4, 9), ...items(5, 10), ...items(6, 11)])];
  const profile = buildKnowledgeProfile(records, bank);
  assert.equal(profile.strongest?.category, PROFILE_CATEGORIES[6]);
  assert.equal(profile.radar.length, 6);
  assert.equal(profile.radar[0]!.category, PROFILE_CATEGORIES[6]);
  assert.equal(profile.radar.some(item => item.category === PROFILE_CATEGORIES[0]), false);
});

test("trend requires twenty unique questions and compares last ten with previous ten", () => {
  const early = Array.from({ length: 10 }, (_, n) => ({ questionId: `0-${n}`, correct: n < 4 }));
  const late = Array.from({ length: 10 }, (_, n) => ({ questionId: `0-${n + 10}`, correct: n < 7 }));
  const partial = buildKnowledgeProfile([round(1, early)], bank);
  assert.equal(partial.categories[0]!.trend, null);
  const profile = buildKnowledgeProfile([round(1, early), round(2, late)], bank);
  assert.equal(profile.categories[0]!.trend, 30); assert.equal(profile.categories[0]!.trendState, "rising");
});

test("share content reuses visible percentages and omits identity unless nickname is opted in", () => {
  const profile = buildKnowledgeProfile([round(1, items(0, 5)), round(2, items(1, 5)), round(3, items(2, 5))], bank);
  assert.deepEqual(cardDimensions("story"), { width: 1080, height: 1920 });
  assert.deepEqual(cardDimensions("square"), { width: 1080, height: 1080 });
  const card = cardContent(profile, "tr");
  assert.deepEqual(card.rows.map(row => row.percentage), profile.radar.slice(0, 4).map(item => item.percentage));
  assert.equal(card.nickname, undefined);
  assert.equal(JSON.stringify(card).includes("@"), false);
  assert.equal(cardContent(profile, "tr", "Meraklı").nickname, "Meraklı");
  assert.ok(profileComment(profile, "en").length > 10);
  assert.throws(() => cardContent(buildKnowledgeProfile([], bank), "tr"));
});
