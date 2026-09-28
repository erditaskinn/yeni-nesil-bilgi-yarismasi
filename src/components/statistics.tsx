"use client";
import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { CATEGORIES, GAME_CATEGORIES } from "../lib/categories";
import { configureStatistics, readStatistics, statisticsSummary } from "../lib/statistics";

export function StatisticsPanel({ onBack }: { onBack: () => void }) {
  const [statistics, setStatistics] = useState(() => readStatistics());
  const [status, setStatus] = useState("");
  const summary = statisticsSummary(statistics.games);
  function update(enabled: boolean, clear = false) {
    if (!configureStatistics(enabled, clear)) { setStatus("Bu tarayıcıda kayıt kullanılamıyor. Oyuna devam edebilirsin."); return; }
    setStatistics(readStatistics());
    setStatus(clear || !enabled ? "İstatistik kayıtları silindi." : "Yeni tamamlanan turlar bu cihazda kaydedilecek.");
  }
  return <section className="wrap guide-page statistics-page" aria-labelledby="statistics-title">
    <button className="text-button back-button" onClick={onBack}><ArrowLeft size={17} /> Ana sayfaya dön</button>
    <h1 id="statistics-title" tabIndex={-1}>İstatistiklerim</h1>
    <label className="statistics-toggle"><input type="checkbox" checked={statistics.enabled} onChange={event => update(event.target.checked)} /> İstatistiklerimi bu cihazda tut</label>
    <p>İsteğe bağlıdır. Son 100 tamamlanan tur saklanır; başka bir cihaza veya sunucuya gönderilmez. Kapatınca kayıtlar silinir.</p>
    {statistics.enabled && <>
      <dl className="result-stats"><div><dt>Tamamlanan tur</dt><dd>{summary.games}</dd></div><div><dt>Doğru / Soru</dt><dd>{summary.correct} / {summary.total}</dd></div><div><dt>Başarı</dt><dd>%{summary.percentage}</dd></div></dl>
      {summary.games ? <div className="statistics-table"><table><caption>Kategoriye göre başarı</caption><thead><tr><th scope="col">Kategori</th><th scope="col">Tur</th><th scope="col">Başarı</th></tr></thead><tbody>{[...GAME_CATEGORIES, "daily" as const].map(category => { const row = statisticsSummary(statistics.games.filter(game => game.category === category)); return row.games ? <tr key={category}><th scope="row">{category === "daily" ? "Günlük 10 Soru" : CATEGORIES[category].label}</th><td>{row.games}</td><td>%{row.percentage}</td></tr> : null; })}</tbody></table></div> : <p>İlk turunu tamamladığında sonuçların burada görünecek.</p>}
      <button className="button secondary" disabled={!summary.games} onClick={() => update(true, true)}><Trash2 size={18} /> Kayıtları Sil</button>
    </>}
    <p role="status">{status}</p>
  </section>;
}
