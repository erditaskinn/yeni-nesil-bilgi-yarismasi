const SOUND_EFFECTS_KEY = "ynby-sound-effects-enabled";
const SOUND_EFFECTS_EVENT = "ynby-sound-effects-change";
let memoryEnabled = false;

export function subscribeSoundEffects(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(SOUND_EFFECTS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SOUND_EFFECTS_EVENT, onChange);
  };
}

export function soundEffectsServerSnapshot(): boolean {
  return false;
}

export function readSoundEffectsEnabled(): boolean {
  try {
    return window.localStorage.getItem(SOUND_EFFECTS_KEY) === "true";
  } catch {
    return memoryEnabled;
  }
}

export function writeSoundEffectsEnabled(enabled: boolean): void {
  memoryEnabled = enabled;
  try {
    window.localStorage.setItem(SOUND_EFFECTS_KEY, String(enabled));
  } catch {
    // Audio remains optional when storage is unavailable.
  }
  window.dispatchEvent(new Event(SOUND_EFFECTS_EVENT));
}

export function playQuizFeedbackSound(correct: boolean): void {
  if (typeof window === "undefined" || !readSoundEffectsEnabled()) return;
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    void context.resume().catch(() => {});
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(correct ? 660 : 220, now);
    if (correct) oscillator.frequency.setValueAtTime(880, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (correct ? 0.2 : 0.16));
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + (correct ? 0.21 : 0.17));
    oscillator.onended = () => void context.close();
  } catch {
    // Sound is decorative; quiz input should never depend on audio support.
  }
}
