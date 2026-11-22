import { test, expect, type Page } from "@playwright/test";

// Legacy navigation tests deliberately start fresh; reload recovery is tested in rounds.spec.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import AxeBuilder from "@axe-core/playwright";
import { questions } from "../../src/data/questions";
import { matchesCategory } from "../../src/lib/categories";

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
async function accessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
}

test("seviye ve tur kartları farklı ekranlarda okunabilir bir listede kalır", async ({ page }, testInfo) => {
  for (const width of [320, 900]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Bilgini Test Et" }).click();
    await page.getByTestId("category-mixed").click();

    for (const screen of ["level-selection-page", "round-selection-page"]) {
      const cards = page.locator(`.${screen} .level-card`);
      await expect(cards.first()).toBeVisible();
      const layout = await cards.evaluateAll((nodes) => nodes.map((node) => {
        const card = node.getBoundingClientRect();
        const copy = node.querySelector(".selection-copy")!.getBoundingClientRect();
        const bottom = node.querySelector(".level-bottom")!.getBoundingClientRect();
        return { left: card.left, right: card.right, top: card.top, bottom: card.bottom, copyWidth: copy.width, copyRight: copy.right, footerRight: bottom.right };
      }));
      expect(layout.length).toBeGreaterThan(2);
      expect(layout.every((card, index) => card.copyWidth >= 150 && card.copyRight <= card.right + 1 && card.footerRight <= card.right + 1 && (index === 0 || card.top >= layout[index - 1]!.bottom + 4))).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${screen}-${width}.png`), fullPage: true });
      if (screen === "level-selection-page") await page.getByTestId("level-easy").click();
    }
  }
});

async function start(page: Page, difficulty = "easy") {
  await page.goto("/");
  await page.getByRole("button", { name: "Bilgini Test Et" }).click();
  await page.getByTestId("category-mixed").click();
  await page.getByTestId(`level-${difficulty}`).click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
}

test("ana sayfa, seviyeler, tam yarışma, sonuç, paylaşım ve yeni tur", async ({
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.clock.setFixedTime(new Date("2026-09-27T12:00:01Z"));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          sessionStorage.setItem("shared", text);
        },
      },
      configurable: true,
    });
  });
  await page.goto("/");
  await expect(page).toHaveTitle(/Yeni Nesil Bilgi Yarışması/);
  await noOverflow(page);
  await accessible(page);
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Bilgini Test Et" }).click();
  await accessible(page);
  await noOverflow(page);
  await expect(page.getByTestId("category-mixed")).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("categories.png"),
    fullPage: true,
  });
  await page.getByTestId("category-mixed").click();
  await accessible(page);
  await noOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("levels.png"),
    fullPage: true,
  });
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const text = await page.locator("main h1").innerText();
    const q = questions.find((q) => q.question === text)!;
    expect(q).toBeDefined();
    expect(q.difficulty).toBe("easy");
    expect(seen.has(q.id)).toBe(false);
    seen.add(q.id);
    await expect(page.getByTestId("question-number")).toHaveText(
      String(i + 1).padStart(2, "0"),
    );
    if (i === 0) {
      await accessible(page);
      await noOverflow(page);
      await page.screenshot({
        path: testInfo.outputPath("question.png"),
        fullPage: true,
      });
    }
    const choice =
      i < 7
        ? q.choices.find((c) => c.id === q.correctAnswer)!
        : q.choices.find((c) => c.id !== q.correctAnswer)!;
    await page.getByRole("button", { name: choice.text, exact: true }).click();
    await expect(page.locator(".choice:disabled")).toHaveCount(4);
    await expect(
      page.getByText("Doğru cevap:", { exact: false }).first(),
    ).toBeVisible();
    if (i === 0) {
      await accessible(page);
      await noOverflow(page);
      await page.screenshot({
        path: testInfo.outputPath("feedback.png"),
        fullPage: true,
      });
    }
    await page
      .getByRole("button", { name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru" })
      .click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText("7");
  await expect(page.getByTestId("result-wrong")).toHaveText("3");
  await expect(page.getByTestId("result-percentage")).toHaveText("%70");
  await expect(page.getByTestId("total-score")).toHaveText("1.400");
  await accessible(page);
  await noOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("results.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list > li")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Yanlışlarımı İncele" })).toBeVisible();
  await accessible(page);
  await noOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("review.png"), fullPage: true });
  await page.getByRole("button", { name: "Yanlışlarımı Çalış" }).click();
  for (let i = 0; i < 3; i++) {
    const text = await page.locator("main h1").innerText();
    const question = questions.find((item) => item.question === text)!;
    const answer = question.choices.find((choice) => choice.id === question.correctAnswer)!;
    await page.getByRole("button", { name: answer.text, exact: true }).click();
    await expect(page.locator(".choice:disabled")).toHaveCount(4);
    if (i === 0) {
      await accessible(page);
      await noOverflow(page);
      await page.screenshot({ path: testInfo.outputPath("practice.png"), fullPage: true });
    }
    await page.getByRole("button", { name: i === 2 ? "Çalışmayı Bitir" : "Sonraki Soru" }).click();
  }
  await expect(page.getByRole("heading", { name: "Güzel bir tekrar yaptın!" })).toBeVisible();
  await expect(page.getByText("3 sorudan 3 tanesini")).toBeVisible();
  await accessible(page);
  await noOverflow(page);
  await page.getByRole("button", { name: "Sonuçlarıma Dön" }).click();
  await expect(page.getByTestId("total-score")).toHaveText("1.400");
  await page.getByRole("button", { name: "Sonucumu Paylaş" }).click();
  await expect(page.getByText("Sonucun panoya kopyalandı!")).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("shared"))).toContain(
    "10 soruda 7 doğru",
  );
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("ynby:high-scores:v1") ?? "{}").easy,
    ),
  ).toBe(1400);
  await page.getByRole("button", { name: "Yeni Tura Başla" }).click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
  await expect(page.getByTestId("live-score")).toHaveText("0 puan");
  const nextHistory = await page.evaluate(() => JSON.parse(localStorage.getItem("ynby:seen-questions:v1") ?? "[]") as string[]);
  expect(nextHistory.slice(-10).every((id) => !seen.has(id))).toBe(true);
  await expect(page.locator(".choice:disabled")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Bilgini Test Et" })).toBeVisible();
  await page.getByRole("button", { name: "Bilgini Test Et" }).click();
  await page.getByTestId("category-mixed").click();
  await expect(page.getByTestId("level-easy")).toContainText("1.400");
  expect(errors).toEqual([]);
});

test("süresi dolan soru incelenir; çalışma turunda zaman aşımı ve puan yoktur", async ({ page }) => {
  await page.clock.install();
  await start(page);
  await page.clock.fastForward(21000);
  await page.getByRole("button", { name: "Sonraki Soru" }).click();
  for (let i = 1; i < 10; i++) {
    const text = await page.locator("main h1").innerText();
    const current = questions.find((item) => item.question === text)!;
    await page.getByRole("button", { name: current.choices.find((choice) => choice.id === current.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru" }).click();
  }
  const score = await page.getByTestId("total-score").innerText();
  await page.getByRole("button", { name: "Yanlışlarımı İncele" }).click();
  await expect(page.locator(".review-list > li")).toHaveCount(1);
  await expect(page.getByText("Süre doldu", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Yanlışlarımı Çalış" }).click();
  await page.clock.fastForward(60000);
  await expect(page.locator(".choice:enabled")).toHaveCount(4);
  await expect(page.getByRole("timer")).toHaveCount(0);
  await expect(page.getByTestId("live-score")).toHaveCount(0);
  await page.getByRole("button", { name: "Sonuçlarıma Dön" }).click();
  await expect(page.getByTestId("total-score")).toHaveText(score);
});

test("kategori seçimi zorluktan önce gelir ve sorular seçilen konuda kalır", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bilgini Test Et" }).click();
  await page.getByTestId("category-science_nature").click();
  await expect(page.getByText("BİLİM VE DOĞA", { exact: true })).toBeVisible();
  await page.getByTestId("level-hard").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  const firstText = await page.locator("main h1").innerText();
  const first = questions.find((q) => q.question === firstText);
  expect(first).toBeDefined();
  expect(["hard", "expert"]).toContain(first?.difficulty);
  expect(matchesCategory(first!.category, "science_nature")).toBe(true);
  await expect(page.locator(".quiz-category")).toContainText("Bilim ve Doğa · Standart Tur");
  await noOverflow(page);
  await accessible(page);
  await page.getByRole("button", { name: "Yarışmadan çık", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Yarışmadan Çık" }).click();
  await page.getByRole("button", { name: "Kategoriler" }).click();
  await page.getByTestId("category-history").click();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  const secondText = await page.locator("main h1").innerText();
  const second = questions.find((q) => q.question === secondText);
  expect(second).toBeDefined();
  expect(second?.difficulty).toBe("easy");
  expect(matchesCategory(second!.category, "history")).toBe(true);
});

test("zaman aşımı, çıkış onayı, klavye ve seviye değiştirme", async ({
  page,
}) => {
  await page.clock.install();
  await start(page, "hard");
  await page.clock.fastForward(21000);
  await expect(
    page.getByText("Süre doldu. Yeni bir bilgiye ne dersin?"),
  ).toBeVisible();
  await expect(page.getByTestId("live-score")).toHaveText("0 puan");
  await expect(page.locator(".choice:disabled")).toHaveCount(4);
  await page.getByRole("button", { name: "Sonraki Soru" }).click();
  await expect(page.getByTestId("question-number")).toHaveText("02");
  await page
    .getByRole("button", { name: "Yarışmadan çık", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await accessible(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Yarışmadan çık", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Yarışmadan Çık" })
    .click();
  await page.getByTestId("level-hard").focus();
  await page.keyboard.press("Enter");
  await page.getByTestId("round-standard").focus();
  await page.keyboard.press("Enter");
  await page.getByTestId("pace-competition").focus();
  await page.keyboard.press("Enter");
  await page.getByTestId("start-round").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("question-number")).toHaveText("01");
  const text = await page.locator("main h1").innerText();
  expect(["hard", "expert"]).toContain(questions.find((q) => q.question === text)?.difficulty);
});

test("depolama ve paylaşım engelliyken yarışma tamamlanır, manuel metin sunulur", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage disabled");
      },
    });
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
      configurable: true,
    });
  });
  await start(page, "medium");
  for (let i = 0; i < 10; i++) {
    await page.locator(".choice").first().click();
    await page
      .getByRole("button", { name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru" })
      .click();
  }
  await page.getByRole("button", { name: "Sonucumu Paylaş" }).click();
  await expect(
    page.getByRole("textbox", { name: "Paylaşım metnin" }),
  ).toHaveValue(/Orta · Standart Tur · Yarışma Modu/);
  await page.getByRole("button", { name: "Seviye Değiştir" }).click();
  await expect(page.getByTestId("level-medium")).toBeEnabled();
});

test("404 ve SEO çıktıları", async ({ page, request }) => {
  await page.goto("/olmayan-sayfa");
  await expect(
    page.getByRole("heading", { name: "Bu sorunun cevabı başka yerde." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ana Sayfaya Dön" }).click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https:\/\/yeninesilbilgiyarismasi\.com\/?$/,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("https://yeninesilbilgiyarismasi.com");
  const image = await request.get("/opengraph-image.png");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});

test("seviye rehberleri indekslenebilir ve tur seçimini açar", async ({ page, request }) => {
  const levels = [
    ["easy", "/kolay-bilgi-yarismasi", "Kolay Bilgi Yarışması"],
    ["medium", "/orta-bilgi-yarismasi", "Orta Bilgi Yarışması"],
    ["hard", "/zor-bilgi-yarismasi", "Zor Bilgi Yarışması"],
  ] as const;
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("https://yeninesilbilgiyarismasi.com/cok-zor-bilgi-yarismasi");
  for (const [level, path, title] of levels) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Bu seviyede neler soruluyor?");
    expect(sitemap).toContain(`https://yeninesilbilgiyarismasi.com${path}`);
    await page.goto(path);
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://yeninesilbilgiyarismasi.com${path}`);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await accessible(page);
    await noOverflow(page);
    await page.locator(".guide-examples summary").first().click();
    await expect(page.locator(".guide-answer").first()).toBeVisible();
    await page.getByRole("link", { name: "Bu Seviyede Yarış" }).click();
    await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
    await expect(page.getByTestId("question-number")).toHaveText("01");
    const questionText = await page.locator("main h1").innerText();
    const questionDifficulty = questions.find(q => q.question === questionText)?.difficulty;
    expect(level === "hard" ? ["hard", "expert"] : [level]).toContain(questionDifficulty);
  }
  await page.goto("/cok-zor-bilgi-yarismasi");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://yeninesilbilgiyarismasi.com/zor-bilgi-yarismasi");
  await expect(page.getByRole("heading", { name: "Çok Zor soruları artık Zor seviyesinde" })).toBeVisible();
});
