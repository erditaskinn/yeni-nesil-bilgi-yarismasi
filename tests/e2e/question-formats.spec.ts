import { test, expect, type Page } from "@playwright/test";
import { formatQuestionsTurkish, formatQuestionsEnglish } from "../../src/data/format-questions";
import { createGame } from "../../src/lib/game";
import { ROUND_SESSION_KEY } from "../../src/lib/round-session";
import type { GameCategory } from "../../src/lib/categories";
import type { Locale } from "../../src/lib/locale";

test("local sample link walks through all eight examples without recording a round", async ({ page }) => {
  await page.goto("/?ornek-sorular=1");
  await page.getByRole("button", { name: "Reddet", exact: true }).click();
  const samples = [...formatQuestionsTurkish].sort((a, b) => a.id.localeCompare(b.id));
  for (const [index, question] of samples.entries()) {
    await expect(page.locator("main h1")).toHaveText(question.question);
    if (question.format?.type === "map_selection") {
      await page.getByRole("button", { name: "C noktası" }).click();
    } else if (question.format?.type === "chronological_order") {
      await page.getByRole("button", { name: /Yukarı taşı: Sputnik/ }).click();
      await page.getByRole("button", { name: /Yukarı taşı: Sputnik/ }).click();
      await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
    } else if (question.format?.type === "matching") {
      for (let i = 0; i < question.format.left.length; i++) {
        await page.locator(".matching-grid > div").first().locator("button").nth(i).click();
        await page.locator(".matching-grid > div").nth(1).locator("button").nth(i).click();
      }
      await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
    } else if (question.format?.type === "fill_in_blank" && question.format.mode === "text") {
      await page.getByRole("textbox", { name: "Kısa cevabın" }).fill("Au");
      await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
    } else {
      await page.locator(".choice").first().click();
    }
    await expect(page.locator(".feedback")).toBeVisible();
    await page.getByRole("button", { name: index === samples.length - 1 ? "Baştan Başla" : "Sonraki Örnek" }).click();
  }
  await expect(page.locator("main h1")).toHaveText(samples[0]!.question);
  expect(await page.evaluate(() => sessionStorage.getItem("ynby:active-round:v1"))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("ynby:statistics:v1"))).toBeNull();
});

async function openFormat(page: Page, id: string, locale: Locale = "tr", waitForOriginal = true, pace: "relaxed" | "competition" = "relaxed") {
  const question = (locale === "tr" ? formatQuestionsTurkish : formatQuestionsEnglish).find(item => item.id === id)!;
  const state = createGame([question], question.difficulty, Date.now(), question.category as GameCategory, "short", pace);
  const value = JSON.stringify({
    version: 1, locale, owner: null,
    state: { ...state, questions: [{ id: question.id, choices: question.choices.map(choice => choice.id) }] },
  });
  const path = locale === "tr" ? "/" : "/en";
  await page.goto(`${path}?format-test=1`);
  await page.evaluate(({ key, value }) => sessionStorage.setItem(key, value), { key: ROUND_SESSION_KEY, value });
  await page.goto(path);
  if (waitForOriginal) await expect(page.locator("main h1")).toHaveText(question.question);
}

