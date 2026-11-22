import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { questions } from "../../src/data/questions";
import { ROUND_CONFIG } from "../../src/lib/rounds";

async function choose(page: Page, mode: "short" | "standard" | "long" | "endless" | "mistakes") {
  await page.goto("/?seviye=easy");
  await expect(page.locator("main h1")).toHaveText("Turunu seç");
  await page.getByTestId(`round-${mode}`).click();
  await page.getByTestId("pace-competition").click();
  await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
}
async function respond(page: Page, correct = true) {
  const text = await page.locator("main h1").innerText();
  const q = questions.find(q => q.question === text)!;
  if (q.format?.type === "fill_in_blank" && q.format.mode === "text") {
    await page.getByRole("textbox", { name: "Kısa cevabın" }).fill(correct ? q.correctAnswer : "__wrong_answer__");
    await page.getByRole("button", { name: "Cevabımı Onayla" }).click();
    return q.id;
  }
  const choice = q.choices.find(c => (c.id === q.correctAnswer) === correct)!;
  const position = (await page.locator(".choice-text").allTextContents()).findIndex(text => text === choice.text);
  expect(position).toBeGreaterThanOrEqual(0);
  await page.locator(".choice").nth(position).click();
  return q.id;
}

for (const mode of ["short", "standard", "long"] as const) test(`${mode}: complete selected count and dynamic progress/results`, async ({ page }) => {
  test.setTimeout(90000);
  await page.clock.setFixedTime(new Date("2026-09-29T14:00:00Z"));
  await choose(page, mode);
  const count = ROUND_CONFIG[mode].count;
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    await expect(page.getByTestId("question-number")).toHaveText(String(i + 1).padStart(2, "0"));
    await expect(page.locator(".question-progress")).toHaveAttribute("max", String(count));
    const id = await respond(page, i !== 0);
    expect(seen.has(id)).toBe(false); seen.add(id);
    await page.getByRole("button", { name: i === count - 1 ? "Sonucumu Gör" : "Sonraki Soru", exact: true }).click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText(String(count - 1));
  await expect(page.getByTestId("result-wrong")).toHaveText("1");
  await expect(page.getByTestId("result-percentage")).toHaveText(`%${Math.round(100 * (count - 1) / count)}`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (mode === "long") expect(await page.evaluate(() => localStorage.getItem("ynby:high-scores:v1"))).toBeNull();
});

test("endless feedback, first wrong, timeout and exit produce explicit end reasons", async ({ page }) => {
  test.setTimeout(90000);
  await page.clock.install();
  await choose(page, "endless");
  await respond(page); await page.getByRole("button", { name: "Sonraki Soru", exact: true }).click();
  await expect(page.getByTestId("question-number")).toHaveText("02");
  await respond(page, false);
  await expect(page.locator(".feedback")).toBeVisible();
  await expect(page.getByRole("link", { name: /Kaynağı incele/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sonraki Soru", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await expect(page.getByTestId("end-reason")).toContainText("ilk yanlış");
  await expect(page.getByText("En uzun doğru cevap serisi: 1", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Yeni Tura Başla" }).click();
  await page.clock.fastForward(21000);
  await expect(page.getByText("Süre doldu. Yeni bir bilgiye ne dersin?", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await expect(page.getByTestId("end-reason")).toContainText("Süre dolduğu");
  await page.getByRole("button", { name: "Yeni Tura Başla" }).click();
  await page.getByRole("button", { name: "Yarışmadan çık", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Yarışmadan Çık", exact: true }).click();
  await expect(page.getByTestId("end-reason")).toHaveText("Turdan çıktın.");
  await expect(page.locator(".round-result-mode")).toContainText("0 soru cevaplandı");
  await expect(page.getByText("Tüm soruları doğru cevapladın!", { exact: true })).toHaveCount(0);
});

test("mistakes uses only incorrect answers in memory without optional persistent statistics", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-29T14:00:00Z"));
  await page.goto("/?seviye=easy");
  await expect(page.getByTestId("round-mistakes")).toBeDisabled();
  await expect(page.getByTestId("round-mistakes")).toContainText("Henüz çalışılacak yanlışın yok.");
  await page.getByTestId("round-endless").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  const wrongId = await respond(page, false);
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Seviye Değiştir", exact: true }).click();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-mistakes").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.locator("main h1")).toHaveText(questions.find(q => q.id === wrongId)!.question);
  await respond(page); await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await expect(page.getByTestId("mistakes-corrected")).toHaveText("1 yanlışından 1 tanesini bu kez doğru cevapladın.");
  expect(await page.evaluate(() => localStorage.getItem("ynby:statistics:v1"))).toBeNull();
  await page.getByRole("button", { name: "Yeni Tura Başla" }).click();
  await expect(page.getByTestId("round-mistakes")).toBeDisabled();
});

test("opted-in mistakes survive reload and corrected mistakes leave history", async ({ page }) => {
  await page.addInitScript(() => { if (!localStorage.getItem("ynby:statistics:v1")) localStorage.setItem("ynby:statistics:v1", JSON.stringify({ enabled: true, games: [] })); });
  await choose(page, "endless");
  const wrongId = await respond(page, false);
  await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Ana sayfaya dön", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-mixed").click(); await page.getByTestId("level-easy").click();
  await page.getByTestId("round-mistakes").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.locator("main h1")).toHaveText(questions.find(q => q.id === wrongId)!.question);
  await respond(page); await page.getByRole("button", { name: "Sonucumu Gör" }).click();
  await page.getByRole("button", { name: "Ana sayfaya dön", exact: true }).click(); await page.reload();
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-mixed").click(); await page.getByTestId("level-easy").click();
  await expect(page.getByTestId("round-mistakes")).toBeDisabled();
});

test("reload preserves long round, choice order, progress, score and real deadline", async ({ page }) => {
  await page.clock.install(); await choose(page, "long");
  await respond(page); await page.getByRole("button", { name: "Sonraki Soru", exact: true }).click();
  const question = await page.locator("main h1").innerText();
  const choices = await page.locator(".choice-text").allTextContents();
  const score = await page.getByTestId("live-score").innerText();
  await page.clock.fastForward(6000); await page.reload();
  await expect(page.locator("main h1")).toHaveText(question);
  await expect(page.getByTestId("question-number")).toHaveText("02");
  expect(await page.locator(".choice-text").allTextContents()).toEqual(choices);
  await expect(page.getByTestId("live-score")).toHaveText(score);
  const remaining = Number((await page.getByTestId("timer").innerText()).match(/\d+/)?.[0]);
  expect(remaining).toBeGreaterThan(0);
  expect(remaining).toBeLessThanOrEqual(14);
  await page.clock.fastForward(15000);
  await expect(page.locator(".feedback")).toBeVisible();
});

test("round selection is bilingual, keyboard accessible, light/dark and responsive", async ({ page }, info) => {
  await page.goto("/en?seviye=expert");
  await expect(page.locator("main h1")).toHaveText("Choose your round");
  await expect(page.getByTestId("round-long")).toContainText("20 questions");
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`rounds-${theme}.png`), fullPage: true });
  }
  await page.getByTestId("round-short").focus(); await page.keyboard.press("Enter");
  await page.getByTestId("pace-competition").focus(); await page.keyboard.press("Enter");
  await page.getByTestId("start-round").focus(); await page.keyboard.press("Enter");
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await expect(page.locator(".quiz-category")).toContainText("Short Round");
});

test("daily bypasses round selection and still shows ten-question progress", async ({ page }) => {
  await page.goto("/"); await page.getByRole("button", { name: "Günlük Tura Başla", exact: true }).click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await expect(page.getByTestId("round-standard")).toHaveCount(0);
  await expect(page.locator(".question-progress")).toHaveAttribute("max", String(ROUND_CONFIG.daily.count));
});
