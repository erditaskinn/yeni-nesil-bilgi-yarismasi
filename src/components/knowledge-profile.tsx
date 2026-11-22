"use client";
import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { CATEGORIES } from "../lib/categories";
import { categoryInfo, formatPercentage, translate, type Locale } from "../lib/locale";
import type { KnowledgeProfile } from "../lib/knowledge-profile";
import { cardContent, downloadKnowledgeCard, profileComment, renderKnowledgeCard, shareKnowledgeCard, type CardFormat } from "../lib/profile-sharing";
import { CATEGORY_ICONS } from "./category-selection";
import { useI18n } from "./locale-provider";

function Radar({ profile, locale }: { profile: KnowledgeProfile; locale: Locale }) {
  const values = profile.radar.map(item => `${categoryInfo(locale, item.category).label} ${formatPercentage(locale, item.percentage)}`);
  const center = 200, radius = 112;
  const point = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / profile.radar.length;
    return `${center + Math.cos(angle) * radius * value},${center + Math.sin(angle) * radius * value}`;
  };
  return <figure className="profile-radar" role="img" aria-label={translate(locale, "profileRadarText", { values: values.join(", ") })}>
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {[.25, .5, .75, 1].map(value => <polygon key={value} points={profile.radar.map((_, index) => point(index, value)).join(" ")} fill="none" stroke="currentColor" opacity={.15 + value * .18} />)}
      {profile.radar.map((_, index) => <line key={index} x1={center} y1={center} x2={point(index, 1).split(",")[0]} y2={point(index, 1).split(",")[1]} stroke="currentColor" opacity=".35" />)}
      <polygon className="profile-radar-shape" points={profile.radar.map((item, index) => point(index, item.percentage / 100)).join(" ")} />
      {profile.radar.map((item, index) => { const [x, y] = point(index, item.percentage / 100).split(",").map(Number); return <g key={item.category}><circle cx={x} cy={y} r="7" fill="#17133f" stroke="#24c9c3" strokeWidth="3" /><text x={point(index, 1.25).split(",")[0]} y={point(index, 1.25).split(",")[1]} textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="14" fontWeight="700">{index + 1}</text></g>; })}
    </svg>
    <ol className="profile-radar-legend">{profile.radar.map(item => <li key={item.category}><span>{categoryInfo(locale, item.category).label}</span><strong>{formatPercentage(locale, item.percentage)}</strong></li>)}</ol>
  </figure>;
}

