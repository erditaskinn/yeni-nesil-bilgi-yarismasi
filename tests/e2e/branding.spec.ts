import { test, expect } from "@playwright/test";

// Legacy navigation tests deliberately start fresh; reload recovery is tested in rounds.spec.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import AxeBuilder from "@axe-core/playwright";

test("brand logo and palette remain accessible across both languages", async ({ page }, info) => {
  test.setTimeout(90_000);
  for (const path of ["/", "/en"]) {
    await page.goto(path);
    const logo = page.locator(".brand-logo");
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 900)).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--ink").trim())).toBe("#17133f");
    await page.screenshot({ path: info.outputPath(path === "/" ? "home-tr.png" : "home-en.png"), fullPage: true });
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: path === "/" ? "Bilgini Test Et" : "Test Your Knowledge", exact: true }).click();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.getByTestId("category-mixed").click();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.getByTestId("level-easy").click();
    await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
    await expect(page.getByTestId("question-number")).toHaveText("01");
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/en");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("home-320.png"), fullPage: true });
});
