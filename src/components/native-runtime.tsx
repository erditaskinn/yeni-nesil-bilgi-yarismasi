"use client";
import { useEffect } from "react";
import { Capacitor, SystemBars, SystemBarsStyle, type PluginListenerHandle } from "@capacitor/core";
import { handleNativeBack } from "../lib/native-back";
import { homePath, type Locale } from "../lib/locale";

export function NativeRuntime({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;
    let disposed = false;
    const listeners: PluginListenerHandle[] = [];
    // Branded navy system bars retain readable white icons in either app theme.
    void SystemBars.setStyle({ style: SystemBarsStyle.Dark }).catch(() => {});
    void import("@capacitor/app").then(async ({ App }) => {
      const back = await App.addListener("backButton", () => {
        if (handleNativeBack()) return;
        const path = window.location.pathname.replace(/\/$/, "") || "/";
        if (path !== homePath(locale)) window.location.assign(homePath(locale));
        else void App.minimizeApp();
      });
      const resumed = await App.addListener("resume", () => window.dispatchEvent(new Event("ynby-resume")));
      if (disposed) { await back.remove(); await resumed.remove(); }
      else listeners.push(back, resumed);
    }).catch(() => {});
    return () => { disposed = true; for (const listener of listeners) void listener.remove(); };
  }, [locale]);
  return null;
}
