import { Gamepad2, RotateCcw } from "lucide-react";
import { languageNames } from "../data/letters";
import { getResultGrade } from "../game/session";
import { getCopy } from "../i18n";
import type { EarnedStamp, LanguageCode, SessionSettings, SessionSummary } from "../types";
import { IconLabel } from "./IconLabel";
import { StampBadge, StampCollection } from "./StampBadge";

type Props = {
  settings: SessionSettings;
  summary: SessionSummary;
  stamps: EarnedStamp[];
  newStamp: EarnedStamp | null;
  onPlayAgain: () => void;
  onChooseGame: () => void;
  onUiAction: (label: string) => void;
  onStampSpeak: (label: string, language: LanguageCode) => void;
};

export function ResultsScreen({ settings, summary, stamps, newStamp, onPlayAgain, onChooseGame, onUiAction, onStampSpeak }: Props) {
  const copy = getCopy(settings.language);
  const resultGrade = getResultGrade(summary.accuracy);
  const resultGradeLabel = copy.resultGrades[resultGrade];
  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-4xl rounded-[2rem] bg-white/92 p-5 text-center shadow-soft ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">{languageNames[settings.language]}</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 sm:text-6xl">{copy.greatWork}</h1>
        <p className="mt-3 text-2xl font-black text-emerald-700 sm:text-3xl">{resultGradeLabel}</p>

        <div className="mx-auto mt-7 grid max-w-xl gap-4 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-2xl font-black">
            {copy.score} {summary.totalScore} / {summary.maxScore}
          </p>
          <div className="h-7 overflow-hidden rounded-full bg-white/20" aria-label={`${copy.accuracy} ${summary.accuracy}%`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-orange-400 transition-all"
              style={{ width: `${summary.accuracy}%` }}
            />
          </div>
          <p className="text-xl font-black">{summary.accuracy}%</p>
        </div>

        {newStamp && (
          <section className="mx-auto mt-7 grid max-w-sm justify-items-center gap-3 rounded-3xl bg-amber-50 p-5 text-amber-950 ring-2 ring-amber-200">
            <h2 className="text-2xl font-black">{copy.newStamp}</h2>
            <StampBadge stamp={newStamp} language={settings.language} isNew onSpeakLabel={onStampSpeak} />
          </section>
        )}

        <div className="mt-7 grid gap-4 text-left sm:grid-cols-2">
          <LetterList title={copy.strongCharacters[settings.characterSet]} letters={summary.strongLetters} tone="emerald" />
          <LetterList title={copy.practiceAgain} letters={summary.practiceLetters} tone="amber" />
        </div>

        <div className="mt-7 text-left">
          <StampCollection stamps={stamps} language={settings.language} onSpeakLabel={onStampSpeak} />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            className="control-button flex-1 bg-orange-500 px-6 py-4 text-xl text-white shadow-lg shadow-orange-200"
            type="button"
            onClick={() => handleAction(copy.playAgain, onPlayAgain)}
          >
            <IconLabel icon={RotateCcw}>{copy.playAgain}</IconLabel>
          </button>
          <button
            className="control-button flex-1 bg-slate-100 px-6 py-4 text-xl text-slate-950"
            type="button"
            onClick={() => handleAction(copy.chooseAnotherGame, onChooseGame)}
          >
            <IconLabel icon={Gamepad2}>{copy.chooseAnotherGame}</IconLabel>
          </button>
        </div>
      </section>
    </main>
  );
}

function LetterList({ title, letters, tone }: { title: string; letters: string[]; tone: "emerald" | "amber" }) {
  const toneClasses = tone === "emerald" ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950";

  return (
    <section className={`${toneClasses} min-h-32 rounded-3xl p-5`}>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-4 flex flex-wrap gap-2 text-3xl font-black">
        {(letters.length > 0 ? letters : ["-"]).map((letter) => (
          <span key={letter} className="rounded-2xl bg-white/70 px-4 py-2">
            {letter}
          </span>
        ))}
      </p>
    </section>
  );
}
