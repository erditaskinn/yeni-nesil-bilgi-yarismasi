import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { membershipConfig, resilientAuthStorage } from "./membership";

let client: SupabaseClient | null = null;
export function getMembershipClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const config = membershipConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  if (!config) return null;
  if (!client) {
    let storage: Storage | undefined;
    try { storage = window.localStorage; } catch { /* Use a memory-only session. */ }
    client = createClient(config.url, config.key, {
      auth: { storage: resilientAuthStorage(storage), storageKey: "ynby:auth:v1", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: "pkce" },
      global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.any([AbortSignal.timeout(15000), ...(init?.signal ? [init.signal] : [])]) }) },
    });
  }
  return client;
}
