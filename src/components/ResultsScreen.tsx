import { languageNames } from "../data/letters";
import { getCopy } from "../i18n";
import type { SessionSettings, SessionSummary } from "../types";

type Props = {
  settings: SessionSettings;
  summary: SessionSummary;
  onPlayAgain: () => void;
  onChooseGame: () => void;
};

export function ResultsScreen({ settings, summary, onPlayAgain, onChooseGame }: Props) {
  const copy = getCopy(settings.language);

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-4xl rounded-[2rem] bg-white/92 p-5 text-center shadow-soft ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">{languageNames[settings.language]}</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 sm:text-6xl">{copy.greatWork}</h1>

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

        <div className="mt-7 grid gap-4 text-left sm:grid-cols-2">
          <LetterList title={copy.strongLetters} letters={summary.strongLetters} tone="emerald" />
          <LetterList title={copy.practiceAgain} letters={summary.practiceLetters} tone="amber" />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="control-button flex-1 bg-orange-500 px-6 py-4 text-xl text-white shadow-lg shadow-orange-200" type="button" onClick={onPlayAgain}>
            {copy.playAgain}
          </button>
          <button className="control-button flex-1 bg-slate-100 px-6 py-4 text-xl text-slate-950" type="button" onClick={onChooseGame}>
            {copy.chooseAnotherGame}
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
