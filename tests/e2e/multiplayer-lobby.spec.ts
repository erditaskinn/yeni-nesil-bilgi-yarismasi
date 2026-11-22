import { test, expect } from "@playwright/test";

test("multiplayer entry is absent from the website", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Oda Kur veya Katıl" })).toHaveCount(0);
});

test("Android entry opens the room form and validates a code locally", async ({ page }) => {
  await page.addInitScript(() => {
    const nativeWindow = window as typeof window & { androidBridge: object; Capacitor: object };
    nativeWindow.androidBridge = {};
    nativeWindow.Capacitor = { PluginHeaders: [], nativePromise: async () => ({}), nativeCallback: async () => "0" };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Oda Kur veya Katıl" }).click();
  await expect(page.getByRole("heading", { name: "Arkadaşlarla Yarış" })).toBeVisible();
  await page.getByRole("button", { name: "Kodla Katıl" }).click();
  await expect(page.locator(".multiplayer-error")).toContainText("Takma ad");
  await page.getByLabel("Takma adın").fill("Deneme");
  await page.getByRole("button", { name: "Kodla Katıl" }).click();
  await expect(page.locator(".multiplayer-error")).toContainText("Altı karakterli oda kodunu gir");
});

test("unfinished English native UI does not expose the Turkish lobby", async ({ page }) => {
  await page.addInitScript(() => {
    const nativeWindow = window as typeof window & { androidBridge: object; Capacitor: object };
    nativeWindow.androidBridge = {};
    nativeWindow.Capacitor = { PluginHeaders: [], nativePromise: async () => ({}), nativeCallback: async () => "0" };
  });
  await page.goto("/en");
  await expect(page.getByRole("button", { name: "Oda Kur veya Katıl" })).toHaveCount(0);
});
