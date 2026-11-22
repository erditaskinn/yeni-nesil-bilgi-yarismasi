import type { SupabaseClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { accountPath } from "./account-copy";
import type { Locale } from "./locale";

export const NATIVE_AUTH_CALLBACK = "com.yeninesilbilgiyarismasi.app://auth/callback";
export const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function parseGoogleCallback(value: string, origin?: string) {
  try {
    const url = new URL(value);
    const native = `${url.protocol}//${url.host}${url.pathname}` === NATIVE_AUTH_CALLBACK;
    const web = origin && url.origin === origin && ["/hesap", "/en/account"].includes(url.pathname.replace(/\/$/, ""));
    if ((!native && !web) || url.username || url.password || url.hash) return null;
    const code = url.searchParams.get("code");
    const failed = url.searchParams.has("error") || url.searchParams.has("error_code");
    if (!failed && (!code || code.length > 2048)) return null;
    return { code: failed ? null : code, failed, locale: (native ? url.searchParams.get("locale") === "en" : url.pathname.startsWith("/en/")) ? "en" as const : "tr" as const };
  } catch { return null; }
}

export async function startGoogleSignIn(client: SupabaseClient, locale: Locale) {
  if (!googleAuthEnabled) throw new Error("Google sign-in is not configured");
  const native = Capacitor.isNativePlatform();
  const redirectTo = native ? `${NATIVE_AUTH_CALLBACK}?locale=${locale}` : `${window.location.origin}${accountPath(locale)}`;
  const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo, skipBrowserRedirect: true, queryParams: { prompt: "select_account" } } });
  if (error) throw error;
  if (!data.url) throw new Error("Missing authorization URL");
  const url = new URL(data.url);
  const configured = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  if (url.origin !== configured.origin || url.pathname !== "/auth/v1/authorize") throw new Error("Invalid authorization URL");
  if (native) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url: url.href });
  } else window.location.assign(url.href);
}

// React remounts and native launch events can deliver the same callback twice.
let lastExchange: { code: string; result: Promise<boolean> } | undefined;
export function exchangeGoogleCode(client: SupabaseClient, code: string) {
  if (lastExchange?.code === code) return lastExchange.result;
  const result = client.auth.exchangeCodeForSession(code).then(({ error }) => !error, () => false);
  lastExchange = { code, result };
  return result;
}
