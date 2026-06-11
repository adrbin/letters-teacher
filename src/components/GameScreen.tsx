import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCharacters, matchesCharacterTranscript } from "../data/letters";
import { answerQuestion, remainingPoints, type SessionState } from "../game/session";
import { recognizeExpectedLetter, type Stroke } from "../handwriting/recognizer";
import { useFeedbackSound } from "../hooks/useFeedbackSound";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { getCopy, translateFeedback } from "../i18n";
import type { AttemptResult, LetterItem } from "../types";
import { DrawingCanvas } from "./DrawingCanvas";
import { LetterImage } from "./LetterImage";

type Props = {
  session: SessionState;
  onSessionChange: (session: SessionState) => void;
  onExit: () => void;
};

type Copy = ReturnType<typeof getCopy>;

export function GameScreen({ session, onSessionChange, onExit }: Props) {
  const question = session.questions[session.currentIndex];
  const copy = getCopy(session.settings.language);
  const characterSet = session.settings.characterSet;
  const { speak, supported: speechSupported, error: speechError } = useSpeechSynthesis();
  const playFeedbackSound = useFeedbackSound();
  const feedbackSequence = useRef(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [heardTranscript, setHeardTranscript] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<{
    result: AttemptResult;
    target: LetterItem;
    sourceKey: string;
    feedbackKey: number;
  } | null>(null);

  const submitAnswer = useCallback(
    (answer: string, sourceKey = answer || "try-again") => {
      const answeredTarget = session.questions[session.currentIndex].target;
      const next = answerQuestion(session, answer);
      feedbackSequence.current += 1;
      setAnswerFeedback({ result: next.result, target: answeredTarget, sourceKey, feedbackKey: feedbackSequence.current });
      playFeedbackSound(next.result.correct ? "correct" : "incorrect");
      onSessionChange(next.state);
    },
    [onSessionChange, playFeedbackSound, session]
  );

  const recognition = useSpeechRecognition(
    session.settings.language,
    useCallback(
      (transcript: string) => {
        setHeardTranscript(transcript);
        submitAnswer(matchesCharacterTranscript(question.target, transcript) ? question.target.display : "", "speech");
      },
      [question.target, submitAnswer]
    )
  );

  useEffect(() => {
    setStrokes([]);
    setHeardTranscript("");
    let speakTimeout: number | undefined;
    if (session.settings.gameMode === "hear-pick" || session.settings.gameMode === "hear-write") {
      speakTimeout = window.setTimeout(() => speak(question.target), 250);
    }
    return () => {
      if (speakTimeout) window.clearTimeout(speakTimeout);
      recognition.abort();
    };
  }, [question.id, question.target, recognition.abort, session.settings.gameMode, speak]);

  const progressLabel = `${session.currentIndex + 1} / ${session.questions.length}`;
  const availablePoints = remainingPoints(session.wrongAttempts.length);
  const status = translateFeedback(session.settings.language, session.lastFeedback) || speechError || copy.ready;
  const feedbackTone = answerFeedback?.result.correct ? "answer-correct" : answerFeedback ? "answer-incorrect" : "";

  return (
    <main className="page-shell min-h-screen p-4 sm:p-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white/92 p-4 shadow-soft ring-1 ring-slate-200 sm:min-h-[calc(100vh-3rem)] sm:p-6">
        {answerFeedback?.result.correct && (
          <div
            key={`burst-${answerFeedback.feedbackKey}`}
            className="celebration-burst pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
        )}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button className="control-button bg-slate-100 px-4 text-slate-900" type="button" onClick={onExit}>
              {copy.back}
            </button>
            <p className="rounded-full bg-blue-100 px-4 py-2 text-lg font-black text-blue-900">{progressLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <p
              key={answerFeedback?.result.correct ? answerFeedback.feedbackKey : "score"}
              className={`rounded-full bg-emerald-100 px-4 py-2 text-lg font-black text-emerald-900 ${answerFeedback?.result.correct ? "score-pop" : ""}`}
            >
              {copy.score} {session.score}
            </p>
            <p className="rounded-full bg-amber-100 px-4 py-2 text-lg font-black text-amber-900">
              {copy.pointPrefix}
              {availablePoints}
            </p>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center py-6">
          {session.settings.gameMode === "hear-pick" && (
            <HearPickGame
              questionTarget={question.target}
              options={question.options}
              wrongAttempts={session.wrongAttempts}
              speechSupported={speechSupported}
              onSpeak={speak}
              onAnswer={(answer) => submitAnswer(answer, answer)}
              answerFeedback={answerFeedback}
              characterSet={characterSet}
              copy={copy}
            />
          )}

          {session.settings.gameMode === "hear-write" && (
            <HearWriteGame
              target={question.target}
              strokes={strokes}
              onStrokesChange={setStrokes}
              speechSupported={speechSupported}
              onSpeak={speak}
              onAnswer={(answer) => submitAnswer(answer, "check")}
              letters={getCharacters(session.settings.language, characterSet)}
              answerFeedback={answerFeedback}
              characterSet={characterSet}
              copy={copy}
            />
          )}

          {session.settings.gameMode === "see-pick-sound" && (
            <SeePickSoundGame
              options={question.options}
              target={question.target}
              speechSupported={speechSupported}
              onSpeak={speak}
              onAnswer={(answer) => submitAnswer(answer, answer)}
              answerFeedback={answerFeedback}
              copy={copy}
            />
          )}

          {session.settings.gameMode === "see-say" && (
            <SeeSayGame
              target={question.target}
              transcript={heardTranscript}
              recognition={recognition}
              onExit={onExit}
              characterSet={characterSet}
              copy={copy}
            />
          )}
        </div>

        {answerFeedback?.result.correct && (
          <div
            key={`example-${answerFeedback.feedbackKey}`}
            className="answer-correct mx-auto mb-4 flex w-full max-w-xl items-center justify-center gap-4 rounded-3xl bg-emerald-100 p-3 text-center text-emerald-950"
            role="status"
          >
            <LetterImage letter={answerFeedback.target} compact />
            <p className="text-xl font-black">
              {copy.characterExample[characterSet](answerFeedback.target.display, answerFeedback.target.example?.word)}
            </p>
          </div>
        )}

        <div
          key={answerFeedback ? `status-${answerFeedback.feedbackKey}` : "status"}
          className="min-h-16 rounded-3xl bg-slate-950 px-5 py-4 text-center text-xl font-black text-white"
          role="status"
          aria-live="polite"
        >
          <span className={feedbackTone}>{status}</span>
        </div>
      </section>
    </main>
  );
}

type SpeechProps = {
  speechSupported: boolean;
  onSpeak: (letter: LetterItem) => boolean;
};

function SpeakerButton({ letter, speechSupported, onSpeak, label }: SpeechProps & { letter: LetterItem; label: string }) {
  return (
    <button
      className="control-button mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-5xl text-white shadow-lg shadow-orange-200"
      type="button"
      aria-label={label}
      onClick={() => onSpeak(letter)}
      disabled={!speechSupported}
    >
      ▶
    </button>
  );
}

function HearPickGame({
  questionTarget,
  options,
  wrongAttempts,
  speechSupported,
  onSpeak,
  onAnswer,
  answerFeedback,
  characterSet,
  copy
}: SpeechProps & {
  questionTarget: LetterItem;
  options: LetterItem[];
  wrongAttempts: string[];
  onAnswer: (answer: string) => void;
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  characterSet: "letters" | "digits";
  copy: Copy;
}) {
  return (
    <div className="grid gap-7 text-center">
      <SpeakerButton letter={questionTarget} speechSupported={speechSupported} onSpeak={onSpeak} label={copy.playCharacterSound[characterSet]} />
      <h1 className="text-3xl font-black text-slate-950">{copy.pickCharacterYouHear[characterSet]}</h1>
      <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4">
        {options.map((option) => {
          const missed = wrongAttempts.includes(option.display);
          const pulsing = answerFeedback?.sourceKey === option.display;
          return (
            <button
              key={option.display}
              className={`control-button min-h-28 border-4 text-5xl ${
                missed ? "border-rose-500 bg-rose-100 text-rose-950" : "border-slate-200 bg-white text-slate-950 shadow-sm"
              } ${pulsing ? (answerFeedback?.result.correct ? "answer-correct" : "answer-incorrect") : ""}`}
              type="button"
              aria-label={copy.chooseCharacter[characterSet](option.display)}
              onClick={() => onAnswer(option.display)}
            >
              {missed ? "✕ " : ""}
              {option.display}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HearWriteGame({
  target,
  strokes,
  onStrokesChange,
  speechSupported,
  onSpeak,
  onAnswer,
  letters,
  answerFeedback,
  characterSet,
  copy
}: SpeechProps & {
  target: LetterItem;
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[]) => void;
  onAnswer: (answer: string) => void;
  letters: LetterItem[];
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  characterSet: "letters" | "digits";
  copy: Copy;
}) {
  const recognized = useMemo(
    () =>
      recognizeExpectedLetter(
        strokes,
        target.display,
        letters.map((letter) => letter.display)
      ),
    [letters, strokes, target.display]
  );

  return (
    <div className="grid gap-5 text-center">
      <SpeakerButton letter={target} speechSupported={speechSupported} onSpeak={onSpeak} label={copy.playCharacterSound[characterSet]} />
      <h1 className="text-3xl font-black text-slate-950">{copy.drawCharacter[characterSet]}</h1>
      <DrawingCanvas strokes={strokes} onChange={onStrokesChange} />
      <div className="mx-auto flex w-full max-w-2xl gap-3">
        <button className="control-button flex-1 bg-slate-100 px-5 text-slate-950" type="button" onClick={() => onStrokesChange([])}>
          {copy.clear}
        </button>
        <button
          className={`control-button flex-1 bg-sky-500 px-5 text-white shadow-lg shadow-sky-200 ${
            answerFeedback?.sourceKey === "check" ? (answerFeedback.result.correct ? "answer-correct" : "answer-incorrect") : ""
          }`}
          type="button"
          data-recognized-letter={recognized.letter ?? ""}
          data-recognition-confidence={recognized.confidence.toFixed(3)}
          data-recognition-matches={recognized.matches ? "true" : "false"}
          onClick={() => onAnswer(recognized.matches ? target.display : "")}
        >
          {copy.check}
        </button>
      </div>
    </div>
  );
}

function SeePickSoundGame({
  options,
  target,
  speechSupported,
  onSpeak,
  onAnswer,
  answerFeedback,
  copy
}: {
  options: LetterItem[];
  target: LetterItem;
  speechSupported: boolean;
  onSpeak: (letter: LetterItem) => boolean;
  onAnswer: (answer: string) => void;
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  copy: Copy;
}) {
  const [previewedLetter, setPreviewedLetter] = useState<LetterItem | null>(null);

  useEffect(() => {
    setPreviewedLetter(null);
  }, [target.display]);

  return (
    <div className="grid gap-7 text-center">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-6">
        <p className="text-[7rem] font-black leading-none text-slate-950 sm:text-[10rem]">{target.display}</p>
        <LetterImage letter={target} compact />
      </div>
      <h1 className="text-3xl font-black text-slate-950">{copy.pickMatchingSound}</h1>
      <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={option.display}
            className={`control-button min-h-28 border-4 text-4xl shadow-sm ${
              previewedLetter?.display === option.display
                ? "border-emerald-500 bg-emerald-100 text-emerald-950"
                : "border-slate-200 bg-white text-slate-950"
            } ${answerFeedback?.sourceKey === option.display ? (answerFeedback.result.correct ? "answer-correct" : "answer-incorrect") : ""}`}
            type="button"
            aria-label={copy.playSound(index + 1)}
            disabled={!speechSupported}
            onClick={() => {
              onSpeak(option);
              setPreviewedLetter(option);
            }}
          >
            ▶
          </button>
        ))}
      </div>
      <button
        className="control-button mx-auto w-full max-w-md bg-emerald-500 px-6 py-4 text-xl text-white shadow-lg shadow-emerald-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        type="button"
        disabled={!previewedLetter}
        onClick={() => previewedLetter && onAnswer(previewedLetter.display)}
      >
        {copy.chooseThisSound}
      </button>
    </div>
  );
}

function SeeSayGame({
  target,
  transcript,
  recognition,
  onExit,
  characterSet,
  copy
}: {
  target: LetterItem;
  transcript: string;
  recognition: ReturnType<typeof useSpeechRecognition>;
  onExit: () => void;
  characterSet: "letters" | "digits";
  copy: Copy;
}) {
  return (
    <div className="grid gap-7 text-center">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-6">
        <p className="text-[7rem] font-black leading-none text-slate-950 sm:text-[10rem]">{target.display}</p>
        <LetterImage letter={target} compact />
      </div>
      <h1 className="text-3xl font-black text-slate-950">{copy.sayThisCharacter[characterSet]}</h1>
      {recognition.supported ? (
        <>
          <button
            className={`control-button mx-auto h-28 w-28 rounded-full text-5xl text-white shadow-lg ${
              recognition.listening ? "bg-rose-500 shadow-rose-200" : "bg-fuchsia-500 shadow-fuchsia-200"
            }`}
            type="button"
            aria-label={recognition.listening ? copy.stopRecording : copy.startRecording}
            onClick={recognition.listening ? recognition.stop : recognition.start}
          >
            ●
          </button>
          <p className="min-h-8 text-xl font-black text-slate-700">{transcript ? `${copy.heard}: ${transcript}` : recognition.error}</p>
        </>
      ) : (
        <div className="mx-auto grid max-w-xl gap-4 rounded-3xl bg-rose-100 p-5 text-rose-950">
          <p className="text-xl font-black">{copy.speechRecognitionUnavailable}</p>
          <button className="control-button bg-rose-600 px-5 text-white" type="button" onClick={onExit}>
            {copy.chooseAnotherGame}
          </button>
        </div>
      )}
    </div>
  );
}
