import test from "node:test";
import assert from "node:assert/strict";
import { membershipConfig, validNickname, validPassword, parseMemberScores, resilientAuthStorage, authIssue } from "../src/lib/membership";
import { readHighScores, saveHighScore } from "../src/lib/storage";
import { deletionHandler } from "../supabase/functions/delete-account/handler";
import { parseGoogleCallback, NATIVE_AUTH_CALLBACK } from "../src/lib/google-auth";

test("Google callback accepts only account routes and the registered native callback", () => {
  assert.deepEqual(parseGoogleCallback("https://example.com/en/account?code=test", "https://example.com"), { code: "test", failed: false, locale: "en" });
  assert.deepEqual(parseGoogleCallback(`${NATIVE_AUTH_CALLBACK}?code=test&locale=en`), { code: "test", failed: false, locale: "en" });
  assert.equal(parseGoogleCallback("https://evil.example/hesap?code=test", "https://example.com"), null);
  assert.equal(parseGoogleCallback("https://example.com/?code=test", "https://example.com"), null);
  assert.equal(parseGoogleCallback("com.yeninesilbilgiyarismasi.app://evil/callback?code=test"), null);
  assert.equal(parseGoogleCallback(`${NATIVE_AUTH_CALLBACK}?code=test#access_token=unsafe`), null);
  assert.equal(parseGoogleCallback(`${NATIVE_AUTH_CALLBACK}?code=${"x".repeat(2049)}`), null);
  assert.equal(parseGoogleCallback("https://example.com/hesap?error=access_denied", "https://example.com")?.failed, true);
});

