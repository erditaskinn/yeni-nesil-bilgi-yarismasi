import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { THEME_BOOTSTRAP } from "../src/lib/theme";

test("theme bootstrap defaults to light without consulting the device and honors explicit choices", () => {
  for (const choice of [null, "invalid", "light", "dark"]) {
    const root = { dataset: {} as Record<string, string> };
    runInNewContext(THEME_BOOTSTRAP, {
      document: { documentElement: root },
      localStorage: { getItem: () => choice },
      matchMedia: () => { throw new Error("Device theme must not be consulted"); },
    });
    assert.equal(root.dataset.theme, choice === "dark" ? "dark" : "light");
  }
});

test("theme bootstrap remains light when storage is blocked", () => {
  const root = { dataset: {} as Record<string, string> };
  runInNewContext(THEME_BOOTSTRAP, {
    document: { documentElement: root },
    get localStorage() { throw new Error("Storage blocked"); },
  });
  assert.equal(root.dataset.theme, "light");
});
