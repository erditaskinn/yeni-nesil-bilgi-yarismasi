import { test, expect } from "@playwright/test";

test("contact link is localized, accessible and responsive", async ({ page }) => {
  for (const [path, label] of [["/", "İletişim"], ["/en", "Contact"], ["/kolay-bilgi-yarismasi", "İletişim"], ["/en/space-trivia-quiz", "Contact"]] as const) {
    await page.goto(path);
    const link = page.getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", "mailto:info@yeninesilbilgiyarismasi.com");
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await link.focus();
    await expect(link).toBeFocused();
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
