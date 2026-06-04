import { useCallback } from "react";
import { speechLocales } from "../data/letters";
import type { LetterItem } from "../types";

export function useSpeechSynthesis() {
  const speak = useCallback((letter: LetterItem) => {
    if (!("speechSynthesis" in window)) return false;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(letter.speechText);
    utterance.lang = speechLocales[letter.language];
    utterance.rate = 0.78;
    utterance.pitch = 1.12;
    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  return { speak, supported: typeof window !== "undefined" && "speechSynthesis" in window };
}
