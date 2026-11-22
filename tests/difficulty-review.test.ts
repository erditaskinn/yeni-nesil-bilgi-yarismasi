import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../src/data/questions";
import { englishQuestions } from "../src/data/questions-en";
import { DIFFICULTY_CHANGES, reviewDifficulties } from "../src/data/difficulty-review";
import { foundationQuestions } from "../src/data/questions-foundations";
import { GAME_CATEGORIES, matchesCategory } from "../src/lib/categories";
import { DIFFICULTIES } from "../src/lib/config";
import { LEVEL_PAGES } from "../src/lib/level-pages";
import { selectDailyQuestions } from "../src/lib/daily";

test("uzmanlık ayrıntıları kolay seviyeye, temel kurallar çok zor seviyeye sızmaz", () => {
  for (const id of ["e19", "e35", "e60", "e70", "e76", "e104", "e113", "e117", "e120"]) {
    assert.notEqual(questions.find(q => q.id === id)?.difficulty, "easy", id);
  }
  for (const id of ["m10", "m77", "h45", "h124", "x119"]) {
    assert.equal(questions.find(q => q.id === id)?.difficulty, "easy", id);
  }
  assert.equal(questions.find(q => q.id === "r032")?.difficulty, "hard");
  assert.equal(questions.find(q => q.id === "r059")?.difficulty, "hard");
});

test("inceleme kaynakları, yanıt kimliklerini ve çevirilerin seviyesini korur", () => {
  assert.ok(DIFFICULTY_CHANGES.size > 200);
  assert.throws(() => reviewDifficulties([]), /Unknown difficulty/);
  const reviewed = reviewDifficulties(questions);
  assert.deepEqual(reviewed, questions);
  for (const [id, level] of DIFFICULTY_CHANGES) {
    const tr = questions.find(q => q.id === id)!;
    const en = englishQuestions.find(q => q.id === id)!;
    assert.equal(tr.difficulty, level);
    assert.equal(en.difficulty, level);
    assert.equal(en.correctAnswer, tr.correctAnswer);
  }
});

test("80 temel soru kimlikleri korunarak yeni kategorilere eşlenir", () => {
  assert.equal(foundationQuestions.length, 80);
  for (const q of foundationQuestions) assert.ok(questions.some(item => item.id === q.id && GAME_CATEGORIES.some(category => category !== "mixed" && matchesCategory(item.category, category))));
});

test("rehberlerdeki örnek sorular güncel seviyeye aittir", () => {
  for (const level of DIFFICULTIES) {
    for (const id of LEVEL_PAGES[level].sampleIds) assert.equal(questions.find(q => q.id === id)?.difficulty, level, id);
  }
});

test("bugünkü günlük seçenek sıraları korunur; yeni havuz sonraki günlere katılır", () => {
  assert.deepEqual(selectDailyQuestions(questions, "2026-09-28").map(q => q.choices.map(c => c.id)), [
    ["x37-0", "x37-2", "x37-3", "x37-1"], ["e61-2", "e61-0", "e61-1", "e61-3"],
    ["h101-3", "h101-0", "h101-1", "h101-2"], ["m28-2", "m28-0", "m28-1", "m28-3"],
    ["m111-3", "m111-2", "m111-0", "m111-1"], ["e91-2", "e91-3", "e91-0", "e91-1"],
    ["h60-3", "h60-1", "h60-0", "h60-2"], ["m82-3", "m82-0", "m82-2", "m82-1"],
    ["h05-3", "h05-0", "h05-1", "h05-2"], ["x117-0", "x117-3", "x117-1", "x117-2"],
  ]);
  const ids = new Set<string>();
  for (let day = 1; day <= 31; day++) {
    for (const q of selectDailyQuestions(questions, `2026-10-${String(day).padStart(2, "0")}`)) ids.add(q.id);
  }
  assert.ok([...ids].some(id => id.startsWith("r")));
});
