"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { readSoundEffectsEnabled, soundEffectsServerSnapshot, subscribeSoundEffects, writeSoundEffectsEnabled } from "../lib/sound-effects";
import { useI18n } from "./locale-provider";

export function SoundToggle() {
  const { t } = useI18n();
  const enabled = useSyncExternalStore(subscribeSoundEffects, readSoundEffectsEnabled, soundEffectsServerSnapshot);
  const label = t(enabled ? "soundOff" : "soundOn");

  function toggle() {
    writeSoundEffectsEnabled(!enabled);
  }

  return <button
    type="button"
    className="theme-toggle sound-toggle"
    aria-label={label}
    title={label}
    aria-pressed={enabled}
    onClick={toggle}
  >
    {enabled ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
  </button>;
}
