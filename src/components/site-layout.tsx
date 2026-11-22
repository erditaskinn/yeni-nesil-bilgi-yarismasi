import { SITE_URL } from "../lib/config";
import { homePath, translate, type Locale } from "../lib/locale";
import { homeMetadata } from "../lib/site-metadata";
import "../app/globals.css";
import "../app/native-game.css";
import { THEME_BOOTSTRAP } from "../lib/theme";
import { NativeRuntime } from "./native-runtime";
import { NativeConnectivity } from "./native-connectivity";
import { AnalyticsConsent } from "./analytics-consent";
export function SiteLayout({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: translate(locale, "brand"), url: `${SITE_URL}${homePath(locale)}`, inLanguage: locale === "en" ? "en-US" : "tr-TR", description: homeMetadata(locale).description };
  // This shared App Router root initializes the theme before the first paint.
  // eslint-disable-next-line @next/next/no-head-element
  return <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head><body><NativeRuntime locale={locale} /><NativeConnectivity />{children}<AnalyticsConsent locale={locale} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }} /></body></html>;
}
