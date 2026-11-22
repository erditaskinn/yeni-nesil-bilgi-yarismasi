"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, Clock3, ExternalLink, Lightbulb, LogOut, RotateCcw, Trophy, Users } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { QuestionAnswer, correctAnswerText, solutionDetail } from "./question-answer";
import { QuestionImage } from "./question-image";
import { questionRepository } from "../lib/question-repository";
import { MULTIPLAYER_SECONDS_PER_QUESTION, randomGameSeed, selectMultiplayerQuestions } from "../lib/multiplayer-game";
import { evaluateQuestion, pointsForEvaluation, type QuestionResponse } from "../lib/question-engine";
import { topicLabel } from "../lib/locale";
import type { Question } from "../lib/types";
import { useI18n } from "./locale-provider";
import { MultiplayerLeaveDialog } from "./multiplayer-leave-dialog";

type Room = {
  id: string; code: string; host_user_id: string; status: "waiting" | "started" | "closed";
  question_ids: string[] | null; question_seed: number | null; question_index: number; question_started_at: string | null;
};
type Participant = { user_id: string; nickname: string; joined_at: string };
type LocalAnswer = { correct: boolean; points: number; selectedId: string | null };
type Result = { nickname: string; total_points: number; correct_answers: number };

export function MultiplayerGame({ room, members, client, userId, onBack, onLeave, onRefresh }: {
  room: Room; members: Participant[]; client: SupabaseClient | null; userId: string | null;
  onBack: () => void; onLeave: () => Promise<void>; onRefresh: () => void;
}) {
  const { locale } = useI18n();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [savedAnswer, setSavedAnswer] = useState<{ questionIndex: number; value: LocalAnswer } | null>(null);
  const [answerBusy, setAnswerBusy] = useState(false);
  const [progress, setProgress] = useState({ answered: 0, participants: members.length });
  const [now, setNow] = useState(Date.now);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ seed: number | null; membersKey: string; rows: Result[] } | null>(null);
  const [rematchBusy, setRematchBusy] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveBusy, setLeaveBusy] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const advancing = useRef(false);
  const savedAnswerRef = useRef<{ questionIndex: number; value: LocalAnswer } | null>(null);
  const refreshRef = useRef(onRefresh);
  const questionSignature = JSON.stringify(room.question_ids ?? []);
  const expectedIds = useMemo(() => JSON.parse(questionSignature) as string[], [questionSignature]);
  const membersKey = members.map(member => member.user_id).sort().join(":");
  const invalidRoomData = room.question_seed === null || expectedIds.length !== 10;
  const answer = savedAnswer?.questionIndex === room.question_index ? savedAnswer.value : null;

  useEffect(() => { refreshRef.current = onRefresh; }, [onRefresh]);
  useEffect(() => { savedAnswerRef.current = savedAnswer; }, [savedAnswer]);

  useEffect(() => {
    let active = true;
    if (invalidRoomData) return;
    void questionRepository.getByDifficulty("medium", "mixed", "tr").then(pool => {
      const selected = selectMultiplayerQuestions(pool, room.question_seed!);
      if (selected.length !== expectedIds.length || selected.some((question, index) => question.id !== expectedIds[index])) {
        throw new Error("Oyuncuların soru havuzu eşleşmiyor. Herkes uygulamanın güncel sürümünü yükleyip yeni oda kurmalı.");
      }
      if (active) setQuestions(selected);
    }).catch(issue => { if (active) setLoadError(issue instanceof Error ? issue.message : "Sorular yüklenemedi."); });
    return () => { active = false; };
  }, [room.question_seed, questionSignature, expectedIds, invalidRoomData]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const interval = window.setInterval(tick, 200);
    window.addEventListener("ynby-resume", tick);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(interval); window.removeEventListener("ynby-resume", tick); document.removeEventListener("visibilitychange", tick); };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => refreshRef.current(), 850);
    return () => window.clearInterval(interval);
  }, []);

  const roomId = room.id;
  const questionIndex = room.question_index;
  useEffect(() => { advancing.current = false; }, [questionIndex]);
  useEffect(() => {
    if (!client || room.status !== "started") return;
    let active = true;
    const readProgress = async () => {
      try {
        const [progressResponse, answerResponse] = await Promise.all([
          client.rpc("get_multiplayer_answer_progress", { p_room_id: roomId }),
          client.rpc("get_my_multiplayer_answer", { p_room_id: roomId, p_question_index: questionIndex }),
        ]);
        if (!active) return;
        const progressRow = Array.isArray(progressResponse.data) ? progressResponse.data[0] : progressResponse.data;
        if (progressRow) setProgress({ answered: Number(progressRow.answered), participants: Number(progressRow.participants) });
        if (answerResponse.error) {
          if (answerResponse.error.message.includes("get_my_multiplayer_answer") || answerResponse.error.message.includes("Could not find the function")) {
            setError("Yanıt kurtarma güncellemesi henüz kurulmamış. Uygulamayı güncellemeden önce Supabase migration'ını çalıştır.");
          }
          return;
        }
        const ownAnswer = Array.isArray(answerResponse.data) ? answerResponse.data[0] : answerResponse.data;
        if (ownAnswer && savedAnswerRef.current?.questionIndex !== questionIndex) {
          const recovered = {
            questionIndex,
            value: { correct: Boolean(ownAnswer.is_correct), points: Number(ownAnswer.points), selectedId: typeof ownAnswer.selected_id === "string" ? ownAnswer.selected_id : null },
          };
          savedAnswerRef.current = recovered;
          setSavedAnswer(recovered);
        }
      } catch {
        // The next poll retries when a transient connection failure interrupts either request.
      }
    };
    void readProgress();
    const interval = window.setInterval(() => { void readProgress(); }, 850);
    return () => { active = false; window.clearInterval(interval); };
  }, [client, roomId, room.status, questionIndex]);

  useEffect(() => {
    if (!client || room.status !== "closed" || (results?.seed === room.question_seed && results.membersKey === membersKey)) return;
    let active = true;
    void client.rpc("get_multiplayer_results", { p_room_id: roomId }).then(response => {
      if (!active) return;
      if (response.error) setError("Sonuçlar alınamadı. Bağlantını kontrol edip yenile.");
      else setResults({ seed: room.question_seed, membersKey, rows: (response.data ?? []) as Result[] });
    });
    return () => { active = false; };
  }, [client, room.status, roomId, room.question_seed, membersKey, results?.seed, results?.membersKey]);

  const question = useMemo(() => questions?.[questionIndex] ?? null, [questions, questionIndex]);
  const startedAt = room.question_started_at ? new Date(room.question_started_at).getTime() : now + 3000;
  const secondsLeft = Math.max(0, Math.min(MULTIPLAYER_SECONDS_PER_QUESTION, Math.ceil((startedAt + MULTIPLAYER_SECONDS_PER_QUESTION * 1000 - now) / 1000)));
  const countdown = Math.max(0, Math.ceil((startedAt - now) / 1000));
  const locked = answer !== null || answerBusy || secondsLeft === 0 || countdown > 0;
  const canAdvance = progress.answered >= progress.participants || secondsLeft === 0;

  const submitAnswer = useCallback(async (response: QuestionResponse, selectedId: string) => {
    if (!client || !question || !userId || answer || answerBusy || secondsLeft === 0 || countdown > 0) return;
    const evaluation = evaluateQuestion(question, response);
    if (!evaluation) { setError("Bu yanıt biçimi değerlendirilemedi; tekrar dene."); return; }
    const elapsed = Math.max(0, (now - startedAt) / 1000);
    const score = pointsForEvaluation(evaluation.scoreRatio, Math.max(0, MULTIPLAYER_SECONDS_PER_QUESTION - elapsed), "competition");
    setAnswerBusy(true);
    setError("");
    const saved = await client.rpc("submit_multiplayer_answer_v2", {
      p_room_id: room.id,
      p_question_index: questionIndex,
      p_is_correct: evaluation.isCorrect,
      p_points: score,
      p_selected_id: response.type === "choice" || response.type === "map" ? selectedId : null,
    });
    setAnswerBusy(false);
    if (saved.error) {
      if (saved.error.message.includes("already submitted")) {
        const restored = await client.rpc("get_my_multiplayer_answer", { p_room_id: room.id, p_question_index: questionIndex });
        const row = Array.isArray(restored.data) ? restored.data[0] : restored.data;
        if (row) {
          const recovered = { questionIndex, value: { correct: Boolean(row.is_correct), points: Number(row.points), selectedId: typeof row.selected_id === "string" ? row.selected_id : null } };
          savedAnswerRef.current = recovered;
          setSavedAnswer(recovered);
          setError("");
          return;
        }
      }
      setError(saved.error.message.includes("submit_multiplayer_answer_v2") || saved.error.message.includes("Could not find the function")
        ? "Yanıt kurtarma güncellemesi için yeni Supabase migration'ını çalıştır."
        : "Yanıtın kaydedilemedi. Bağlantını kontrol edip tekrar dene.");
      return;
    }
    const savedValue = { correct: evaluation.isCorrect, points: score, selectedId: response.type === "choice" || response.type === "map" ? selectedId : null };
    savedAnswerRef.current = { questionIndex, value: savedValue };
    setSavedAnswer({ questionIndex, value: savedValue });
    const latest = await client.rpc("get_multiplayer_answer_progress", { p_room_id: room.id });
    const row = Array.isArray(latest.data) ? latest.data[0] : latest.data;
    if (row) setProgress({ answered: Number(row.answered), participants: Number(row.participants) });
  }, [client, question, userId, answer, answerBusy, secondsLeft, countdown, now, startedAt, room.id, questionIndex]);

  const advanceQuestion = useCallback(async () => {
    if (!client || !userId || !canAdvance || advancing.current) return;
    advancing.current = true;
    setError("");
    const response = await client.rpc("advance_multiplayer_question", { p_room_id: room.id, p_question_index: questionIndex });
    if (response.error) {
      advancing.current = false;
      if (response.error.message.includes("Question unavailable")) {
        refreshRef.current();
        return;
      }
      setError(response.error.message.includes("Answers pending") ? "Diğer oyuncuların yanıtı bekleniyor." : "Sonraki soruya geçilemedi. Bağlantını kontrol edip yenile.");
      return;
    }
    refreshRef.current();
  }, [client, userId, canAdvance, room.id, questionIndex]);

  const rematch = useCallback(async () => {
    if (!client || !userId || rematchBusy) return;
    setRematchBusy(true);
    setError("");
    try {
      const seed = randomGameSeed();
      const pool = await questionRepository.getByDifficulty("medium", "mixed", "tr");
      const nextQuestions = selectMultiplayerQuestions(pool, seed);
      const response = await client.rpc("rematch_multiplayer_game", {
        p_room_id: room.id, p_question_ids: nextQuestions.map(item => item.id), p_seed: seed,
      });
      if (response.error) throw response.error;
      setQuestions(nextQuestions);
      refreshRef.current();
    } catch (issue) {
      const message = issue && typeof issue === "object" && "message" in issue ? String(issue.message) : "";
      if (message.includes("rematch_multiplayer_game") || message.includes("Could not find the function")) {
        setError("Aynı odada yeniden oynamak için yeni Supabase migration'ını çalıştır.");
      } else if (message.includes("Room is not ready for a rematch")) {
        setError("Odada yeni tur zaten başlatılmış veya oda kullanılamıyor. Oda yenileniyor.");
        refreshRef.current();
      } else {
        setError("Yeni tur başlatılamadı. Odanın süresi dolmuş olabilir; bağlantıyı kontrol edip yeniden dene.");
      }
    } finally { setRematchBusy(false); }
  }, [client, userId, rematchBusy, room.id]);

  async function confirmLeave() {
    setLeaveBusy(true);
    setLeaveError("");
    try { await onLeave(); }
    catch {
      setLeaveError("Odadan ayrılamadın. Bağlantını kontrol edip tekrar dene.");
    } finally { setLeaveBusy(false); }
  }

  if (invalidRoomData || loadError) return <section className="multiplayer-page wrap" aria-labelledby="multiplayer-title">
    <button className="text-button" onClick={onBack}><ArrowLeft size={18} /> Ana sayfa</button>
    <h1 id="multiplayer-title">Arkadaşlarla Yarış</h1><p className="multiplayer-error" role="alert">{loadError || "Bu oda oyun verisini içermiyor. Host yeni oda kurup tekrar başlatmalı."}</p>
  </section>;

  if (room.status === "closed") return <section className="multiplayer-page multiplayer-game-page wrap" aria-labelledby="multiplayer-title">
    <button className="text-button" onClick={() => setLeaveOpen(true)}><LogOut size={18} /> Odadan ayrıl</button>
    <header className="multiplayer-heading"><span className="eyebrow">ODA {room.code}</span><h1 id="multiplayer-title">Yarışma Sonuçları</h1></header>
    {!results || results.seed !== room.question_seed || results.membersKey !== membersKey ? <p role="status">Sonuçlar yükleniyor…</p> : <>
      <ol className="multiplayer-results">{results.rows.map((item, index) => <li key={`${item.nickname}-${index}`}><span><b>{index + 1}.</b> {item.nickname}</span><strong><Trophy size={17} /> {item.total_points} puan <small>· {item.correct_answers}/10 doğru</small></strong></li>)}</ol>
      <button className="button primary multiplayer-rematch" onClick={() => void rematch()} disabled={rematchBusy}><RotateCcw size={18} /> {rematchBusy ? "Yeni tur hazırlanıyor…" : "Aynı odada yeni tur başlat"}</button>
    </>}
    {error && <p className="multiplayer-error" role="alert">{error}</p>}
    {leaveError && <p className="multiplayer-error" role="alert">{leaveError}</p>}
    {leaveOpen && <MultiplayerLeaveDialog onCancel={() => setLeaveOpen(false)} onConfirm={() => void confirmLeave()} busy={leaveBusy} />}
  </section>;

  if (!questions || !question) return <section className="multiplayer-page wrap" aria-labelledby="multiplayer-title">
    <p id="multiplayer-title" role="status">Ortak yarışma yükleniyor…</p>
  </section>;

  return <section className="quiz-page multiplayer-game-page wrap" aria-label="Arkadaşlarla ortak bilgi yarışması">
    <div className="quiz-topbar">
      <div className="quiz-mode"><span className="difficulty-label level-medium"><span /> Orta</span><span className="quiz-category">Karışık Sorular · Oda {room.code}</span></div>
      <button className="text-button" onClick={() => setLeaveOpen(true)}><LogOut size={17} /><span className="quiz-exit-label">Odadan ayrıl</span></button>
    </div>
    <div className="game-stats">
      <div><span className="muted">SORU</span><strong>{String(questionIndex + 1).padStart(2, "0")}<small> / 10</small></strong></div>
      <div className="live-score"><Users size={19} /><strong>{progress.answered}<small> / {members.length} yanıt</small></strong></div>
      <div className={`timer ${secondsLeft <= 5 ? "urgent" : ""}`} role="timer" aria-label={`${secondsLeft} saniye kaldı`}><Clock3 size={20} /><strong>{secondsLeft}<small>sn</small></strong></div>
    </div>
    <progress className="question-progress" value={questionIndex + 1} max={10} aria-label={`Soru ${questionIndex + 1} / 10`} />
    <div className="question-content">
      <span className="eyebrow">{topicLabel(locale, question.category).toLocaleUpperCase("tr-TR")}</span>
      <h1 tabIndex={-1}>{question.question}</h1>
      {question.image && <QuestionImage key={question.id} image={question.image} showCredit={locked} />}
      {question.format?.type === "audio_question" && <audio className="multiplayer-audio" controls preload="none" src={question.format.media.src}>Ses oynatımı desteklenmiyor.</audio>}
      <QuestionAnswer key={question.id} question={question} locked={locked} revealCorrectAnswer={countdown === 0 && (answer !== null || secondsLeft === 0)} selectedId={answer?.selectedId ?? null} onAnswer={(response, id) => void submitAnswer(response, id)} />
    </div>
    {countdown > 0 && <p className="multiplayer-game-status" role="status">Soru {countdown} saniye içinde başlayacak.</p>}
    {answer && <>
      <div className="next-row multiplayer-next-row"><span>{progress.answered}/{progress.participants} oyuncu yanıtladı</span>
        {canAdvance ? <button className="button primary" onClick={() => void advanceQuestion()}>{questionIndex === 9 ? "Sonuçları Gör" : "Sonraki Soru"}<ArrowRight size={18} /></button> : <span role="status">Diğer oyuncuların yanıtları bekleniyor.</span>}
      </div>
      <div className={`feedback ${answer.correct ? "positive" : "negative"}`} role="status" tabIndex={-1}>
        <div className="feedback-heading">{answer.correct ? <CircleCheck size={23} /> : <Lightbulb size={23} />}<h2>{answer.correct ? "Doğru cevap, harika!" : "Doğru cevap"}</h2><strong>+{answer.points} puan</strong></div>
        <p><b>Doğru cevap: {correctAnswerText(question)}.</b> {solutionDetail(question)} {question.explanation}</p>
        <a href={question.sourceUrl} target="_blank" rel="noreferrer">Kaynağı incele <ExternalLink size={13} /></a>
      </div>
    </>}
    {answerBusy && <p className="multiplayer-game-status" role="status">Yanıtın kaydediliyor…</p>}
    {secondsLeft === 0 && !answer && <p className="multiplayer-game-status" role="status">Süre doldu. Bu soru için puan alamadın.</p>}
    {room.status === "started" && !answer && canAdvance && <div className="multiplayer-next-row"><button className="button primary" onClick={() => void advanceQuestion()}>{questionIndex === 9 ? "Sonuçları Gör" : "Yanıtsız geç"}<ArrowRight size={18} /></button></div>}
    {error && <p className="multiplayer-error" role="alert">{error}</p>}
    {leaveError && <p className="multiplayer-error" role="alert">{leaveError}</p>}
    {leaveOpen && <MultiplayerLeaveDialog onCancel={() => setLeaveOpen(false)} onConfirm={() => void confirmLeave()} busy={leaveBusy} />}
    {countdown > 0 && <div className="multiplayer-start-overlay" aria-hidden="true">{countdown}</div>}
  </section>;
}

