import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "./brand";
import { ContactLink } from "./contact-link";
import { categoryPath } from "../lib/category-pages";
import { homePath, type Locale } from "../lib/locale";

export function LegacyCategoryGuide({ locale }: { locale: Locale }) {
  const home = homePath(locale);
  const en = locale === "en";
  return <div className="app-shell"><header className="site-header"><div className="wrap header-inner"><Link className="brand-button brand-link" href={home}><Brand locale={locale} /></Link></div></header>
    <main id="main" className="wrap guide-page"><section className="guide-hero"><h1>{en ? "History & Geography Trivia Quiz" : "Tarih ve Coğrafya Bilgi Yarışması"}</h1><p>{en ? "These subjects now have separate quizzes. Choose history or geography to continue." : "Bu iki konu artık ayrı yarışmalarda. Devam etmek için Tarih veya Coğrafya'yı seç."}</p>
      <div className="level-links">{(["history", "geography"] as const).map(category => <Link key={category} href={categoryPath(category, locale)}><span><strong>{category === "history" ? en ? "History" : "Tarih" : en ? "Geography" : "Coğrafya"}</strong></span><ArrowRight size={18} /></Link>)}</div></section></main>
    <footer className="site-footer"><div className="wrap footer-inner"><ContactLink locale={locale} /></div></footer></div>;
}
