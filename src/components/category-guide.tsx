import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ContactLink } from "./contact-link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Brand } from "./brand";
import { LanguageSwitch } from "./language-switch";
import { categoryPage, TOPIC_CATEGORIES, categoryPath, categoryTitle, type TopicCategory } from "../lib/category-pages";
import { DIFFICULTIES, TURKISH_DIFFICULTIES, SITE_URL } from "../lib/config";
import { matchesCategory } from "../lib/categories";
import { questionsForLocale } from "../lib/question-repository";
import { homePath, levelInfo, topicLabel, translate, type Locale } from "../lib/locale";

export async function CategoryGuide({ category, locale = "tr" }: { category: TopicCategory; locale?: Locale }) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const page = categoryPage(category, locale);
  const title = categoryTitle(category, locale);
  const home = homePath(locale);
  const questions = await questionsForLocale(locale);
  const visibleDifficulties = TURKISH_DIFFICULTIES;
  const isInLevel = (level: typeof DIFFICULTIES[number], difficulty: typeof DIFFICULTIES[number]) => difficulty === level || level === "hard" && difficulty === "expert";
  const levels = visibleDifficulties.filter(level => questions.some(q => isInLevel(level, q.difficulty) && matchesCategory(q.category, category)));
  const samples = levels.map(level => questions.find(q => q.difficulty === level && matchesCategory(q.category, category)) ?? questions.find(q => isInLevel(level, q.difficulty) && matchesCategory(q.category, category))!);
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: t("home"), item: `${SITE_URL}${home}` }, { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${categoryPath(category, locale)}` }] };
  return <div className="app-shell tr-web-design">
    <a className="skip-link" href="#main">{t("skip")}</a>
    <header className="site-header"><div className="wrap header-inner"><Link className="brand-button brand-link" href={home} aria-label={t("homeLabel")}><Brand locale={locale} /></Link><div className="header-tools"><LanguageSwitch locale={locale} trPath={categoryPath(category)} enPath={categoryPath(category, "en")} /><ThemeToggle locale={locale} /></div></div></header>
    <main id="main"><div className="wrap guide-page">
      <Link className="text-button back-button" href={home}><ArrowLeft size={17} /> {t("home")}</Link>
      <section className="guide-hero"><span className="eyebrow">{t("categoryGuideEyebrow")}</span><h1>{title}</h1><p>{page.intro}</p><div className="level-links">{levels.map(level => <Link key={level} href={`${home}?kategori=${category}&seviye=${level}`}><span><strong>{levelInfo(locale, level).label}</strong><small>{levelInfo(locale, level).description}</small></span><ArrowRight size={18} /></Link>)}</div></section>
      <section className="guide-section" aria-labelledby="sample-title"><span className="eyebrow">{t("fourSamples")}</span><h2 id="sample-title">{t("browseSamples")}</h2><p>{page.detail}</p><div className="guide-examples">{samples.map(q => <details key={q.id}><summary><span><small>{levelInfo(locale, q.difficulty).label} · {topicLabel(locale, q.category)}</small><strong>{q.question}</strong></span><span className="guide-expand" aria-hidden="true">+</span></summary><div className="guide-answer"><p><b>{q.choices.find(c => c.id === q.correctAnswer)?.text}.</b> {q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noreferrer">{t("source")} <ExternalLink size={14} /><span className="sr-only">{t("newTab")}</span></a></div></details>)}</div></section>
      <nav className="guide-other" aria-label={t("otherCategoriesLabel")}><h2>{t("otherCategories")}</h2><div>{TOPIC_CATEGORIES.filter(item => item !== category).map(item => <Link key={item} href={categoryPath(item, locale)}>{categoryTitle(item, locale)} <ArrowRight size={15} /></Link>)}</div></nav>
    </div></main><footer className="site-footer"><div className="wrap footer-inner"><Link href={home}>{t("brand")}</Link><ContactLink locale={locale} /><span>{t("slogan")}</span></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
  </div>;
}
