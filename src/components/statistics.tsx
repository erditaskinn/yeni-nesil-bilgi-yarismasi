"use client";
import { useI18n } from "./locale-provider";
import { storedCategoryLabel, formatPercentage } from "../lib/locale";

import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { GAME_CATEGORIES, type StoredCategory } from "../lib/categories";
import { paceLabel } from "../lib/pace";
import { configureStatistics, readStatistics, statisticsSummary } from "../lib/statistics";
import { afterProfileClear, buildKnowledgeProfile } from "../lib/knowledge-profile";
import { questions } from "../data/questions";
import { useAccount } from "./account-provider";
import { KnowledgeProfilePanel } from "./knowledge-profile";

export function StatisticsPanel({ onBack, onPlay, native = false }: { onBack: () => void; onPlay: () => void; native?: boolean }) {
  const { locale, t } = useI18n();
  const { user, profileRecords, profileCutoff, profileSyncStatus, nickname, syncProfile, clearProfile } = useAccount();
  const [statistics, setStatistics] = useState(() => readStatistics());
  const [status, setStatus] = useState("");
  const ownGames = statistics.games.filter(game => game.owner === user?.id);
  const profile = buildKnowledgeProfile([...ownGames, ...profileRecords].filter(record => record.owner === user?.id && afterProfileClear(record, profileCutoff)), questions);
  const summary = statisticsSummary(ownGames);
  const competition = ownGames.filter(game => game.pace !== "relaxed");
  const relaxed = ownGames.filter(game => game.pace === "relaxed");
  const relaxedSummary = statisticsSummary(relaxed);
  const competitionBest = Math.max(0, ...competition.map(game => game.points));
  async function update(enabled: boolean, clear = false) {
    if (!configureStatistics(enabled, clear)) { setStatus(t("statsUnavailable")); return; }
    setStatistics(readStatistics());
    if (enabled && !clear) await syncProfile();
    else if (user && !await clearProfile()) { setStatus(t("profileSyncError")); return; }
    setStatus(clear || !enabled ? t("statsDeleted") : t("statsEnabled"));
  }
  return <section className="wrap guide-page statistics-page" aria-labelledby="statistics-title">
    <button className="text-button back-button" onClick={onBack}><ArrowLeft size={17} />{t("homeBack")}</button>
    <h1 id="statistics-title" tabIndex={-1}>{t("statistics")}</h1>
    <KnowledgeProfilePanel profile={profile} onPlay={onPlay} onConsent={() => void update(true)} consentNeeded={!statistics.enabled} nickname={nickname} syncError={!!user && profileSyncStatus === "error"} />
    {(!native || statistics.enabled) && <label className="statistics-toggle"><input type="checkbox" checked={statistics.enabled} onChange={event => void update(event.target.checked)} />{t("statsConsent")}</label>}
    {native ? <details className="native-game-privacy-details"><summary>{t("nativeStatsPrivacy")}</summary><p>{t("statsPrivacy")}</p></details> : <p>{t("statsPrivacy")}</p>}
    {statistics.enabled && <>
      <dl className="result-stats"><div><dt>{t("completedRounds")}</dt><dd>{summary.games}</dd></div><div><dt>{t("correctTotal")}</dt><dd>{summary.correct} / {summary.total}</dd></div><div><dt>{t("accuracy")}</dt><dd>{formatPercentage(locale, summary.percentage)}</dd></div></dl>
      <dl className="result-stats"><div><dt>{paceLabel("competition", locale)} · {t("completedRounds")}</dt><dd>{competition.length}</dd></div><div><dt>{t("competitionBest")}</dt><dd>{competitionBest}</dd></div><div><dt>{paceLabel("relaxed", locale)} · {t("completedRounds")}</dt><dd>{relaxed.length}</dd></div><div><dt>{t("relaxedAccuracy")}</dt><dd>{formatPercentage(locale, relaxedSummary.percentage)}</dd></div></dl>
      {summary.games ? <div className="statistics-table"><table><caption>{t("categoryAccuracy")}</caption><thead><tr><th scope="col">{t("category")}</th><th scope="col">{t("round")}</th><th scope="col">{t("accuracy")}</th></tr></thead><tbody>{([...GAME_CATEGORIES, "science", "culture", "legacy_history_geography", "daily"] as StoredCategory[]).map(category => { const row = statisticsSummary(ownGames.filter(game => game.category === category)); return row.games ? <tr key={category}><th scope="row">{category === "daily" ? t("daily") : storedCategoryLabel(locale, category)}</th><td>{row.games}</td><td>{formatPercentage(locale, row.percentage)}</td></tr> : null; })}</tbody></table></div> : <p>{t("statsEmpty")}</p>}
      <button className="button secondary" disabled={!summary.games} onClick={() => void update(true, true)}><Trash2 size={18} />{t("deleteRecords")}</button>
    </>}
    <p role="status">{status}</p>
  </section>;
}
