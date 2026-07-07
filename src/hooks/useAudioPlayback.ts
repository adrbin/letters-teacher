import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generatedAudioManifest, getAudioManifestEntry } from "../audio/generatedAudioManifest";
import { getCopy } from "../i18n";
import type { LanguageCode, LetterItem } from "../types";

function getAudioConstructor(): typeof Audio | null {
  if (typeof Audio === "undefined") return null;
  return Audio;
}

export function useAudioPlayback() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackRequestRef = useRef(0);
  const [error, setError] = useState("");

  const playText = useCallback((text: string, language: LanguageCode) => {
    playbackRequestRef.current += 1;
    const requestId = playbackRequestRef.current;
    const AudioConstructor = getAudioConstructor();
    if (!AudioConstructor) {
      setError(getCopy(language).audioPlaybackUnavailable);
      return false;
    }

    const entry = getAudioManifestEntry(generatedAudioManifest, language, text);
    if (!entry) {
      setError(getCopy(language).audioPlaybackUnavailable);
      return false;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new AudioConstructor(entry.path);
    audio.preload = "auto";
    audioRef.current = audio;
    setError("");

    const playResult = audio.play();
    playResult.catch(() => {
      if (playbackRequestRef.current === requestId && audioRef.current === audio) {
        setError(getCopy(language).audioPlaybackUnavailable);
      }
    });
    return true;
  }, []);

  useEffect(
    () => () => {
      playbackRequestRef.current += 1;
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    },
    []
  );

  const speak = useCallback((letter: LetterItem) => playText(letter.speechText, letter.language), [playText]);
  const speakText = useCallback((text: string, language: LanguageCode) => playText(text, language), [playText]);
  const supported = useMemo(() => Boolean(getAudioConstructor()), []);

  return { speak, speakText, supported, error };
}

export type AudioPlaybackControls = ReturnType<typeof useAudioPlayback>;
