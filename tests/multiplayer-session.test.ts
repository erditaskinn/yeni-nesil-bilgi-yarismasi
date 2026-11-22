import { test } from "node:test";
import assert from "node:assert/strict";
import { forgetMultiplayerRoom, readRememberedMultiplayerRoom, rememberMultiplayerRoom } from "../src/lib/multiplayer-session";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
    removeItem: (key: string) => { data.delete(key); },
  };
}

test("remembers a room only for the matching authenticated identity", () => {
  const storage = memoryStorage();
  const userId = "11111111-1111-4111-8111-111111111111";
  const roomId = "22222222-2222-4222-8222-222222222222";
  assert.equal(rememberMultiplayerRoom(storage, userId, roomId), true);
  assert.equal(readRememberedMultiplayerRoom(storage, userId), roomId);
  assert.equal(readRememberedMultiplayerRoom(storage, "33333333-3333-4333-8333-333333333333"), null);
});

test("ignores malformed storage and refuses invalid IDs", () => {
  const storage = memoryStorage();
  assert.equal(rememberMultiplayerRoom(storage, "not-an-id", "also-invalid"), false);
  storage.setItem("ynby:multiplayer-room:v1", "{");
  assert.equal(readRememberedMultiplayerRoom(storage, "11111111-1111-4111-8111-111111111111"), null);
});

test("leaving clears only the matching remembered room", () => {
  const storage = memoryStorage();
  const userId = "11111111-1111-4111-8111-111111111111";
  const roomId = "22222222-2222-4222-8222-222222222222";
  rememberMultiplayerRoom(storage, userId, roomId);
  forgetMultiplayerRoom(storage, userId, "44444444-4444-4444-8444-444444444444");
  assert.equal(readRememberedMultiplayerRoom(storage, userId), roomId);
  forgetMultiplayerRoom(storage, userId, roomId);
  assert.equal(readRememberedMultiplayerRoom(storage, userId), null);
});
