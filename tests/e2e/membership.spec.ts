import { test, expect, type Page } from "@playwright/test";

// Legacy navigation tests deliberately start fresh; reload recovery is tested in rounds.spec.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.removeItem("ynby:active-round:v1")); });
import AxeBuilder from "@axe-core/playwright";
import { questions } from "../../src/data/questions";

const owner = "11111111-1111-4111-8111-111111111111";
async function mockMembership(page: Page) {
  const calls: { path: string; body: Record<string, unknown> }[] = [];
  let best = 400;
  const user = { id: owner, aud: "authenticated", role: "authenticated", email: "member@example.com", email_confirmed_at: "2026-09-29T00:00:00Z", app_metadata: { provider: "email", providers: ["email"] }, user_metadata: { nickname: "Meraklı" }, identities: [], created_at: "2026-09-29T00:00:00Z" };
  const token = () => ({ access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTQxMTEtODExMS0xMTExMTExMTExMTEiLCJleHAiOjQxMDI0NDQ4MDB9.signature", token_type: "bearer", expires_in: 3600, refresh_token: "test-refresh", user });
  await page.route("https://membership-test.supabase.co/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const headers = { "access-control-allow-origin": "http://127.0.0.1:3121", "access-control-allow-headers": "authorization,apikey,content-type,x-client-info,x-supabase-api-version", "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS", "access-control-expose-headers": "x-supabase-api-version", "x-supabase-api-version": "2024-01-01" };
    if (request.method() === "OPTIONS") { await route.fulfill({ status: 204, headers }); return; }
    const body = request.postDataJSON() as Record<string, unknown> | null;
    calls.push({ path: url.pathname, body: body ?? {} });
    let json: unknown = {};
    let status = 200;
    if (url.pathname.endsWith("/authorize")) { await route.fulfill({ status: 200, headers, contentType: "text/html", body: "<html><body>Mock Google authorization</body></html>" }); return; }
    if (url.pathname.endsWith("/signup")) json = { ...user, identities: [] };
    else if (url.pathname.endsWith("/token")) { if (body?.password === "wrong") { status = 400; json = { code: "invalid_credentials", message: "Invalid login credentials" }; } else json = token(); }
    else if (url.pathname.endsWith("/verify")) { if (body?.token === "000000") { status = 403; json = { code: "otp_expired", message: "Expired" }; } else json = token(); }
    else if (url.pathname.endsWith("/user")) json = user;
    else if (url.pathname.endsWith("/profiles")) json = request.method() === "GET" ? { nickname: "Meraklı" } : [];
    else if (url.pathname.endsWith("/personal_bests")) json = [{ category: "mixed", difficulty: "easy", score: best }];
    else if (url.pathname.endsWith("/save_personal_best")) { expect(body?.p_owner).toBe(owner); best = Math.max(best, Number(body?.p_score)); json = [{ category: body?.p_category, difficulty: body?.p_difficulty, score: best }]; }
    else if (url.pathname.endsWith("/delete-account")) { if (body?.password === "wrong") { status = 401; json = { error: "unauthorized" }; } else json = { deleted: true }; }
    await route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify(json) });
  });
  return calls;
}
async function inspect(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
}

