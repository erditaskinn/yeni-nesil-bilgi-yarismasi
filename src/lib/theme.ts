export type Theme = "light" | "dark";
export const THEME_KEY = "ynby-theme";
export const THEME_BOOTSTRAP = `(()=>{let choice;try{choice=localStorage.getItem("ynby-theme")}catch{}const root=document.documentElement;if(choice==="light"||choice==="dark")root.dataset.themeChoice=choice;root.dataset.theme=choice==="dark"?"dark":"light"})()`;

function applyTheme(choice: string | null) {
  const root = document.documentElement;
  if (choice === "dark" || choice === "light") root.dataset.themeChoice = choice;
  else delete root.dataset.themeChoice;
  root.dataset.theme = choice === "dark" ? "dark" : "light";
}

export function themeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
export function serverThemeSnapshot(): Theme { return "light"; }
export function setTheme(theme: Theme) {
  applyTheme(theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* The current tab still works without storage. */ }
  window.dispatchEvent(new Event("ynby-theme-change"));
}
export function subscribeTheme(callback: () => void) {
  const stored = (event: StorageEvent) => {
    if (event.key === THEME_KEY || event.key === null) { applyTheme(event.newValue); callback(); }
  };
  window.addEventListener("ynby-theme-change", callback);
  window.addEventListener("storage", stored);
  return () => {
    window.removeEventListener("ynby-theme-change", callback);
    window.removeEventListener("storage", stored);
  };
}
