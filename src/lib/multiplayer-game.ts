import { selectQuestions } from "./game";
import type { Difficulty } from "./config";
import type { GameCategory } from "./categories";
import type { Question } from "./types";

export const MULTIPLAYER_QUESTION_COUNT = 10;
export const MULTIPLAYER_SECONDS_PER_QUESTION = 20;
export const MULTIPLAYER_DIFFICULTY: Difficulty = "medium";
export const MULTIPLAYER_CATEGORY: GameCategory = "mixed";

export function randomGameSeed(): number {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0]! % 2_147_483_647;
}

export function seededRandom(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function selectMultiplayerQuestions(pool: readonly Question[], seed: number): Question[] {
  return selectQuestions(pool, MULTIPLAYER_DIFFICULTY, {
    category: MULTIPLAYER_CATEGORY,
    count: MULTIPLAYER_QUESTION_COUNT,
    seenQuestionIds: [],
    random: seededRandom(seed),
  });
}
