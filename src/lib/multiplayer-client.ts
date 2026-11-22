import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { membershipConfig, resilientAuthStorage } from "./membership";

let guestClient: SupabaseClient | null = null;

export function getMultiplayerGuestClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const config = membershipConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  if (!config) return null;
  if (!guestClient) {
    let storage: Storage | undefined;
    try { storage = window.sessionStorage; } catch { /* Keep the session in memory. */ }
    guestClient = createClient(config.url, config.key, {
      auth: {
        storage: resilientAuthStorage(storage),
        storageKey: "ynby:multiplayer-guest:v1",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return guestClient;
}
