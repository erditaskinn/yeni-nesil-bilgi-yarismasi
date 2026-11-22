import { copyFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { questions } from "../../src/data/questions";
import { STATISTICS_KEY } from "../../src/lib/statistics";

const picked = ["space", "science_nature", "history"].flatMap(category => questions.filter(question => question.category === category).slice(0, 5));
const games = [0, 1, 2].map((index) => ({
  id: `00000000-0000-4000-8000-00000000000${index}`,
  category: "mixed", categoryVersion: 2, correct: 5, total: 5, points: 0,
  mode: "standard", pace: "relaxed", completedAt: `2026-09-30T12:0${index}:00.000Z`,
  answers: picked.slice(index * 5, index * 5 + 5).map(question => ({ questionId: question.id, correct: true })),
}));

test("knowledge profile is private by default and renders bilingual, responsive radar and both PNG sizes", async ({ page }, info) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  await expect(page.getByText("Bilgi Profilin oluşuyor")).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), STATISTICS_KEY)).toBeNull();

  await page.evaluate(({ key, records }) => localStorage.setItem(key, JSON.stringify({ enabled: true, games: records })), { key: STATISTICS_KEY, records: games });
  await page.reload();
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Bilgi DNA'm" })).toBeVisible();
  await expect(page.locator(".profile-radar")).toBeVisible();
  await expect(page.locator(".profile-category")).toHaveCount(11);
  const radarDescription = await page.locator(".profile-radar").getAttribute("aria-label");
  for (const topic of ["Uzay %100", "Bilim ve Doğa %100", "Tarih %100"]) expect(radarDescription).toContain(topic);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath("knowledge-profile-light.png"), fullPage: true });
  for (const [format, width, height] of [["Story", 1080, 1920], ["Kare Gönderi", 1080, 1080]] as const) {
    await page.getByRole("button", { name: format, exact: true }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Görseli İndir" }).click();
    const download = await downloadPromise;
    const png = await readFile(await download.path());
    await copyFile(await download.path(), info.outputPath(`knowledge-dna-${format === "Story" ? "story" : "square"}.png`));
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([width, height]);
  }
  await page.evaluate(() => { Object.defineProperty(navigator, "share", { configurable: true, value: undefined }); });
  const fallback = page.waitForEvent("download");
  await page.getByRole("button", { name: "Bilgi DNA'mı Paylaş" }).click();
  expect((await fallback).suggestedFilename()).toBe("bilgi-dna-square.png");
  await page.setViewportSize({ width: 320, height: 780 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Karanlık moda geç" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("knowledge-profile-dark-mobile.png"), fullPage: true });
  await page.goto("/en");
  await page.getByRole("button", { name: "My Statistics", exact: true }).click();
  await expect(page.getByRole("heading", { name: "My Knowledge DNA" })).toBeVisible();
  await expect(page.locator(".profile-category")).toHaveCount(11);
});

test("native Knowledge DNA sharing writes a cache PNG, opens the share bridge and cleans up", async ({ page }) => {
  test.setTimeout(60_000);
  await page.addInitScript(({ key, records }) => {
    localStorage.setItem(key, JSON.stringify({ enabled: true, games: records }));
    const calls: { plugin: string; method: string; options: Record<string, unknown> }[] = [];
    const globals = window as typeof window & { androidBridge: object; Capacitor: object; nativeShareCalls: typeof calls };
    globals.androidBridge = {};
    globals.Capacitor = {
      PluginHeaders: [
        { name: "Filesystem", methods: [{ name: "writeFile", rtype: "promise" }, { name: "getUri", rtype: "promise" }, { name: "deleteFile", rtype: "promise" }] },
        { name: "Share", methods: [{ name: "share", rtype: "promise" }] },
      ],
      nativePromise: async (plugin: string, method: string, options: Record<string, unknown> = {}) => {
        calls.push({ plugin, method, options: { ...options, data: options.data ? "[PNG]" : undefined } });
        if (plugin === "Filesystem" && method === "getUri") return { uri: "file:///cache/knowledge-dna.png" };
        return {};
      },
    };
    globals.nativeShareCalls = calls;
  }, { key: STATISTICS_KEY, records: games });
  await page.goto("/");
  await page.getByRole("button", { name: "İstatistiklerim", exact: true }).click();
  await page.getByRole("button", { name: "Bilgi DNA'mı Paylaş" }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { nativeShareCalls: { plugin: string; method: string }[] }).nativeShareCalls.filter(call => ["Filesystem", "Share"].includes(call.plugin)).map(call => call.method))).toEqual(["writeFile", "getUri", "share", "deleteFile"]);
  const calls = (await page.evaluate(() => (window as typeof window & { nativeShareCalls: { plugin: string; method: string; options: Record<string, unknown> }[] }).nativeShareCalls)).filter(call => ["Filesystem", "Share"].includes(call.plugin));
  expect(calls[2]?.plugin).toBe("Share");
  expect(calls[2]?.options.files).toEqual(["file:///cache/knowledge-dna.png"]);
  expect(calls[0]?.options.directory).toBe("CACHE");
});
