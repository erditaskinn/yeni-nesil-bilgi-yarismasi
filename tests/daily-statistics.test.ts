import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { questions } from "../src/data/questions";
import { QUESTION_IMAGES } from "../src/data/question-images";
import { dailyDate, selectDailyQuestions, createDailyGame } from "../src/lib/daily";
import { createGame, gameReducer, selectQuestions } from "../src/lib/game";
import { configureStatistics, readStatistics, recordGame, STATISTICS_KEY, statisticsSummary } from "../src/lib/statistics";
import { TOPIC_CATEGORIES, categoryMetadata, categoryPath } from "../src/lib/category-pages";
import { matchesCategory } from "../src/lib/categories";

function memoryStorage() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
}
function completed(id = "one") {
  let state = { ...createGame(selectQuestions(questions, "easy"), "easy", 0), sessionId: id };
  for (const q of state.questions) {
    state = gameReducer(state, { type: "answer", questionId: q.id, selectedId: q.correctAnswer, now: 0 });
    state = gameReducer(state, { type: "next", questionId: q.id, now: 0 });
  }
  return state;
}

test("Türkiye saatinde günlük tur gece yarısında değişir", () => {
  assert.equal(dailyDate(new Date("2026-09-28T20:59:59Z")), "2026-09-28");
  assert.equal(dailyDate(new Date("2026-09-28T21:00:00Z")), "2026-09-29");
});
test("günlük set ve seçenekler cihazdan ve havuz sırasından bağımsızdır", () => {
  const first = selectDailyQuestions(questions, "2026-09-28");
  assert.deepEqual(first, selectDailyQuestions([...questions].reverse(), "2026-09-28"));
  assert.deepEqual(first, selectDailyQuestions([...questions, { ...questions[0]!, id: "e126" }], "2026-09-28"));
  assert.equal(new Set(first.map(q => q.id)).size, 10);
  assert.deepEqual(["easy", "medium", "hard", "expert"].map(level => first.filter(q => q.difficulty === level).length), [2, 3, 3, 2]);
  assert.notDeepEqual(first.map(q => q.id), selectDailyQuestions(questions, "2026-09-29").map(q => q.id));
  assert.ok(first.every(q => q.choices.filter(c => c.id === q.correctAnswer).length === 1));
  assert.throws(() => selectDailyQuestions(questions, "2026-02-30"));
  assert.throws(() => selectDailyQuestions([], "2026-09-28"));
});
test("günlük tur tarihi oyun ortasında değişmez ve yeni tur cevapları temizler", () => {
  const first = createDailyGame(questions, Date.parse("2026-09-28T20:59:59Z"));
  const q = first.questions[0]!;
  const answered = gameReducer(first, { type: "answer", questionId: q.id, selectedId: q.correctAnswer, now: first.deadline - 1000 });
  assert.equal(answered.dailyDate, "2026-09-28");
  const next = createDailyGame(questions, Date.parse("2026-09-28T21:00:01Z"));
  assert.equal(next.dailyDate, "2026-09-29");
  assert.deepEqual(next.answers, []);
  assert.equal(next.index, 0);
});
test("istatistikler varsayılan kapalıdır ve tamamlanmamış oyun kaydedilmez", () => {
  const storage = memoryStorage();
  recordGame(completed(), storage);
  assert.equal(storage.getItem(STATISTICS_KEY), null);
  assert.equal(configureStatistics(true, false, storage), true);
  recordGame(createGame(selectQuestions(questions, "easy"), "easy", 0), storage);
  assert.equal(readStatistics(storage).games.length, 0);
});
test("istatistik kaydı idempotenttir, günlük tur ayrıdır ve başarı doğru hesaplanır", () => {
  const storage = memoryStorage();
  configureStatistics(true, false, storage);
  const state = completed();
  recordGame(state, storage);
  recordGame(state, storage);
  recordGame({ ...completed("daily"), dailyDate: "2026-09-28" }, storage);
  assert.equal(readStatistics(storage).games.length, 2);
  assert.equal(readStatistics(storage).games[1]!.category, "daily");
  assert.deepEqual(statisticsSummary(readStatistics(storage).games), { games: 2, total: 20, correct: 20, percentage: 100 });
  configureStatistics(false, false, storage);
  assert.deepEqual(readStatistics(storage), { enabled: false, games: [] });
});
test("bozuk ve engellenmiş depolama güvenlidir; son 100 tur tutulur ve silinebilir", () => {
  const denied = { getItem: () => { throw Error("denied"); }, setItem: () => { throw Error("denied"); } };
  assert.deepEqual(readStatistics(denied), { enabled: false, games: [] });
  assert.equal(configureStatistics(true, false, denied), false);
  assert.doesNotThrow(() => recordGame(completed(), denied));
  const storage = memoryStorage();
  storage.setItem(STATISTICS_KEY, "{broken");
  assert.equal(readStatistics(storage).enabled, false);
  configureStatistics(true, false, storage);
  const state = completed();
  for (let i = 0; i < 105; i++) recordGame({ ...state, sessionId: String(i) }, storage);
  assert.equal(readStatistics(storage).games.length, 100);
  assert.equal(readStatistics(storage).games[0]!.id, "5");
  configureStatistics(true, true, storage);
  assert.deepEqual(readStatistics(storage), { enabled: true, games: [] });
  storage.setItem(STATISTICS_KEY, JSON.stringify({ enabled: true, games: [null, { id: "bad", category: "invalid", total: 10, correct: 11, points: -5 }] }));
  assert.equal(readStatistics(storage).games.length, 0);
});
test("kategori sayfaları özgün canonical ve dört farklı seviye örneğine sahiptir", () => {
  assert.equal(new Set(TOPIC_CATEGORIES.map(categoryPath)).size, 4);
  for (const category of TOPIC_CATEGORIES) {
    assert.equal(categoryMetadata(category).alternates?.canonical, `https://yeninesilbilgiyarismasi.com${categoryPath(category)}`);
    for (const difficulty of ["easy", "medium", "hard", "expert"]) assert.ok(questions.some(q => q.difficulty === difficulty && matchesCategory(q.category, category)));
  }
});
test("görseller mevcut sorulara bağlı, yerel, boyutlu ve kaynaklıdır", () => {
  for (const [id, image] of Object.entries(QUESTION_IMAGES)) {
    assert.ok(questions.find(q => q.id === id)?.image);
    assert.ok(existsSync(`public${image.src}`));
    assert.ok(image.width >= 500 && image.height > 0 && image.alt.length > 20 && image.credit.length > 0);
    assert.equal(new URL(image.licenseUrl).protocol, "https:");
  }
});
