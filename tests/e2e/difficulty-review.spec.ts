import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { questions } from "../../src/data/questions";
import { englishQuestions } from "../../src/data/questions-en";
import { TURKISH_DIFFICULTIES } from "../../src/lib/config";
import { GAME_CATEGORIES, matchesCategory } from "../../src/lib/categories";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1"));
});

for (const locale of ["tr", "en"] as const) {
  for (const category of GAME_CATEGORIES.filter(value => value !== "mixed" && value !== "technology" && value !== "cinema_television")) {
    test(`${locale}/${category}: available levels keep the selected category`, async ({ page }, info) => {
      test.setTimeout(90_000);
      const pool = locale === "en" ? englishQuestions : questions;
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.clock.setFixedTime(new Date("2026-09-29T09:00:00Z"));
      for (const level of TURKISH_DIFFICULTIES) {
        const available = pool.filter(q => (q.difficulty === level || level === "hard" && q.difficulty === "expert") && matchesCategory(q.category, category));
        if (!available.length) continue;
        await page.goto(locale === "en" ? "/en" : "/");
        await page.getByRole("button", { name: locale === "en" ? "Test Your Knowledge" : "Bilgini Test Et", exact: true }).click();
        await page.getByTestId(`category-${category}`).click();
        await page.getByTestId(`level-${level}`).click();
        await page.getByTestId("round-short").click();
        await page.getByTestId("pace-relaxed").click();
        await page.getByTestId("start-round").click();
        const text = await page.locator("main h1").innerText();
        const question = pool.find(q => q.question === text);
        expect(question).toBeDefined();
        expect(level === "hard" ? ["hard", "expert"] : [level]).toContain(question!.difficulty);
        expect(matchesCategory(question!.category, category)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.getByRole("button", { name: question!.choices.find(choice => choice.id === question!.correctAnswer)!.text, exact: true }).click();
        await expect(page.locator("main")).toContainText(question!.explanation);
        if (level === TURKISH_DIFFICULTIES[0]) {
          expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
          await page.screenshot({ path: info.outputPath(`${locale}-${category}-${level}.png`), fullPage: true });
        }
      }
      expect(errors).toEqual([]);
    });
  }
}
