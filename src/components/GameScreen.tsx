import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Eraser, Gamepad2, Mic, Square, Undo2, Volume2 } from "lucide-react";
import { getCharacters, matchesCharacterTranscript } from "../data/letters";
import { getCharacterDisplayText, getExampleDisplayWord } from "../game/displayCase";
import { advanceQuestion, answerQuestion, remainingPoints, type SessionState } from "../game/session";
import { recognizeExpectedLetter, type Stroke } from "../handwriting/recognizer";
import { useFeedbackSound } from "../hooks/useFeedbackSound";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { getCopy, translateFeedback } from "../i18n";
import type { AttemptResult, CharacterSet, LetterCase, LetterItem } from "../types";
import { DrawingCanvas } from "./DrawingCanvas";
import { IconLabel } from "./IconLabel";
import { LetterImage } from "./LetterImage";

type Props = {
  session: SessionState;
  onSessionChange: (session: SessionState) => void;
  onExit: () => void;
  onUiAction: (label: string) => void;
};

type Copy = ReturnType<typeof getCopy>;

export function GameScreen({ session, onSessionChange, onExit, onUiAction }: Props) {
  const question = session.questions[session.currentIndex];
  const copy = getCopy(session.settings.language);
  const characterSet = session.settings.characterSet;
  const letterCase = session.settings.letterCase;
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

  const showingSuccess = Boolean(session.pendingResult?.correct && answerFeedback?.result.correct);
  const isFinalQuestion = session.currentIndex >= session.questions.length - 1;

  const handleContinue = useCallback(() => {
    setAnswerFeedback(null);
    onSessionChange(advanceQuestion(session));
  }, [onSessionChange, session]);

  useEffect(() => {
    setStrokes([]);
    setHeardTranscript("");
    setAnswerFeedback(null);
    let speakTimeout: number | undefined;
    if (session.settings.gameMode === "hear-pick" || session.settings.gameMode === "hear-write") {
      speakTimeout = window.setTimeout(() => speak(question.target), 250);
    }
    return () => {
      if (speakTimeout) window.clearTimeout(speakTimeout);
      recognition.abort();
    };
  }, [question.id, question.target, recognition.abort, session.settings.gameMode, speak]);

  useEffect(() => {
    if (session.pendingResult?.correct) {
      recognition.abort();
    }
  }, [recognition.abort, session.pendingResult?.correct]);

  const progressLabel = `${session.currentIndex + 1} / ${session.questions.length}`;
  const availablePoints = remainingPoints(session.wrongAttempts.length);
  const status = translateFeedback(session.settings.language, session.lastFeedback) || speechError || copy.ready;
  const feedbackTone = answerFeedback ? "answer-incorrect" : "";
  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  return (
    <main className="page-shell min-h-screen p-4 sm:p-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white/92 p-4 shadow-soft ring-1 ring-slate-200 sm:min-h-[calc(100vh-3rem)] sm:p-6">
        {showingSuccess && answerFeedback && (
          <div
            key={`burst-${answerFeedback.feedbackKey}`}
            className="celebration-burst pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
        )}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button className="control-button bg-slate-100 px-4 text-slate-900" type="button" onClick={() => handleAction(copy.back, onExit)}>
              <IconLabel icon={ArrowLeft}>{copy.back}</IconLabel>
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
          {showingSuccess && answerFeedback ? (
            <SuccessFeedback
              target={answerFeedback.target}
              characterSet={characterSet}
              status={status}
              continueLabel={isFinalQuestion ? copy.showResults : copy.nextQuestion}
              onContinue={() => handleAction(isFinalQuestion ? copy.showResults : copy.nextQuestion, handleContinue)}
              copy={copy}
              feedbackKey={answerFeedback.feedbackKey}
              letterCase={letterCase}
            />
          ) : (
            <>
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
                  letterCase={letterCase}
                />
              )}

              {session.settings.gameMode === "hear-write" && characterSet !== "words" && (
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
                  letterCase={letterCase}
                  onUiAction={onUiAction}
                />
              )}

              {session.settings.gameMode === "hear-write" && characterSet === "words" && (
                <SpellWordGame
                  target={question.target}
                  speechSupported={speechSupported}
                  onSpeak={speak}
                  onAnswer={(answer) => submitAnswer(answer, "spell")}
                  answerFeedback={answerFeedback}
                  copy={copy}
                  letterCase={letterCase}
                  onUiAction={onUiAction}
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
                  letterCase={letterCase}
                  onUiAction={onUiAction}
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
                  letterCase={letterCase}
                  onUiAction={onUiAction}
                />
              )}
            </>
          )}
        </div>

        {!showingSuccess && (
          <div
            key={answerFeedback ? `status-${answerFeedback.feedbackKey}` : "status"}
            className="min-h-16 rounded-3xl bg-slate-950 px-5 py-4 text-center text-xl font-black text-white"
            role="status"
            aria-live="polite"
          >
            <span className={feedbackTone}>{status}</span>
          </div>
        )}
      </section>
    </main>
  );
}

