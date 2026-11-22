import test from "node:test";
import assert from "node:assert/strict";
import { questions, legacyQuestions } from "../src/data/questions";
import { turkishBatchOne, turkishBatchTwo } from "../src/data/questions-tr-batch-one";
import { turkishSourceExpansion } from "../src/data/questions-tr-source-expansion";
import { turkishMilestoneOne } from "../src/data/questions-tr-milestone-one";
import { turkishMilestoneTwo } from "../src/data/questions-tr-milestone-two";
import { turkishMilestoneThree } from "../src/data/questions-tr-milestone-three";
import { turkishFiftyOne } from "../src/data/questions-tr-batch-50-one";
import { turkishFiftyTwo } from "../src/data/questions-tr-batch-50-two";
import { turkishFiftyThree } from "../src/data/questions-tr-batch-50-three";
import { turkishFiftyFour } from "../src/data/questions-tr-batch-50-four";
import { turkishFiftyFive } from "../src/data/questions-tr-batch-50-five";
import { turkishFinalFortyTwo } from "../src/data/questions-tr-batch-42-final";
import { turkishBalanceOne } from "../src/data/questions-tr-balance-one";
import { turkishBalanceTwo } from "../src/data/questions-tr-balance-two";
import { turkishEasyAdditions } from "../src/data/questions-tr-easy-additions";
import { englishQuestions } from "../src/data/questions-en";
import { DIFFICULTIES, GAME_CONFIG } from "../src/lib/config";
import {
  calculatePoints,
  createGame,
  gameReducer,
  missedQuestions,
  secondsLeft,
  selectQuestions,
  summarize,
} from "../src/lib/game";
import { readHighScores, readSeenQuestions, saveHighScore, saveSeenQuestions, SEEN_STORAGE_KEY, STORAGE_KEY } from "../src/lib/storage";
import { questionRepository } from "../src/lib/question-repository";
import { CATEGORIES, GAME_CATEGORIES, matchesCategory } from "../src/lib/categories";
import { initialPracticeState, practiceReducer } from "../src/lib/practice";
import { evaluateQuestion } from "../src/lib/question-engine";

test("soru havuzu benzersiz, geriye uyumlu, tek doğru cevaplı ve kaynaklıdır", () => {
  assert.equal(questions.length, 1107);
  assert.ok(questions.every(q => !q.format));
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  assert.equal(
    new Set(questions.map((q) => q.question.toLocaleLowerCase("tr").trim())).size,
    questions.length,
  );
  for (const level of DIFFICULTIES)
    assert.ok(questions.filter((q) => q.difficulty === level).length >= 40);
  for (const q of questions) {
    assert.ok(q.choices.length >= 2 && q.choices.length <= 6);
    assert.equal(new Set(q.choices.map((c) => c.id)).size, q.choices.length);
    assert.equal(new Set(q.choices.map((c) => c.text)).size, q.choices.length);
    if (q.format?.type === "chronological_order") {
      assert.equal(new Set(q.format.events.map(event => event.id)).size, q.format.events.length);
      assert.deepEqual(new Set(q.format.order), new Set(q.format.events.map(event => event.id)));
      assert.equal(evaluateQuestion(q, { type: "order", ids: q.format.order })?.isCorrect, true);
    } else if (q.format?.type === "matching") {
      assert.equal(q.format.left.length, q.format.right.length);
      assert.equal(new Set(Object.keys(q.format.pairs)).size, q.format.left.length);
      assert.equal(new Set(Object.values(q.format.pairs)).size, q.format.right.length);
      assert.equal(evaluateQuestion(q, { type: "matches", pairs: q.format.pairs })?.isCorrect, true);
    } else assert.equal(q.choices.filter((c) => c.id === q.correctAnswer).length, 1);
    assert.ok(
      q.question.length > 10 &&
        q.explanation.length > 10 &&
        q.category.length > 0,
    );
    assert.equal(new URL(q.sourceUrl).protocol, "https:");
    assert.match(q.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(q.reviewedAt)));
  }
});

