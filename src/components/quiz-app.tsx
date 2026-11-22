"use client";

import { ContactLink } from "./contact-link";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Heart, House, Search, ShieldCheck, Trophy, UserRound } from "lucide-react";
import { AccountProvider, useAccount } from "./account-provider";
import { AccountPanel } from "./account-panel";
import { AccountLinks } from "./account-links";
import { accountText, accountPath } from "../lib/account-copy";
import { Brand } from "./brand";
import { CategorySelection } from "./category-selection";
import { Home } from "./home";
import { NativeHome } from "./native-home";
import { NativeExplore } from "./native-explore";
import { SampleQuestions } from "./sample-questions";
import { LevelSelection } from "./level-selection";
import { RoundSelection } from "./round-selection";
import { roundCount, type SelectableRound } from "../lib/rounds";
import type { PaceMode } from "../lib/pace";
import { mistakeIds } from "../lib/mistakes";
import { clearRoundSession, restoreRoundSession } from "../lib/round-session";
import { Quiz } from "./quiz";
import { StatisticsPanel } from "./statistics";
import { createDailyGame } from "../lib/daily";
import { createGame, selectQuestions, type GameState } from "../lib/game";
import { questionRepository } from "../lib/question-repository";
import { DIFFICULTIES, type Difficulty } from "../lib/config";
import { GAME_CATEGORIES, type GameCategory } from "../lib/categories";
import { readHighScores, readSeenQuestions, saveSeenQuestions, type HighScores } from "../lib/storage";
import { categoryInfo, homePath, type Locale } from "../lib/locale";
import { LocaleProvider, useI18n } from "./locale-provider";
import { LanguageSwitch } from "./language-switch";
import { useAndroidBack } from "./use-android-back";
import { Capacitor } from "@capacitor/core";
import { MultiplayerLobby } from "./multiplayer-lobby";
import { adaptiveStartingDifficulty } from "../lib/adaptive-difficulty";
import { afterProfileClear, buildKnowledgeProfile } from "../lib/knowledge-profile";
import { readStatistics } from "../lib/statistics";