export function KnowledgeProfilePanel({ profile, onPlay, onConsent, consentNeeded, nickname, syncError }: { profile: KnowledgeProfile; onPlay: () => void; onConsent: () => void; consentNeeded: boolean; nickname?: string; syncError?: boolean }) {
  const { locale, t } = useI18n();
  const [format, setFormat] = useState<CardFormat>("story");
  const [includeNickname, setIncludeNickname] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const shareReady = profile.ready && profile.radar.length >= 3;
  async function share() {
    if (!shareReady || busy) return;
    setBusy(true); setStatus(t("profileCreating"));
    try {
      cardContent(profile, locale, includeNickname ? nickname : undefined);
      const blob = await renderKnowledgeCard(profile, locale, format, includeNickname ? nickname : undefined);
      const result = await shareKnowledgeCard(blob, format, locale);
      setStatus(result === "cancelled" ? "" : t("profileShareDone"));
    } catch { setStatus(t("profileShareError")); }
    finally { setBusy(false); }
  }
  async function download() {
    if (!shareReady || busy) return;
    setBusy(true); setStatus(t("profileCreating"));
    try { const blob = await renderKnowledgeCard(profile, locale, format, includeNickname ? nickname : undefined); downloadKnowledgeCard(blob, `bilgi-dna-${format}.png`); setStatus(t("profileShareDone")); }
    catch { setStatus(t("profileShareError")); }
    finally { setBusy(false); }
  }
  return <section className="knowledge-profile" id="bilgi-profili" aria-labelledby="profile-title">
    <h2 id="profile-title">{t("profileTitle")}</h2>
    {consentNeeded ? <div className="profile-empty"><h3>{t("profileBuilding")}</h3><p>{t("profileConsent")}</p><button className="button secondary" onClick={onConsent}>{t("profileConsentButton")}</button></div> : !profile.ready ? <div className="profile-empty"><h3>{t("profileBuilding")}</h3><p>{t("profileBuildingText")}</p><dl className="profile-progress"><div><dt>{t("profileRounds")}</dt><dd>{Math.min(profile.rounds, 3)} / 3</dd></div><div><dt>{t("profileAnswered")}</dt><dd>{Math.min(profile.answered, 15)} / 15</dd></div><div><dt>{t("profileTried")}</dt><dd>{Math.min(profile.triedCategories, 3)} / 3</dd></div></dl><button className="button primary" onClick={onPlay}>{t("profileTest")}</button></div> : <>
      <dl className="profile-summary"><div><dt>{t("profileUnique")}</dt><dd>{profile.answered}</dd></div><div><dt>{t("profileCorrect")}</dt><dd>{profile.correct}</dd></div><div><dt>{t("accuracy")}</dt><dd>{formatPercentage(locale, profile.percentage)}</dd></div><div><dt>{t("profileStrongest")}</dt><dd>{profile.strongest ? categoryInfo(locale, profile.strongest.category).label : "—"}</dd></div><div><dt>{t("profileImproved")}</dt><dd>{profile.mostImproved ? categoryInfo(locale, profile.mostImproved.category).label : "—"}</dd></div><div><dt>{t("profileExplore")}</dt><dd>{profile.readyToExplore ? categoryInfo(locale, profile.readyToExplore.category).label : "—"}</dd></div></dl>
      <p className="profile-comment">{profileComment(profile, locale)}</p>
      <p className="profile-updated">{t("profileUpdated")}: {profile.updatedAt ? new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", { dateStyle: "medium" }).format(new Date(profile.updatedAt)) : "—"}</p>
      <h3>{t("profileDna")}</h3>
      {profile.radar.length >= 3 ? <Radar profile={profile} locale={locale} /> : <p>{t("profileShareLocked")}</p>}
      <div className="profile-category-list">{profile.categories.map(item => { const Icon = CATEGORY_ICONS[CATEGORIES[item.category].icon]; return <div className="profile-category" key={item.category}><Icon size={21} aria-hidden="true" /><div><strong>{categoryInfo(locale, item.category).label}</strong><small>{item.answered ? t("profileCorrectOf", { correct: item.correct, answered: item.answered }) : t("profileNever")}</small><progress value={item.sufficient ? item.percentage : 0} max="100" aria-label={`${categoryInfo(locale, item.category).label}: ${item.sufficient ? formatPercentage(locale, item.percentage) : t("profileBuildingCategory")}`} /><small>{item.trendState === "rising" ? t("profileTrend", { change: item.trend! }) : item.trendState === "steady" ? t("profileSteady") : item.trendState === "revisit" ? t("profileRevisit") : item.answered ? t("profileBuildingCategory") : t("profileNever")}</small></div><b>{item.sufficient ? formatPercentage(locale, item.percentage) : "—"}</b></div>; })}</div>
      <div className="profile-share"><div className="profile-format" role="group" aria-label={t("profileShare")}>{(["story", "square"] as const).map(value => <button type="button" key={value} aria-pressed={format === value} onClick={() => setFormat(value)}>{t(value === "story" ? "profileStory" : "profileSquare")}</button>)}</div>{nickname && <label><input type="checkbox" checked={includeNickname} onChange={event => setIncludeNickname(event.target.checked)} />{t("profileNickname")}</label>}<button className="button primary" disabled={!shareReady || busy} onClick={() => void share()}><Share2 size={18} />{t("profileShare")}</button><button className="button secondary" disabled={!shareReady || busy} onClick={() => void download()}><Download size={18} />{t("profileDownload")}</button>{!shareReady && <p>{t("profileShareLocked")}</p>}<p role="status" aria-live="polite">{status}</p></div>
    </>}
    {syncError && <p role="status">{t("profileSyncError")}</p>}
  </section>;
}
