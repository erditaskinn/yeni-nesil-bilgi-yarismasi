import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../src/data/questions";
import { evaluateQuestion, pointsForEvaluation, questionSeconds, questionType } from "../src/lib/question-engine";
import { createGame, gameReducer, selectQuestions } from "../src/lib/game";
import { restoreRoundSession, saveRoundSession } from "../src/lib/round-session";
import type { Question } from "../src/lib/types";

const legacy = questions[0]!;
const choice = (id: string) => ({ type: "choice" as const, id });

test("legacy questions remain multiple choice with a 20-second clock", () => {
  assert.equal(questionType(legacy), "multiple_choice");
  assert.equal(questionSeconds(legacy), 20);
  assert.equal(evaluateQuestion(legacy, choice(legacy.correctAnswer))?.scoreRatio, 1);
  assert.equal(evaluateQuestion(legacy, choice("unknown")), null);
});

test("question-specific and type-specific durations are centralised", () => {
  assert.equal(questionSeconds({ ...legacy, format: { type: "matching", left: [], right: [], pairs: {} } }), 45);
  assert.equal(questionSeconds({ ...legacy, format: { type: "map_selection", viewBox: "0 0 10 10", regions: [] } }), 30);
  assert.equal(questionSeconds({ ...legacy, timeLimitSeconds: 34 }), 34);
  assert.equal(questionSeconds({ ...legacy, timeLimitSeconds: 999 }), 20);
});

test("ordering and matching award partial base points but are not fully correct", () => {
  const order: Question = { ...legacy, format: { type: "chronological_order", events: [{ id: "a", text: "A", date: "1" }, { id: "b", text: "B", date: "2" }, { id: "c", text: "C", date: "3" }], order: ["a", "b", "c"] } };
  const partialOrder = evaluateQuestion(order, { type: "order", ids: ["a", "c", "b"] });
  assert.equal(partialOrder?.scoreRatio, 1 / 3);
  assert.equal(partialOrder?.isCorrect, false);
  assert.equal(evaluateQuestion(order, { type: "order", ids: ["a", "a", "b"] }), null);
  const match: Question = { ...legacy, format: { type: "matching", left: [{ id: "a", text: "A" }, { id: "b", text: "B" }], right: [{ id: "x", text: "X" }, { id: "y", text: "Y" }], pairs: { a: "x", b: "y" } } };
  assert.equal(evaluateQuestion(match, { type: "matches", pairs: { a: "x", b: "y" } })?.scoreRatio, 1);
  assert.equal(evaluateQuestion(match, { type: "matches", pairs: { a: "y", b: "x" } })?.scoreRatio, 0);
  assert.equal(pointsForEvaluation(0.5, 20, "competition"), 50);
  assert.equal(pointsForEvaluation(1, 20, "competition"), 200);
  assert.equal(pointsForEvaluation(1, 20, "relaxed"), 100);
});

test("map and true-false use explicit permitted choices", () => {
  const map: Question = { ...legacy, correctAnswer: "tr", format: { type: "map_selection", viewBox: "0 0 10 10", regions: [{ id: "tr", label: "Türkiye", path: "M0 0" }, { id: "fr", label: "Fransa", path: "M1 1" }] } };
  assert.equal(evaluateQuestion(map, { type: "map", id: "tr" })?.isCorrect, true);
  assert.equal(evaluateQuestion(map, { type: "map", id: "other" }), null);
  const boolean: Question = { ...legacy, correctAnswer: "true", choices: [{ id: "true", text: "Doğru" }, { id: "false", text: "Yanlış" }], format: { type: "true_false" } };
  assert.equal(evaluateQuestion(boolean, choice("false"))?.isCorrect, false);
  assert.equal(evaluateQuestion(boolean, choice("true"))?.isCorrect, true);
});

