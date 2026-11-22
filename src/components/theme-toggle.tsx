"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { subscribeTheme, themeSnapshot, serverThemeSnapshot, setTheme } from "../lib/theme";
import type { Locale } from "../lib/locale";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const dark = useSyncExternalStore(subscribeTheme, themeSnapshot, serverThemeSnapshot) === "dark";
  const label = locale === "en" ? dark ? "Switch to light mode" : "Switch to dark mode" : dark ? "Açık moda geç" : "Karanlık moda geç";
  return <button type="button" className="theme-toggle" aria-label={label} title={label} aria-pressed={dark} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</button>;
}
