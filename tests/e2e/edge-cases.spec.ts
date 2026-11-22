import { test, expect } from "@playwright/test";

// Legacy navigation tests deliberately start fresh; reload recovery is tested in rounds.spec.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import { questions } from "../../src/data/questions";
import { matchesCategory } from "../../src/lib/categories";

test("görsel yüklenemediğinde soru cevaplanabilir ve günlük tur dar ekrana sığar", async ({ page }) => {
  await page.goto("/");
  const target = questions.find(q => q.id === "e118")!;
  await page.evaluate(ids => localStorage.setItem("ynby:seen-questions:v1", JSON.stringify(ids)), questions.filter(q => (q.difficulty === target.difficulty || q.difficulty === "expert") && q.id !== target.id).map(q => q.id));
  await page.route("**/questions/art.webp", route => route.abort());
  await page.goto(`/?kategori=${target.category}&seviye=${target.difficulty}`);
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.locator(".question-figure").getByRole("status")).toContainText("Görsel yüklenemedi");
  await page.locator(".choice").first().click();
  await expect(page.getByRole("button", { name: "Sonraki Soru" })).toBeEnabled();
  expect(await page.evaluate(() => {
    const next = document.querySelector(".next-row");
    const feedback = document.querySelector(".feedback");
    return Boolean(next && feedback && next.compareDocumentPosition(feedback) & Node.DOCUMENT_POSITION_FOLLOWING);
  })).toBe(true);
  for (const width of [320, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?mod=gunluk");
    await expect(page.getByTestId("question-number")).toHaveText("01");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("istatistikler depolama engelliyken açılmaz ve yarışma kullanılabilir", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get: () => { throw new Error("blocked"); } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  await page.getByRole("checkbox").click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(page.getByRole("status")).toContainText("kayıt kullanılamıyor");
  await page.getByRole("button", { name: "Ana sayfaya dön" }).click();
  await page.getByRole("button", { name: "Günlük Tura Başla" }).click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
});

test("native paylaşım, iptal ve API hatasında pano yedeği", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        const mode = sessionStorage.getItem("share-mode");
        if (mode === "success") { sessionStorage.setItem("native-share", data.text ?? ""); return; }
        if (mode === "error") throw new Error("Share failed");
        throw new DOMException("Cancelled", "AbortError");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text: string) => { sessionStorage.setItem("clipboard", text); } },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Bilgini Test Et" }).click();
  await page.getByTestId("category-mixed").click();
  await page.getByTestId("level-hard").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  for (let i = 0; i < 10; i++) {
    await page.locator(".choice").first().click({ clickCount: 2 });
    await page.getByRole("button", { name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru" }).click();
  }
  const share = page.getByRole("button", { name: "Sonucumu Paylaş" });
  await share.click();
  await expect(share).toBeEnabled();
  expect(await page.evaluate(() => sessionStorage.getItem("clipboard"))).toBeNull();
  await page.evaluate(() => sessionStorage.setItem("share-mode", "success"));
  await share.click();
  await expect(page.getByText("Paylaşım tamamlandı.")).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("native-share"))).toContain("Zor · Standart Tur · Yarışma Modu");
  await page.evaluate(() => sessionStorage.setItem("share-mode", "error"));
  await share.click();
  await expect(page.getByText("Sonucun panoya kopyalandı!")).toBeVisible();
});

test("dar ekran, büyük ekran ve azaltılmış hareket", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Bilgini Test Et" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`categories-${width}.png`), fullPage: true });
    await page.getByTestId("category-mixed").click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`levels-${width}.png`), fullPage: true });
    await page.getByTestId("level-hard").click();
    await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`question-${width}.png`), fullPage: true });
  }
});

test("konu turu, paylaşım, tekrar ve ayrı rekor", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text: string) => sessionStorage.setItem("category-share", text) },
      configurable: true,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Bilgini Test Et" }).click();
  await page.getByTestId("category-arts_culture").click();
  await page.getByTestId("level-hard").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const text = await page.locator("main h1").innerText();
    const q = questions.find((item) => item.question === text)!;
    expect(q).toBeDefined();
    expect(matchesCategory(q.category, "arts_culture")).toBe(true);
    expect(["hard", "expert"]).toContain(q.difficulty);
    expect(seen.has(q.id)).toBe(false);
    seen.add(q.id);
    await page.getByRole("button", { name: q.choices.find((choice) => choice.id === q.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru" }).click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText("10");
  await expect(page.getByText("Tüm soruları doğru cevapladın!")).toBeVisible();
  await expect(page.getByRole("button", { name: "Yanlışlarımı Çalış" })).toHaveCount(0);
  await page.getByRole("button", { name: "Sonucumu Paylaş" }).click();
  expect(await page.evaluate(() => sessionStorage.getItem("category-share"))).toContain("Sanat ve Kültür · Zor · Standart Tur · Yarışma Modu");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ynby:high-scores:v1:arts_culture") ?? "{}").hard)).toBeGreaterThan(0);
  expect(await page.evaluate(() => localStorage.getItem("ynby:high-scores:v1"))).toBeNull();
  await page.getByRole("button", { name: "Yeni Tura Başla" }).click();
  await expect(page.locator(".quiz-category")).toContainText("Sanat ve Kültür · Standart Tur");
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await page.getByRole("button", { name: "Yarışmadan çık", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Yarışmadan Çık" }).click();
  await page.getByRole("button", { name: "Kategoriler" }).click();
  await page.getByTestId("category-mixed").click();
  await expect(page.getByTestId("level-hard")).toContainText(`${questions.filter(q => q.difficulty === "hard" || q.difficulty === "expert").length} soru`);
});
