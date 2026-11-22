import { expect, test } from "@playwright/test";

test("analytics loads only with explicit consent and can be revoked", async ({ page }) => {
  const googleRequests: string[] = [];
  await page.route(/googletagmanager\.com|google-analytics\.com/, async (route) => {
    googleRequests.push(route.request().url());
    await route.fulfill({ status: 200, body: "", contentType: "text/javascript" });
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "İzin ver" })).toBeVisible();
  expect(googleRequests).toEqual([]);

  await page.getByRole("button", { name: "Reddet" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Çerez tercihleri" })).toBeVisible();
  expect(googleRequests).toEqual([]);

  await page.getByRole("button", { name: "Çerez tercihleri" }).click();
  await page.getByRole("button", { name: "İzin ver" }).click();
  await expect.poll(() => googleRequests.some((url) => url.includes("gtag/js?id=G-LTDYMQSESE"))).toBe(true);
  expect(await page.evaluate(() => window.dataLayer?.some((item) => Object.prototype.toString.call(item) === "[object Arguments]"))).toBe(true);

  await page.getByRole("button", { name: "Çerez tercihleri" }).click();
  await page.getByRole("button", { name: "Reddet" }).click();
  await expect(page.locator("#ynby-analytics-script")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("ynby:analytics-consent:v1"))).toBe("rejected");
});
