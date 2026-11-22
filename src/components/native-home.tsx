"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight, ChartNoAxesCombined, Compass, Play, Sparkles, Trophy, UserRound, Users } from "lucide-react";
import { readHighScores } from "../lib/storage";
import { SoundToggle } from "./sound-toggle";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitch } from "./language-switch";
import { numberLocale, translate, type Locale } from "../lib/locale";

export function NativeHome({
  locale,
  nickname,
  scoreOwner,
  onDaily,
  onExplore,
  onStatistics,
  onMultiplayer,
  loadingDaily,
  error,
}: {
  locale: Locale;
  nickname: string;
  scoreOwner?: string;
  onDaily: () => void;
  onExplore: () => void;
  onStatistics: () => void;
  onMultiplayer: () => void;
  loadingDaily: boolean;
  error: string;
}) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const firstName = nickname.trim().split(/\s+/)[0] || t("nativeContestant");
  const best = Math.max(0, ...Object.values(readHighScores(undefined, "mixed", scoreOwner)));

  return <section className="native-game-home" aria-labelledby="native-home-title">
    <div className="native-game-welcome">
      <span className="native-game-avatar" aria-hidden="true"><UserRound size={25} /></span>
      <div className="native-game-welcome-copy">
        <span>{t("nativeWelcome")}</span>
        <h1 id="native-home-title" tabIndex={-1}>{t("nativeHello")}, {firstName}</h1>
      </div>
      <div className="native-game-tools"><SoundToggle /><ThemeToggle locale={locale} /></div>
    </div>
    <LanguageSwitch locale={locale} />

    <div className="native-game-daily">
      <span className="native-game-daily-kicker"><Sparkles size={15} aria-hidden="true" /> {t("nativeDailyEyebrow")}</span>
      <div className="native-game-daily-copy">
        <h2>{t("nativeDailyTitle")}</h2>
        <p>{t("nativeDailyText")}</p>
        <button type="button" onClick={onDaily} disabled={loadingDaily}>
          {loadingDaily ? t("preparing") : t("nativeBegin")}<ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      <Image className="native-game-mascot" src="/native/quiz-mascot.png" alt="" width={320} height={320} priority unoptimized />
    </div>
    {error && <p className="native-game-error" role="alert">{error}</p>}

    <button type="button" className="native-game-best" onClick={onStatistics}>
      <span className="native-game-best-icon" aria-hidden="true"><ChartNoAxesCombined size={27} /></span>
      <span className="native-game-best-copy"><small>{t("nativeBestLabel")}</small><strong>{best ? `${best.toLocaleString(numberLocale(locale))} ${t("points")}` : t("nativeFirstBest")}</strong></span>
      <ChevronRight size={22} aria-hidden="true" />
    </button>

    <div className="native-game-quick-actions">
      <button type="button" aria-label={t("play")} onClick={onExplore}>
        <span className="native-game-action-icon native-game-action-yellow"><Trophy size={29} aria-hidden="true" /></span>
        <strong>{t("play")}</strong>
        <small><Play size={14} aria-hidden="true" /> {t("nativeStartNow")}</small>
        <ArrowRight size={20} className="native-game-action-arrow" aria-hidden="true" />
      </button>
      <button type="button" aria-label={t("nativeFriends")} onClick={onMultiplayer}>
        <span className="native-game-action-icon native-game-action-teal"><Users size={29} aria-hidden="true" /></span>
        <strong>{t("nativeFriends")}</strong>
        <small><Play size={14} aria-hidden="true" /> {t("nativeJoinRoom")}</small>
        <ArrowRight size={20} className="native-game-action-arrow" aria-hidden="true" />
      </button>
    </div>

    <button type="button" className="native-game-discover-link" onClick={onExplore}>
      <span className="native-game-discover-icon" aria-hidden="true"><Compass size={24} /></span>
      <span><strong>{t("nativeDiscover")}</strong><small>{t("nativeDiscoverSub")}</small></span>
      <ChevronRight size={20} aria-hidden="true" />
    </button>
  </section>;
}