test("membership accepts only a public Supabase configuration, never privileged keys", () => {
  assert.ok(membershipConfig("https://example.supabase.co", "sb_publishable_test"));
  for (const url of [undefined, "http://example.supabase.co", "https://example.com", "https://a:b@example.supabase.co", "https://example.supabase.co/path"]) assert.equal(membershipConfig(url, "sb_publishable_test"), null);
  for (const key of [undefined, "", "sb_secret_unsafe", "service_role", "eyJhbGci"]) assert.equal(membershipConfig("https://example.supabase.co", key), null);
});
test("nicknames, passwords and personal bests have bounded validation", () => {
  assert.equal(validNickname("  Meraklı  "), true);
  for (const name of ["a", "a".repeat(31), "<script>", "ab\u0000", "ab\u200b"]) assert.equal(validNickname(name), false);
  assert.equal(validPassword("long-pass-123"), true);
  assert.equal(validPassword("short"), false);
  assert.equal(validPassword("a".repeat(129)), false);
  assert.equal(validPassword("abcde1"), true);
  assert.equal(validPassword("abcd1"), false);
  assert.equal(validPassword("abcdef"), false);
  assert.equal(validPassword("123456"), false);
  assert.equal(validPassword("şşşşş1"), false);
  assert.equal(validPassword("a".repeat(71) + "1"), true);
  assert.equal(validPassword("a".repeat(73)), false);
  assert.equal(validPassword("ş".repeat(35) + "a1"), true);
  assert.equal(validPassword("ş".repeat(35) + "aa1"), false);
  assert.equal(validPassword("ş".repeat(37)), false);
  assert.deepEqual(parseMemberScores([{ category: "mixed", difficulty: "easy", score: 1000 }, { category: "mixed", difficulty: "easy", score: 500 }, { category: "bad", difficulty: "easy", score: 20 }, { category: "space", difficulty: "hard", score: 2001 }, { category: "space", difficulty: "hard", score: -1 }]), [{ category: "mixed", difficulty: "easy", score: 1000 }]);
});
test("guest and two accounts keep separate personal bests", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const one = "11111111-1111-4111-8111-111111111111", two = "22222222-2222-4222-8222-222222222222";
  saveHighScore("easy", 1000, storage);
  saveHighScore("easy", 600, storage, "mixed", one);
  saveHighScore("easy", 200, storage, "mixed", two);
  saveHighScore("easy", 100, storage, "mixed", one);
  assert.equal(readHighScores(storage).easy, 1000);
  assert.equal(readHighScores(storage, "mixed", one).easy, 600);
  assert.equal(readHighScores(storage, "mixed", two).easy, 200);
  assert.deepEqual(readHighScores(storage, "space", one), {});
});
test("session storage tolerates disabled storage and removes tokens", () => {
  const storage = resilientAuthStorage({ getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } });
  storage.setItem("session", "token"); assert.equal(storage.getItem("session"), "token");
  storage.removeItem("session"); assert.equal(storage.getItem("session"), null);
  assert.equal(authIssue({ code: "invalid_credentials" }), "credentials");
  assert.equal(authIssue({ code: "otp_expired" }), "invalidCode");
  assert.equal(authIssue(new TypeError("network")), "network");
});
test("account deletion validates JWT and password and ignores caller-supplied IDs", async () => {
  const deleted: string[] = [];
  const handler = deletionHandler({ identity: async token => token === "valid" ? { id: "owner", email: "member@example.com" } : null, verifyPassword: async (_email, password) => password === "correct" ? "owner" : null, deleteUser: async id => { deleted.push(id); return true; } }, ["https://yeninesilbilgiyarismasi.com"]);
  const request = (token: string, password: string, origin = "https://yeninesilbilgiyarismasi.com") => new Request("https://example.supabase.co/functions/v1/delete-account", { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json", origin }, body: JSON.stringify({ password, user_id: "victim" }) });
  assert.equal((await handler(request("invalid", "correct"))).status, 401);
  assert.equal((await handler(request("valid", "wrong"))).status, 401);
  assert.equal((await handler(request("valid", "correct", "https://evil.example"))).status, 403);
  assert.deepEqual(deleted, []);
  const result = await handler(request("valid", "correct"));
  assert.equal(result.status, 200); assert.deepEqual(await result.json(), { deleted: true });
  assert.deepEqual(deleted, ["owner"]);
  assert.equal(result.headers.get("cache-control"), "no-store");
});
test("deletion rejects invalid method, malformed payload, mismatched password identity and oversized requests", async () => {
  let count = 0;
  const handler = deletionHandler({ identity: async () => ({ id: "one", email: "one@example.com" }), verifyPassword: async () => "two", deleteUser: async () => { count++; return true; } }, ["https://localhost"]);
  const url = "https://example.supabase.co/functions/v1/delete-account";
  assert.equal((await handler(new Request(url))).status, 405);
  assert.equal((await handler(new Request(url, { method: "OPTIONS", headers: { origin: "https://localhost" } }))).status, 204);
  const make = (body: string) => new Request(url, { method: "POST", headers: { authorization: "Bearer valid", "content-type": "application/json" }, body });
  assert.equal((await handler(make("not json"))).status, 400);
  assert.equal((await handler(make("x".repeat(1025)))).status, 413);
  assert.equal((await handler(make('{"password":"correct"}'))).status, 401);
  assert.equal(count, 0);
});

test("deletion cancels oversized streams before authentication and decodes split UTF-8 safely", async () => {
  let checked = 0, deleted = 0, cancelled = false, pulls = 0;
  const password = "\u015fifre-test-123";
  const handler = deletionHandler({
    identity: async () => { checked++; return { id: "owner", email: "member@example.com" }; },
    verifyPassword: async (_email, value) => value === password ? "owner" : null,
    deleteUser: async () => { deleted++; return true; },
  }, []);
  const url = "https://example.supabase.co/functions/v1/delete-account";
  const headers = { authorization: "Bearer valid", "content-type": "application/json" };
  const oversized = new ReadableStream<Uint8Array>({
    pull(controller) { pulls++; if (pulls > 4) controller.close(); else controller.enqueue(new Uint8Array(600)); },
    cancel() { cancelled = true; },
  });
  assert.equal((await handler(new Request(url, { method: "POST", headers, body: oversized, ...{ duplex: "half" } }))).status, 413);
  assert.equal(cancelled, true);
  assert.ok(pulls <= 3);
  assert.equal(checked, 0);
  assert.equal(deleted, 0);

  const encoded = new TextEncoder().encode(JSON.stringify({ password }));
  const split = encoded.findIndex(byte => byte > 127) + 1;
  const valid = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(encoded.slice(0, split)); controller.enqueue(encoded.slice(split)); controller.close(); } });
  assert.equal((await handler(new Request(url, { method: "POST", headers, body: valid, ...{ duplex: "half" } }))).status, 200);
  assert.equal(checked, 1);
  assert.equal(deleted, 1);
});
