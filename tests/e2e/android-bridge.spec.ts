import { test, expect } from "@playwright/test";

test("Android bridge: back confirmation, resume deadline, theme and share cancellation", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.clock.setFixedTime(new Date("2026-09-29T09:00:00Z"));
  await page.addInitScript(() => {
    const listeners = new Map<string, Map<string, () => void>>();
    let nextId = 0;
    const calls: { plugin: string; method: string; options: Record<string, unknown> }[] = [];
    const copied: string[] = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { copied.push(text); } } });
    const globals = window as typeof window & {
      androidBridge: object;
      Capacitor: object;
      nativeTest: { emit: (event: string) => void; calls: typeof calls; copied: string[] };
    };
    globals.androidBridge = {};
    globals.Capacitor = {
      PluginHeaders: [
        { name: "App", methods: [{ name: "addListener", rtype: "callback" }, { name: "removeListener", rtype: "promise" }, { name: "minimizeApp", rtype: "promise" }] },
        { name: "SystemBars", methods: [{ name: "setStyle", rtype: "promise" }] },
        { name: "Share", methods: [{ name: "share", rtype: "promise" }] },
      ],
      nativePromise: async (plugin: string, method: string, options: Record<string, unknown> = {}) => {
        calls.push({ plugin, method, options });
        if (method === "removeListener") listeners.get(String(options.eventName))?.delete(String(options.callbackId));
        if (plugin === "Share") throw new Error("Share canceled");
        return {};
      },
      nativeCallback: async (_plugin: string, _method: string, options: { eventName: string }, callback: () => void) => {
        const id = String(nextId++);
        if (!listeners.has(options.eventName)) listeners.set(options.eventName, new Map());
        listeners.get(options.eventName)!.set(id, callback);
        return id;
      },
    };
    globals.nativeTest = { calls, copied, emit: event => { for (const callback of listeners.get(event)?.values() ?? []) callback(); } };
  });
  const emit = (event: string) => page.evaluate(name => {
    (window as typeof window & { nativeTest: { emit: (name: string) => void } }).nativeTest.emit(name);
  }, event);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Karanlık moda geç" }).click();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { nativeTest: { calls: { plugin: string; options: { style?: string } }[] } }).nativeTest.calls.some(c => c.plugin === "SystemBars" && c.options.style === "DARK"))).toBe(true);
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await emit("backButton");
  await expect(page.getByRole("button", { name: "Bilgini Test Et", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-science_nature").click();
  await emit("backButton");
  await expect(page.getByTestId("category-science_nature")).toBeVisible();
  await page.getByTestId("category-science_nature").click();
  await page.getByTestId("level-easy").click();
  await expect(page.locator("main h1")).toHaveText("Turunu seç");
  await emit("backButton");
  await expect(page.getByTestId("level-easy")).toBeVisible();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await emit("backButton");
  await expect(page.getByRole("dialog")).toBeVisible();
  await emit("backButton");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.clock.setFixedTime(new Date(await page.evaluate(() => Date.now()) + 30_000));
  await emit("resume");
  await expect(page.locator(".choice:disabled")).toHaveCount(4);
  for (let n = 1; n <= 10; n++) {
    if (n > 1) await page.locator(".choice").first().click();
    await page.getByRole("button", { name: n === 10 ? "Sonucumu Gör" : "Sonraki Soru", exact: true }).click();
  }
  await page.getByRole("button", { name: "Sonucumu Paylaş" }).click();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { nativeTest: { calls: { plugin: string }[] } }).nativeTest.calls.some(c => c.plugin === "Share"))).toBe(true);
  await expect(page.getByRole("button", { name: "Sonucumu Paylaş" })).toBeEnabled();
  expect(await page.evaluate(() => (window as typeof window & { nativeTest: { copied: string[] } }).nativeTest.copied)).toEqual([]);
  await emit("backButton");
  await expect(page.getByRole("button", { name: "Bilgini Test Et", exact: true })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
    window.dispatchEvent(new Event("offline"));
  });
  await expect(page.getByRole("status").filter({ hasText: "Çevrimdışısın." })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
    window.dispatchEvent(new Event("online"));
  });
  await expect(page.getByRole("status").filter({ hasText: "Çevrimdışısın." })).toHaveCount(0);
  expect(errors).toEqual([]);
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-science_nature").click();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-endless").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await emit("backButton");
  await expect(page.getByRole("dialog")).toBeVisible();
  await emit("backButton");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await emit("backButton");
  await page.getByRole("dialog").getByRole("button", { name: "Yarışmadan Çık", exact: true }).click();
  await expect(page.getByTestId("end-reason")).toHaveText("Turdan çıktın.");
  await emit("backButton");
  await expect(page.getByRole("button", { name: "Bilgini Test Et", exact: true })).toBeVisible();
});

