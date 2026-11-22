"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Copy, LogIn, LogOut, Play, RefreshCw, Users } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useAccount } from "./account-provider";
import { getMultiplayerGuestClient } from "../lib/multiplayer-client";
import { validNickname } from "../lib/membership";
import { questionRepository } from "../lib/question-repository";
import { MULTIPLAYER_CATEGORY, MULTIPLAYER_DIFFICULTY, MULTIPLAYER_QUESTION_COUNT, randomGameSeed, selectMultiplayerQuestions } from "../lib/multiplayer-game";
import { MultiplayerGame } from "./multiplayer-game";
import { MultiplayerLeaveDialog } from "./multiplayer-leave-dialog";
import { forgetMultiplayerRoom, readRememberedMultiplayerRoom, rememberMultiplayerRoom } from "../lib/multiplayer-session";

type Room = { id: string; code: string; host_user_id: string; status: "waiting" | "started" | "closed"; starts_at: string | null; expires_at: string; question_ids: string[] | null; question_seed: number | null; question_index: number; question_started_at: string | null };
type Participant = { user_id: string; nickname: string; joined_at: string };

function lobbyError(issue: unknown): string {
  const message = issue && typeof issue === "object" && "message" in issue ? String(issue.message) : "";
  if (message.includes("start_multiplayer_game") || message.includes("Could not find the function")) return "Ortak oyun altyapısı henüz kurulmadı. Yeni migration dosyasını Supabase SQL Editor'da çalıştır.";
  if (message.includes("Room unavailable")) return "Oda bulunamadı, süresi doldu veya başladı.";
  if (message.includes("Room is full")) return "Oda dolu.";
  if (message.includes("Room is not ready")) return "Başlamak için en az iki kişi gerekli veya oda artık kullanılamıyor.";
  if (message.includes("Too many open rooms")) return "En fazla üç açık odan olabilir.";
  if (message.includes("duplicate key")) return "Bu takma ad odada kullanılıyor.";
  if (message.includes("Anonymous sign-ins are disabled")) return "Misafir katılımı henüz etkin değil.";
  return "İşlem tamamlanamadı. Bağlantını kontrol edip tekrar dene.";
}