test.describe.skip("shelved formats outside the normal quiz pool", () => {
test("true/false keeps review and practice interactive", async ({ page }) => {
  await openFormat(page, "fmt001");
  await expect(page.locator(".choice")).toHaveCount(2);
  await page.getByRole("button", { name: /Yanlış/ }).click();
  await expect(page.locator(".feedback")).toContainText("Doğru");
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list")).toContainText("Merkür ve Venüs");
  await page.getByRole("button", { name: "Yanlışlarımı Çalış" }).click();
  await expect(page.locator(".choice")).toHaveCount(2);
  await page.getByRole("button", { name: /Doğru/ }).click();
  await expect(page.locator(".study-page .feedback")).toContainText("Doğru bildin");
});

test("odd-one-out and choice completion show their solutions", async ({ page }) => {
  await openFormat(page, "fmt002");
  await page.getByRole("button", { name: /Merkür/ }).click();
  await expect(page.locator(".feedback")).toContainText("Jüpiter bir gaz devidir.");
  await openFormat(page, "fmt003");
  await expect(page.locator(".choice")).toHaveCount(3);
  await page.getByRole("button", { name: /Venüs/ }).click();
  await expect(page.locator(".feedback")).toContainText("Merkür, Venüs, Dünya ve Mars");
});

test("written answer is localized, keyboard usable and remains text", async ({ page }) => {
  await openFormat(page, "fmt004", "en");
  await expect(page.locator(".choice")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Your short answer" }).fill("<img src=x onerror=alert(1)>");
  await page.getByRole("button", { name: "Submit My Answer" }).click();
  await expect(page.locator(".feedback")).toContainText("Au");
  await page.getByRole("button", { name: "See My Result" }).click();
  await page.getByRole("button", { name: "Review My Mistakes" }).click();
  await expect(page.locator(".review-list dd").first()).toHaveText("<img src=x onerror=alert(1)>");
  await expect(page.locator(".review-list img")).toHaveCount(0);
  await page.getByRole("button", { name: "Practice My Mistakes" }).click();
  await page.getByRole("textbox", { name: "Your short answer" }).fill("au");
  await page.getByRole("textbox", { name: "Your short answer" }).press("Enter");
  await expect(page.locator(".study-page .feedback")).toContainText("You got it right");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("chronology uses keyboard controls and shows the dated solution in review and practice", async ({ page }) => {
  await openFormat(page, "fmt005");
  await expect(page.locator(".order-item")).toHaveCount(3);
  await page.getByRole("button", { name: /Yukarı taşı: Sputnik/ }).click();
  await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
  await expect(page.locator(".feedback")).toContainText("Sputnik 1 fırlatıldı (1957)");
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list")).toContainText("Hubble Uzay Teleskobu fırlatıldı (1990)");
  await page.getByRole("button", { name: "Yanlışlarımı Çalış" }).click();
  await page.getByRole("button", { name: /Yukarı taşı: Sputnik/ }).click();
  await page.getByRole("button", { name: /Yukarı taşı: Sputnik/ }).click();
  await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
  await expect(page.locator(".study-page .feedback")).toContainText("Doğru bildin");
});

test("matching can be changed before submit and keeps partial credit separate from correctness", async ({ page }) => {
  await openFormat(page, "fmt006");
  const left = page.locator(".matching-grid > div").first().locator("button");
  const right = page.locator(".matching-grid > div").nth(1).locator("button");
  await expect(page.getByRole("button", { name: "Cevabımı Onayla" })).toBeDisabled();
  await left.nth(0).click(); await right.nth(0).click();
  await left.nth(0).click(); await right.nth(1).click();
  await expect(left.nth(0)).toContainText("1. gezegen");
  await left.nth(1).click(); await right.nth(3).click();
  await left.nth(2).click(); await right.nth(2).click();
  await left.nth(3).click(); await right.nth(0).click();
  await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
  await expect(page.locator(".feedback")).toContainText("Merkür: 1. gezegen");
  await expect(page.locator(".feedback")).toContainText("+50 puan");
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await expect(page.getByTestId("result-wrong")).toHaveText("1");
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list")).toContainText("Dünya: 4. gezegen");
  await page.getByRole("button", { name: "Yanlışlarımı Çalış" }).click();
  const practiceLeft = page.locator(".matching-grid > div").first().locator("button");
  const practiceRight = page.locator(".matching-grid > div").nth(1).locator("button");
  for (const [leftIndex, rightIndex] of [[0, 1], [1, 3], [2, 0], [3, 2]] as const) {
    await practiceLeft.nth(leftIndex).click();
    await practiceRight.nth(rightIndex).click();
  }
  await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
  await expect(page.locator(".study-page .feedback")).toContainText("Doğru bildin");
});

test("image question shows its source after answering and remains usable in review", async ({ page }) => {
  await openFormat(page, "fmt007", "tr", true, "competition");
  await expect(page.locator(".question-image")).toBeVisible();
  await expect.poll(async () => Number.parseInt(await page.getByTestId("timer").innerText(), 10)).toBeLessThan(20);
  await page.getByRole("button", { name: "Görseli büyüt" }).click();
  await expect(page.locator(".question-image")).toHaveClass(/is-zoomed/);
  await page.getByRole("button", { name: /Nehir deltası/ }).click();
  await expect(page.locator(".feedback")).toContainText("Krater");
  await expect(page.locator(".image-credit")).toContainText("NASA/JSC");
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list")).toContainText("Krater");
});

test("map question supports point selection and accessible text alternatives", async ({ page }) => {
  await openFormat(page, "fmt008", "tr", true, "competition");
  await expect(page.locator(".map-frame svg")).toBeVisible();
  await expect.poll(async () => Number.parseInt(await page.getByTestId("timer").innerText(), 10)).toBeLessThan(30);
  await page.getByRole("button", { name: "A noktası" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".feedback")).toContainText("C noktası");
  await expect(page.locator(".image-credit")).toContainText("Natural Earth");
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list")).toContainText("A noktası");
  await page.getByRole("button", { name: "Yanlışlarımı Çalış" }).click();
  await page.getByRole("button", { name: "C noktası" }).click();
  await expect(page.locator(".study-page .feedback")).toContainText("Doğru bildin");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("a failed image is replaced without recording an answer", async ({ page }) => {
  await page.route("**/questions/moon.webp", route => route.abort());
  await openFormat(page, "fmt007", "tr", false);
  await expect(page.locator("main h1")).not.toHaveText(formatQuestionsTurkish.find(question => question.id === "fmt007")!.question);
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await expect(page.getByTestId("live-score")).toContainText("0");
});
});
