"use client";
import { useI18n } from "./locale-provider";

import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";

export function ExitDialog({
  onCancel,
  onExit,
  relaxed = false,
  adaptive = false,
}: {
  onCancel: () => void;
  onExit: () => void;
  relaxed?: boolean;
  adaptive?: boolean;
}) {
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="exit-dialog"
      aria-labelledby="exit-title"
      aria-describedby="exit-description"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <span className="dialog-icon">
        <LogOut />
      </span>
      <h2 id="exit-title">{adaptive ? "Turu bitirmek istiyor musun?" : t("exitHeading")}</h2>
      <p id="exit-description">{adaptive ? "Şu ana kadarki cevapların sonuçlarda gösterilecek. Devam etmek istersen turuna geri dönebilirsin." : t(relaxed ? "exitDescriptionRelaxed" : "exitDescription")}</p>
      <div className="dialog-actions">
        <button autoFocus className="button primary" onClick={onCancel}>{adaptive ? "Tura devam et" : t("resume")}</button>
        <button className="button secondary" onClick={onExit}>{adaptive ? "Sonuçları gör" : t("exitConfirm")}</button>
      </div>
    </dialog>
  );
}
