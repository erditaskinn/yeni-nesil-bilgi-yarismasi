import { test } from "node:test";
import assert from "node:assert/strict";
import { questions, legacyQuestions } from "../src/data/questions";
import { createGame, gameReducer, longestStreak, roundEndsAfterFeedback, selectQuestions, summarize, type GameState } from "../src/lib/game";
import { ROUND_CONFIG, roundCount, type SelectableRound } from "../src/lib/rounds";
import { configureStatistics, correctStoredMistake, readStatistics, recordGame, STATISTICS_KEY, storedMistakes } from "../src/lib/statistics";
import { readHighScores, saveHighScore } from "../src/lib/storage";
import { ROUND_SESSION_KEY, restoreRoundSession, saveRoundSession } from "../src/lib/round-session";
import { createDailyGame } from "../src/lib/daily";
import { MESSAGES, categoryInfo, topicLabel } from "../src/lib/locale";
import { sharingText } from "../src/lib/sharing";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RoundSelection } from "../src/components/round-selection";

function memory() { const map = new Map<string, string>(); return { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => { map.set(key, value); }, removeItem: (key: string) => { map.delete(key); } }; }
function round(mode: SelectableRound, count = ROUND_CONFIG[mode].count ?? 3) { return createGame(selectQuestions(legacyQuestions, "easy", { count }), "easy", 1000, "mixed", mode); }
function answer(state: GameState, correct = true, timeout = false) {
  const q = state.questions[state.index]!;
  return gameReducer(state, { type: "answer", questionId: q.id, selectedId: correct ? q.correctAnswer : q.choices.find(c => c.id !== q.correctAnswer)!.id, now: timeout ? state.deadline : state.deadline - 10000 });
}
function next(state: GameState) { return gameReducer(state, { type: "next", questionId: state.questions[state.index]!.id, now: state.deadline }); }

