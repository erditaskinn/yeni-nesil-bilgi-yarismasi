import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";

export function ExitDialog({
  onCancel,
  onExit,
}: {
  onCancel: () => void;
  onExit: () => void;
}) {
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
      <h2 id="exit-title">Bu turdan ayrılıyor musun?</h2>
      <p id="exit-description">
        Bu oyundaki ilerlemen kaydedilmeyecek. Sorunun süresi işlemeye devam
        ediyor.
      </p>
      <div className="dialog-actions">
        <button autoFocus className="button primary" onClick={onCancel}>
          Oyuna Dön
        </button>
        <button className="button secondary" onClick={onExit}>
          Yarışmadan Çık
        </button>
      </div>
    </dialog>
  );
}
