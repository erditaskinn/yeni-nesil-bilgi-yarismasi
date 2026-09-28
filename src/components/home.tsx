import {
  ArrowRight,
  Check,
  ChevronRight,
  Compass,
  Lightbulb,
  ListChecks,
  Sparkles,
  Trophy,
  CalendarDays,
  ChartNoAxesCombined,
} from "lucide-react";
import Link from "next/link";
import { DIFFICULTIES, LEVELS } from "../lib/config";
import { levelPath, levelTitle } from "../lib/level-pages";
import { TOPIC_CATEGORIES, categoryPath, categoryTitle } from "../lib/category-pages";
import { CATEGORIES } from "../lib/categories";

export function Home({ onPlay, onDaily, onStatistics, loadingDaily }: { onPlay: () => void; onDaily: () => void; onStatistics: () => void; loadingDaily: boolean }) {
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-art" aria-hidden="true">
          <div className="art-tile art-question">?</div>
          <div className="art-tile art-check">
            <Check strokeWidth={2.5} />
          </div>
          <span className="art-spark spark-one">
            <Sparkles />
          </span>
          <span className="art-spark spark-two">
            <Sparkles />
          </span>
          <span className="art-letter letter-a">A</span>
          <span className="art-letter letter-b">B</span>
        </div>
        <div className="hero-content">
          <span className="eyebrow">
            <span className="small-line" /> MERAKIN OYUNA DÖNÜŞSÜN
          </span>
          <h1 id="home-title" tabIndex={-1}>
            Yeni Nesil
            <br />
            <span>Bilgi Yarışması</span>
          </h1>
          <p className="slogan">Bilgini göster, eğlenerek öğren!</p>
          <p className="hero-description">
            İstediğin an başla, kategorini ve seviyeni seç, bilgini test et
            <br className="desktop-break" /> ve yeni şeyler öğren.
          </p>
          <button className="button primary hero-cta" onClick={onPlay}>
            Hemen Oyna <ArrowRight size={20} />
          </button>
          <div className="hero-notes">
            <span>
              <Check size={15} /> Üyelik gerektirmez
            </span>
            <span>
              <Check size={15} /> Tek başına, istediğin an
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <span>10 SORU</span>
          <i />
          <span>4 SEVİYE</span>
          <i />
          <span>YEPYENİ BİLGİLER</span>
        </div>
      </section>
      <section className="daily-band"><div className="wrap daily-content"><CalendarDays size={30} /><div><span className="eyebrow">BUGÜNÜN KEŞFİ</span><h2>Günlük 10 Soru</h2><p>Her gün yeni bir tur. Aynı gün, herkes için aynı sorular.</p></div><button className="button primary" onClick={onDaily} disabled={loadingDaily}>{loadingDaily ? "Hazırlanıyor" : "Günlük Turu Oyna"}<ArrowRight size={18} /></button></div></section>
      <section
        className="how-section wrap"
        id="nasil-oynanir"
        aria-labelledby="how-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">KÜÇÜK BİR MOLA, BÜYÜK BİR KEŞİF</span>
            <h2 id="how-title">Üç adımda oyundasın.</h2>
          </div>
          <span className="section-note">Rakibin, dünkü sen.</span>
        </div>
        <ol className="steps">
          <li>
            <span className="step-icon mint">
              <Compass />
            </span>
            <span className="step-number">01</span>
            <h3>Kategorini ve seviyeni seç</h3>
            <p>Karışık sorularla başla veya sevdiğin konuya yönel.</p>
            <ChevronRight className="step-arrow" />
          </li>
          <li>
            <span className="step-icon lilac">
              <ListChecks />
            </span>
            <span className="step-number">02</span>
            <h3>10 soruyu cevapla</h3>
            <p>Her soruda bilgini sına, cevabın ardındaki bilgiyi keşfet.</p>
            <ChevronRight className="step-arrow" />
          </li>
          <li>
            <span className="step-icon yellow">
              <Trophy />
            </span>
            <span className="step-number">03</span>
            <h3>Sonucunu gör ve paylaş</h3>
            <p>Kendi rekorunu geliştir, arkadaşlarını da oyuna davet et.</p>
          </li>
        </ol>
      </section>
      <section className="discovery-band">
        <div className="wrap discovery-content">
          <Lightbulb />
          <div>
            <h2>Doğru cevap da bir kazanç, yeni bir bilgi de.</h2>
            <p>
              Bilimden sanata, tarihten coğrafyaya. Her sorunun sonunda kısa bir
              keşif seni bekliyor.
            </p>
          </div>
          <button className="text-button" onClick={onPlay}>
            Hadi başlayalım <ArrowRight size={18} />
          </button>
        </div>
      </section>
      <section className="wrap level-links-section" aria-labelledby="level-links-title">
        <span className="eyebrow">KENDİ YOLUNU SEÇ</span>
        <h2 id="level-links-title">Hangi seviyeden başlayacaksın?</h2>
        <p>Her seviyede bilim, tarih, coğrafya, sanat ve farklı genel kültür konularından sorular bulunur. Örnek sorulara göz atıp sana uygun turu seçebilirsin.</p>
        <div className="level-links">{DIFFICULTIES.map(level => <Link key={level} href={levelPath(level)}><span><strong>{levelTitle(level)}</strong><small>{LEVELS[level].description}</small></span><ArrowRight size={19} /></Link>)}</div>
      </section>
      <section className="wrap level-links-section" aria-labelledby="category-links-title"><span className="eyebrow">KONULARI KEŞFET</span><h2 id="category-links-title">Merakın hangi yönde?</h2><div className="level-links">{TOPIC_CATEGORIES.map(category => <Link key={category} href={categoryPath(category)}><span><strong>{categoryTitle(category)}</strong><small>{CATEGORIES[category].description}</small></span><ArrowRight size={19} /></Link>)}</div><button className="text-button statistics-link" onClick={onStatistics}><ChartNoAxesCombined size={18} /> İstatistiklerim</button></section>
    </>
  );
}