test("Google login uses PKCE, returns to the localized account and clears the callback URL", async ({ page }) => {
  const calls = await mockMembership(page);
  await page.goto("/en/account");
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeEnabled();
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await expect(page).toHaveURL(/membership-test\.supabase\.co\/auth\/v1\/authorize/);
  const authorization = new URL(page.url());
  expect(authorization.searchParams.get("provider")).toBe("google");
  expect(authorization.searchParams.get("redirect_to")).toBe("http://127.0.0.1:3121/en/account");
  expect(authorization.searchParams.get("code_challenge_method")).toBe("s256");
  expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
  await page.goto("/en/account?code=google-test-code");
  await expect(page.getByRole("heading", { name: "My Account", exact: true })).toBeVisible();
  expect(page.url()).toBe("http://127.0.0.1:3121/en/account");
  expect(calls.some(call => call.path.endsWith("/token") && call.body.auth_code === "google-test-code" && typeof call.body.code_verifier === "string")).toBe(true);
  await page.getByRole("button", { name: "Sign Out", exact: true }).click();
  await page.goto("/en/account?error=access_denied&error_description=Untrusted");
  await expect(page.locator("main").getByRole("alert")).toContainText("Google sign-in could not be completed");
  expect(page.url()).toBe("http://127.0.0.1:3121/en/account");
});
test("Android Google opens the external browser and handles duplicate native callbacks", async ({ page }) => {
  const calls = await mockMembership(page);
  await page.addInitScript(() => {
    const listeners = new Map<string, Map<string, (event: { url: string }) => void>>();
    const nativeCalls: { plugin: string; method: string; options: Record<string, unknown> }[] = [];
    let id = 0;
    const globals = window as typeof window & {
      androidBridge: object; Capacitor: object;
      googleNativeTest: { calls: typeof nativeCalls; emit: (url: string) => void };
    };
    globals.androidBridge = {};
    globals.Capacitor = {
      PluginHeaders: [
        { name: "App", methods: [{ name: "addListener", rtype: "callback" }, { name: "removeListener", rtype: "promise" }, { name: "getLaunchUrl", rtype: "promise" }] },
        { name: "Browser", methods: [{ name: "open", rtype: "promise" }] },
        { name: "SystemBars", methods: [{ name: "setStyle", rtype: "promise" }] },
      ],
      nativePromise: async (plugin: string, method: string, options: Record<string, unknown> = {}) => {
        nativeCalls.push({ plugin, method, options });
        if (method === "removeListener") listeners.get(String(options.eventName))?.delete(String(options.callbackId));
        return {};
      },
      nativeCallback: async (_plugin: string, _method: string, options: { eventName: string }, callback: (event: { url: string }) => void) => {
        const key = String(id++);
        if (!listeners.has(options.eventName)) listeners.set(options.eventName, new Map());
        listeners.get(options.eventName)!.set(key, callback);
        return key;
      },
    };
    globals.googleNativeTest = {
      calls: nativeCalls,
      emit: url => { for (const listener of listeners.get("appUrlOpen")?.values() ?? []) listener({ url }); },
    };
  });
  await page.goto("/en/account");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  const browserUrl = () => page.evaluate(() =>
    String((window as typeof window & { googleNativeTest: { calls: { plugin: string; options: { url?: string } }[] } }).googleNativeTest.calls.find(c => c.plugin === "Browser")?.options.url ?? ""));
  await expect.poll(browserUrl).not.toBe("");
  const authorization = new URL(await browserUrl());
  expect(authorization.searchParams.get("redirect_to")).toBe("com.yeninesilbilgiyarismasi.app://auth/callback?locale=en");
  expect(authorization.searchParams.get("code_challenge_method")).toBe("s256");
  expect(page.url()).toBe("http://127.0.0.1:3121/en/account");
  await page.evaluate(() => {
    const bridge = (window as typeof window & { googleNativeTest: { emit: (url: string) => void } }).googleNativeTest;
    bridge.emit("com.yeninesilbilgiyarismasi.app://auth/callback?locale=en&code=native-test-code");
    bridge.emit("com.yeninesilbilgiyarismasi.app://auth/callback?locale=en&code=native-test-code");
  });
  await expect(page.getByRole("heading", { name: "My Account", exact: true })).toBeVisible();
  expect(calls.filter(call => call.path.endsWith("/token") && call.body.auth_code === "native-test-code")).toHaveLength(1);
});