function SuccessFeedback({
  target,
  characterSet,
  status,
  continueLabel,
  onContinue,
  copy,
  feedbackKey,
  letterCase
}: {
  target: LetterItem;
  characterSet: CharacterSet;
  status: string;
  continueLabel: string;
  onContinue: () => void;
  copy: Copy;
  feedbackKey: number;
  letterCase: LetterCase | undefined;
}) {
  const displayTarget = getCharacterDisplayText(target, letterCase);
  const displayExampleWord = getExampleDisplayWord(target, letterCase);

  return (
    <div
      key={`success-${feedbackKey}`}
      className="answer-correct mx-auto grid w-full max-w-2xl gap-5 rounded-3xl bg-emerald-100 p-5 text-center text-emerald-950 ring-4 ring-emerald-200"
      role="status"
      aria-live="polite"
    >
      <div className="success-stars flex justify-center gap-3 text-3xl text-amber-400" aria-hidden="true">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <p className="text-3xl font-black">{status}</p>
      <div className="mx-auto flex w-full max-w-xl flex-wrap items-center justify-center gap-4 rounded-3xl bg-white/75 p-4">
        <LetterImage letter={target} compact displayText={displayTarget} exampleWord={displayExampleWord} />
        <p className="text-2xl font-black">{copy.characterExample[characterSet](displayTarget, displayExampleWord)}</p>
      </div>
      <button
        className="control-button mx-auto w-full max-w-md bg-emerald-600 px-6 py-4 text-2xl text-white shadow-lg shadow-emerald-200"
        type="button"
        onClick={onContinue}
      >
        <IconLabel icon={Check}>{continueLabel}</IconLabel>
      </button>
    </div>
  );
}

type SpeechProps = {
  speechSupported: boolean;
  onSpeak: (letter: LetterItem) => boolean;
};

