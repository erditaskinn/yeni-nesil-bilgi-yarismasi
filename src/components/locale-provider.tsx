"use client";
import { createContext, useContext, useCallback } from "react";
import { translate, type Locale, type MessageKey } from "../lib/locale";
const LocaleContext = createContext<Locale>("tr");
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) { return <LocaleContext value={locale}>{children}</LocaleContext>; }
export function useI18n() {
  const locale = useContext(LocaleContext);
  const t = useCallback((key: MessageKey, values?: Record<string, string | number>) => translate(locale, key, values), [locale]);
  return { locale, t };
}
