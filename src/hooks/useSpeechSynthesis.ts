import { useCallback, useEffect, useMemo, useState } from "react";
import { speechLocales } from "../data/letters";
import { getCopy } from "../i18n";
import type { LanguageCode, LetterItem } from "../types";

function getSpeechSynthesis() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

function loadVoices(): SpeechSynthesisVoice[] {
  return getSpeechSynthesis()?.getVoices?.() ?? [];
}

function findVoice(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | undefined {
  const language = locale.split("-")[0];
  return (
    voices.find((voice) => voice.lang === locale) ??
    voices.find((voice) => voice.lang.toLocaleLowerCase().startsWith(`${language}-`)) ??
    voices.find((voice) => voice.lang.toLocaleLowerCase().startsWith(language))
  );
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const speechSynthesis = getSpeechSynthesis();
    if (!speechSynthesis) return;

    const updateVoices = () => setVoices(loadVoices());
    updateVoices();
    speechSynthesis.addEventListener?.("voiceschanged", updateVoices);

    return () => speechSynthesis.removeEventListener?.("voiceschanged", updateVoices);
  }, []);

  const speakText = useCallback((text: string, language: LanguageCode) => {
    const speechSynthesis = getSpeechSynthesis();
    if (!speechSynthesis) {
      setError(getCopy(language).speechSynthesisUnavailable);
      return false;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLocales[language];
    utterance.voice = findVoice(loadVoices(), utterance.lang) ?? findVoice(voices, utterance.lang) ?? null;
    utterance.rate = 0.78;
    utterance.pitch = 1.12;
    utterance.onerror = () => setError(getCopy(language).speechSynthesisUnavailable);
    setError("");
    speechSynthesis.speak(utterance);
    return true;
  }, [voices]);

  const speak = useCallback((letter: LetterItem) => speakText(letter.speechText, letter.language), [speakText]);

  const supported = useMemo(() => Boolean(getSpeechSynthesis()), []);

  return { speak, speakText, supported, error };
}