test("new beginner questions expand the three thinnest easy topics with sourced, Turkish-only items", () => {
  assert.equal(turkishEasyAdditions.length, 15);
  assert.equal(new Set(turkishEasyAdditions.map(q => q.id)).size, 15);
  assert.deepEqual(
    Object.fromEntries(["history", "arts_culture", "turkiye"].map(category => [category, turkishEasyAdditions.filter(q => q.category === category).length])),
    { history: 5, arts_culture: 5, turkiye: 5 },
  );
  assert.ok(turkishEasyAdditions.every(q => q.difficulty === "easy" && q.sourceUrl.startsWith("https://")));
  for (const q of turkishEasyAdditions) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("ilk Türkçe parti beş ayrı kurumsal kaynaktan gelir ve İngilizce havuzu değiştirmez", () => {
  assert.equal(turkishBatchOne.length, 5);
  assert.equal(new Set(turkishBatchOne.map(q => q.id)).size, 5);
  assert.equal(new Set(turkishBatchOne.map(q => new URL(q.sourceUrl).hostname)).size, 5);
  for (const q of turkishBatchOne) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
    assert.equal(q.choices.filter(choice => choice.id === q.correctAnswer).length, 1);
  }
});

test("ikinci Türkçe parti aynı beş kaynaktan yeni sorular ekler", () => {
  assert.equal(turkishBatchTwo.length, 5);
  assert.equal(new Set(turkishBatchTwo.map(q => q.sourceUrl)).size, 5);
  assert.deepEqual(
    new Set(turkishBatchTwo.map(q => q.sourceUrl)),
    new Set(turkishBatchOne.map(q => q.sourceUrl)),
  );
  for (const q of turkishBatchTwo) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(turkishBatchOne.some(item => item.id === q.id || item.question === q.question), false);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("yeni kurumsal kaynak paketi boş kategori düzeylerini doldurur", () => {
  assert.equal(turkishSourceExpansion.length, 10);
  assert.equal(new Set(turkishSourceExpansion.map(q => q.id)).size, 10);
  assert.equal(new Set(turkishSourceExpansion.map(q => new URL(q.sourceUrl).hostname)).size, 7);
  for (const q of turkishSourceExpansion) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
    assert.equal(q.choices.filter(choice => choice.id === q.correctAnswer).length, 1);
  }
  for (const [category, difficulty] of [
    ["geography", "expert"], ["sports", "hard"], ["sports", "expert"],
    ["technology", "hard"], ["technology", "expert"],
    ["cinema_television", "hard"], ["cinema_television", "expert"],
    ["language_literature", "easy"],
  ]) {
    assert.ok(questions.some(q => q.category === category && q.difficulty === difficulty), `${category}/${difficulty}`);
  }
});

test("Türkçe Zor havuzu Çok Zor soruları da kapsar; İngilizce zorluklar değişmez", () => {
  const hardPool = selectQuestions(questions, "hard", { category: "mixed", count: 10, includeExpertAtHard: true });
  assert.equal(hardPool.length, 10);
  assert.ok(hardPool.every(q => q.difficulty === "hard" || q.difficulty === "expert"));
  assert.ok(selectQuestions(englishQuestions, "hard", { count: 10 }).every(q => q.difficulty === "hard"));
});

test("1000 soru hedefinin ilk yeni paketi yalnızca Türkçe havuza eklenir", () => {
  assert.equal(turkishMilestoneOne.length, 20);
  assert.equal(new Set(turkishMilestoneOne.map(q => q.id)).size, 20);
  for (const q of turkishMilestoneOne) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
    assert.equal(q.choices.filter(choice => choice.id === q.correctAnswer).length, 1);
  }
});

test("ikinci hedef paketi tarih, coğrafya ve spor ağırlıklı, kaynaklı ve Türkçedir", () => {
  assert.equal(turkishMilestoneTwo.length, 20);
  assert.equal(new Set(turkishMilestoneTwo.map(q => q.id)).size, 20);
  assert.ok(turkishMilestoneTwo.filter(q => ["history", "geography", "sports"].includes(q.category)).length >= 15);
  for (const q of turkishMilestoneTwo) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("üçüncü hedef paketi dil-edebiyat alanına 20 özgün soru ekler", () => {
  assert.equal(turkishMilestoneThree.length, 20);
  assert.equal(new Set(turkishMilestoneThree.map(q => q.id)).size, 20);
  assert.ok(turkishMilestoneThree.every(q => q.category === "language_literature"));
  for (const q of turkishMilestoneThree) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("50 soruluk parti beş az sorulu kategoriye dengeli dağıtılır", () => {
  assert.equal(turkishFiftyOne.length, 50);
  assert.equal(new Set(turkishFiftyOne.map(q => q.id)).size, 50);
  for (const category of ["sports", "technology", "cinema_television", "geography", "history"])
    assert.equal(turkishFiftyOne.filter(q => q.category === category).length, 10);
  for (const q of turkishFiftyOne) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("ikinci 50 soruluk parti beş kategoriye eşit dağıtılır", () => {
  assert.equal(turkishFiftyTwo.length, 50);
  assert.equal(new Set(turkishFiftyTwo.map(q => q.id)).size, 50);
  for (const category of ["sports", "geography", "history", "arts_culture", "language_literature"])
    assert.equal(turkishFiftyTwo.filter(q => q.category === category).length, 10);
  for (const q of turkishFiftyTwo) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("üçüncü 50 soruluk parti beş kategoriye eşit dağıtılır", () => {
  assert.equal(turkishFiftyThree.length, 50);
  assert.equal(new Set(turkishFiftyThree.map(q => q.id)).size, 50);
  for (const category of ["sports", "cinema_television", "technology", "turkiye", "general_knowledge"])
    assert.equal(turkishFiftyThree.filter(q => q.category === category).length, 10);
  for (const q of turkishFiftyThree) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("dördüncü 50 soruluk parti en az temsil edilen beş alana dağılır", () => {
  assert.equal(turkishFiftyFour.length, 50);
  assert.equal(new Set(turkishFiftyFour.map(q => q.id)).size, 50);
  for (const category of ["sports", "history", "geography", "cinema_television", "language_literature"])
    assert.equal(turkishFiftyFour.filter(q => q.category === category).length, 10);
  for (const q of turkishFiftyFour) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("beşinci 50 soruluk parti beş alana eşit dağılır", () => {
  assert.equal(turkishFiftyFive.length, 50);
  assert.equal(new Set(turkishFiftyFive.map(q => q.id)).size, 50);
  for (const category of ["sports", "technology", "history", "cinema_television", "general_knowledge"])
    assert.equal(turkishFiftyFive.filter(q => q.category === category).length, 10);
  for (const q of turkishFiftyFive) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("son 42 soru Türkçe havuzu tam 1000'e tamamlar", () => {
  assert.equal(turkishFinalFortyTwo.length, 42);
  assert.equal(new Set(turkishFinalFortyTwo.map(q => q.id)).size, 42);
  for (const [category, count] of [
    ["geography", 8], ["language_literature", 8], ["arts_culture", 6],
    ["history", 6], ["technology", 8], ["general_knowledge", 6],
  ] as const) assert.equal(turkishFinalFortyTwo.filter(q => q.category === category).length, count);
  for (const q of turkishFinalFortyTwo) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("ilk dengeleme paketi yalnızca az sorulu Türkçe kategorilere eklenir", () => {
  assert.equal(turkishBalanceOne.length, 50);
  assert.equal(new Set(turkishBalanceOne.map(q => q.id)).size, 50);
  for (const [category, count] of [
    ["history", 7], ["geography", 7], ["sports", 7], ["technology", 8],
    ["cinema_television", 7], ["language_literature", 7], ["general_knowledge", 7],
  ] as const) assert.equal(turkishBalanceOne.filter(q => q.category === category).length, count);
  for (const q of turkishBalanceOne) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

test("ikinci dengeleme paketi düşük sayılı yedi kategoriyi artırır", () => {
  assert.equal(turkishBalanceTwo.length, 50);
  assert.equal(new Set(turkishBalanceTwo.map(q => q.id)).size, 50);
  for (const [category, count] of [
    ["history", 7], ["geography", 7], ["sports", 7], ["technology", 7],
    ["cinema_television", 7], ["language_literature", 8], ["general_knowledge", 7],
  ] as const) assert.equal(turkishBalanceTwo.filter(q => q.category === category).length, count);
  for (const q of turkishBalanceTwo) {
    assert.equal(questions.find(item => item.id === q.id), q);
    assert.equal(englishQuestions.some(item => item.id === q.id), false);
  }
});

for (const difficulty of DIFFICULTIES) {
  test(`${difficulty}: yalnızca seçilen seviyeden 10 benzersiz soru`, async () => {
    const pool = await questionRepository.getByDifficulty(difficulty);
    assert.ok(pool.every((q) => q.difficulty === difficulty));
    for (let i = 0; i < 40; i++) {
      const selected = selectQuestions(questions, difficulty);
      assert.equal(selected.length, 10);
      assert.equal(new Set(selected.map((q) => q.id)).size, 10);
      assert.ok(selected.every((q) => q.difficulty === difficulty));
    }
  });
}

test("her soru tek bir konu kategorisine girer; mevcut havuz tekrar etmeden seçilir", async () => {
  for (const q of questions) {
    assert.equal(
      GAME_CATEGORIES.filter((category) => category !== "mixed" && matchesCategory(q.category, category)).length,
      1,
      `Kategori eşlemesi eksik veya çakışıyor: ${q.id}`,
    );
  }
  for (const category of GAME_CATEGORIES) {
    assert.ok(CATEGORIES[category].label);
    for (const difficulty of DIFFICULTIES) {
      const pool = await questionRepository.getByDifficulty(difficulty, category);
      assert.ok(pool.every((q) => q.difficulty === difficulty && matchesCategory(q.category, category)));
      if (!pool.length) continue;
      for (let i = 0; i < 20; i++) {
        const count = Math.min(GAME_CONFIG.questionCount, pool.length);
        const selected = selectQuestions(questions, difficulty, { category, count });
        assert.equal(selected.length, count);
        assert.equal(new Set(selected.map((q) => q.id)).size, count);
        assert.ok(selected.every((q) => q.difficulty === difficulty && matchesCategory(q.category, category)));
      }
    }
  }
});

test("karıştırma kaynak veriyi değiştirmez ve doğru cevabı korur", () => {
  const before = JSON.stringify(legacyQuestions);
  const selected = selectQuestions(legacyQuestions, "easy", { random: () => 0 });
  for (const q of selected) {
    const original = legacyQuestions.find((item) => item.id === q.id)!;
    assert.equal(
      q.choices.find((c) => c.id === q.correctAnswer)?.text,
      original.choices[0].text,
    );
    assert.notDeepEqual(q.choices, original.choices);
  }
  assert.equal(JSON.stringify(legacyQuestions), before);
});

test("eksik havuz kontrollü hata verir, tekrar kimlikler sayılmaz", () => {
  assert.throws(() => selectQuestions([], "easy"), /yeterli/);
  assert.throws(
    () =>
      selectQuestions(
        Array.from({ length: 20 }, () => questions[0]!),
        "easy",
      ),
    /yeterli/,
  );
});
test("yakın zamanda görülen sorular ertelenir; havuz bitince en eskiler döner", () => {
  const eligible = questions.filter((q) => q.difficulty === "easy" && matchesCategory(q.category, "space"));
  const seenQuestionIds = eligible.slice(0, -9).map((q) => q.id);
  const selected = selectQuestions(questions, "easy", { category: "space", seenQuestionIds, random: () => 0.5 });
  assert.equal(selected.length, 10);
  assert.equal(selected.filter((q) => !seenQuestionIds.includes(q.id)).length, 9);
  assert.equal(selected[9]?.id, seenQuestionIds[0]);
  const allSeen = selectQuestions(questions, "easy", { category: "space", seenQuestionIds: eligible.map((q) => q.id) });
  assert.deepEqual(allSeen.map((q) => q.id), eligible.slice(0, 10).map((q) => q.id));
});

test("puan formülü sınırları", () => {
  assert.equal(calculatePoints(true, 20), 200);
  assert.equal(calculatePoints(true, 7), 135);
  assert.equal(calculatePoints(true, 1), 105);
  assert.equal(calculatePoints(false, 20), 0);
  assert.equal(calculatePoints(true, 0), 0);
  assert.equal(calculatePoints(true, -1), 0);
  assert.equal(calculatePoints(true, 500), 200);
  assert.equal(calculatePoints(true, NaN), 0);
});

function fresh() {
  return createGame(
    selectQuestions(legacyQuestions, "easy", { random: () => 0.5 }),
    "easy",
    1000,
  );
}
test("sayaç gerçekte geçen süreyi kullanır ve sınırları korur", () => {
  assert.equal(secondsLeft(21000, 1000), 20);
  assert.equal(secondsLeft(21000, 20001), 1);
  assert.equal(secondsLeft(21000, 21000), 0);
  assert.equal(secondsLeft(21000, 100000), 0);
  assert.equal(secondsLeft(21000, -100000), 20);
});
test("bir soruya yalnızca bir kez cevap verilir", () => {
  const initial = fresh();
  const q = initial.questions[0]!;
  const action = {
    type: "answer" as const,
    questionId: q.id,
    selectedId: q.correctAnswer,
    now: 6000,
  };
  const answered = gameReducer(initial, action);
  assert.equal(answered.answers.length, 1);
  assert.equal(answered.answers[0]?.points, 175);
  assert.equal(answered.phase, "feedback");
  assert.strictEqual(gameReducer(answered, action), answered);
  assert.strictEqual(
    gameReducer(answered, { type: "tick", questionId: q.id, now: 30000 }),
    answered,
  );
});
test("süre dolması ve bitiş anındaki cevap yanlış sayılır", () => {
  for (const type of ["tick", "answer"] as const) {
    const initial = fresh();
    const q = initial.questions[0]!;
    const timedOut = gameReducer(initial, {
      type,
      questionId: q.id,
      selectedId: q.correctAnswer,
      now: 21000,
    });
    assert.equal(timedOut.phase, "feedback");
    assert.equal(timedOut.answers[0]?.correct, false);
    assert.equal(timedOut.answers[0]?.selectedId, null);
    assert.equal(timedOut.answers[0]?.points, 0);
  }
});
test("geçersiz seçenek ve eski soruya ait olaylar durumu değiştirmez", () => {
  const initial = fresh();
  const q = initial.questions[0]!;
  assert.strictEqual(
    gameReducer(initial, {
      type: "answer",
      questionId: q.id,
      selectedId: "invalid",
      now: 2000,
    }),
    initial,
  );
  assert.strictEqual(
    gameReducer(initial, { type: "tick", questionId: "old-id", now: 30000 }),
    initial,
  );
  assert.strictEqual(
    gameReducer(initial, { type: "next", questionId: q.id, now: 2000 }),
    initial,
  );
  const answered = gameReducer(initial, {
    type: "answer",
    questionId: q.id,
    selectedId: q.correctAnswer,
    now: 2000,
  });
  const next = gameReducer(answered, {
    type: "next",
    questionId: q.id,
    now: 3000,
  });
  assert.equal(next.index, 1);
  assert.equal(next.deadline, 23000);
  assert.strictEqual(
    gameReducer(next, { type: "next", questionId: q.id, now: 3001 }),
    next,
  );
});
test("on soru sonunda toplam ve başarı doğru; yeni turda eski durum temiz", () => {
  let state = fresh();
  for (let i = 0; i < GAME_CONFIG.questionCount; i++) {
    const q = state.questions[state.index]!;
    const correct = i < 7;
    state = gameReducer(state, {
      type: "answer",
      questionId: q.id,
      selectedId: correct
        ? q.correctAnswer
        : q.choices.find((c) => c.id !== q.correctAnswer)!.id,
      now: state.deadline - 10000,
    });
    state = gameReducer(state, {
      type: "next",
      questionId: q.id,
      now: state.deadline,
    });
  }
  assert.equal(state.phase, "finished");
  const missed = missedQuestions(state);
  assert.deepEqual(missed.map((item) => item.number), [8, 9, 10]);
  assert.ok(missed.every((item) => item.question.id === item.answer.questionId));
  assert.deepEqual(summarize(state.answers), {
    total: 1050,
    correct: 7,
    wrong: 3,
    percentage: 70,
  });
  const reset = fresh();
  assert.equal(reset.index, 0);
  assert.equal(reset.phase, "answering");
  assert.equal(reset.remaining, 20);
  assert.deepEqual(reset.answers, []);
  assert.deepEqual(summarize([]), {
    total: 0,
    correct: 0,
    wrong: 0,
    percentage: 0,
  });
  const categoryGame = createGame(selectQuestions(questions, "hard", { category: "science_nature" }), "hard", 1000, "science_nature");
  assert.equal(categoryGame.category, "science_nature");
  assert.ok(categoryGame.questions.every((q) => matchesCategory(q.category, "science_nature")));
});
test("süresiz çalışma tek yanıt alır, ilerler ve puan üretmez", () => {
  const selected = selectQuestions(legacyQuestions, "easy", { random: () => 0.5 }).slice(0, 2);
  const first = selected[0]!;
  const wrong = first.choices.find((choice) => choice.id !== first.correctAnswer)!.id;
  const answered = practiceReducer(initialPracticeState, { type: "answer", questionId: first.id, selectedId: wrong }, selected);
  assert.equal(answered.phase, "feedback");
  assert.equal(answered.correct, 0);
  assert.strictEqual(practiceReducer(answered, { type: "answer", questionId: first.id, selectedId: first.correctAnswer }, selected), answered);
  const next = practiceReducer(answered, { type: "next", questionId: first.id }, selected);
  assert.equal(next.index, 1);
  assert.equal(next.phase, "answering");
  assert.strictEqual(practiceReducer(next, { type: "answer", questionId: first.id, selectedId: wrong }, selected), next);
  const second = selected[1]!;
  const correct = practiceReducer(next, { type: "answer", questionId: second.id, selectedId: second.correctAnswer }, selected);
  assert.equal(correct.correct, 1);
  const finished = practiceReducer(correct, { type: "next", questionId: second.id }, selected);
  assert.equal(finished.phase, "finished");
  assert.deepEqual(practiceReducer(finished, { type: "restart" }, selected), initialPracticeState);
});
test("yerel rekor yalnızca yükselir, seviyeler ayrı tutulur", () => {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
  saveHighScore("easy", 400, storage);
  saveHighScore("easy", 200, storage);
  saveHighScore("hard", 800, storage);
  assert.deepEqual(readHighScores(storage), { easy: 400, hard: 800 });
  assert.ok(data.has(STORAGE_KEY));
  saveHighScore("easy", 1000, storage);
  assert.equal(readHighScores(storage).easy, 1000);
  saveHighScore("easy", 650, storage, "space");
  saveHighScore("easy", 400, storage, "space");
  saveHighScore("easy", 900, storage, "science");
  assert.deepEqual(readHighScores(storage, "space"), { easy: 650 });
  assert.deepEqual(readHighScores(storage, "science"), { easy: 900 });
  assert.equal(readHighScores(storage).easy, 1000);
  assert.ok(data.has(`${STORAGE_KEY}:space`));
});
test("engelli, bozuk veya kullanılamayan depolama yarışmayı bozmaz", () => {
  const denied = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("quota");
    },
  };
  assert.deepEqual(readHighScores(denied), {});
  assert.doesNotThrow(() => saveHighScore("easy", 100, denied));
  assert.doesNotThrow(() => readHighScores());
  for (const value of [
    "oops",
    "null",
    "[]",
    '"text"',
    '{"easy":-1,"hard":"100","medium":1.5}',
  ]) {
    assert.deepEqual(
      readHighScores({ getItem: () => value, setItem() {} }),
      {},
    );
  }
  assert.deepEqual(saveHighScore("easy", NaN, denied), {});
});
test("görülen soru geçmişi sıralı, sınırlı ve bozuk depolamaya dayanıklı", () => {
  const data = new Map<string, string>();
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
  saveSeenQuestions(["a", "b", "a"], storage);
  saveSeenQuestions(["b", "c"], storage);
  assert.deepEqual(readSeenQuestions(storage), ["a", "b", "c"]);
  assert.ok(data.has(SEEN_STORAGE_KEY));
  saveSeenQuestions(Array.from({ length: 600 }, (_, i) => `q${i}`), storage);
  assert.equal(readSeenQuestions(storage).length, 500);
  assert.equal(readSeenQuestions(storage)[0], "q100");
  data.set(SEEN_STORAGE_KEY, '{"invalid":true}');
  assert.deepEqual(readSeenQuestions(storage), []);
  const denied = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("quota"); } };
  assert.deepEqual(readSeenQuestions(denied), []);
  assert.doesNotThrow(() => saveSeenQuestions(["a"], denied));
});
