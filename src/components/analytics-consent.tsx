"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { privacyPath } from "../lib/account-copy";
import type { Locale } from "../lib/locale";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const consentKey = "ynby:analytics-consent:v1";
type Choice = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function clearAnalyticsCookies() {
  const hostname = window.location.hostname;
  const domains = ["", hostname, `.${hostname}`, ".yeninesilbilgiyarismasi.com"];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0] ?? "";
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

export function AnalyticsConsent({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null | "loading">("loading");
  const [editing, setEditing] = useState(false);
  const enabled = Boolean(measurementId && /^G-[A-Z0-9]+$/.test(measurementId));

  useEffect(() => {
    if (!enabled || Capacitor.isNativePlatform()) return;
    let active = true;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(consentKey);
    } catch { /* Storage can be blocked by the browser. */ }
    queueMicrotask(() => {
      if (active) setChoice(saved === "accepted" || saved === "rejected" ? saved : null);
    });
    return () => { active = false; };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || Capacitor.isNativePlatform() || choice !== "accepted") return;
    window[`ga-disable-${measurementId}`] = false;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer?.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false,
        page_location: `${window.location.origin}${pathname}`,
        page_referrer: "",
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.id = "ynby-analytics-script";
      document.head.appendChild(script);
    }
    window.gtag("event", "page_view", {
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
      page_title: document.title,
    });
  }, [choice, enabled, pathname]);

  if (!enabled || choice === "loading" || (typeof window !== "undefined" && Capacitor.isNativePlatform())) return null;

  function choose(next: Choice) {
    if (next === "rejected" && measurementId) {
      window[`ga-disable-${measurementId}`] = true;
      document.getElementById("ynby-analytics-script")?.remove();
      window.gtag = undefined;
      window.dataLayer = [];
      clearAnalyticsCookies();
    }
    try { localStorage.setItem(consentKey, next); } catch { /* Continue without persistent preference. */ }
    setChoice(next);
    setEditing(false);
  }

  const en = locale === "en";
  return <>
    {(choice === null || editing) && <section className="analytics-consent" aria-label={en ? "Analytics preference" : "Analiz tercihi"}>
      <div className="analytics-consent-inner">
        <div><strong>{en ? "Analytics preference" : "Analiz tercihin"}</strong>
          <p>{en ? "With your permission, Google Analytics uses cookies to count website visits. Rejecting does not affect the quiz. You can change your choice at any time." : "İzin verirsen Google Analytics, site ziyaretlerini saymak için çerez kullanır. Reddetmen yarışmayı etkilemez. Tercihini istediğin zaman değiştirebilirsin."} <a href={privacyPath(locale)}>{en ? "Privacy notice" : "Gizlilik açıklaması"}</a></p>
        </div>
        <div className="analytics-consent-actions"><button type="button" onClick={() => choose("rejected")}>{en ? "Reject" : "Reddet"}</button><button type="button" onClick={() => choose("accepted")}>{en ? "Allow" : "İzin ver"}</button></div>
      </div>
    </section>}
    {choice !== null && !editing && <button type="button" className="analytics-preferences" onClick={() => setEditing(true)}>{en ? "Cookie preferences" : "Çerez tercihleri"}</button>}
  </>;
}
