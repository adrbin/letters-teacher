import { useCallback, useEffect, useRef } from "react";

type FeedbackTone = "correct" | "incorrect";

function getAudioContextConstructor(): typeof AudioContext | null {
  const AudioContextConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return AudioContextConstructor ?? null;
}

function createAudioContext(): AudioContext | null {
  const AudioContextConstructor = getAudioContextConstructor();
  if (!AudioContextConstructor) return null;
  try {
    return new AudioContextConstructor();
  } catch {
    return null;
  }
}

function playBeep(context: AudioContext, frequency: number, start: number, duration: number, gainValue: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function useFeedbackSound() {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (contextRef.current) return contextRef.current;

    const context = createAudioContext();
    contextRef.current = context;
    return context;
  }, []);

  useEffect(
    () => () => {
      const context = contextRef.current;
      contextRef.current = null;
      if (!context) return;
      context.close().catch(() => undefined);
    },
    []
  );

  return useCallback((tone: FeedbackTone) => {
    if (typeof window === "undefined") return;

    const context = getContext();
    if (!context) return;
    if (context.state === "suspended") {
      context.resume().catch(() => undefined);
    }

    const start = context.currentTime;
    if (tone === "correct") {
      playBeep(context, 523.25, start, 0.12, 0.12);
      playBeep(context, 659.25, start + 0.12, 0.14, 0.1);
      return;
    }

    playBeep(context, 220, start, 0.16, 0.08);
  }, [getContext]);
}
