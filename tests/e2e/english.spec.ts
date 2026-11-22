import { test, expect, type Page } from "@playwright/test";

// Legacy navigation tests deliberately start fresh; reload recovery is tested in rounds.spec.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import AxeBuilder from "@axe-core/playwright";
import { englishQuestions } from "../../src/data/questions-en";
import { ENGLISH_LEVEL_PAGES, ENGLISH_CATEGORY_PAGES } from "../../src/lib/english-pages";
import { selectDailyQuestions } from "../../src/lib/daily";
import { questions } from "../../src/data/questions";
async function inspect(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.evaluate(() => {
    const strip = document.querySelector(".hero-bottom")?.getBoundingClientRect();
    if (!strip) return false;
    return [...document.querySelectorAll(".hero-art .art-tile")].some(tile => {
      const bounds = tile.getBoundingClientRect();
      return bounds.left < strip.right && bounds.right > strip.left && bounds.top < strip.bottom && bounds.bottom > strip.top;
    });
  })).toBe(false);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
}
test("English complete quiz, sharing, mistakes, practice and replay", async ({ page }, info) => {
  test.setTimeout(100_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.clock.setFixedTime(new Date("2026-09-28T09:00:00Z"));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { sessionStorage.setItem("english-share", text); } }, configurable: true });
  });
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Next Gen Trivia Quiz/);
  await expect(page.locator(".hero-visual img")).toBeVisible();
  await inspect(page);
  await page.screenshot({ path: info.outputPath("english-home.png"), fullPage: true });
  await page.getByRole("button", { name: "Test Your Knowledge", exact: true }).click();
  await inspect(page);
  await expect(page.getByRole("searchbox", { name: "Search topics..." })).toBeVisible();
  await page.getByTestId("category-mixed").click();
  await inspect(page);
  await expect(page.locator(".level-card")).toHaveCount(3);
  await expect(page.getByTestId("level-expert")).toHaveCount(0);
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    await expect(page.getByTestId("question-number")).toHaveText(String(i + 1).padStart(2, "0"));
    const text = await page.locator("main h1").innerText();
    const q = englishQuestions.find(q => q.question === text)!;
    expect(q).toBeDefined();
    expect(q.difficulty).toBe("easy");
    expect(seen.has(q.id)).toBe(false);
    seen.add(q.id);
    const answer = q.choices.find(c => i < 7 ? c.id === q.correctAnswer : c.id !== q.correctAnswer)!;
    await page.getByRole("button", { name: answer.text, exact: true }).click();
    await expect(page.locator(".choice:disabled")).toHaveCount(4);
    await expect(page.getByText("Correct answer:", { exact: false }).first()).toBeVisible();
    if (i === 0) { await inspect(page); await page.screenshot({ path: info.outputPath("english-feedback.png"), fullPage: true }); }
    await page.getByRole("button", { name: i === 9 ? "See My Result" : "Next Question", exact: true }).click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText("7");
  await expect(page.getByTestId("result-wrong")).toHaveText("3");
  await expect(page.getByTestId("result-percentage")).toHaveText("70%");
  await expect(page.getByTestId("total-score")).toHaveText("1,400");
  await inspect(page);
  await page.screenshot({ path: info.outputPath("english-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Share My Result", exact: true }).click();
  expect(await page.evaluate(() => sessionStorage.getItem("english-share"))).toMatch(/Next Gen Trivia Quiz.*Challenge Mode: 7\/10 correct.*\/en$/);
  await page.getByRole("button", { name: "Review My Mistakes", exact: true }).click();
  await expect(page.locator(".review-list > li")).toHaveCount(3);
  await inspect(page);
  await page.getByRole("button", { name: "Practice My Mistakes", exact: true }).click();
  for (let i = 0; i < 3; i++) {
    const text = await page.locator("main h1").innerText();
    const q = englishQuestions.find(q => q.question === text)!;
    await page.getByRole("button", { name: q.choices.find(c => c.id === q.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: i === 2 ? "Finish Practice" : "Next Question", exact: true }).click();
  }
  await expect(page.getByRole("heading", { name: "A great way to review!" })).toBeVisible();
  await page.getByRole("button", { name: "Back to My Results", exact: true }).click();
  await expect(page.getByTestId("total-score")).toHaveText("1,400");
  await page.getByRole("button", { name: "Start Another Round", exact: true }).click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await expect(page.getByTestId("live-score")).toHaveText("0 points");
  expect(errors).toEqual([]);
});
test("English routes have server-rendered language, canonical, reciprocal hreflang and English samples", async ({ page, request }) => {
  for (const slug of [...Object.values(ENGLISH_LEVEL_PAGES), ...Object.values(ENGLISH_CATEGORY_PAGES)].map(p => p.slug)) {
    const response = await request.get(`/en/${slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(/<html[^>]*lang="en"/);
    expect(html).toContain(`rel="canonical" href="https://yeninesilbilgiyarismasi.com/en/${slug === ENGLISH_LEVEL_PAGES.expert.slug ? ENGLISH_LEVEL_PAGES.hard.slug : slug}"`);
    expect(html).toContain('hrefLang="tr"');
    expect(html).toContain('hrefLang="en"');
  }
  await page.goto("/en/space-trivia-quiz");
  await expect(page.locator("main h1")).toHaveText("Space Trivia Quiz");
  await inspect(page);
  await page.locator("details summary").first().click();
  await expect(page.locator("details[open]")).toContainText("Mars");
  await page.getByRole("link", { name: "Türkçe", exact: true }).click();
  await expect(page).toHaveURL(/\/uzay-bilgi-yarismasi$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/space-trivia-quiz$/);
  await page.getByRole("link", { name: /^Hard Trust your knowledge/ }).click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  const text = await page.locator("main h1").innerText();
  expect(["hard", "expert"]).toContain(englishQuestions.find(q => q.question === text)?.difficulty);
});
test("English daily quiz matches Turkish question IDs and English timeout feedback", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-09-28T09:00:00Z") });
  await page.goto("/en?mod=gunluk");
  await expect(page.getByTestId("question-number")).toHaveText("01");
  const text = await page.locator("main h1").innerText();
  const q = englishQuestions.find(q => q.question === text)!;
  expect(q.id).toBe(selectDailyQuestions(questions, "2026-09-28")[0]!.id);
  await page.clock.fastForward(21_000);
  await expect(page.getByText("Time's up. Here's something to learn!")).toBeVisible();
  await expect(page.getByTestId("live-score")).toHaveText("0 points");
  await expect(page.locator(".choice:disabled")).toHaveCount(4);
  await inspect(page);
});
test("English error page and 320px layout", async ({ page }) => {
  await page.goto("/en/404");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "The answer is somewhere else." })).toBeVisible();
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 780 });
  await inspect(page);
  await page.getByRole("button", { name: "Test Your Knowledge", exact: true }).click();
  await inspect(page);
  await page.getByTestId("category-history").click();
  await inspect(page);
});
test("English statistics controls and records shared with Turkish", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "My Statistics", exact: true }).click();
  const consent = page.getByRole("checkbox", { name: "Keep my statistics on this device" });
  await expect(consent).not.toBeChecked();
  await consent.check();
  await expect(page.getByText("Your results will appear here after you complete your first round.")).toBeVisible();
  await page.evaluate(() => localStorage.setItem("ynby:statistics:v1", JSON.stringify({ enabled: true, games: [{ id: "english-test", category: "space", correct: 8, total: 10, points: 1500 }] })));
  await page.reload();
  await page.getByRole("button", { name: "My Statistics", exact: true }).click();
  await expect(page.locator(".result-stats").first()).toContainText("8 / 10");
  await expect(page.locator(".result-stats").first()).toContainText("80%");
  await expect(page.getByRole("row", { name: "Space 1 80%" })).toBeVisible();
  await inspect(page);
  await page.getByRole("link", { name: "Türkçe", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  await expect(page.locator(".result-stats").first()).toContainText("8 / 10");
  await expect(page.locator(".result-stats").first()).toContainText("%80");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "My Statistics", exact: true }).click();
  await page.getByRole("button", { name: "Delete Records", exact: true }).click();
  await expect(page.getByText("Your statistics were deleted.")).toBeVisible();
  await expect(page.locator(".result-stats").first()).toContainText("0 / 0");
});
test("Android English uses the native home, Explore, three levels and quiz", async ({ page }, info) => {
  await page.addInitScript(() => {
    const globals = window as typeof window & { androidBridge: object; Capacitor: object };
    globals.androidBridge = {};
    globals.Capacitor = {
      PluginHeaders: [
        { name: "SystemBars", methods: [{ name: "setStyle", rtype: "promise" }] },
        { name: "App", methods: [{ name: "addListener", rtype: "callback" }, { name: "removeListener", rtype: "promise" }, { name: "getLaunchUrl", rtype: "promise" }] },
      ],
      nativePromise: async () => ({}),
      nativeCallback: async () => "1",
    };
  });
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/en");
  await expect(page.locator(".native-game-home")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hello, Player" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Test Your Knowledge" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Friends Quiz (Turkish)" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("english-native-home.png") });
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await expect(page.getByRole("heading", { name: "What will we explore today?" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search topics..." }).fill("space");
  await expect(page.getByTestId("category-space")).toBeVisible();
  await page.getByTestId("category-space").click();
  await expect(page.locator(".level-card")).toHaveCount(3);
  await page.getByTestId("level-hard").click();
  await page.getByTestId("round-short").click();
  await page.getByTestId("pace-relaxed").click();
  await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