test("text answers preserve Turkish letters and never accept broad fuzzy matches", () => {
  const question: Question = { ...legacy, correctAnswer: "İstanbul", format: { type: "fill_in_blank", mode: "text", acceptedAnswers: ["İstanbul"], completedText: "Başkent değil: İstanbul." } };
  assert.equal(evaluateQuestion(question, { type: "text", value: "  İSTANBUL! " })?.isCorrect, true);
  assert.equal(evaluateQuestion(question, { type: "text", value: "Istanbul" })?.isCorrect, false);
  assert.equal(evaluateQuestion(question, { type: "text", value: "<script>alert(1)</script>" })?.isCorrect, false);
});

test("new question duration survives reducer transitions and relaxed mode remains untimed", () => {
  const map: Question = { ...legacy, id: "map-test", correctAnswer: "tr", format: { type: "map_selection", viewBox: "0 0 10 10", regions: [{ id: "tr", label: "Türkiye", path: "M0 0" }] } };
  const second = { ...legacy, id: "legacy-test" };
  const initial = createGame([map, second], "easy", 1000);
  assert.equal(initial.remaining, 30);
  const answered = gameReducer(initial, { type: "answer", questionId: map.id, selectedId: "tr", response: { type: "map", id: "tr" }, now: 11000 });
  assert.equal(answered.answers[0]?.scoreRatio, 1);
  assert.equal(answered.answers[0]?.correct, true);
  assert.equal(gameReducer(answered, { type: "answer", questionId: map.id, selectedId: "tr", now: 11001 }).answers.length, 1);
  const next = gameReducer(answered, { type: "next", questionId: map.id, now: 12000 });
  assert.equal(next.remaining, 20);
  assert.equal(next.deadline, 32000);
  const relaxed = createGame([map], "easy", 1000, "mixed", "short", "relaxed");
  assert.equal(relaxed.remaining, 0);
  assert.equal(relaxed.deadline, 0);
});

test("media readiness restarts the timer and failed media replaces the unanswered question", () => {
  const image: Question = { ...legacy, id: "image-test", format: { type: "image_question", media: { src: "/questions/moon.webp", credit: "NASA", licenseUrl: "https://www.nasa.gov/" } } };
  const replacement: Question = { ...legacy, id: "replacement-test" };
  const initial = createGame([image], image.difficulty, 1000);
  const ready = gameReducer(initial, { type: "mediaReady", questionId: image.id, now: 15000 });
  assert.equal(ready.deadline, 35000);
  const replaced = gameReducer(ready, { type: "replace", questionId: image.id, replacement, now: 16000 });
  assert.equal(replaced.questions[0]?.id, replacement.id);
  assert.equal(replaced.deadline, 36000);
  assert.equal(replaced.answers.length, 0);
  assert.equal(gameReducer(replaced, { type: "replace", questionId: image.id, replacement, now: 17000 }), replaced);
  const exhausted = gameReducer(initial, { type: "mediaUnavailable", questionId: image.id, now: 2000 });
  assert.equal(exhausted.phase, "finished");
  assert.equal(exhausted.answers.length, 0);
});

test("inactive questions are not selected", () => {
  const pool = [{ ...legacy, active: false }, { ...legacy, id: "active-test", active: true }];
  assert.deepEqual(selectQuestions(pool, legacy.difficulty, { count: 1, random: () => 0 }).map(question => question.id), ["active-test"]);
});

test("structured answers restore from canonical question data and recompute points", () => {
  const map: Question = { ...legacy, id: "map-restore", correctAnswer: "tr", format: { type: "map_selection", viewBox: "0 0 10 10", regions: [{ id: "tr", label: "Türkiye", path: "M0 0" }] } };
  const store = new Map<string, string>();
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
  };
  const game = createGame([map], legacy.difficulty, 1000);
  const answered = gameReducer(game, { type: "answer", questionId: map.id, selectedId: "tr", response: { type: "map", id: "tr" }, now: 10000 });
  saveRoundSession(answered, "tr", undefined, storage);
  const restored = restoreRoundSession([map], "tr", undefined, 11000, storage);
  assert.equal(restored?.answers[0]?.correct, true);
  assert.equal(restored?.answers[0]?.points, answered.answers[0]?.points);
  assert.equal(restored?.answers[0]?.questionType, "map_selection");
});
