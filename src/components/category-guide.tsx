import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Brand } from "./brand";
import { CATEGORY_PAGES, TOPIC_CATEGORIES, categoryPath, categoryTitle, type TopicCategory } from "../lib/category-pages";
import { DIFFICULTIES, LEVELS, SITE_URL } from "../lib/config";
import { matchesCategory } from "../lib/categories";
import { questions } from "../data/questions";

export function CategoryGuide({ category }: { category: TopicCategory }) {
  const page = CATEGORY_PAGES[category];
  const title = categoryTitle(category);
  const samples = DIFFICULTIES.map(level => questions.find(q => q.difficulty === level && matchesCategory(q.category, category))!);
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL }, { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${categoryPath(category)}` }] };
  return <div className="app-shell">
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <header className="site-header"><div className="wrap header-inner"><Link className="brand-button brand-link" href="/" aria-label="Yeni Nesil Bilgi Yarışması ana sayfa"><Brand /></Link></div></header>
    <main id="main"><div className="wrap guide-page">
      <Link className="text-button back-button" href="/"><ArrowLeft size={17} /> Ana sayfa</Link>
      <section className="guide-hero"><span className="eyebrow">KONUNU SEÇ, MERAKINI TAKİP ET</span><h1>{title}</h1><p>{page.intro}</p><div className="level-links">{DIFFICULTIES.map(level => <Link key={level} href={`/?kategori=${category}&seviye=${level}`}><span><strong>{LEVELS[level].label}</strong><small>{LEVELS[level].description}</small></span><ArrowRight size={18} /></Link>)}</div></section>
      <section className="guide-section" aria-labelledby="sample-title"><span className="eyebrow">DÖRT SEVİYE, DÖRT ÖRNEK</span><h2 id="sample-title">Sorulara göz at</h2><p>{page.detail}</p><div className="guide-examples">{samples.map(q => <details key={q.id}><summary><span><small>{LEVELS[q.difficulty].label} · {q.category}</small><strong>{q.question}</strong></span><span className="guide-expand" aria-hidden="true">+</span></summary><div className="guide-answer"><p><b>{q.choices.find(c => c.id === q.correctAnswer)?.text}.</b> {q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noreferrer">Kaynağı incele <ExternalLink size={14} /><span className="sr-only"> (yeni sekmede açılır)</span></a></div></details>)}</div></section>
      <nav className="guide-other" aria-label="Diğer kategoriler"><h2>Başka bir konu keşfet</h2><div>{TOPIC_CATEGORIES.filter(item => item !== category).map(item => <Link key={item} href={categoryPath(item)}>{categoryTitle(item)} <ArrowRight size={15} /></Link>)}</div></nav>
    </div></main><footer className="site-footer"><div className="wrap footer-inner"><Link href="/">Yeni Nesil Bilgi Yarışması</Link><span>Bilgini göster, eğlenerek öğren!</span></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
  </div>;
}
