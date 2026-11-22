"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { CloudOff, RefreshCw } from "lucide-react";

export function NativeConnectivity() {
  const [native, setNative] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const update = () => setOffline(!navigator.onLine);
    const initialize = window.setTimeout(() => {
      setNative(true);
      update();
    }, 0);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    window.addEventListener("ynby-resume", update);
    return () => {
      window.clearTimeout(initialize);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      window.removeEventListener("ynby-resume", update);
    };
  }, []);

  if (!native || !offline) return null;
  return <aside className="native-connectivity" role="status" aria-live="polite">
    <CloudOff size={19} aria-hidden="true" />
    <span>Çevrimdışısın. Tek kişilik oyun çalışır; hesap ve arkadaşlarla yarış için bağlantı gerekir.</span>
    <button type="button" aria-label="Bağlantıyı yeniden dene" title="Bağlantıyı yeniden dene" onClick={() => {
      window.dispatchEvent(new Event("ynby-resume"));
    }}><RefreshCw size={18} aria-hidden="true" /></button>
  </aside>;
}
