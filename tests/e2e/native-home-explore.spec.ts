import { expect, test } from "@playwright/test";

test("Android home and Explore remain usable on a narrow phone", async ({ page }, testInfo) => {
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
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Merhaba,/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bilgini Test Et" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Arkadaşlarla yarış" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Başla" })).toBeVisible();
  await expect(page.locator(".native-game-mascot")).toHaveJSProperty("complete", true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("native-home.png") });
  await page.setViewportSize({ width: 320, height: 690 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("native-home-small.png") });
  await page.setViewportSize({ width: 360, height: 780 });

  await page.getByRole("button", { name: "Keşfet", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Bugün neyi keşfedelim?" })).toBeVisible();
  await expect(page.locator(".native-game-category")).toHaveCount(11);
  await page.screenshot({ path: testInfo.outputPath("native-explore.png"), fullPage: true });
  await page.getByRole("searchbox", { name: "Kategori ara" }).fill("uzay");
  await expect(page.locator(".native-game-category")).toHaveCount(1);
  await expect(page.getByTestId("category-space")).toBeVisible();
  await page.getByRole("searchbox", { name: "Kategori ara" }).fill("");
  await page.getByLabel("Konu filtresi").selectOption("science");
  await expect(page.locator(".native-game-category")).toHaveCount(3);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByTestId("category-science_nature").click();
  await expect(page.getByTestId("level-easy")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("native-levels.png") });
  await page.getByTestId("level-easy").click();
  await expect(page.getByTestId("round-standard")).toBeVisible();
  await page.getByTestId("round-standard").click();
  await page.getByTestId("pace-competition").click();
  await page.screenshot({ path: testInfo.outputPath("native-rounds.png") });
  await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await page.screenshot({ path: testInfo.outputPath("native-question.png") });
  await page.setViewportSize({ width: 320, height: 690 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 360, height: 780 });
  for (let n = 1; n <= 10; n++) {
    await page.locator(".choice").first().click();
    if (n === 1) await page.screenshot({ path: testInfo.outputPath("native-feedback.png") });
    await page.getByRole("button", { name: n === 10 ? "Sonucumu Gör" : "Sonraki Soru", exact: true }).click();
  }
  await expect(page.getByTestId("total-score")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("native-results.png") });
  await page.setViewportSize({ width: 320, height: 690 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 360, height: 780 });
  await page.getByRole("button", { name: "Ana sayfaya dön" }).click();
  await page.getByRole("button", { name: "Arkadaşlarla yarış" }).click();
  await expect(page.getByRole("heading", { name: "Arkadaşlarla Yarış" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("native-multiplayer.png") });
  await page.getByRole("button", { name: "Gelişim", exact: true }).click();
  await expect(page.locator(".statistics-page")).toBeVisible();
  await expect(page.getByText("Veriler nasıl tutulur?")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("native-progress.png") });
  await page.getByRole("button", { name: "Profil", exact: true }).click();
  await expect(page.locator(".account-page")).toBeVisible();
  await expect(page.locator(".native-game-legal .account-links a")).toHaveCount(2);
  await page.screenshot({ path: testInfo.outputPath("native-profile.png") });
});
