import { useCallback, useMemo, useRef, useState } from "react";
import { speechLocales } from "../data/letters";
import type { LanguageCode } from "../types";

type SpeechRecognitionResult = {
  transcript: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<SpeechRecognitionResult>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function useSpeechRecognition(language: LanguageCode, onTranscript: (transcript: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const Recognition = useMemo(() => window.SpeechRecognition ?? window.webkitSpeechRecognition, []);
  const supported = Boolean(Recognition);

  const start = useCallback(() => {
    if (!Recognition) {
      setError("Speech recognition is not available in this browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = speechLocales[language];
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      onTranscript(transcript);
    };
    recognition.onerror = () => {
      setError("I could not hear that. Try again.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setError("");
    setListening(true);
    recognition.start();
  }, [Recognition, language, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
}
