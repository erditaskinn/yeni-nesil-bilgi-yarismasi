import { Languages } from "lucide-react";
import type { Locale } from "../lib/locale";
export function LanguageSwitch({ locale, trPath = "/", enPath = "/en" }: { locale: Locale; trPath?: string; enPath?: string }) {
  return <nav className="language-switch" aria-label={locale === "en" ? "Language" : "Dil"}><Languages size={16} aria-hidden="true" /><a href={trPath} hrefLang="tr" lang="tr" aria-current={locale === "tr" ? "page" : undefined}>Türkçe</a><span aria-hidden="true">/</span><a href={enPath} hrefLang="en" lang="en" aria-current={locale === "en" ? "page" : undefined}>English</a></nav>;
}
