const STORAGE_KEY = "ynby:multiplayer-room:v1";

type RememberedRoom = { userId: string; roomId: string };

function validId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value);
}

export function rememberMultiplayerRoom(storage: Pick<Storage, "setItem"> | undefined, userId: string, roomId: string) {
  if (!storage || !validId(userId) || !validId(roomId)) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ userId, roomId } satisfies RememberedRoom));
    return true;
  } catch {
    return false;
  }
}

export function readRememberedMultiplayerRoom(storage: Pick<Storage, "getItem"> | undefined, userId: string) {
  if (!storage || !validId(userId)) return null;
  try {
    const value: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "null");
    if (!value || typeof value !== "object") return null;
    const row = value as Partial<RememberedRoom>;
    return row.userId === userId && validId(row.roomId) ? row.roomId : null;
  } catch {
    return null;
  }
}

export function forgetMultiplayerRoom(storage: Pick<Storage, "getItem" | "removeItem"> | undefined, userId: string, roomId: string) {
  if (!storage) return;
  try {
    const value: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "null");
    if (value && typeof value === "object") {
      const row = value as Partial<RememberedRoom>;
      if (row.userId === userId && row.roomId === roomId) storage.removeItem(STORAGE_KEY);
    }
  } catch {
    storage.removeItem(STORAGE_KEY);
  }
}