type Screen = "home" | "categories" | "play-mode" | "levels" | "rounds" | "quiz" | "statistics" | "account" | "multiplayer";
const subscribePreview = () => () => {};
const samplePreviewSnapshot = () => {
  const local = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  return local && new URLSearchParams(window.location.search).get("ornek-sorular") === "1";
};
const noPreview = () => false;
const nativeSnapshot = () => Capacitor.isNativePlatform();
export function QuizApp({ locale = "tr", initialScreen = "home" }: { locale?: Locale; initialScreen?: "home" | "account" }) { return <LocaleProvider locale={locale}><AccountProvider><QuizAppContent initialScreen={initialScreen} /></AccountProvider></LocaleProvider>; }
function QuizAppContent({ initialScreen }: { initialScreen: "home" | "account" }) {
  const { locale, t } = useI18n();
  const { user, nickname, revision, ready, profileRecords, profileCutoff } = useAccount();
  const userId = user?.id;
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [gameOwner, setGameOwner] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<GameCategory>("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [adaptiveRequested, setAdaptiveRequested] = useState(false);
  const [available, setAvailable] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [game, setGame] = useState<GameState | null>(null);
  const [session, setSession] = useState(0);
  const [scores, setScores] = useState<HighScores>({});
  const [loading, setLoading] = useState<Difficulty | null>(null);
  const [error, setError] = useState("");
  const samplePreview = useSyncExternalStore(subscribePreview, samplePreviewSnapshot, noPreview);
  const nativeApp = useSyncExternalStore(subscribePreview, nativeSnapshot, noPreview);
  const nativeGameShell = nativeApp;
  const mergeExpertAtHard = true;
  const showNativeTabs = nativeApp && ["home", "categories", "statistics", "account", "multiplayer"].includes(screen);
  const [sampleDismissed, setSampleDismissed] = useState(false);
  const requestId = useRef(0);
  const starting = useRef(false);
  const restored = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (screen !== "quiz")
      document.querySelector<HTMLElement>("main h1")?.focus();
  }, [screen, session]);

  function goTo(next: Screen, nextCategory: GameCategory = category) {
    if (screen === "quiz") clearRoundSession();
    requestId.current++;
    starting.current = false;
    setLoading(null);
    setError("");
    if (next === "levels") setScores(readHighScores(undefined, nextCategory, user?.id));
    if (next === "home" && window.location.pathname === accountPath(locale)) window.history.replaceState(null, "", homePath(locale));
    setScreen(next);
  }
  function chooseCategory(nextCategory: GameCategory) {
    setCategory(nextCategory);
    setGame(null);
    setAdaptiveRequested(false);
    goTo(locale === "tr" ? "play-mode" : "levels", nextCategory);
  }
  useAndroidBack(() => {
    if (screen === "categories" || screen === "statistics" || screen === "account" || screen === "multiplayer") { goTo("home"); return true; }
    if (screen === "play-mode") { goTo("categories"); return true; }
    if (screen === "levels") { goTo("categories"); return true; }
    if (screen === "rounds") { goTo(adaptiveRequested ? "play-mode" : "levels"); return true; }
    return false;
  });
  const chooseLevel = useCallback(async (level: Difficulty, selectedCategory: GameCategory, includeExpert = mergeExpertAtHard) => {
    const id = ++requestId.current;
    starting.current = false;
    setDifficulty(level); setCategory(selectedCategory); setAvailable(0); setMistakeCount(0); setError(""); setLoading(level); setScreen("rounds");
    try {
      const pool = await questionRepository.getByDifficulty(level, selectedCategory, locale, includeExpert);
      if (id !== requestId.current) return;
      setAvailable(new Set(pool.map(q => q.id)).size);
      const missed = mistakeIds(userId);
      setMistakeCount(new Set(pool.filter(q => missed.has(q.id)).map(q => q.id)).size);
    } catch { if (id === requestId.current) setError(t("questionsError")); }
    finally { if (id === requestId.current) setLoading(null); }
  }, [locale, mergeExpertAtHard, t, userId]);

  const chooseAdaptiveMode = useCallback(async () => {
    setAdaptiveRequested(true);
    setLoading("medium");
    setError("");
    try {
      const pool = await questionRepository.getAll("tr");
      const records = [...readStatistics().games, ...profileRecords].filter(record => record.owner === userId && afterProfileClear(record, profileCutoff));
      const knowledge = buildKnowledgeProfile(records, pool);
      const profile = category === "mixed" ? knowledge : knowledge.categories.find(item => item.category === category);
      const availableLevels = DIFFICULTIES.filter(level => pool.some(question => question.difficulty === level && question.active !== false && (category === "mixed" || question.category === category)));
      const level = adaptiveStartingDifficulty(profile ? { answered: profile.answered, percentage: profile.percentage } : null, availableLevels);
      if (!level) { setError("Bu kategoride oynanabilir soru bulunamadı."); return; }
      await chooseLevel(level, category, false);
    } catch { setError(t("questionsError")); }
    finally { setLoading(null); }
  }, [category, chooseLevel, t, userId, profileRecords, profileCutoff]);

  const start = useCallback(async (level: Difficulty, selectedCategory: GameCategory, mode: SelectableRound = "standard", pace: PaceMode = "competition") => {
    if (starting.current) return;
    starting.current = true;
    const id = ++requestId.current;
    setLoading(level);
    setError("");
    try {
      const pool = await questionRepository.getByDifficulty(level, selectedCategory, locale, mode !== "adaptive" && mergeExpertAtHard);
      if (id !== requestId.current) return;
      const missed = mistakeIds(userId);
      const eligible = mode === "mistakes" ? pool.filter(q => missed.has(q.id)) : pool;
      const selected = selectQuestions(eligible, level, {
        category: selectedCategory,
        seenQuestionIds: readSeenQuestions(),
        count: mode === "adaptive" ? Math.min(5, new Set(eligible.map(q => q.id)).size) : roundCount(mode, new Set(eligible.map(q => q.id)).size),
        includeExpertAtHard: mode !== "adaptive" && mergeExpertAtHard,
      });
      setGame({ ...createGame(selected, level, Date.now(), selectedCategory, mode, pace, mode === "adaptive"), sessionId: crypto.randomUUID() });
      setGameOwner(userId);
      setCategory(selectedCategory);
      if (mode !== "endless") saveSeenQuestions(selected.map((q) => q.id));
      setSession((n) => n + 1);
      setScreen("quiz");
    } catch (e) {
      if (id === requestId.current) {
        setError(t(e instanceof Error && e.message === "Bu kategori ve seviye için yeterli soru bulunamadı." ? "poolError" : "questionsError"));
        setScreen("rounds");
      }
    } finally {
      if (id === requestId.current) {
        starting.current = false;
        setLoading(null);
      }
    }
  }, [locale, mergeExpertAtHard, t, userId]);

  useEffect(() => {
    if (!ready || restored.current) return;
    if (initialScreen !== "home" || window.location.search) return;
    let active = true;
    void questionRepository.getAll(locale).then(pool => {
      const previous = restoreRoundSession(pool, locale, userId, Date.now(), undefined, mergeExpertAtHard);
      if (!active || !previous || requestId.current) return;
      restored.current = true;
      setGame(previous); setGameOwner(userId); setCategory(previous.category); setDifficulty(previous.difficulty); setAdaptiveRequested(previous.adaptive === true); setScreen("quiz");
    }).catch(() => {});
    return () => { active = false; };
  }, [ready, userId, locale, initialScreen, mergeExpertAtHard]);

  const startDaily = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    const id = ++requestId.current;
    setLoading("medium");
    setError("");
    try {
      const pool = await questionRepository.getAll(locale);
      if (id !== requestId.current) return;
      setGame({ ...createDailyGame(pool, Date.now()), sessionId: crypto.randomUUID() });
      setGameOwner(userId);
      setCategory("mixed");
      setSession(n => n + 1);
      setScreen("quiz");
    } catch {
      if (id === requestId.current) { setError(t("dailyError")); setScreen("home"); }
    } finally {
      if (id === requestId.current) { starting.current = false; setLoading(null); }
    }
  }, [locale, t, userId]);

  useEffect(() => {
    const refresh = window.setTimeout(() => { if (screen === "levels") setScores(readHighScores(undefined, category, user?.id)); }, 0);
    return () => window.clearTimeout(refresh);
  }, [screen, category, user?.id, revision]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const level = query.get("seviye");
    const requestedCategory = query.get("kategori");
    const selectedCategory = GAME_CATEGORIES.find(item => item === requestedCategory) ?? "mixed";
    if (query.get("mod") === "gunluk") {
      const timer = window.setTimeout(() => { window.history.replaceState(null, "", homePath(locale)); void startDaily(); }, 0);
      return () => window.clearTimeout(timer);
    }
    if (DIFFICULTIES.some(item => item === level)) {
      const selectedLevel = level === "expert" ? "hard" : level as Difficulty;
      const timer = window.setTimeout(() => { window.history.replaceState(null, "", homePath(locale)); void chooseLevel(selectedLevel, selectedCategory); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [chooseLevel, startDaily, locale]);

  if (samplePreview && !sampleDismissed) return <SampleQuestions locale={locale} onExit={() => {
    window.history.replaceState(null, "", homePath(locale));
    setSampleDismissed(true);
  }} />;

  return (
    <div className={`app-shell${screen === "quiz" ? " quiz-screen" : ""}${nativeApp ? " native-app" : ""}${nativeGameShell ? " native-game-shell" : ""}${showNativeTabs ? " native-tabs-visible" : ""}${!nativeApp ? " tr-web-design" : ""}`}>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          {screen === "quiz" ? (
            <Brand locale={locale} />
          ) : (
            <button
              className="brand-button"
              onClick={() => goTo("home")}
              aria-label={t("homeLabel")}
            >
              <Brand locale={locale} />
            </button>
          )}
          {screen === "home" ? (
            <nav aria-label={t("menu")}>
              {!nativeApp && <a className="nav-how" href="#nasil-oynanir">
                {t("how")}
              </a>}
              <button className="header-play" onClick={() => goTo("categories")}>
                {t("start")} <ArrowUpRight size={17} />
              </button>
            </nav>
          ) : (
            <span className="header-note">
              <ShieldCheck size={17} /> {t("alone")}
            </span>
          )}
          <div className="header-tools">{screen !== "quiz" && <><LanguageSwitch locale={locale} /><button className="theme-toggle" aria-label={accountText(locale, user ? "account" : "login")} title={accountText(locale, user ? "account" : "login")} onClick={() => goTo("account")}><UserRound size={20} aria-hidden="true" /></button></>}{nativeApp && <SoundToggle />}<ThemeToggle locale={locale} /></div>
        </div>
      </header>
      <main id="main">
        {screen === "home" && (nativeApp
          ? <NativeHome locale={locale} nickname={nickname} scoreOwner={userId} onDaily={() => void startDaily()} onExplore={() => goTo("categories")} onStatistics={() => goTo("statistics")} onMultiplayer={() => goTo("multiplayer")} loadingDaily={loading !== null} error={error} />
          : <><Home onPlay={() => goTo("categories")} onDaily={() => void startDaily()} onStatistics={() => goTo("statistics")} loadingDaily={loading !== null} /><p className="wrap" role="alert">{error}</p></>)}
        {screen === "multiplayer" && nativeApp && locale === "tr" && <MultiplayerLobby onBack={() => goTo("home")} onAccount={() => goTo("account")} />}
        {screen === "statistics" && <StatisticsPanel onBack={() => goTo("home")} onPlay={() => goTo("categories")} native={nativeApp} />}
        {screen === "account" && <AccountPanel onBack={() => goTo("home")} />}
        {screen === "account" && nativeApp && <div className="native-game-legal"><AccountLinks locale={locale} /><ContactLink locale={locale} /></div>}
        {screen === "categories" && (nativeApp
          ? <NativeExplore locale={locale} onSelect={chooseCategory} />
          : <CategorySelection onBack={() => goTo("home")} onSelect={chooseCategory} />)}
        {screen === "play-mode" && <section className="wrap level-page" aria-labelledby="play-mode-title">
          <button className="text-button back-button" onClick={() => goTo("categories")}>← Kategori seçimine dön</button>
          <div className="page-heading"><span className="eyebrow">{categoryInfo(locale, category).label}</span><h1 id="play-mode-title" tabIndex={-1}>Nasıl oynamak istersin?</h1><p>İstersen seviyeni kendin seç, istersen sorular sana göre ayarlansın.</p></div>
          <div className="level-grid">
            <button type="button" className="level-card" disabled={loading !== null} onClick={() => { setAdaptiveRequested(false); goTo("levels"); }}><div className="level-top">🎯</div><div className="selection-copy"><h2>Klasik mod</h2><p>Kolay, orta veya zor seviyeyi sen seç. Tur boyunca seviye değişmez.</p></div><div className="level-bottom">Seviyeni kendin belirle</div></button>
            <button type="button" className="level-card" disabled={loading !== null} onClick={() => void chooseAdaptiveMode()}><div className="level-top">🧠</div><div className="selection-copy"><h2>Uyarlanabilir mod</h2><p>Sistem seviyeni geçmiş performansına göre başlatır. Sonsuz turda her 5 cevaptan sonra son 5 cevabına bakar: 4–5 doğruysa yükseltir, 0–2 doğruysa düşürür, 3 doğruysa aynı tutar. Her seferinde en fazla bir basamak değişir. Yanlış cevapta tur bitmez; doğru yanıtı ve açıklamasını görüp devam edersin. İstediğinde “Turu bitir” ile sonuçlarını görebilirsin.</p></div><div className="level-bottom">{loading ? "Seviyen belirleniyor…" : "Sana uygun seviyede başla"}</div></button>
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
        </section>}
        {screen === "levels" && (
          <LevelSelection
            category={category}
            onBack={() => goTo("categories")}
            onSelect={(level) => void chooseLevel(level, category)}
            scores={scores}
            loading={loading}
            error={error}
          />
        )}
        {screen === "rounds" && <><RoundSelection key={`${category}:${difficulty}:${adaptiveRequested}`} category={category} difficulty={difficulty} available={available} mistakes={mistakeCount} owner={userId} loading={loading !== null} error={error} adaptive={adaptiveRequested} onBack={() => goTo(adaptiveRequested ? "play-mode" : "levels")} onSelect={(mode, pace) => void start(difficulty, category, mode, pace)} />{adaptiveRequested && <p className="wrap" role="note">Uyarlanabilir modda doğru veya yanlış her cevaptan sonra yeni soru gelir. Her 5 cevapta zorluk performansına göre ayarlanır. İstediğinde “Turu bitir” ile sonuçlarını görebilirsin; kategoride sorulmamış soru kalmazsa tur sona erer.</p>}</>}
        {screen === "quiz" && game && (
          <Quiz
            key={session}
            initialState={game}
            scoreOwner={gameOwner}
            onExit={() => goTo(game.dailyDate ? "home" : game.adaptive ? "play-mode" : "levels")}
            onReplay={() => { clearRoundSession(); if (game.dailyDate) void startDaily(); else if (game.mode === "mistakes") void chooseLevel(game.difficulty, game.category); else void start(game.difficulty, game.category, game.mode as SelectableRound, game.pace); }}
            onLevels={() => goTo(game.adaptive ? "play-mode" : "levels", game.category)}
            onCategories={() => goTo("categories")}
            onHome={() => goTo("home")}
            onProfile={() => goTo("statistics")}
            enableSoundEffects={nativeApp}
            includeExpertAtHard={mergeExpertAtHard}
          />
        )}
      </main>
      {showNativeTabs && <nav className="native-game-tabs" aria-label={t("menu")}>
        <button type="button" aria-current={screen === "home" ? "page" : undefined} onClick={() => goTo("home")}><House size={20} aria-hidden="true" /><span>{t("home")}</span></button>
        <button type="button" aria-current={screen === "categories" ? "page" : undefined} onClick={() => goTo("categories")}><Search size={20} aria-hidden="true" /><span>{t("nativeExplore")}</span></button>
        <button type="button" aria-current={screen === "statistics" ? "page" : undefined} onClick={() => goTo("statistics")}><Trophy size={20} aria-hidden="true" /><span>{t("nativeProgress")}</span></button>
        <button type="button" aria-current={screen === "account" ? "page" : undefined} onClick={() => goTo("account")}><UserRound size={20} aria-hidden="true" /><span>{t("nativeProfile")}</span></button>
      </nav>}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>{t("brand")}</span>
          <ContactLink locale={locale} />
          <AccountLinks locale={locale} />
          <span className="footer-tagline">
            {t("footer")} <Heart size={13} />
          </span>
          <span className="privacy-note">
            {t("privacy")}
          </span>
        </div>
      </footer>
    </div>
  );
}
