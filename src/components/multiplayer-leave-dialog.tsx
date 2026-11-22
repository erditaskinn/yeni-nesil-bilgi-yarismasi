"use client";

import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";

export function MultiplayerLeaveDialog({ onCancel, onConfirm, busy }: {
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return <dialog ref={dialog} className="exit-dialog" aria-labelledby="multiplayer-leave-title" aria-describedby="multiplayer-leave-description" onCancel={event => { event.preventDefault(); onCancel(); }}>
    <span className="dialog-icon"><LogOut /></span>
    <h2 id="multiplayer-leave-title">Odadan ayrıl?</h2>
    <p id="multiplayer-leave-description">Ayrılan oyuncunun puanları sonuçlardan kaldırılır. Host ayrılırsa hostluk başka bir oyuncuya geçer; son oyuncu da ayrılırsa oda silinir.</p>
    <div className="dialog-actions">
      <button autoFocus className="button primary" onClick={onCancel} disabled={busy}>Odada kal</button>
      <button className="button secondary" onClick={onConfirm} disabled={busy}>{busy ? "Ayrılıyor…" : "Odadan ayrıl"}</button>
    </div>
  </dialog>;
}
