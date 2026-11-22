"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, LogIn, LogOut, RefreshCw, Save, Trash2, UserPlus } from "lucide-react";
import { useAccount } from "./account-provider";
import { useI18n } from "./locale-provider";
import { accountText, privacyPath, type AccountText } from "../lib/account-copy";
import { authIssue, validNickname, validPassword } from "../lib/membership";
import { storedCategoryLabel, levelInfo, numberLocale } from "../lib/locale";
import { clearMemberScores } from "../lib/storage";
import { clearOwnerStatistics } from "../lib/statistics";
import { useAndroidBack } from "./use-android-back";
import { googleAuthEnabled, startGoogleSignIn } from "../lib/google-auth";

type Mode = "login" | "signup" | "forgot" | "verify" | "recovery" | "password";
function PasswordField({ id, label, value, onChange, disabled, newPassword = false, hint, a }: {
  id: string; label: string; value: string; onChange: (value: string) => void;
  disabled: boolean; newPassword?: boolean; hint?: string; a: (key: AccountText) => string;
}) {
  const [visible, setVisible] = useState(false);
  return <div className="account-password-field">
    <label htmlFor={id}>{label}</label>
    <div className="account-password-input">
      <input id={id} name={id} type={visible && value ? "text" : "password"} autoComplete={newPassword ? "new-password" : "current-password"} value={value} onChange={event => onChange(event.target.value)} required minLength={newPassword ? 6 : 1} maxLength={128} disabled={disabled} aria-describedby={hint ? `${id}-hint` : undefined} />
      <button type="button" disabled={disabled} aria-label={`${a(visible && value ? "hidePassword" : "showPassword")}: ${label}`} title={a(visible && value ? "hidePassword" : "showPassword")} aria-pressed={Boolean(visible && value)} onClick={() => setVisible(!(visible && value))}>{visible && value ? <EyeOff size={20} /> : <Eye size={20} />}</button>
    </div>
    {hint && <small id={`${id}-hint`}>{hint}</small>}
  </div>;
}
export function AccountPanel({ onBack }: { onBack: () => void }) {
  const { locale } = useI18n();
  const a = (key: AccountText) => accountText(locale, key);
  const { client, ready, user, googleError, nickname, setNickname, scores, sync, syncStatus } = useAccount();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [profileName, setProfileName] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<AccountText | null>(null);
  const [error, setError] = useState<AccountText | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const pending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const challengeEmail = useRef("");
  const cooldownUntil = useRef(0);
  useEffect(() => { heading.current?.focus(); }, [mode, user?.id]);
  useAndroidBack(() => {
    if (deleteOpen) { setDeleteOpen(false); setDeletePassword(""); return true; }
    if (mode !== "login" && !user) { changeMode("login"); return true; }
    return false;
  });
  function changeMode(next: Mode) { setMode(next); setPassword(""); setConfirmPassword(""); setCode(""); setError(null); setStatus(null); }
  async function run(action: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true); setError(null); setStatus(null);
    try { await action(); } catch (issue) { setError(authIssue(issue)); }
    finally { pending.current = false; setBusy(false); setPassword(""); setConfirmPassword(""); setDeletePassword(""); }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    const normalized = email.trim();
    if (["signup", "login", "forgot"].includes(mode) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) { setError("invalidEmail"); return; }
    if ((mode === "signup" || mode === "password") && !validPassword(password)) { setError("invalidPassword"); return; }
    if ((mode === "signup" || mode === "password") && password !== confirmPassword) { setError("passwordMismatch"); return; }
    if (mode === "signup" && !validNickname(name)) { setError("invalidNickname"); return; }
    if ((mode === "verify" || mode === "recovery") && !/^\d{6,10}$/.test(code)) { setError("invalidCode"); return; }
    await run(async () => {
      if (mode === "login") {
        const result = await client.auth.signInWithPassword({ email: normalized, password });
        if (result.error) throw result.error;
      } else if (mode === "signup") {
        const result = await client.auth.signUp({ email: normalized, password, options: { data: { nickname: name.trim() } } });
        if (result.error) throw result.error;
        challengeEmail.current = normalized;
        cooldownUntil.current = Date.now() + 60000;
        setMode("verify"); setStatus("codeSent");
      } else if (mode === "forgot") {
        if (Date.now() < cooldownUntil.current) { setError("rateLimit"); return; }
        const result = await client.auth.resetPasswordForEmail(normalized);
        if (result.error) throw result.error;
        challengeEmail.current = normalized;
        cooldownUntil.current = Date.now() + 60000;
        setMode("recovery"); setStatus("codeSent");
      } else if (mode === "verify" || mode === "recovery") {
        const result = await client.auth.verifyOtp({ email: challengeEmail.current || normalized, token: code, type: mode === "verify" ? "signup" : "recovery" });
        if (result.error) throw result.error;
        setCode("");
        setMode(mode === "recovery" ? "password" : "login");
      } else if (mode === "password") {
        const result = await client.auth.updateUser({ password });
        if (result.error) throw result.error;
        setMode("login"); setStatus("passwordSaved");
      }
    });
  }
  async function resend() {
    if (!client) return;
    if (Date.now() < cooldownUntil.current) { setError("rateLimit"); return; }
    await run(async () => {
      const result = mode === "recovery" ? await client.auth.resetPasswordForEmail(challengeEmail.current) : await client.auth.resend({ type: "signup", email: challengeEmail.current });
      if (result.error) throw result.error;
      cooldownUntil.current = Date.now() + 60000; setStatus("codeSent");
    });
  }
  async function remove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || !user) return;
    const owner = user.id;
    await run(async () => {
      const session = await client.auth.getSession();
      if (!session.data.session) { setError("credentials"); return; }
      const result = await client.functions.invoke("delete-account", { body: { password: deletePassword }, headers: { Authorization: `Bearer ${session.data.session.access_token}` } });
      if (result.error || result.data?.deleted !== true) { setError("deleteError"); return; }
      clearMemberScores(owner);
      clearOwnerStatistics(owner);
      await client.auth.signOut({ scope: "local" });
      setDeleteOpen(false); setMode("login"); setStatus("deleted");
    });
  }
  const formMode = !user || ["forgot", "recovery", "password"].includes(mode);
  const googleOnly = user?.app_metadata.providers?.includes("google") && !user?.app_metadata.providers?.includes("email");
  return <section className="account-page wrap" aria-labelledby="account-title">
    <button className="text-button" onClick={onBack}><ArrowLeft size={17} />{a("back")}</button>
    <h1 id="account-title" ref={heading} tabIndex={-1}>{user && !formMode ? a("account") : a(mode === "verify" ? "verify" : mode === "forgot" || mode === "recovery" ? "forgot" : mode === "password" ? "newPassword" : mode)}</h1>
    <p>{a("intro")}</p>
    {!ready ? <p role="status">{a("loading")}</p> : !client ? <><p role="status">{a("unavailable")}</p><button className="button primary" onClick={onBack}>{a("guest")}</button></> : formMode ? <>
      {(mode === "login" || mode === "signup") && <div className="account-tabs" role="group" aria-label={a("account")}><button aria-pressed={mode === "login"} disabled={busy} onClick={() => changeMode("login")}><LogIn size={17} />{a("login")}</button><button aria-pressed={mode === "signup"} disabled={busy} onClick={() => changeMode("signup")}><UserPlus size={17} />{a("signup")}</button></div>}
      {(mode === "login" || mode === "signup") && <div className="account-google"><button type="button" className="button secondary" disabled={busy || !googleAuthEnabled} title={!googleAuthEnabled ? a("googleUnavailable") : undefined} onClick={() => void run(async () => { try { await startGoogleSignIn(client, locale); } catch { setError("googleError"); } })}>{a("google")}</button><small><a href={privacyPath(locale)}>{a("privacy")}</a></small></div>}
      <form className="account-form" onSubmit={submit}>
        {["login", "signup", "forgot"].includes(mode) && <label>{a("email")}<input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} disabled={busy} /></label>}
        {mode === "signup" && <label>{a("nickname")}<input name="nickname" autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={30} disabled={busy} aria-describedby="nickname-hint" /><small id="nickname-hint">{a("nicknameHint")}</small></label>}
        {["login", "signup", "password"].includes(mode) && <PasswordField key={`${mode}-${busy}`} id="password" label={a(mode === "password" ? "newPassword" : "password")} value={password} onChange={setPassword} disabled={busy} newPassword={mode !== "login"} hint={mode !== "login" ? a("passwordHint") : undefined} a={a} />}
        {(mode === "signup" || mode === "password") && <PasswordField key={`confirm-${mode}-${busy}`} id="confirm-password" label={a("confirmPassword")} value={confirmPassword} onChange={setConfirmPassword} disabled={busy} newPassword a={a} />}
        {(mode === "verify" || mode === "recovery") && <><p>{challengeEmail.current || email}</p><label>{a("code")}<input name="code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} required pattern="[0-9]{6,10}" minLength={6} maxLength={10} disabled={busy} /></label></>}
        {mode === "signup" && <label className="account-check"><input type="checkbox" required disabled={busy} /><span>{a("acknowledge")} <a href={privacyPath(locale)} target="_blank" rel="noreferrer">{a("privacy")}</a></span></label>}
        <button className="button primary" disabled={busy}><KeyRound size={18} />{busy ? a("busy") : a(mode === "forgot" ? "sendCode" : mode === "verify" || mode === "recovery" ? "verifyCode" : mode === "password" ? "savePassword" : mode)}</button>
      </form>
      <div className="account-actions">{mode === "login" && <><button className="text-button" disabled={busy} onClick={() => changeMode("forgot")}>{a("forgot")}</button><button className="text-button" disabled={busy} onClick={() => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("invalidEmail"); return; } challengeEmail.current = email.trim(); changeMode("verify"); }}>{a("verify")}</button></>}{(mode === "verify" || mode === "recovery") && <button className="text-button" disabled={busy || !challengeEmail.current} onClick={() => void resend()}>{a("resend")}</button>}{mode !== "login" && <button className="text-button" disabled={busy} onClick={() => changeMode("login")}>{a("login")}</button>}<button className="text-button" onClick={onBack}>{a("guest")}</button></div><p className="muted">{a("notice")}</p>
    </> : <>
      <p className="account-email">{user.email}</p>
      {googleOnly && <div className="account-actions"><button className="button secondary" disabled={busy} onClick={() => { setEmail(user.email ?? ""); setDeleteOpen(false); changeMode("forgot"); }}>{a("setPassword")}</button></div>}
      <form className="account-form" onSubmit={event => { event.preventDefault(); const next = (profileName ?? nickname).trim(); if (!validNickname(next)) { setError("invalidNickname"); return; } void run(async () => { const result = await client.from("profiles").upsert({ id: user.id, nickname: next }); if (result.error) throw result.error; setNickname(next); setProfileName(null); setStatus("saved"); }); }}><label>{a("nickname")}<input name="nickname" autoComplete="nickname" value={profileName ?? nickname} onChange={e => setProfileName(e.target.value)} required minLength={2} maxLength={30} disabled={busy} /></label><button className="button secondary" disabled={busy}><Save size={17} />{a("saveProfile")}</button></form>
      <section className="account-records" aria-labelledby="member-records"><h2 id="member-records">{a("records")}</h2>{scores.length ? <dl>{scores.map(row => <div key={`${row.category}:${row.difficulty}`}><dt>{storedCategoryLabel(locale, row.category)} · {levelInfo(locale, row.difficulty).label}</dt><dd>{row.score.toLocaleString(numberLocale(locale))}</dd></div>)}</dl> : <p>{a("noRecords")}</p>}<p>{a("scoreNote")}</p><button className="button secondary" disabled={syncStatus === "syncing" || busy} onClick={() => void sync()}><RefreshCw size={18} />{a(syncStatus === "syncing" ? "busy" : "sync")}</button><p role="status">{syncStatus === "synced" ? a("synced") : syncStatus === "error" ? a("syncError") : ""}</p></section>
      <div className="account-actions"><button className="text-button" disabled={busy} onClick={() => void run(async () => { const result = await client.auth.signOut({ scope: "local" }); if (result.error) throw result.error; setMode("login"); })}><LogOut size={17} />{a("signout")}</button><button className="text-button account-danger" disabled={busy} onClick={() => { setDeleteOpen(true); setStatus(null); setError(null); }}><Trash2 size={17} />{a("deleteAccount")}</button></div>
      {deleteOpen && <form className="account-form account-delete" onSubmit={remove}><h2>{a("deleteAccount")}</h2><p>{a("deleteIntro")}</p><PasswordField key={`delete-${busy}`} id="delete-password" label={a("password")} value={deletePassword} onChange={setDeletePassword} disabled={busy} a={a} /><label className="account-check"><input type="checkbox" required disabled={busy} /><span>{a("confirmDelete")}</span></label><div className="account-actions"><button className="button secondary account-danger" disabled={busy}><Trash2 size={18} />{busy ? a("busy") : a("deleteAccount")}</button><button type="button" className="text-button" disabled={busy} onClick={() => { setDeleteOpen(false); setDeletePassword(""); }}>{a("cancel")}</button></div></form>}
    </>}
    {deleteOpen && googleOnly && <p>{a("googleDeleteHint")}</p>}
    <p role="alert">{error ? a(error) : googleError ? a("googleError") : ""}</p><p role="status">{status ? a(status) : ""}</p>
  </section>;
}
