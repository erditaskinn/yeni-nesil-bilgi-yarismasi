import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ContactLink } from "./contact-link";
import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from "lucide-react";
import { Brand } from "./brand";
import { LanguageSwitch } from "./language-switch";
import { TURKISH_DIFFICULTIES, GAME_CONFIG, SITE_URL, type Difficulty } from "../lib/config";
import { levelPage, levelPath, levelTitle } from "../lib/level-pages";
import { questionsForLocale } from "../lib/question-repository";
import { homePath, levelInfo, topicLabel, translate, type Locale } from "../lib/locale";

export async function LevelGuide({ difficulty, locale = "tr" }: { difficulty: Difficulty; locale?: Locale }) {
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values);
  const page = levelPage(difficulty, locale);
  const title = levelTitle(difficulty, locale);
  const questions = await questionsForLocale(locale);
  const samples = page.sampleIds.map(id => questions.find(q => q.id === id)!);
  const home = homePath(locale);
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: t("home"), item: `${SITE_URL}${home}` },
    { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${levelPath(difficulty, locale)}` },
  ] };
  if (difficulty === "expert") return <div className="app-shell tr-web-design">
    <a className="skip-link" href="#main">{t("skip")}</a>
    <header className="site-header"><div className="wrap header-inner"><Link className="brand-button brand-link" href={home} aria-label={t("homeLabel")}><Brand locale={locale} /></Link><div className="guide-header-actions"><ThemeToggle locale={locale} /><Link className="header-play" href={levelPath("hard", locale)}>{t("play")} <ArrowRight size={17} /></Link></div></div></header>
    <main id="main"><div className="wrap guide-page"><Link className="text-button back-button" href={home}><ArrowLeft size={17} /> {t("home")}</Link><section className="guide-hero"><span className="eyebrow">{locale === "tr" ? "SEVİYE GÜNCELLEMESİ" : "DIFFICULTY UPDATE"}</span><h1>{locale === "tr" ? "Çok Zor soruları artık Zor seviyesinde" : "Very Hard questions are now in Hard"}</h1><p>{locale === "tr" ? "Soru havuzunu daha dengeli ve seçimleri daha anlaşılır tutmak için Çok Zor sorular Zor seviyesine eklendi. Bu sorular Zor turunda karşına çıkmaya devam ediyor." : "Very Hard questions are now part of Hard, so you can still find them in the quiz with a simpler difficulty choice."}</p><Link className="button primary" href={levelPath("hard", locale)}>{locale === "tr" ? "Zor seviyesini keşfet" : "Explore Hard"} <ArrowRight size={19} /></Link></section></div></main>
    <footer className="site-footer"><div className="wrap footer-inner"><Link href={home}>{t("brand")}</Link><ContactLink locale={locale} /><span className="footer-tagline">{t("slogan")}</span></div></footer>
  </div>;
  return <div className="app-shell tr-web-design">
    <a className="skip-link" href="#main">{t("skip")}</a>
    <header className="site-header"><div className="wrap header-inner"><Link className="brand-button brand-link" href={home} aria-label={t("homeLabel")}><Brand locale={locale} /></Link><div className="guide-header-actions"><LanguageSwitch locale={locale} trPath={levelPath(difficulty)} enPath={levelPath(difficulty, "en")} /><ThemeToggle locale={locale} /><Link className="header-play" href={`${home}?seviye=${difficulty}`}>{t("play")} <ArrowRight size={17} /></Link></div></div></header>
    <main id="main"><div className="wrap guide-page">
      <Link className="text-button back-button" href={home}><ArrowLeft size={17} /> {t("home")}</Link>
      <section className="guide-hero" aria-labelledby="guide-title"><span className={`difficulty-label level-${difficulty}`}><span />{levelInfo(locale, difficulty).label}</span><h1 id="guide-title">{title}</h1><p>{page.intro}</p><Link className="button primary" href={`${home}?seviye=${difficulty}`}>{t("guidePlay")} <ArrowRight size={19} /></Link><div className="guide-facts"><span><Clock3 size={16} /> {t("tenQuestions")}</span><span>{t("questionSeconds", { seconds: GAME_CONFIG.secondsPerQuestion })}</span><span>{t("noAccount")}</span></div></section>
      <section className="guide-section" aria-labelledby="guide-examples"><div className="guide-section-heading"><span className="eyebrow">{t("guideExamples")}</span><h2 id="guide-examples">{t("guideExamplesTitle")}</h2><p>{page.details}</p></div><div className="guide-examples">{samples.map((q, i) => <details key={q.id}><summary><span className="guide-number">0{i + 1}</span><span><small>{topicLabel(locale, q.category)}</small><strong>{q.question}</strong></span><span className="guide-expand" aria-hidden="true">+</span></summary><div className="guide-answer"><p><b>{q.choices.find(c => c.id === q.correctAnswer)?.text}.</b> {q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noreferrer">{t("source")} <ExternalLink size={14} /><span className="sr-only">{t("newTab")}</span></a></div></details>)}</div></section>
      <section className="guide-section" aria-labelledby="guide-rules"><span className="eyebrow">{t("guideRulesEyebrow")}</span><h2 id="guide-rules">{t("guideRulesTitle")}</h2><p>{t("guideRules", { base: GAME_CONFIG.basePoints, bonus: GAME_CONFIG.pointsPerSecond })}</p></section>
      <nav className="guide-other" aria-label={t("otherLevelsLabel")}><h2>{t("otherLevels")}</h2><div>{TURKISH_DIFFICULTIES.filter(level => level !== difficulty).map(level => <Link key={level} href={levelPath(level, locale)}>{levelTitle(level, locale)} <ArrowRight size={15} /></Link>)}</div></nav>
    </div></main>
    <footer className="site-footer"><div className="wrap footer-inner"><Link href={home}>{t("brand")}</Link><ContactLink locale={locale} /><span className="footer-tagline">{t("slogan")}</span><span className="privacy-note">{t("privacyShort")}</span></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
  </div>;
}
