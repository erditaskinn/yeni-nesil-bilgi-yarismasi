import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../src/data/questions";
import { DIFFICULTIES, GAME_CONFIG } from "../src/lib/config";
import {
  calculatePoints,
  createGame,
  gameReducer,
  secondsLeft,
  selectQuestions,
  summarize,
} from "../src/lib/game";
import { readHighScores, saveHighScore, STORAGE_KEY } from "../src/lib/storage";
import { questionRepository } from "../src/lib/question-repository";

test("soru havuzu benzersiz, dört seçenekli, tek doğru cevaplı ve kaynaklıdır", () => {
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  for (const level of DIFFICULTIES)
    assert.ok(questions.filter((q) => q.difficulty === level).length >= 12);
  for (const q of questions) {
    assert.equal(q.choices.length, 4);
    assert.equal(new Set(q.choices.map((c) => c.id)).size, 4);
    assert.equal(new Set(q.choices.map((c) => c.text)).size, 4);
    assert.equal(q.choices.filter((c) => c.id === q.correctAnswer).length, 1);
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

test("karıştırma kaynak veriyi değiştirmez ve doğru cevabı korur", () => {
  const before = JSON.stringify(questions);
  const selected = selectQuestions(questions, "easy", () => 0);
  for (const q of selected) {
    const original = questions.find((item) => item.id === q.id)!;
    assert.equal(
      q.choices.find((c) => c.id === q.correctAnswer)?.text,
      original.choices[0].text,
    );
    assert.notDeepEqual(q.choices, original.choices);
  }
  assert.equal(JSON.stringify(questions), before);
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
    selectQuestions(questions, "easy", () => 0.5),
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
test("on soru sonunda toplam ve başarı doğru; yeni oyunda eski durum temiz", () => {
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
});
test("engelli, bozuk veya kullanılamayan depolama oyunu bozmaz", () => {
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
