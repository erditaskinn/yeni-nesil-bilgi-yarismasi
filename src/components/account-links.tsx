import { accountText, privacyPath, deletionPath } from "../lib/account-copy";
import type { Locale } from "../lib/locale";
export function AccountLinks({ locale }: { locale: Locale }) {
  return <nav className="account-links" aria-label={locale === "tr" ? "Hesap ve gizlilik" : "Account and privacy"}><a href={privacyPath(locale)}>{accountText(locale, "privacy")}</a><a href={deletionPath(locale)}>{accountText(locale, "deletion")}</a></nav>;
}