export function MultiplayerLobby({ onBack, onAccount }: { onBack: () => void; onAccount: () => void }) {
  const { client, user, ready, nickname: accountNickname } = useAccount();
  const [nickname, setNickname] = useState(accountNickname);
  const [code, setCode] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [roomClient, setRoomClient] = useState<SupabaseClient | null>(null);
  const [roomUserId, setRoomUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<Participant[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [restoringRoom, setRestoringRoom] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const activeClient = useRef<SupabaseClient | null>(null);
  const actionPending = useRef(false);
  const restoreAttempted = useRef(false);

  const refresh = useCallback(async (sdk: SupabaseClient, roomId: string) => {
    const [roomResult, memberResult] = await Promise.all([
      sdk.from("multiplayer_rooms").select("id,code,host_user_id,status,starts_at,expires_at,question_ids,question_seed,question_index,question_started_at").eq("id", roomId).single(),
      sdk.from("multiplayer_participants").select("user_id,nickname,joined_at").eq("room_id", roomId).order("joined_at"),
    ]);
    if (roomResult.error || memberResult.error) throw roomResult.error ?? memberResult.error;
    setRoom(roomResult.data as Room);
    setMembers(memberResult.data as Participant[]);
  }, []);

  const roomId = room?.id;
  useEffect(() => {
    if (!ready || restoreAttempted.current) return;
    restoreAttempted.current = true;
    let active = true;
    void (async () => {
      try {
        const sdk = user ? client : getMultiplayerGuestClient();
        if (!sdk) return;
        const identity = await sdk.auth.getUser();
        const currentUser = identity.data.user;
        if (identity.error || !currentUser) return;
        let storage: Storage | undefined;
        try { storage = window.localStorage; } catch { /* Room recovery remains optional. */ }
        const rememberedId = readRememberedMultiplayerRoom(storage, currentUser.id);
        if (!rememberedId) return;
        const response = await sdk.from("multiplayer_rooms").select("id,code,host_user_id,status,starts_at,expires_at,question_ids,question_seed,question_index,question_started_at").eq("id", rememberedId).maybeSingle();
        if (!active) return;
        if (response.error) { setError("Önceki oda kontrol edilemedi. Bağlantı gelince yeniden deneyebilirsin."); return; }
        const saved = response.data as Room | null;
        if (!saved || saved.status === "closed" || new Date(saved.expires_at).getTime() <= Date.now()) {
          forgetMultiplayerRoom(storage, currentUser.id, rememberedId);
          return;
        }
        activeClient.current = sdk;
        setRoomClient(sdk);
        setRoomUserId(currentUser.id);
        await refresh(sdk, rememberedId);
      } catch {
        if (active) setError("Önceki odaya dönülemedi. Oda süresi dolmuş veya erişimin kalmamış olabilir.");
      } finally {
        if (active) setRestoringRoom(false);
      }
    })();
    return () => { active = false; };
  }, [ready, client, user, refresh]);

  useEffect(() => {
    if (!roomId || !activeClient.current) return;
    const sdk = activeClient.current;
    let active = true;
    const reload = () => { if (active) void refresh(sdk, roomId).catch(() => { if (active) setError("Oda güncellenemedi. Bağlantını kontrol et."); }); };
    const channel = sdk.channel(`multiplayer-lobby-${roomId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "multiplayer_rooms", filter: `id=eq.${roomId}` }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "multiplayer_participants", filter: `room_id=eq.${roomId}` }, reload)
      .subscribe();
    const interval = window.setInterval(reload, 900);
    window.addEventListener("ynby-resume", reload);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("ynby-resume", reload);
      void sdk.removeChannel(channel);
    };
  }, [roomId, refresh]);

  useEffect(() => {
    if (room?.status !== "started") return;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [room?.status]);

  async function run(action: () => Promise<void>) {
    if (actionPending.current) return;
    actionPending.current = true;
    setBusy(true);
    setError("");
    try { await action(); }
    catch (issue) { setError(lobbyError(issue)); }
    finally { actionPending.current = false; setBusy(false); }
  }

  async function createRoom() {
    await run(async () => {
      if (!client || !user || user.is_anonymous) { onAccount(); return; }
      if (!validNickname(nickname)) { setError("Takma ad 2–30 karakter olmalı."); return; }
      const result = await client.rpc("create_multiplayer_room", { p_nickname: nickname.trim() });
      if (result.error) throw result.error;
      const roomId = result.data?.[0]?.room_id;
      if (typeof roomId !== "string") throw new Error("Oda oluşturulamadı.");
      activeClient.current = client;
      setRoomClient(client);
      setRoomUserId(user.id);
      try { rememberMultiplayerRoom(window.localStorage, user.id, roomId); } catch { /* Recovery is best-effort. */ }
      await refresh(client, roomId);
    });
  }

  async function joinRoom() {
    await run(async () => {
      if (!validNickname(nickname)) { setError("Takma ad 2–30 karakter olmalı."); return; }
      if (!/^[A-F0-9]{6}$/.test(code.trim().toUpperCase())) { setError("Altı karakterli oda kodunu gir."); return; }
      const sdk = user ? client : getMultiplayerGuestClient();
      if (!sdk) { setError("Bağlantı yapılandırması bulunamadı."); return; }
      if (!user) {
        const session = await sdk.auth.getSession();
        if (session.error) throw session.error;
        if (!session.data.session) {
          const signIn = await sdk.auth.signInAnonymously();
          if (signIn.error) throw signIn.error;
        }
      }
      const result = await sdk.rpc("join_multiplayer_room", { p_code: code.trim().toUpperCase(), p_nickname: nickname.trim() });
      if (result.error) throw result.error;
      if (typeof result.data !== "string") throw new Error("Odaya katılınamadı.");
      const identity = await sdk.auth.getUser();
      if (identity.error || !identity.data.user) throw identity.error ?? new Error("Oyuncu oturumu alınamadı.");
      activeClient.current = sdk;
      setRoomClient(sdk);
      setRoomUserId(identity.data.user.id);
      try { rememberMultiplayerRoom(window.localStorage, identity.data.user.id, result.data); } catch { /* Recovery is best-effort. */ }
      await refresh(sdk, result.data);
    });
  }

  async function startRoom() {
    if (!room || !activeClient.current) return;
    await run(async () => {
      const pool = await questionRepository.getByDifficulty(MULTIPLAYER_DIFFICULTY, MULTIPLAYER_CATEGORY, "tr");
      const seed = randomGameSeed();
      const questions = selectMultiplayerQuestions(pool, seed);
      if (questions.length !== MULTIPLAYER_QUESTION_COUNT) throw new Error("Bu sürümde yeterli soru bulunamadı.");
      const result = await activeClient.current!.rpc("start_multiplayer_game", {
        p_room_id: room.id,
        p_question_ids: questions.map(question => question.id),
        p_seed: seed,
      });
      if (result.error) throw result.error;
      await refresh(activeClient.current!, room.id);
    });
  }

  const leaveRoom = useCallback(async () => {
    const sdk = activeClient.current;
    if (!room || !sdk) throw new Error("Oda bağlantısı bulunamadı.");
    if (actionPending.current) throw new Error("Başka bir işlem sürüyor.");
    actionPending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await sdk.rpc("leave_multiplayer_room", { p_room_id: room.id });
      if (response.error) throw response.error;
      if (roomUserId) {
        try { forgetMultiplayerRoom(window.localStorage, roomUserId, room.id); } catch { /* The room was still left successfully. */ }
      }
      activeClient.current = null;
      setRoom(null);
      setMembers([]);
      setRoomClient(null);
      setRoomUserId(null);
      setLeaveOpen(false);
      onBack();
    } finally {
      actionPending.current = false;
      setBusy(false);
    }
  }, [room, roomUserId, onBack]);

  async function copyCode() {
    if (!room) return;
    try { await navigator.clipboard.writeText(room.code); setCopied(true); }
    catch { setError("Kod kopyalanamadı; ekrandaki kodu paylaşabilirsin."); }
  }

  const isHost = room?.host_user_id === roomUserId;
  const startRemaining = room?.starts_at ? Math.max(0, Math.ceil((new Date(room.starts_at).getTime() - now) / 1000)) : 0;
  if (room && room.status !== "waiting" && room.question_seed !== null && room.question_ids?.length === MULTIPLAYER_QUESTION_COUNT) {
    return <MultiplayerGame room={room} members={members} client={roomClient} userId={roomUserId}
      onBack={onBack} onLeave={leaveRoom} onRefresh={() => { if (activeClient.current) void refresh(activeClient.current, room.id); }} />;
  }

  return <section className="multiplayer-page wrap" aria-labelledby="multiplayer-title">
    {room ? <button className="text-button" onClick={() => setLeaveOpen(true)}><LogOut size={18} /> Odadan ayrıl</button> : <button className="text-button" onClick={onBack}><ArrowLeft size={18} /> Ana sayfa</button>}
    <header className="multiplayer-heading"><span className="eyebrow">UYGULAMAYA ÖZEL</span><h1 id="multiplayer-title" tabIndex={-1}>Arkadaşlarla Yarış</h1></header>
    {!room && restoringRoom ? <p role="status">Önceki oda kontrol ediliyor…</p> : !room ? <div className="multiplayer-entry">
      <label htmlFor="multiplayer-nickname">Takma adın</label>
      <input id="multiplayer-nickname" autoComplete="nickname" maxLength={30} value={nickname} onChange={event => setNickname(event.target.value)} />
      <div className="multiplayer-actions">
        <button className="button primary" onClick={() => void createRoom()} disabled={busy}>{user ? <Users size={18} /> : <LogIn size={18} />} Oda Kur</button>
        <div className="multiplayer-join"><label htmlFor="multiplayer-code">Oda kodu</label><input id="multiplayer-code" inputMode="text" autoCapitalize="characters" autoComplete="off" maxLength={6} value={code} onChange={event => setCode(event.target.value.toUpperCase().replace(/[^A-F0-9]/g, ""))} /></div>
        <button className="button secondary" onClick={() => void joinRoom()} disabled={busy}>Kodla Katıl</button>
      </div>
      {!user && <p>Oda kurmak için hesabına giriş yap. Kodla katılmak için hesap gerekmez.</p>}
    </div> : <div className="multiplayer-room">
      <div className="multiplayer-room-bar"><div><span className="eyebrow">ODA KODU</span><strong className="multiplayer-code">{room.code}</strong></div><button className="button secondary" onClick={() => void copyCode()}><Copy size={18} /> {copied ? "Kopyalandı" : "Kodu Kopyala"}</button></div>
      <h2>Katılımcılar <span>{members.length}/8</span></h2>
      <ul className="multiplayer-members">{members.map(member => <li key={member.user_id}><span>{member.nickname}</span>{member.user_id === room.host_user_id && <strong>Host</strong>}</li>)}</ul>
      {room.status === "waiting" ? isHost ? <button className="button primary" onClick={() => void startRoom()} disabled={busy || members.length < 2}><Play size={18} /> Başlat</button> : <p>Host yarışmayı başlatınca burada görünecek.</p> : room.status === "started" ? <p className="multiplayer-started" role="status">{startRemaining ? `${startRemaining} saniye sonra başlıyor…` : "Ortak yarışma hazırlanıyor…"}</p> : <p>Oda kapandı.</p>}
      <button className="text-button" onClick={() => { if (activeClient.current) void refresh(activeClient.current, room.id); }}><RefreshCw size={17} /> Yenile</button>
    </div>}
    {error && <p className="multiplayer-error" role="alert">{error}</p>}
    {busy && <p role="status">İşlem sürüyor…</p>}
    {leaveOpen && <MultiplayerLeaveDialog onCancel={() => setLeaveOpen(false)} onConfirm={() => { void leaveRoom().catch(issue => setError(lobbyError(issue))); }} busy={busy} />}
  </section>;
}