function SpeakerButton({ letter, speechSupported, onSpeak, label, visibleLabel }: SpeechProps & { letter: LetterItem; label: string; visibleLabel: string }) {
  return (
    <button
      className="control-button mx-auto flex min-h-24 items-center justify-center rounded-full bg-orange-500 px-8 text-2xl text-white shadow-lg shadow-orange-200"
      type="button"
      aria-label={label}
      onClick={() => onSpeak(letter)}
      disabled={!speechSupported}
    >
      <IconLabel icon={Volume2} iconClassName="h-9 w-9">
        {visibleLabel}
      </IconLabel>
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
  copy,
  letterCase
}: SpeechProps & {
  questionTarget: LetterItem;
  options: LetterItem[];
  wrongAttempts: string[];
  onAnswer: (answer: string) => void;
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  characterSet: CharacterSet;
  copy: Copy;
  letterCase: LetterCase | undefined;
}) {
  const cardTextSize = characterSet === "words" ? "text-3xl sm:text-4xl" : "text-5xl";

  return (
    <div className="grid gap-7 text-center">
      <SpeakerButton
        letter={questionTarget}
        speechSupported={speechSupported}
        onSpeak={onSpeak}
        label={copy.playCharacterSound[characterSet]}
        visibleLabel={copy.playSoundAction}
      />
      <h1 className="text-3xl font-black text-slate-950">{copy.pickCharacterYouHear[characterSet]}</h1>
      <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4">
        {options.map((option) => {
          const displayText = getCharacterDisplayText(option, letterCase);
          const missed = wrongAttempts.includes(option.display);
          const pulsing = answerFeedback?.sourceKey === option.display;
          return (
            <button
              key={option.display}
              className={`control-button min-h-28 border-4 ${cardTextSize} ${
                missed ? "border-rose-500 bg-rose-100 text-rose-950" : "border-slate-200 bg-white text-slate-950 shadow-sm"
              } ${pulsing ? (answerFeedback?.result.correct ? "answer-correct" : "answer-incorrect") : ""}`}
              type="button"
              aria-label={copy.chooseCharacter[characterSet](displayText)}
              onClick={() => onAnswer(option.display)}
            >
              {missed ? "✕ " : ""}
              {displayText}
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
  copy,
  letterCase,
  onUiAction
}: SpeechProps & {
  target: LetterItem;
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[]) => void;
  onAnswer: (answer: string) => void;
  letters: LetterItem[];
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  characterSet: "letters" | "digits";
  copy: Copy;
  letterCase: LetterCase | undefined;
  onUiAction: (label: string) => void;
}) {
  const expectedDisplay = getCharacterDisplayText(target, letterCase);
  const candidateDisplays = useMemo(() => letters.map((letter) => getCharacterDisplayText(letter, letterCase)), [letterCase, letters]);
  const recognized = useMemo(
    () =>
      recognizeExpectedLetter(
        strokes,
        expectedDisplay,
        candidateDisplays
      ),
    [candidateDisplays, expectedDisplay, strokes]
  );
  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  return (
    <div className="grid gap-5 text-center">
      <SpeakerButton
        letter={target}
        speechSupported={speechSupported}
        onSpeak={onSpeak}
        label={copy.playCharacterSound[characterSet]}
        visibleLabel={copy.playSoundAction}
      />
      <h1 className="text-3xl font-black text-slate-950">{copy.drawCharacter[characterSet]}</h1>
      <DrawingCanvas strokes={strokes} onChange={onStrokesChange} />
      <div className="mx-auto flex w-full max-w-2xl gap-3">
        <button className="control-button flex-1 bg-slate-100 px-5 text-slate-950" type="button" onClick={() => handleAction(copy.clear, () => onStrokesChange([]))}>
          <IconLabel icon={Eraser}>{copy.clear}</IconLabel>
        </button>
        <button
          className={`control-button flex-1 bg-sky-500 px-5 text-white shadow-lg shadow-sky-200 ${
            answerFeedback?.sourceKey === "check" ? (answerFeedback.result.correct ? "answer-correct" : "answer-incorrect") : ""
          }`}
          type="button"
          data-recognized-letter={recognized.letter ?? ""}
          data-recognition-confidence={recognized.confidence.toFixed(3)}
          data-recognition-matches={recognized.matches ? "true" : "false"}
          onClick={() => handleAction(copy.check, () => onAnswer(recognized.matches ? target.display : ""))}
        >
          <IconLabel icon={Check}>{copy.check}</IconLabel>
        </button>
      </div>
    </div>
  );
}

type SpellingTile = {
  id: string;
  letter: string;
};

function createSpellingTiles(word: string): SpellingTile[] {
  const tiles = Array.from(word).map((letter, index) => ({
    id: `${index}-${letter}`,
    letter
  }));
  const sorted = [...tiles].sort((first, second) => {
    const firstScore = first.letter.charCodeAt(0) * 17 + first.id.charCodeAt(0);
    const secondScore = second.letter.charCodeAt(0) * 17 + second.id.charCodeAt(0);
    return firstScore - secondScore;
  });

  if (sorted.map((tile) => tile.id).join("|") === tiles.map((tile) => tile.id).join("|") && sorted.length > 1) {
    return [...sorted.slice(1), sorted[0]];
  }

  return sorted;
}

function SpellWordGame({
  target,
  speechSupported,
  onSpeak,
  onAnswer,
  answerFeedback,
  copy,
  letterCase,
  onUiAction
}: SpeechProps & {
  target: LetterItem;
  onAnswer: (answer: string) => void;
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  copy: Copy;
  letterCase: LetterCase | undefined;
  onUiAction: (label: string) => void;
}) {
  const displayWord = getCharacterDisplayText(target, letterCase);
  const tiles = useMemo(() => createSpellingTiles(displayWord), [displayWord]);
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const selectedTileSet = useMemo(() => new Set(selectedTileIds), [selectedTileIds]);
  const selectedTiles = selectedTileIds
    .map((tileId) => tiles.find((tile) => tile.id === tileId))
    .filter((tile): tile is SpellingTile => Boolean(tile));
  const selectedWord = selectedTiles.map((tile) => tile.letter).join("");
  const readyToCheck = selectedTileIds.length === tiles.length;
  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  useEffect(() => {
    setSelectedTileIds([]);
  }, [displayWord]);

  return (
    <div className="grid gap-5 text-center">
      <SpeakerButton letter={target} speechSupported={speechSupported} onSpeak={onSpeak} label={copy.playCharacterSound.words} visibleLabel={copy.playSoundAction} />
      <h1 className="text-3xl font-black text-slate-950">{copy.drawCharacter.words}</h1>
      <div className="mx-auto flex flex-wrap items-center justify-center gap-4">
        <LetterImage letter={target} compact showCaption={false} displayText={displayWord} />
      </div>

      <div className="mx-auto grid w-full max-w-2xl gap-4">
        <p className="min-h-12 rounded-3xl bg-slate-100 px-4 py-2 text-4xl font-black tracking-wide text-slate-950" aria-label={copy.spelledWord}>
          {selectedWord || " "}
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(3.5rem,1fr))] gap-2">
          {tiles.map((_, index) => {
            const selectedTile = selectedTiles[index];
            return (
              <button
                key={`slot-${index}`}
                className="control-button min-h-16 border-4 border-dashed border-slate-200 bg-white text-3xl text-slate-950 disabled:text-slate-300"
                type="button"
                aria-label={selectedTile ? copy.removeSpellingTile(selectedTile.letter, index + 1) : undefined}
                disabled={!selectedTile}
                onClick={() => setSelectedTileIds((current) => current.filter((_, currentIndex) => currentIndex !== index))}
              >
                {selectedTile?.letter ?? ""}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(3.75rem,1fr))] gap-3">
          {tiles.map((tile, index) => {
            const selected = selectedTileSet.has(tile.id);
            return (
              <button
                key={tile.id}
                className="control-button min-h-16 border-4 border-slate-200 bg-white text-3xl text-slate-950 shadow-sm disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
                type="button"
                aria-label={copy.addSpellingTile(tile.letter, index + 1)}
                disabled={selected}
                onClick={() => setSelectedTileIds((current) => [...current, tile.id])}
              >
                {tile.letter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-2xl gap-3">
        <button className="control-button flex-1 bg-slate-100 px-5 text-slate-950" type="button" onClick={() => handleAction(copy.clear, () => setSelectedTileIds([]))}>
          <IconLabel icon={Eraser}>{copy.clear}</IconLabel>
        </button>
        <button
          className="control-button flex-1 bg-slate-100 px-5 text-slate-950 disabled:text-slate-400"
          type="button"
          disabled={selectedTileIds.length === 0}
          onClick={() => handleAction(copy.undo, () => setSelectedTileIds((current) => current.slice(0, -1)))}
        >
          <IconLabel icon={Undo2}>{copy.undo}</IconLabel>
        </button>
        <button
          className={`control-button flex-1 bg-sky-500 px-5 text-white shadow-lg shadow-sky-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none ${
            answerFeedback?.sourceKey === "spell" ? (answerFeedback.result.correct ? "answer-correct" : "answer-incorrect") : ""
          }`}
          type="button"
          disabled={!readyToCheck}
          onClick={() => handleAction(copy.check, () => onAnswer(selectedWord === displayWord ? target.display : ""))}
        >
          <IconLabel icon={Check}>{copy.check}</IconLabel>
        </button>
      </div>
    </div>
  );
}

function CharacterDisplay({ target, letterCase }: { target: LetterItem; letterCase: LetterCase | undefined }) {
  const displayText = getCharacterDisplayText(target, letterCase);

  if (target.characterSet === "words") {
    return <p className="max-w-full break-words text-5xl font-black leading-tight text-slate-950 sm:text-7xl">{displayText}</p>;
  }

  return <p className="text-[7rem] font-black leading-none text-slate-950 sm:text-[10rem]">{displayText}</p>;
}

function SeePickSoundGame({
  options,
  target,
  speechSupported,
  onSpeak,
  onAnswer,
  answerFeedback,
  copy,
  letterCase,
  onUiAction
}: {
  options: LetterItem[];
  target: LetterItem;
  speechSupported: boolean;
  onSpeak: (letter: LetterItem) => boolean;
  onAnswer: (answer: string) => void;
  answerFeedback: { result: AttemptResult; sourceKey: string; feedbackKey: number } | null;
  copy: Copy;
  letterCase: LetterCase | undefined;
  onUiAction: (label: string) => void;
}) {
  const [previewedLetter, setPreviewedLetter] = useState<LetterItem | null>(null);
  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  useEffect(() => {
    setPreviewedLetter(null);
  }, [target.display]);

  return (
    <div className="grid gap-7 text-center">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-6">
        <CharacterDisplay target={target} letterCase={letterCase} />
        <LetterImage letter={target} compact displayText={getCharacterDisplayText(target, letterCase)} exampleWord={getExampleDisplayWord(target, letterCase)} />
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
            <Volume2 aria-hidden="true" focusable="false" className="mx-auto h-12 w-12" />
          </button>
        ))}
      </div>
      <button
        className="control-button mx-auto w-full max-w-md bg-emerald-500 px-6 py-4 text-xl text-white shadow-lg shadow-emerald-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        type="button"
        disabled={!previewedLetter}
        onClick={() => previewedLetter && handleAction(copy.chooseThisSound, () => onAnswer(previewedLetter.display))}
      >
        <IconLabel icon={Check}>{copy.chooseThisSound}</IconLabel>
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
  copy,
  letterCase,
  onUiAction
}: {
  target: LetterItem;
  transcript: string;
  recognition: ReturnType<typeof useSpeechRecognition>;
  onExit: () => void;
  characterSet: CharacterSet;
  copy: Copy;
  letterCase: LetterCase | undefined;
  onUiAction: (label: string) => void;
}) {
  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  return (
    <div className="grid gap-7 text-center">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-6">
        <CharacterDisplay target={target} letterCase={letterCase} />
        <LetterImage letter={target} compact displayText={getCharacterDisplayText(target, letterCase)} exampleWord={getExampleDisplayWord(target, letterCase)} />
      </div>
      <h1 className="text-3xl font-black text-slate-950">{copy.sayThisCharacter[characterSet]}</h1>
      {recognition.supported ? (
        <>
          <button
            className={`control-button mx-auto min-h-24 rounded-full px-8 text-xl text-white shadow-lg ${
              recognition.listening ? "bg-rose-500 shadow-rose-200" : "bg-fuchsia-500 shadow-fuchsia-200"
            }`}
            type="button"
            aria-label={recognition.listening ? copy.stopRecording : copy.startRecording}
            onClick={() =>
              recognition.listening
                ? handleAction(copy.stopRecording, recognition.stop)
                : handleAction(copy.startRecording, recognition.start)
            }
          >
            <IconLabel icon={recognition.listening ? Square : Mic} iconClassName="h-8 w-8">
              {recognition.listening ? copy.stopRecording : copy.startRecording}
            </IconLabel>
          </button>
          <p className="min-h-8 text-xl font-black text-slate-700">{transcript ? `${copy.heard}: ${transcript}` : recognition.error}</p>
        </>
      ) : (
        <div className="mx-auto grid max-w-xl gap-4 rounded-3xl bg-rose-100 p-5 text-rose-950">
          <p className="text-xl font-black">{copy.speechRecognitionUnavailable}</p>
          <button className="control-button bg-rose-600 px-5 text-white" type="button" onClick={() => handleAction(copy.chooseAnotherGame, onExit)}>
            <IconLabel icon={Gamepad2}>{copy.chooseAnotherGame}</IconLabel>
          </button>
        </div>
      )}
    </div>
  );
}
