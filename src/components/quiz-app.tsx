"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, ShieldCheck } from "lucide-react";
import { Brand } from "./brand";
import { CategorySelection } from "./category-selection";
import { Home } from "./home";
import { LevelSelection } from "./level-selection";
import { Quiz } from "./quiz";
import { StatisticsPanel } from "./statistics";
import { createDailyGame } from "../lib/daily";
import { createGame, selectQuestions, type GameState } from "../lib/game";
import { questionRepository } from "../lib/question-repository";
import { DIFFICULTIES, type Difficulty } from "../lib/config";
import { GAME_CATEGORIES, type GameCategory } from "../lib/categories";
import { readHighScores, readSeenQuestions, saveSeenQuestions, type HighScores } from "../lib/storage";

type Screen = "home" | "categories" | "levels" | "quiz" | "statistics";
export function QuizApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState<GameCategory>("mixed");
  const [game, setGame] = useState<GameState | null>(null);
  const [session, setSession] = useState(0);
  const [scores, setScores] = useState<HighScores>({});
  const [loading, setLoading] = useState<Difficulty | null>(null);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const starting = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (screen !== "quiz")
      document.querySelector<HTMLElement>("main h1")?.focus();
  }, [screen, session]);

  function goTo(next: Screen, nextCategory: GameCategory = category) {
    requestId.current++;
    starting.current = false;
    setLoading(null);
    setError("");
    if (next === "levels") setScores(readHighScores(undefined, nextCategory));
    setScreen(next);
  }
  function chooseCategory(nextCategory: GameCategory) {
    setCategory(nextCategory);
    setGame(null);
    goTo("levels", nextCategory);
  }
  const start = useCallback(async (level: Difficulty, selectedCategory: GameCategory) => {
    if (starting.current) return;
    starting.current = true;
    const id = ++requestId.current;
    setLoading(level);
    setError("");
    try {
      const pool = await questionRepository.getByDifficulty(level, selectedCategory);
      if (id !== requestId.current) return;
      const selected = selectQuestions(pool, level, {
        category: selectedCategory,
        seenQuestionIds: readSeenQuestions(),
      });
      setGame({ ...createGame(selected, level, Date.now(), selectedCategory), sessionId: crypto.randomUUID() });
      setCategory(selectedCategory);
      saveSeenQuestions(selected.map((q) => q.id));
      setSession((n) => n + 1);
      setScreen("quiz");
    } catch (e) {
      if (id === requestId.current) {
        setError(e instanceof Error ? e.message : "Sorular yüklenemedi.");
        setScreen("levels");
      }
    } finally {
      if (id === requestId.current) {
        starting.current = false;
        setLoading(null);
      }
    }
  }, []);

  const startDaily = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    const id = ++requestId.current;
    setLoading("medium");
    setError("");
    try {
      const pool = await questionRepository.getAll();
      if (id !== requestId.current) return;
      setGame({ ...createDailyGame(pool, Date.now()), sessionId: crypto.randomUUID() });
      setCategory("mixed");
      setSession(n => n + 1);
      setScreen("quiz");
    } catch {
      if (id === requestId.current) { setError("Günlük sorular yüklenemedi. Yeniden deneyebilirsin."); setScreen("home"); }
    } finally {
      if (id === requestId.current) { starting.current = false; setLoading(null); }
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const level = query.get("seviye");
    const requestedCategory = query.get("kategori");
    const selectedCategory = GAME_CATEGORIES.find(item => item === requestedCategory) ?? "mixed";
    if (query.get("mod") === "gunluk") {
      const timer = window.setTimeout(() => { window.history.replaceState(null, "", "/"); void startDaily(); }, 0);
      return () => window.clearTimeout(timer);
    }
    if (DIFFICULTIES.some(item => item === level)) {
      const timer = window.setTimeout(() => { window.history.replaceState(null, "", "/"); void start(level as Difficulty, selectedCategory); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [start, startDaily]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          {screen === "quiz" ? (
            <Brand />
          ) : (
            <button
              className="brand-button"
              onClick={() => goTo("home")}
              aria-label="Yeni Nesil Bilgi Yarışması ana sayfa"
            >
              <Brand />
            </button>
          )}
          {screen === "home" ? (
            <nav aria-label="Ana menü">
              <a className="nav-how" href="#nasil-oynanir">
                Nasıl oynanır?
              </a>
              <button className="header-play" onClick={() => goTo("categories")}>
                Oyuna Başla <ArrowUpRight size={17} />
              </button>
            </nav>
          ) : (
            <span className="header-note">
              <ShieldCheck size={17} /> Sadece sen ve bilgin.
            </span>
          )}
        </div>
      </header>
      <main id="main">
        {screen === "home" && <><Home onPlay={() => goTo("categories")} onDaily={() => void startDaily()} onStatistics={() => goTo("statistics")} loadingDaily={loading !== null} /><p className="wrap" role="alert">{error}</p></>}
        {screen === "statistics" && <StatisticsPanel onBack={() => goTo("home")} />}
        {screen === "categories" && (
          <CategorySelection
            onBack={() => goTo("home")}
            onSelect={chooseCategory}
          />
        )}
        {screen === "levels" && (
          <LevelSelection
            category={category}
            onBack={() => goTo("categories")}
            onSelect={(level) => start(level, category)}
            scores={scores}
            loading={loading}
            error={error}
          />
        )}
        {screen === "quiz" && game && (
          <Quiz
            key={session}
            initialState={game}
            onExit={() => goTo(game.dailyDate ? "home" : "levels")}
            onReplay={() => game.dailyDate ? startDaily() : start(game.difficulty, game.category)}
            onLevels={() => goTo("levels", game.category)}
            onCategories={() => goTo("categories")}
            onHome={() => goTo("home")}
          />
        )}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>Yeni Nesil Bilgi Yarışması</span>
          <span className="footer-tagline">
            Merakla başlar, bilgiyle devam eder. <Heart size={13} />
          </span>
          <span className="privacy-note">
            Üyeliksiz. Reklamsız. Tamamen senin hızında.
          </span>
        </div>
      </footer>
    </div>
  );
}
