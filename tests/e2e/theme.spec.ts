import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import AxeBuilder from "@axe-core/playwright";
import { englishQuestions } from "../../src/data/questions-en";

async function inspect(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => {
    const header = document.querySelector('.site-header')?.getBoundingClientRect();
    if (!header) return true;
    return [...document.querySelectorAll('.site-header button, .site-header a, .header-note')].every(element => {
      const box = element.getBoundingClientRect();
      return !box.width || (box.top >= header.top && box.bottom <= header.bottom + 1);
    });
  })).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
}
test("first visit is light even on a dark device; explicit choices persist across routes", async ({ page }, info) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await inspect(page);
  await page.screenshot({ path: info.outputPath("light-first-visit.png"), fullPage: true });
  await page.getByRole("button", { name: "Karanlık moda geç" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await inspect(page);
  await page.screenshot({ path: info.outputPath("dark-home.png"), fullPage: true });
  await page.getByRole("button", { name: "Açık moda geç" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Karanlık moda geç" }).click();
  for (const route of ["/en", "/en/very-hard-trivia-quiz", "/en/space-trivia-quiz", "/en/404", "/not-a-real-page"]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await inspect(page);
  }
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/en");
  await inspect(page);
  await page.screenshot({ path: info.outputPath("dark-320.png"), fullPage: true });
  await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});
test("dark theme covers quiz feedback, results, review, practice and statistics", async ({ page }, info) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.getByRole("button", { name: "Test Your Knowledge", exact: true }).click();
  await inspect(page);
  await page.getByTestId("category-mixed").click();
  await inspect(page);
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  for (let i = 0; i < 10; i++) {
    await expect(page.getByTestId("question-number")).toHaveText(String(i + 1).padStart(2, "0"));
    if (i === 0) await inspect(page);
    const text = await page.locator("main h1").innerText();
    const q = englishQuestions.find(q => q.question === text)!;
    await page.getByRole("button", { name: q.choices.find(c => i % 2 ? c.id === q.correctAnswer : c.id !== q.correctAnswer)!.text, exact: true }).click();
    if (i < 2) { await inspect(page); await page.screenshot({ path: info.outputPath(`dark-feedback-${i}.png`), fullPage: true }); }
    await page.getByRole("button", { name: i === 9 ? "See My Result" : "Next Question", exact: true }).click();
  }
  await inspect(page);
  await page.screenshot({ path: info.outputPath("dark-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Review My Mistakes", exact: true }).click();
  await inspect(page);
  await page.getByRole("button", { name: "Practice My Mistakes", exact: true }).click();
  await inspect(page);
  await page.goto("/en");
  await page.getByRole("button", { name: "My Statistics", exact: true }).click();
  await inspect(page);
});
test("system changes do not override light default; cross-tab explicit choices synchronize", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const other = await context.newPage();
  await other.goto("/en");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(other.locator("html")).toHaveAttribute("data-theme", "dark");
  await other.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("theme switching preserves an active question and styles exit and timeout states", async ({ page }, info) => {
  await page.clock.install();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en?seviye=expert");
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  const question = await page.locator("main h1").innerText();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("main h1")).toHaveText(question);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("main h1")).toHaveText(question);
  await page.getByRole("button", { name: "Exit quiz", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await inspect(page);
  await page.screenshot({ path: info.outputPath("dark-dialog.png") });
  await page.getByRole("button", { name: "Return to Quiz", exact: true }).click();
  await page.clock.runFor(20_001);
  await expect(page.locator(".choice:disabled")).toHaveCount(4);
  await inspect(page);
  await page.screenshot({ path: info.outputPath("dark-timeout.png"), fullPage: true });
});
