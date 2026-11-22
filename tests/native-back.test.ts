import { test } from "node:test";
import assert from "node:assert/strict";
import { handleNativeBack, registerBackHandler } from "../src/lib/native-back";

test("Android back delegates to the deepest active handler and cleans up", () => {
  const calls: string[] = [];
  const parent = registerBackHandler(() => { calls.push("parent"); return true; });
  const child = registerBackHandler(() => { calls.push("child"); return false; });
  assert.equal(handleNativeBack(), true);
  assert.deepEqual(calls, ["child", "parent"]);
  child(); child(); parent();
  assert.equal(handleNativeBack(), false);
});
test("Android back stops after a handled exit dialog", () => {
  const parent = registerBackHandler(() => { throw new Error("Unexpected parent navigation"); });
  const child = registerBackHandler(() => true);
  try { assert.equal(handleNativeBack(), true); }
  finally { child(); parent(); }
});
