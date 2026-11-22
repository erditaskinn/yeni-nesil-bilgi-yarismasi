import { test, expect } from "@playwright/test";

// Legacy navigation tests deliberately start fresh; reload recovery is tested in rounds.spec.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import AxeBuilder from "@axe-core/playwright";
import { questions } from "../../src/data/questions";
import { selectDailyQuestions } from "../../src/lib/daily";
import { TOPIC_CATEGORIES, categoryPath, categoryTitle } from "../../src/lib/category-pages";
import { matchesCategory } from "../../src/lib/categories";
import { STATISTICS_KEY } from "../../src/lib/statistics";
import { DIFFICULTIES } from "../../src/lib/config";
import { levelInfo } from "../../src/lib/locale";

test("günlük tur, paylaşım, tekrar ve isteğe bağlı istatistikler", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.clock.setFixedTime(new Date("2026-09-28T12:00:00Z"));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => sessionStorage.setItem("shared", text) } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  const checkbox = page.getByRole("checkbox");
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  expect((await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Ana sayfaya dön" }).click();
  await page.getByRole("button", { name: "Günlük Tura Başla" }).click();
  const daily = selectDailyQuestions(questions, "2026-09-28");
  for (let i = 0; i < daily.length; i++) {
    const q = daily[i]!;
    await expect(page.locator("main h1")).toHaveText(q.question);
    expect(await page.locator(".choice-text").allTextContents()).toEqual(q.choices.map(c => c.text));
    await page.getByRole("button", { name: q.choices.find(c => c.id === q.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru" }).click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText("10");
  await expect(page.locator(".results-page .eyebrow")).toContainText("28 Eylül 2026");
  await page.getByRole("button", { name: "Sonucumu Paylaş" }).click();
  await expect(page.getByRole("status")).toContainText("panoya kopyalandı");
  expect(await page.evaluate(() => sessionStorage.getItem("shared"))).toContain("/?mod=gunluk");
  expect(await page.evaluate(() => localStorage.getItem("ynby:high-scores:v1"))).toBeNull();
  await page.getByRole("button", { name: "Yeni Tura Başla", exact: true }).click();
  await expect(page.locator("main h1")).toHaveText(daily[0]!.question);
  await page.evaluate(() => sessionStorage.removeItem("ynby:active-round:v1"));
  await page.goto("/");
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  await expect(page.locator(".statistics-table")).toContainText("Günlük 10 Soru");
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).games.length, STATISTICS_KEY)).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("statistics.png"), fullPage: true });
  await page.getByRole("button", { name: "Kayıtları Sil" }).click();
  await expect(page.getByText("İlk turunu tamamladığında", { exact: false })).toBeVisible();
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
  expect(errors).toEqual([]);
});

test("dört kategori sayfası kaynaklıdır ve doğru kategoride yarışma başlatır", async ({ page, request }) => {
  test.setTimeout(90000);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const category of TOPIC_CATEGORIES) {
    const path = categoryPath(category);
    expect(sitemap).toContain(`https://yeninesilbilgiyarismasi.com${path}`);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(categoryTitle(category));
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(`https://yeninesilbilgiyarismasi.com${path}`);
    const levels = DIFFICULTIES.filter(level => questions.some(q => q.difficulty === level && matchesCategory(q.category, category)));
    await expect(page.locator("details")).toHaveCount(levels.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.getByRole("link", { name: new RegExp(`^${levelInfo("tr", levels[0]!).label}`) }).click();
    await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
    await expect(page.getByTestId("question-number")).toHaveText("01");
    const text = await page.locator("main h1").innerText();
    const q = questions.find(q => q.question === text)!;
    expect(q.difficulty).toBe(levels[0]);
    expect(matchesCategory(q.category, category)).toBe(true);
  }
});

test("görsel sorular yüklenir ve mobilde taşmaz", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  for (const id of ["e64", "e118", "e11"]) {
    const q = questions.find(q => q.id === id)!;
    await page.goto("/");
    await page.evaluate(ids => localStorage.setItem("ynby:seen-questions:v1", JSON.stringify(ids)), questions.filter(item => item.difficulty === q.difficulty && item.id !== id).map(item => item.id));
    await page.goto(`/?kategori=${q.category}&seviye=${q.difficulty}`);
    await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
    await expect(page.locator("main h1")).toHaveText(q.question);
    const image = page.locator(".question-image");
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth >= 500)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${id}-image.png`), fullPage: true });
    await page.locator(".choice").first().click();
    await expect(page.locator(".image-credit a")).toBeVisible();
  }
});
