import test from "node:test";
import assert from "node:assert/strict";
import { questions, legacyQuestions } from "../src/data/questions";
import { englishQuestions } from "../src/data/questions-en";
import { DIFFICULTIES } from "../src/lib/config";
import { GAME_CATEGORIES, matchesCategory } from "../src/lib/categories";
import { questionRepository } from "../src/lib/question-repository";
import { createGame, selectQuestions } from "../src/lib/game";
import { evaluateQuestion } from "../src/lib/question-engine";
import { selectDailyQuestions } from "../src/lib/daily";
import { MESSAGES, translate, topicLabel } from "../src/lib/locale";
import { sharingText } from "../src/lib/sharing";
import sitemap from "../src/app/sitemap";

test("all English translations preserve answer IDs, sources and category assignments", () => {
  const translatedBase = legacyQuestions;
  assert.equal(englishQuestions.length, translatedBase.length);
  assert.equal(new Set(englishQuestions.map(q => q.id)).size, translatedBase.length);
  assert.equal(new Set(englishQuestions.map(q => q.question.toLowerCase())).size, translatedBase.length);
  for (const [i, q] of englishQuestions.entries()) {
    const original = translatedBase[i]!;
    assert.equal(q.id, original.id);
    assert.equal(q.correctAnswer, original.correctAnswer);
    assert.equal(q.category, original.category);
    assert.equal(q.difficulty, original.difficulty);
    assert.equal(q.sourceUrl, original.sourceUrl);
    assert.equal(q.reviewedAt, original.reviewedAt);
    assert.deepEqual(q.choices.map(c => c.id), original.choices.map(c => c.id));
    assert.equal(new Set(q.choices.map(c => c.text)).size, q.choices.length, q.id);
    assert.ok(q.question.length > 10 && q.explanation.length > 10, q.id);
    assert.notEqual(q.question, original.question, q.id);
    assert.notEqual(q.explanation, original.explanation, q.id);
    assert.notEqual(topicLabel("en", q.category), q.category);
    if (q.image) { assert.ok(q.image.alt); assert.notEqual(q.image.alt, original.image!.alt); }
  }
});
test("English repository selects available unique questions in every category and difficulty", async () => {
  for (const difficulty of DIFFICULTIES) {
    assert.equal(englishQuestions.filter(q => q.difficulty === difficulty).length, legacyQuestions.filter(q => q.difficulty === difficulty).length);
    for (const category of GAME_CATEGORIES) {
      const pool = await questionRepository.getByDifficulty(difficulty, category, "en");
      if (!pool.length) continue;
      const count = Math.min(10, pool.length);
      const selected = selectQuestions(pool, difficulty, { category, count });
      assert.equal(selected.length, count);
      assert.equal(new Set(selected.map(q => q.id)).size, count);
      assert.ok(selected.every(q => q.difficulty === difficulty && matchesCategory(q.category, category)));
      for (const q of selected) {
        if (q.format?.type === "chronological_order") assert.equal(evaluateQuestion(q, { type: "order", ids: q.format.order })?.isCorrect, true);
        else if (q.format?.type === "matching") assert.equal(evaluateQuestion(q, { type: "matches", pairs: q.format.pairs })?.isCorrect, true);
        else assert.equal(q.choices.filter(c => c.id === q.correctAnswer).length, 1);
      }
    }
  }
});
test("English Hard includes former Very Hard questions without a separate visible level", async () => {
  const pool = await questionRepository.getByDifficulty("hard", "mixed", "en", true);
  assert.equal(pool.length, englishQuestions.filter(q => q.difficulty === "hard" || q.difficulty === "expert").length);
  assert.ok(pool.some(q => q.difficulty === "expert"));
  const selected = selectQuestions(pool, "hard", { includeExpertAtHard: true });
  assert.equal(selected.length, 10);
});
test("daily question IDs and shuffled answer positions are identical in both languages", () => {
  for (let day = 1; day <= 30; day++) {
    const date = `2026-09-${String(day).padStart(2, "0")}`;
    const shape = (pool: typeof questions) => selectDailyQuestions(pool, date).map(q => [q.id, q.correctAnswer, q.choices.map(c => c.id)]);
    assert.deepEqual(shape(englishQuestions), shape(questions));
  }
});
test("English UI messages retain all interpolation parameters", () => {
  for (const [key, [tr, en]] of Object.entries(MESSAGES)) {
    assert.ok(en.trim(), key);
    const params = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
    assert.deepEqual(params(en), params(tr), key);
  }
  assert.equal(translate("en", "remaining", { seconds: 5 }), "Time left: 5 seconds");
});
test("English sharing uses its localized URL and no personal data", () => {
  const game = createGame(selectQuestions(englishQuestions, "hard"), "hard", 0);
  const text = sharingText(game, "en");
  assert.match(text, /Next Gen Trivia Quiz/);
  assert.match(text, /Hard · Standard Round · Challenge Mode/);
  assert.match(text, /yeninesilbilgiyarismasi.com\/en$/);
});
test("sitemap contains distinct bilingual URLs and reciprocal language links", () => {
  const entries = sitemap();
  assert.equal(entries.length, 30);
  assert.equal(new Set(entries.map(entry => entry.url)).size, 30);
  assert.ok(!entries.some(entry => entry.url.endsWith("very-hard-trivia-quiz")));
  for (const entry of entries) {
    assert.ok(entry.alternates?.languages?.en);
    assert.ok(entry.alternates?.languages?.tr);
    assert.ok(entries.some(other => other.url === entry.alternates?.languages?.en));
    assert.ok(entries.some(other => other.url === entry.alternates?.languages?.tr?.replace(/\/$/, "")));
  }
});
