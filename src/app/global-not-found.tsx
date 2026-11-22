import NotFound from "./(tr)/not-found";
import "./globals.css";
import { THEME_BOOTSTRAP } from "../lib/theme";
export const metadata = { title: "Sayfa Bulunamadı | Yeni Nesil Bilgi Yarışması", robots: { index: false, follow: true } };
export default function GlobalNotFound() {
  return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head><body><NotFound /></body></html>;
}
