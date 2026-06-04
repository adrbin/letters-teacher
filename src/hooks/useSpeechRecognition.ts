import { useCallback, useMemo, useRef, useState } from "react";
import { speechLocales } from "../data/letters";
import { getCopy } from "../i18n";
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
  onerror: ((event?: { error?: string }) => void) | null;
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
  const [runtimeAvailable, setRuntimeAvailable] = useState(true);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const Recognition = useMemo(() => window.SpeechRecognition ?? window.webkitSpeechRecognition, []);
  const supported = Boolean(Recognition) && runtimeAvailable;
  const copy = getCopy(language);

  const start = useCallback(() => {
    if (!Recognition || !runtimeAvailable) {
      setError(copy.speechRecognitionUnavailable);
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
    recognition.onerror = (event) => {
      const unavailable = event?.error === "network" || event?.error === "not-allowed" || event?.error === "service-not-allowed";
      if (unavailable) {
        setRuntimeAvailable(false);
        setError(copy.speechRecognitionUnavailable);
      } else {
        setError(copy.speechRecognitionTryAgain);
      }
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setError("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      setRuntimeAvailable(false);
      setListening(false);
      setError(copy.speechRecognitionUnavailable);
    }
  }, [Recognition, copy.speechRecognitionTryAgain, copy.speechRecognitionUnavailable, language, onTranscript, runtimeAvailable]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
}
