import { expect, test } from "@playwright/test";
import { GAME_CATEGORIES } from "../../src/lib/categories";
import { questions } from "../../src/data/questions";

test("all 12 categories are in one scrolling grid; new topics are available", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  for (const category of GAME_CATEGORIES) {
    const card = page.getByTestId(`category-${category}`);
    await expect(card).toBeVisible();
    const icon = card.locator(".category-icon img");
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute("src", `/category-icons/${category}.webp`);
    await expect.poll(() => icon.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 128)).toBe(true);
  }
  for (const category of ["technology", "cinema_television"]) {
    const card = page.getByTestId(`category-${category}`);
    await expect(card).toBeEnabled();
    await expect(card).not.toContainText("Yakında");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("technology and film/TV can start sourced rounds in Turkish and English", async ({ page }) => {
  for (const [category, difficulty] of [["technology", "easy"], ["cinema_television", "medium"]] as const) {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.removeItem("ynby:active-round:v1"));
    await page.reload();
    await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
    await page.getByTestId(`category-${category}`).click();
    await page.getByTestId(`level-${difficulty}`).click();
    await page.getByTestId("round-standard").click();
    await page.getByTestId("pace-relaxed").click();
    await page.getByTestId("start-round").click();
    const text = await page.locator("main h1").innerText();
    const question = questions.find(item => item.question === text);
    expect(question?.category).toBe(category);
    expect(question?.sourceUrl).toMatch(/^https:/);
    await expect(page.locator(".choice")).toHaveCount(4);
  }
  await page.goto("/en/technology-trivia-quiz");
  await expect(page.locator("main h1")).toContainText("Technology");
  await page.goto("/en/film-and-television-trivia-quiz");
  await expect(page.locator("main h1")).toContainText("Film & Television");
});

test("round and pace are both required; relaxed round has no timer and survives reload", async ({ page }) => {
  await page.clock.install();
  await page.goto("/?seviye=easy");
  const start = page.getByTestId("start-round");
  await expect(start).toBeDisabled();
  await page.getByTestId("round-short").click();
  await expect(start).toBeDisabled();
  await page.getByTestId("pace-relaxed").click();
  await expect(start).toBeEnabled();
  await expect(page.getByTestId("pace-relaxed")).toHaveAttribute("aria-pressed", "true");
  await start.click();
  await expect(page.getByTestId("timer")).toHaveCount(0);
  const text = await page.locator("main h1").innerText();
  await page.clock.fastForward(120_000);
  await expect(page.locator("main h1")).toHaveText(text);
  await expect(page.locator(".choice:not(:disabled)")).toHaveCount(4);
  await page.reload();
  await expect(page.locator("main h1")).toHaveText(text);
  await expect(page.getByTestId("timer")).toHaveCount(0);
  const question = questions.find(q => q.question === text)!;
  await page.getByRole("button", { name: question.choices.find(c => c.id === question.correctAnswer)!.text, exact: true }).click();
  await expect(page.locator(".feedback-heading")).toContainText("+100");
});

test("competition and daily use 20-second timer; relaxed result names its pace", async ({ page }) => {
  await page.clock.install();
  await page.goto("/?seviye=easy");
  await page.getByTestId("round-short").click();
  await page.getByTestId("pace-relaxed").click();
  await page.getByTestId("start-round").click();
  for (let i = 0; i < 5; i++) {
    const text = await page.locator("main h1").innerText();
    const question = questions.find(q => q.question === text)!;
    await page.getByRole("button", { name: question.choices.find(c => c.id === question.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: i === 4 ? "Sonucumu Gör" : "Sonraki Soru", exact: true }).click();
  }
  await expect(page.locator("main")).toContainText("Rahat Mod");
  await expect(page.getByTestId("total-score")).toHaveText("500");
  await page.getByRole("button", { name: "Ana sayfaya dön", exact: true }).click();
  await page.getByRole("button", { name: "Günlük Tura Başla", exact: true }).click();
  await expect(page.getByTestId("timer")).toContainText("20");
  await expect(page.locator(".quiz-category")).toContainText("Yarışma Modu");
});

test("old history-geography links remain useful in both languages", async ({ page }) => {
  await page.goto("/tarih-ve-cografya-bilgi-yarismasi");
  await expect(page.locator("main h1")).toContainText("Tarih");
  await expect(page.getByRole("link", { name: /Tarih/ }).first()).toBeVisible();
  await page.goto("/en/history-and-geography-trivia-quiz");
  await expect(page.locator("main h1")).toContainText("History");
});
