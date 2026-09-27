import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from "lucide-react";
import { Brand } from "./brand";
import { DIFFICULTIES, GAME_CONFIG, LEVELS, SITE_URL, type Difficulty } from "../lib/config";
import { LEVEL_PAGES, levelPath, levelTitle } from "../lib/level-pages";
import { questions } from "../data/questions";

export function LevelGuide({ difficulty }: { difficulty: Difficulty }) {
  const page = LEVEL_PAGES[difficulty];
  const title = levelTitle(difficulty);
  const samples = page.sampleIds.map(id => questions.find(q => q.id === id)!);
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${levelPath(difficulty)}` },
    ],
  };

  return <div className="app-shell">
    <header className="site-header"><div className="wrap header-inner"><Link className="brand-button brand-link" href="/" aria-label="Yeni Nesil Bilgi Yarışması ana sayfa"><Brand /></Link><Link className="header-play" href={`/?seviye=${difficulty}`}>Hemen Oyna <ArrowRight size={17} /></Link></div></header>
    <main id="main">
      <div className="wrap guide-page">
        <Link className="text-button back-button" href="/"><ArrowLeft size={17} /> Ana sayfa</Link>
        <section className="guide-hero" aria-labelledby="guide-title"><span className={`difficulty-label level-${difficulty}`}><span />{LEVELS[difficulty].label}</span><h1 id="guide-title">{title}</h1><p>{page.intro}</p><Link className="button primary" href={`/?seviye=${difficulty}`}>Bu Seviyede Oyna <ArrowRight size={19} /></Link><div className="guide-facts"><span><Clock3 size={16} /> {GAME_CONFIG.questionCount} soru</span><span>Her soruya {GAME_CONFIG.secondsPerQuestion} saniye</span><span>Üyelik gerektirmez</span></div></section>
        <section className="guide-section" aria-labelledby="guide-examples"><div className="guide-section-heading"><span className="eyebrow">ÖRNEK SORULAR</span><h2 id="guide-examples">Bu seviyede neler soruluyor?</h2><p>{page.details}</p></div><div className="guide-examples">{samples.map((q, i) => <details key={q.id}><summary><span className="guide-number">0{i + 1}</span><span><small>{q.category}</small><strong>{q.question}</strong></span><span className="guide-expand" aria-hidden="true">+</span></summary><div className="guide-answer"><p><b>{q.choices.find(c => c.id === q.correctAnswer)?.text}.</b> {q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noreferrer">Kaynağı incele <ExternalLink size={14} /><span className="sr-only"> (yeni sekmede açılır)</span></a></div></details>)}</div></section>
        <section className="guide-section" aria-labelledby="guide-rules"><span className="eyebrow">OYUN NASIL İŞLER?</span><h2 id="guide-rules">Soruyu cevapla, bilgisini de öğren.</h2><p>Her doğru cevap {GAME_CONFIG.basePoints} puan kazandırır. Kalan her saniye için {GAME_CONFIG.pointsPerSecond} ek puan alırsın. Yanlış cevap ve süre aşımı puan kazandırmaz; ikisinde de doğru cevabı ve açıklamasını görürsün. Sonuç ekranından yeni bir tura başlayabilir veya sonucunu paylaşabilirsin.</p></section>
        <nav className="guide-other" aria-label="Diğer zorluk seviyeleri"><h2>Diğer seviyeleri keşfet</h2><div>{DIFFICULTIES.filter(level => level !== difficulty).map(level => <Link key={level} href={levelPath(level)}>{levelTitle(level)} <ArrowRight size={15} /></Link>)}</div></nav>
      </div>
    </main>
    <footer className="site-footer"><div className="wrap footer-inner"><Link href="/">Yeni Nesil Bilgi Yarışması</Link><span className="footer-tagline">Bilgini göster, eğlenerek öğren!</span><span className="privacy-note">Üyeliksiz. Reklamsız.</span></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
  </div>;
}
