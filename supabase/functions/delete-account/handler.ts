type Identity = { id: string; email: string };
class PayloadTooLarge extends Error {}
async function limitedBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let bytes = 0, text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > 1024) {
        await reader.cancel().catch(() => {});
        throw new PayloadTooLarge();
      }
      text += decoder.decode(value, { stream: true });
    }
  } finally { reader.releaseLock(); }
}
export type DeletionServices = {
  identity: (token: string) => Promise<Identity | null>;
  verifyPassword: (email: string, password: string) => Promise<string | null>;
  deleteUser: (id: string) => Promise<boolean>;
};
export function deletionHandler(services: DeletionServices, origins: readonly string[]) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    const headers: Record<string, string> = { "Content-Type": "application/json", "Cache-Control": "no-store", "Vary": "Origin", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS" };
    if (origin && !origins.includes(origin)) return new Response('{"error":"forbidden"}', { status: 403, headers });
    if (origin) headers["Access-Control-Allow-Origin"] = origin;
    const respond = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), { status, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return respond(405, { error: "method_not_allowed" });
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ") || auth.length > 10000) return respond(401, { error: "unauthorized" });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return respond(415, { error: "json_required" });
    try {
      const text = await limitedBody(request);
      const body: unknown = JSON.parse(text);
      const password = body && typeof body === "object" && "password" in body ? body.password : null;
      if (typeof password !== "string" || password.length < 1 || password.length > 128) return respond(400, { error: "invalid_request" });
      const user = await services.identity(auth.slice(7));
      if (!user) return respond(401, { error: "unauthorized" });
      // Verify both the current JWT and the password; never trust a request ID.
      const verified = await services.verifyPassword(user.email, password);
      if (verified !== user.id) return respond(401, { error: "unauthorized" });
      if (!await services.deleteUser(user.id)) return respond(503, { error: "unavailable" });
      return respond(200, { deleted: true });
    } catch (error) {
      return error instanceof PayloadTooLarge
        ? respond(413, { error: "too_large" })
        : respond(400, { error: "request_failed" });
    }
  };
}
