import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  abort?: () => void;
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

  const cleanupRecognition = useCallback((recognition: BrowserSpeechRecognition | null) => {
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    if (recognitionRef.current === recognition) {
      recognitionRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (listening) return;

    if (!Recognition || !runtimeAvailable) {
      setError(copy.speechRecognitionUnavailable);
      return;
    }

    cleanupRecognition(recognitionRef.current);
    const recognition = new Recognition();
    recognition.lang = speechLocales[language];
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onresult = (event) => {
      const alternatives = event.results[0] ? Array.from(event.results[0]) : [];
      const transcript = alternatives.map((alternative) => alternative.transcript).join(" ");
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
      cleanupRecognition(recognition);
    };
    recognition.onend = () => {
      setListening(false);
      cleanupRecognition(recognition);
    };
    recognitionRef.current = recognition;
    setError("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      cleanupRecognition(recognition);
      setRuntimeAvailable(false);
      setListening(false);
      setError(copy.speechRecognitionUnavailable);
    }
  }, [
    Recognition,
    cleanupRecognition,
    copy.speechRecognitionTryAgain,
    copy.speechRecognitionUnavailable,
    language,
    listening,
    onTranscript,
    runtimeAvailable
  ]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setListening(false);
      return;
    }

    try {
      recognition.stop();
    } catch {
      recognition.abort?.();
      cleanupRecognition(recognition);
    }
    setListening(false);
  }, [cleanupRecognition]);

  const abort = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setListening(false);
      return;
    }

    try {
      recognition.abort?.();
    } finally {
      cleanupRecognition(recognition);
      setListening(false);
    }
  }, [cleanupRecognition]);

  useEffect(() => abort, [abort]);

  return { supported, listening, error, start, stop, abort };
}

export type SpeechRecognitionControls = ReturnType<typeof useSpeechRecognition>;
