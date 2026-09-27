"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, ShieldCheck } from "lucide-react";
import { Brand } from "./brand";
import { Home } from "./home";
import { LevelSelection } from "./level-selection";
import { Quiz } from "./quiz";
import { createGame, selectQuestions, type GameState } from "../lib/game";
import { questionRepository } from "../lib/question-repository";
import { DIFFICULTIES, type Difficulty } from "../lib/config";
import { readHighScores, type HighScores } from "../lib/storage";

type Screen = "home" | "levels" | "quiz";
export function QuizApp() {
  const [screen, setScreen] = useState<Screen>("home");
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

  function goTo(next: Screen) {
    requestId.current++;
    starting.current = false;
    setLoading(null);
    setError("");
    if (next === "levels") setScores(readHighScores());
    setScreen(next);
  }
  const start = useCallback(async (level: Difficulty) => {
    if (starting.current) return;
    starting.current = true;
    const id = ++requestId.current;
    setLoading(level);
    setError("");
    try {
      const pool = await questionRepository.getByDifficulty(level);
      if (id !== requestId.current) return;
      setGame(createGame(selectQuestions(pool, level), level, Date.now()));
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

  useEffect(() => {
    const level = new URLSearchParams(window.location.search).get("seviye");
    if (DIFFICULTIES.some(item => item === level)) {
      window.history.replaceState(null, "", "/");
      const timer = window.setTimeout(() => void start(level as Difficulty), 0);
      return () => window.clearTimeout(timer);
    }
  }, [start]);

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
              <button className="header-play" onClick={() => goTo("levels")}>
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
        {screen === "home" && <Home onPlay={() => goTo("levels")} />}
        {screen === "levels" && (
          <LevelSelection
            onBack={() => goTo("home")}
            onSelect={start}
            scores={scores}
            loading={loading}
            error={error}
          />
        )}
        {screen === "quiz" && game && (
          <Quiz
            key={session}
            initialState={game}
            onExit={() => goTo("levels")}
            onReplay={() => start(game.difficulty)}
            onLevels={() => goTo("levels")}
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
