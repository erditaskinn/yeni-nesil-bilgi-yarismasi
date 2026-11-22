"use client";
import Image from "next/image";
import { useI18n } from "./locale-provider";
import { levelInfo, categoryInfo } from "../lib/locale";

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
  Users,
} from "lucide-react";
import Link from "next/link";
import { TURKISH_DIFFICULTIES } from "../lib/config";
import { levelPath, levelTitle } from "../lib/level-pages";
import { TOPIC_CATEGORIES, categoryPath, categoryTitle } from "../lib/category-pages";

export function Home({ onPlay, onDaily, onStatistics, onMultiplayer, loadingDaily, compact = false }: { onPlay: () => void; onDaily: () => void; onStatistics: () => void; onMultiplayer?: () => void; loadingDaily: boolean; compact?: boolean }) {
  const { locale, t } = useI18n();
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
            <span className="small-line" />{t("heroEyebrow")}</span>
          <h1 id="home-title" tabIndex={-1}>{t("brandTop")}<br />
            <span>{t("brandBottom")}</span>
          </h1>
          <p className="slogan">{t("slogan")}</p>
          {!compact && <p className="hero-description">{t("heroDescription")}</p>}
          <button className="button primary hero-cta" onClick={onPlay}>{t("play")}<ArrowRight size={20} />
          </button>
          {!compact && <div className="hero-notes">
            <span>
              <Check size={15} />{t("noAccount")}</span>
            <span>
              <Check size={15} />{t("solo")}</span>
          </div>}
        </div>
        <div className="hero-visual"><Image src="/native/quiz-mascot.png" alt="" width={420} height={420} priority unoptimized /></div>
        {!compact && <div className="hero-bottom">
          <span>{t("tenQuestions")}</span>
          <i />
          <span>{t("threeLevels")}</span>
          <i />
          <span>{t("newFacts")}</span>
        </div>}
      </section>
      <section className={`daily-band${compact ? " compact" : ""}`}><div className="wrap daily-content"><CalendarDays size={30} /><div><span className="eyebrow">{t("dailyEyebrow")}</span><h2>{t("daily")}</h2>{!compact && <p>{t("dailyDescription")}</p>}</div><button className="button primary" onClick={onDaily} disabled={loadingDaily}>{loadingDaily ? t("preparing") : t("dailyPlay")}<ArrowRight size={18} /></button></div></section>
      {onMultiplayer && <section className="multiplayer-band"><div className="wrap multiplayer-band-inner"><Users size={28} aria-hidden="true" /><div><span className="eyebrow">UYGULAMAYA ÖZEL</span><h2>Arkadaşlarla Yarış</h2></div><button className="button primary" onClick={onMultiplayer}>Oda Kur veya Katıl <ArrowRight size={18} /></button></div></section>}
      {!compact && <>
      <section
        className="how-section wrap"
        id="nasil-oynanir"
        aria-labelledby="how-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t("howEyebrow")}</span>
            <h2 id="how-title">{t("howTitle")}</h2>
          </div>
          <span className="section-note">{t("rival")}</span>
        </div>
        <ol className="steps">
          <li>
            <span className="step-icon mint">
              <Compass />
            </span>
            <span className="step-number">01</span>
            <h3>{t("step1")}</h3>
            <p>{t("step1Text")}</p>
            <ChevronRight className="step-arrow" />
          </li>
          <li>
            <span className="step-icon lilac">
              <ListChecks />
            </span>
            <span className="step-number">02</span>
            <h3>{t("step2")}</h3>
            <p>{t("step2Text")}</p>
            <ChevronRight className="step-arrow" />
          </li>
          <li>
            <span className="step-icon yellow">
              <Trophy />
            </span>
            <span className="step-number">03</span>
            <h3>{t("step3")}</h3>
            <p>{t("step3Text")}</p>
          </li>
        </ol>
      </section>
      <section className="discovery-band">
        <div className="wrap discovery-content">
          <Lightbulb />
          <div>
            <h2>{t("discoveryTitle")}</h2>
            <p>{t("discoveryText")}</p>
          </div>
          <button className="text-button" onClick={onPlay}>{t("letsGo")}<ArrowRight size={18} />
          </button>
        </div>
      </section>
      <section className="wrap level-links-section" aria-labelledby="level-links-title">
        <span className="eyebrow">{t("levelLinksEyebrow")}</span>
        <h2 id="level-links-title">{t("levelLinksTitle")}</h2>
        <p>{t("levelLinksText")}</p>
        <div className="level-links">{TURKISH_DIFFICULTIES.map(level => <Link key={level} href={levelPath(level, locale)}><span><strong>{levelTitle(level, locale)}</strong><small>{levelInfo(locale, level).description}</small></span><ArrowRight size={19} /></Link>)}</div>
      </section>
      <section className="wrap level-links-section" aria-labelledby="category-links-title"><span className="eyebrow">{t("categoryLinksEyebrow")}</span><h2 id="category-links-title">{t("categoryLinksTitle")}</h2><div className="level-links">{TOPIC_CATEGORIES.map(category => <Link key={category} href={categoryPath(category, locale)}><span><strong>{categoryTitle(category, locale)}</strong><small>{categoryInfo(locale, category).description}</small></span><ArrowRight size={19} /></Link>)}</div><button className="text-button statistics-link" onClick={onStatistics}><ChartNoAxesCombined size={18} />{t("statistics")}</button></section>
      </>}
    </>
  );
}
