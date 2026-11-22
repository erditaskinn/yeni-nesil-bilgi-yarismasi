import { DIFFICULTIES } from "./config";
import { createGame, shuffle } from "./game";
import type { Question } from "./types";
import { numberLocale, type Locale } from "./locale";

export function dailyDate(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (name: string) => parts.find(item => item.type === name)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function dailyLabel(date: string, locale: Locale = "tr"): string {
  return new Intl.DateTimeFormat(numberLocale(locale), { timeZone: "Europe/Istanbul", dateStyle: "long" }).format(new Date(`${date}T12:00:00+03:00`));
}

function seededRandom(seed: string): () => number {
  let value = 2166136261;
  for (const char of seed) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return () => {
    value += 0x6d2b79f5;
    let n = Math.imul(value ^ (value >>> 15), 1 | value);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectDailyQuestions(pool: readonly Question[], date: string): Question[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || dailyDate(new Date(`${date}T12:00:00+03:00`)) !== date) throw new Error("Günlük tur tarihi geçersiz.");
  const reviewed = date >= "2026-09-29";
  const random = seededRandom(`ynby-daily-${reviewed ? "v2" : "v1"}:${date}`);
  // Preserve earlier daily IDs and option positions after difficulty changes.
  // Both versions pin their IDs so later additions cannot change today's set.
  const eligible = pool.filter(q => {
    const legacy = /^[emhx]\d{2,3}$/.test(q.id) && Number(q.id.slice(1)) >= 1 && Number(q.id.slice(1)) <= 125;
    const foundation = /^r\d{3}$/.test(q.id) && Number(q.id.slice(1)) >= 1 && Number(q.id.slice(1)) <= 80;
    return legacy || (reviewed && foundation);
  });
  const unique = [...new Map(eligible.map(q => [q.id, q])).values()].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const selected = DIFFICULTIES.flatMap((difficulty, index) => {
    const available = unique.filter(q => reviewed ? q.difficulty === difficulty : q.id[0] === ["e", "m", "h", "x"][index]);
    const count = [2, 3, 3, 2][index]!;
    if (available.length < count) throw new Error("Günlük tur için yeterli soru bulunamadı.");
    return shuffle(available, random).slice(0, count);
  });
  return shuffle(selected, random).map(q => ({ ...q, choices: shuffle(q.choices, random) as unknown as Question["choices"] }));
}

export function createDailyGame(pool: readonly Question[], now: number, date = dailyDate(new Date(now))) {
  return { ...createGame(selectDailyQuestions(pool, date), "medium", now, "mixed", "daily"), dailyDate: date };
}
