import { test, expect } from "@playwright/test";

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
  await page.getByRole("button", { name: "Hemen Oyna" }).click();
  await page.getByTestId("level-hard").click();
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
  expect(await page.evaluate(() => sessionStorage.getItem("native-share"))).toContain("Zor seviyede");
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
    await page.getByRole("button", { name: "Hemen Oyna" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`levels-${width}.png`), fullPage: true });
    await page.getByTestId("level-expert").click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`question-${width}.png`), fullPage: true });
  }
});
