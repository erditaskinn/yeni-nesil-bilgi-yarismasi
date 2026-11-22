import test from "node:test";
import assert from "node:assert/strict";
import { questions, legacyQuestions } from "../src/data/questions";
import { englishQuestions } from "../src/data/questions-en";
import { CATEGORIES, GAME_CATEGORIES, matchesCategory } from "../src/lib/categories";
import { DIFFICULTIES } from "../src/lib/config";
import { createDailyGame } from "../src/lib/daily";
import { createGame, gameReducer, selectQuestions } from "../src/lib/game";
import { cloudCategory, parseMemberScores } from "../src/lib/membership";
import { ROUND_SESSION_KEY, restoreRoundSession, saveRoundSession } from "../src/lib/round-session";
import { readHighScores, saveHighScore } from "../src/lib/storage";
import { readStatistics, STATISTICS_KEY } from "../src/lib/statistics";

function memory() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}
function game(pace: "competition" | "relaxed" = "competition", mode: "short" | "endless" = "short") {
  return createGame(selectQuestions(legacyQuestions, "easy", { count: 5 }), "easy", 1000, "mixed", mode, pace);
}

test("competition keeps 20 seconds, bonus points and timeout", () => {
  const start = game();
  const q = start.questions[0]!;
  assert.equal(start.remaining, 20);
  const fast = gameReducer(start, { type: "answer", questionId: q.id, selectedId: q.correctAnswer, now: 1000 });
  assert.equal(fast.answers[0]!.points, 200);
  const slower = gameReducer(start, { type: "answer", questionId: q.id, selectedId: q.correctAnswer, now: 11000 });
  assert.equal(slower.answers[0]!.points, 150);
  const expired = gameReducer(start, { type: "tick", questionId: q.id, now: start.deadline });
  assert.equal(expired.answers[0]!.selectedId, null);
  assert.equal(expired.answers[0]!.points, 0);
});
test("relaxed has no deadline, timer events or bonus, even after hours", () => {
  const start = game("relaxed");
  const q = start.questions[0]!;
  assert.equal(start.deadline, 0);
  assert.equal(start.remaining, 0);
  assert.strictEqual(gameReducer(start, { type: "tick", questionId: q.id, now: 5_000_000 }), start);
  const correct = gameReducer(start, { type: "answer", questionId: q.id, selectedId: q.correctAnswer, now: 5_000_000 });
  assert.equal(correct.answers[0]!.points, 100);
  const wrong = gameReducer(start, { type: "answer", questionId: q.id, selectedId: q.choices.find(c => c.id !== q.correctAnswer)!.id, now: 5_000_000 });
  assert.equal(wrong.answers[0]!.points, 0);
});
test("endless ends on first wrong in relaxed mode; daily stays competitive", () => {
  const start = game("relaxed", "endless");
  const first = start.questions[0]!;
  const correct = gameReducer(start, { type: "answer", questionId: first.id, selectedId: first.correctAnswer, now: 100_000 });
  const next = gameReducer(correct, { type: "next", questionId: first.id, now: 200_000 });
  assert.equal(next.phase, "answering");
  const second = next.questions[1]!;
  const wrong = gameReducer(next, { type: "answer", questionId: second.id, selectedId: second.choices.find(c => c.id !== second.correctAnswer)!.id, now: 300_000 });
  assert.equal(gameReducer(wrong, { type: "next", questionId: second.id, now: 400_000 }).endReason, "wrong");
  const daily = createDailyGame(questions, Date.parse("2026-09-29T12:00:00Z"));
  assert.equal(daily.pace, "competition"); assert.equal(daily.remaining, 20); assert.equal(daily.questions.length, 10);
});
test("relaxed session restores and recomputes fixed points without a deadline", () => {
  const storage = memory();
  const start = game("relaxed");
  const q = start.questions[0]!;
  const answered = gameReducer(start, { type: "answer", questionId: q.id, selectedId: q.correctAnswer, now: 999_999 });
  saveRoundSession(answered, "tr", undefined, storage);
  const restored = restoreRoundSession(questions, "tr", undefined, 4_000_000, storage)!;
  assert.equal(restored.pace, "relaxed"); assert.equal(restored.remaining, 0); assert.equal(restored.answers[0]!.points, 100);
  const raw = JSON.parse(storage.getItem(ROUND_SESSION_KEY)!); raw.state.answers[0].points = 2000;
  storage.setItem(ROUND_SESSION_KEY, JSON.stringify(raw));
  assert.equal(restoreRoundSession(questions, "tr", undefined, 4_000_000, storage)!.answers[0]!.points, 100);
});
test("pace records do not share keys; old combined scores and statistics survive", () => {
  const storage = memory();
  saveHighScore("easy", 800, storage, "history", undefined, "standard", "competition");
  saveHighScore("easy", 400, storage, "history", undefined, "standard", "relaxed");
  saveHighScore("easy", 1200, storage, "legacy_history_geography");
  assert.equal(readHighScores(storage, "history").easy, 800);
  assert.equal(readHighScores(storage, "history", undefined, "standard", "relaxed").easy, 400);
  assert.equal(readHighScores(storage, "legacy_history_geography").easy, 1200);
  storage.setItem(STATISTICS_KEY, JSON.stringify({ enabled: true, games: [{ id: "old", category: "history", correct: 7, total: 10, points: 1200 }] }));
  assert.equal(readStatistics(storage).games[0]!.category, "legacy_history_geography");
  assert.equal(readStatistics(storage).games[0]!.pace, "competition");
  assert.equal(cloudCategory("history"), "history_v2");
  assert.equal(parseMemberScores([{ category: "history", difficulty: "easy", score: 1200 }])[0]!.category, "legacy_history_geography");
});
test("all questions have one canonical category in both languages; new topics are playable", () => {
    assert.equal(questions.length, 1107); assert.equal(englishQuestions.length, 620);
  for (const q of questions) {
    assert.equal(GAME_CATEGORIES.filter(category => category !== "mixed" && matchesCategory(q.category, category)).length, 1, q.id);
    if (["trb", "trc", "trd", "tre", "trf", "trg", "trh", "tri", "trj", "trk", "trl", "trm", "trn"].some(prefix => q.id.startsWith(prefix))) assert.equal(englishQuestions.some(item => item.id === q.id), false);
    else assert.equal(englishQuestions.find(item => item.id === q.id)!.category, q.category);
  }
  assert.equal(questions.find(q => q.id === "r067")!.category, "sports");
  assert.equal(questions.find(q => q.id === "e05")!.category, "general_knowledge");
  assert.equal(questions.find(q => q.id === "e100")!.category, "turkiye");
  for (const category of ["technology", "cinema_television"]) {
    assert.equal(questions.filter(q => q.category === category).length, category === "technology" ? 85 : 83);
    for (const difficulty of ["easy", "medium"])
      assert.ok(questions.filter(q => q.category === category && q.difficulty === difficulty).length >= 10);
  }
  for (const category of GAME_CATEGORIES) assert.ok(CATEGORIES[category].label[0] && CATEGORIES[category].label[1] && CATEGORIES[category].icon);
  for (const difficulty of DIFFICULTIES) assert.ok(questions.some(q => q.difficulty === difficulty && q.category === "space"));
});
test("mixed round balances available topics without losing randomness or repeating IDs", () => {
  const first = selectQuestions(questions, "easy", { category: "mixed", count: 10, random: () => .37 });
  const second = selectQuestions(questions, "easy", { category: "mixed", count: 10, random: () => .83 });
  assert.equal(new Set(first.map(q => q.id)).size, 10);
  assert.ok(new Set(first.map(q => q.category)).size >= 7);
  assert.notDeepEqual(first.map(q => q.id), second.map(q => q.id));
});