for (const mode of ["short", "standard", "long"] as const) test(`${mode}: exact count, unique questions, dynamic percentage and score`, () => {
  let state = round(mode);
  const count = ROUND_CONFIG[mode].count;
  assert.equal(state.questions.length, count);
  assert.equal(new Set(state.questions.map(q => q.id)).size, count);
  for (let i = 0; i < count; i++) { state = answer(state, i !== 0); assert.equal(roundEndsAfterFeedback(state), i === count - 1); state = next(state); assert.equal(state.phase, i === count - 1 ? "finished" : "answering"); }
  assert.deepEqual(summarize(state.answers), { total: (count - 1) * 150, correct: count - 1, wrong: 1, percentage: Math.round(100 * (count - 1) / count) });
});
test("finite pool fallback stays in the chosen category and never repeats", () => {
  const pool = questions.filter(q => q.difficulty === "easy" && q.category === "space").slice(0, 3);
  assert.equal(roundCount("long", pool.length), 3);
  const selected = selectQuestions([...pool, pool[0]!], "easy", { category: "space", count: roundCount("long", pool.length) });
  assert.equal(new Set(selected.map(q => q.id)).size, 3);
  assert.ok(selected.every(q => q.category === "space"));
  assert.throws(() => selectQuestions([], "easy", { count: 0 }));
});
test("endless continues after correct answers, exposes feedback on wrong and then ends", () => {
  let state = next(answer(round("endless")));
  assert.equal(state.index, 1); assert.equal(state.phase, "answering");
  state = answer(state, false);
  assert.equal(state.phase, "feedback"); assert.equal(roundEndsAfterFeedback(state), true);
  state = next(state);
  assert.equal(state.endReason, "wrong"); assert.equal(state.answers.length, 2); assert.equal(longestStreak(state.answers), 1);
  assert.match(sharingText(state, "tr"), /2 soruda 1 doğru/);
  assert.equal(gameReducer(state, { type: "next", questionId: state.questions[1]!.id, now: 50000 }), state);
});
test("endless distinguishes timeout, pool exhaustion and confirmed user exit", () => {
  assert.equal(next(answer(round("endless"), true, true)).endReason, "timeout");
  let state = round("endless", 2);
  state = next(answer(state)); state = next(answer(state));
  assert.equal(state.endReason, "exhausted"); assert.equal(longestStreak(state.answers), 2);
  state = round("endless");
  state = gameReducer(state, { type: "exit", questionId: state.questions[0]!.id, now: 2000 });
  assert.equal(state.endReason, "exit"); assert.equal(state.answers.length, 0);
});
test("daily remains deterministic ten questions independently of round lengths", () => {
  const a = createDailyGame(questions, 1000, "2026-09-29");
  const b = createDailyGame([...questions].reverse(), 2000, "2026-09-29");
  assert.equal(a.mode, "daily"); assert.equal(a.questions.length, ROUND_CONFIG.daily.count);
  assert.deepEqual(a.questions, b.questions);
});
test("new statistics preserve v1 aggregates, respect opt-in and separate guest/accounts", () => {
  const storage = memory();
  const legacy = { id: "old", category: "mixed", correct: 7, total: 10, points: 1400 };
  storage.setItem(STATISTICS_KEY, JSON.stringify({ enabled: true, games: [legacy] }));
  const owner = "11111111-1111-4111-8111-111111111111";
  const state = next(answer(round("endless"), false));
  recordGame(state, storage, owner);
  assert.deepEqual(readStatistics(storage).games[0], { ...legacy, pace: "competition" });
  assert.equal(storedMistakes(undefined, storage).size, 0);
  assert.deepEqual([...storedMistakes(owner, storage)], [state.questions[0]!.id]);
  correctStoredMistake(state.questions[0]!.id, owner, storage);
  assert.equal(storedMistakes(owner, storage).size, 0);
  configureStatistics(false, false, storage); recordGame(state, storage, owner);
  assert.deepEqual(readStatistics(storage), { enabled: false, games: [] });
});
test("a correct mistakes round removes previously missed questions without mixing records", () => {
  const storage = memory(); configureStatistics(true, false, storage);
  const wrong = next(answer(round("endless", 1), false)); recordGame(wrong, storage);
  let corrected = createGame(wrong.questions, "easy", 50000, "mixed", "mistakes");
  corrected = { ...next(answer(corrected)), sessionId: "corrected" }; recordGame(corrected, storage);
  assert.equal(storedMistakes(undefined, storage).size, 0);
  saveHighScore("easy", 1400, storage);
  saveHighScore("easy", 3900, storage, "mixed", undefined, "long");
  assert.equal(readHighScores(storage).easy, 1400);
  assert.equal(readHighScores(storage, "mixed", undefined, "long").easy, 3900);
});
test("active round restores canonical content, order, answers, deadline and owner", () => {
  const storage = memory(); const state = next(answer(round("long")));
  saveRoundSession(state, "tr", undefined, storage);
  const restored = restoreRoundSession(questions, "tr", undefined, state.deadline - 9000, storage)!;
  assert.equal(restored.mode, "long"); assert.equal(restored.index, 1); assert.equal(restored.remaining, 9);
  assert.deepEqual(restored.questions, state.questions); assert.deepEqual(restored.answers, state.answers);
  assert.equal(restoreRoundSession(questions, "en", undefined, 2000, storage), null);
  assert.equal(restoreRoundSession(questions, "tr", "11111111-1111-4111-8111-111111111111", 2000, storage), null);
  const timedOut = restoreRoundSession(questions, "tr", undefined, state.deadline + 1, storage)!;
  assert.equal(gameReducer(timedOut, { type: "tick", questionId: timedOut.questions[1]!.id, now: state.deadline + 1 }).answers[1]!.correct, false);
  const raw = JSON.parse(storage.getItem(ROUND_SESSION_KEY)!); raw.state.questions[1].id = raw.state.questions[0].id;
  storage.setItem(ROUND_SESSION_KEY, JSON.stringify(raw));
  assert.equal(restoreRoundSession(questions, "tr", undefined, state.deadline - 1000, storage), null);
});
test("blocked and malformed session storage cannot interrupt quiz", () => {
  const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} };
  assert.doesNotThrow(() => saveRoundSession(round("short"), "tr", undefined, blocked));
  assert.equal(restoreRoundSession(questions, "tr", undefined, 1000, blocked), null);
});
test("product copy is quiz wording while real games/sports content is untouched", () => {
  for (const [key, pair] of Object.entries(MESSAGES)) { assert.doesNotMatch(pair[0], /oyun|oyna|oyunda/i, key); assert.doesNotMatch(pair[1], /\bgame\b|\bplay\b/i, key); }
  assert.equal(topicLabel("tr", "sports"), "Spor");
  assert.equal(categoryInfo("tr", "arts_culture").label, "Sanat ve Kültür");
  assert.ok(questions.every(question => question.category !== "Oyun ve Spor"));
});
test("selection announces the actual smaller pool before starting and gives an informative empty state", () => {
  const html = renderToStaticMarkup(createElement(RoundSelection, { category: "space", difficulty: "expert", available: 3, mistakes: 0, loading: false, error: "", onBack: () => {}, onSelect: () => {} }));
  assert.match(html, /20 yerine mevcut 3 soruyla başlayacak/);
  assert.match(html, /3 soru · Daha kapsamlı bir deneyim/);
  assert.match(html, /Henüz çalışılacak yanlışın yok/);
});