test("signup, code verification, profile, logout and login preserve guest records", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const calls = await mockMembership(page);
  await page.addInitScript(() => localStorage.setItem("ynby:high-scores:v1", '{"easy":1900}'));
  await page.goto("/hesap");
  await page.getByRole("button", { name: "Hesap Oluştur", exact: true }).click();
  await page.getByLabel("E-posta", { exact: true }).fill("member@example.com");
  await page.locator("form").getByLabel(/^Takma ad/).fill("Meraklı");
  await page.getByLabel("Şifre", { exact: true }).fill("abcde1");
  await page.getByLabel("Şifre tekrar", { exact: true }).fill("abcde2");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Şifreyi göster: Şifre", exact: true }).click();
  await expect(page.locator("#password")).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Şifreyi gizle: Şifre", exact: true }).click();
  await expect(page.locator("#password")).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Hesap Oluştur", exact: true }).last().click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Şifreler eşleşmiyor");
  expect(calls.filter(call => call.path.endsWith("/signup"))).toHaveLength(0);
  await page.getByLabel("Şifre", { exact: true }).fill("long-password-123");
  await page.getByLabel("Şifre tekrar", { exact: true }).fill("long-password-123");
  await page.getByRole("checkbox").check();
  await inspect(page);
  await page.screenshot({ path: info.outputPath("membership-signup.png"), fullPage: true });
  await page.getByRole("button", { name: "Hesap Oluştur", exact: true }).last().dblclick();
  await expect(page.getByRole("heading", { name: "E-postamı Doğrula" })).toBeVisible();
  expect(calls.filter(call => call.path.endsWith("/signup"))).toHaveLength(1);
  await page.getByLabel("Doğrulama kodu").fill("000000");
  await page.getByRole("button", { name: "Kodu Doğrula" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Kod geçersiz");
  await page.getByLabel("Doğrulama kodu").fill("123456");
  await page.getByRole("button", { name: "Kodu Doğrula" }).click();
  await expect(page.getByRole("heading", { name: "Hesabım", exact: true })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "eşitlendi" })).toBeVisible();
  expect(calls.filter(call => call.path.endsWith("/save_personal_best")).every(call => call.body.p_score !== 1900)).toBe(true);
  await page.getByLabel("Takma ad", { exact: true }).fill("Yeni Merak");
  await page.getByRole("button", { name: "Takma Adı Kaydet" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Takma adın kaydedildi" })).toBeVisible();
  await page.emulateMedia({ colorScheme: "dark" });
  await inspect(page);
  await page.screenshot({ path: info.outputPath("membership-dark-account.png"), fullPage: true });
  await page.getByRole("button", { name: "Çıkış Yap" }).click();
  await expect(page.getByRole("heading", { name: "Giriş Yap" })).toBeVisible();
  await page.getByLabel("E-posta", { exact: true }).fill("member@example.com");
  await page.getByLabel("Şifre", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).last().click();
  await expect(page.locator("main").getByRole("alert")).toContainText("E-posta veya şifre hatalı");
  await page.getByLabel("Şifre", { exact: true }).fill("long-password-123");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Hesabım", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Hesabım", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test("English recovery updates password, deletion needs confirmation and preserves guest data", async ({ page }, info) => {
  const calls = await mockMembership(page);
  await page.addInitScript(() => localStorage.setItem("ynby:high-scores:v1", '{"easy":1900}'));
  await page.goto("/en/account");
  await page.getByRole("button", { name: "Forgot Password" }).click();
  await page.getByLabel("Email", { exact: true }).fill("member@example.com");
  await page.getByRole("button", { name: "Send Code" }).click();
  await page.getByLabel("Verification Code").fill("123456");
  await page.getByRole("button", { name: "Verify Code" }).click();
  await expect(page.getByRole("heading", { name: "New Password" })).toBeVisible();
  await page.locator("form").getByLabel(/^New Password/).fill("new-password-123");
  await page.getByLabel("Repeat Password", { exact: true }).fill("new-password-123");
  await page.getByRole("button", { name: "Reset Password" }).click();
  await expect(page.getByRole("heading", { name: "My Account", exact: true })).toBeVisible();
  expect(calls.some(call => call.path.endsWith("/user") && call.body.password === "new-password-123")).toBe(true);
  await page.getByRole("button", { name: "Delete My Account", exact: true }).click();
  await page.getByLabel("Password", { exact: true }).fill("wrong");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Delete My Account", exact: true }).last().click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Could not delete");
  await page.getByLabel("Password", { exact: true }).fill("new-password-123");
  await inspect(page);
  await page.screenshot({ path: info.outputPath("membership-deletion.png"), fullPage: true });
  await page.getByRole("button", { name: "Delete My Account", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Sign In", exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("ynby:auth:v1"))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ynby:high-scores:v1")!).easy)).toBe(1900);
  expect(await page.evaluate(id => localStorage.getItem(`ynby:high-scores:v1:user:${id}`), owner)).toBeNull();
});
test("logged-in full round saves only account best and unavailable network keeps guest play usable", async ({ page }) => {
  await mockMembership(page);
  await page.goto("/hesap");
  await page.getByLabel("E-posta", { exact: true }).fill("member@example.com");
  await page.getByLabel("Şifre", { exact: true }).fill("long-password-123");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Hesabım", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ana Sayfa", exact: true }).click();
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-mixed").click();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  for (let index = 0; index < 10; index++) {
    await expect(page.getByTestId("question-number")).toHaveText(String(index + 1).padStart(2, "0"));
    const text = await page.locator("main h1").innerText();
    const question = questions.find(q => q.question === text)!;
    await page.getByRole("button", { name: question.choices.find(choice => choice.id === question.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: index === 9 ? "Sonucumu Gör" : "Sonraki Soru", exact: true }).click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText("10");
  await expect.poll(() => page.evaluate(id => Number(JSON.parse(localStorage.getItem(`ynby:high-scores:v1:user:${id}`) ?? "{}").easy ?? 0), owner)).toBeGreaterThan(400);
  expect(await page.evaluate(() => localStorage.getItem("ynby:high-scores:v1"))).toBeNull();
  await page.goto("/hesap");
  await page.getByRole("button", { name: "Çıkış Yap" }).click();
  await page.unroute("https://membership-test.supabase.co/**");
  await page.route("https://membership-test.supabase.co/**", route => route.abort());
  await page.getByLabel("E-posta", { exact: true }).fill("member@example.com");
  await page.getByLabel("Şifre", { exact: true }).fill("long-password-123");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).last().click();
  await page.getByRole("button", { name: "Misafir Olarak Devam Et" }).click();
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-space").click();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  await expect(page.getByTestId("question-number")).toHaveText("01");
});
test("blocked browser storage still uploads a signed-in round from memory", async ({ page }) => {
  const calls = await mockMembership(page);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() { throw new DOMException("Storage disabled", "SecurityError"); },
  }));
  await page.goto("/hesap");
  await page.getByLabel("E-posta", { exact: true }).fill("member@example.com");
  await page.getByLabel("Şifre", { exact: true }).fill("long-password-123");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Hesabım", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ana Sayfa", exact: true }).click();
  await page.getByRole("button", { name: "Bilgini Test Et", exact: true }).click();
  await page.getByTestId("category-mixed").click();
  await page.getByTestId("level-easy").click();
  await page.getByTestId("round-standard").click(); await page.getByTestId("pace-competition").click(); await page.getByTestId("start-round").click();
  for (let index = 0; index < 10; index++) {
    await expect(page.getByTestId("question-number")).toHaveText(String(index + 1).padStart(2, "0"));
    const text = await page.locator("main h1").innerText();
    const question = questions.find(q => q.question === text)!;
    await page.getByRole("button", { name: question.choices.find(choice => choice.id === question.correctAnswer)!.text, exact: true }).click();
    await page.getByRole("button", { name: index === 9 ? "Sonucumu Gör" : "Sonraki Soru", exact: true }).click();
  }
  await expect(page.getByTestId("result-correct")).toHaveText("10");
  await expect.poll(() => calls.some(call => call.path.endsWith("/save_personal_best") && Number(call.body.p_score) > 400)).toBe(true);
  const uploaded = Math.max(...calls.filter(call => call.path.endsWith("/save_personal_best")).map(call => Number(call.body.p_score)));
  await page.getByRole("button", { name: "Ana sayfaya dön", exact: true }).click();
  await page.getByRole("button", { name: "Hesabım", exact: true }).click();
  await expect(page.locator(".account-records dd")).toHaveText(uploaded.toLocaleString("tr-TR"));
  await expect(page.getByRole("status").filter({ hasText: "eşitlendi" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("public privacy and deletion pages stay localized and usable at narrow widths", async ({ page }) => {
  await mockMembership(page);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/gizlilik", "/hesap-silme", "/en/privacy", "/en/delete-account"]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", path.startsWith("/en") ? "en" : "tr");
    await inspect(page);
  }
});
