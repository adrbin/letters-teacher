import { getCharacters, languageNames } from "../data/letters";
import { getCopy } from "../i18n";
import type { CharacterSet, EarnedStamp, GameMode, LanguageCode, SessionSettings } from "../types";
import { StampCollection } from "./StampBadge";

const MIN_QUESTION_COUNT = 3;
const MAX_QUESTION_COUNT = 30;

const gameOptions: Array<{ mode: GameMode; accent: string }> = [
  { mode: "hear-pick", accent: "bg-orange-500" },
  { mode: "hear-write", accent: "bg-sky-500" },
  { mode: "see-pick-sound", accent: "bg-emerald-500" },
  { mode: "see-say", accent: "bg-fuchsia-500" }
];

type Props = {
  settings: SessionSettings;
  stamps: EarnedStamp[];
  onSettingsChange: (settings: SessionSettings) => void;
  onStart: () => void;
};

function getMaxQuestionCount(language: LanguageCode, characterSet: CharacterSet): number {
  return Math.min(MAX_QUESTION_COUNT, getCharacters(language, characterSet).length);
}

function clampQuestionCount(language: LanguageCode, characterSet: CharacterSet, questionCount: number): number {
  return Math.min(getMaxQuestionCount(language, characterSet), Math.max(MIN_QUESTION_COUNT, questionCount || 10));
}

export function SetupScreen({ settings, stamps, onSettingsChange, onStart }: Props) {
  const copy = getCopy(settings.language);
  const maxQuestionCount = getMaxQuestionCount(settings.language, settings.characterSet);
  const setValue = <Key extends keyof SessionSettings>(key: Key, value: SessionSettings[Key]) => {
    if (key === "language") {
      const language = value as LanguageCode;
      onSettingsChange({
        ...settings,
        language,
        questionCount: clampQuestionCount(language, settings.characterSet, settings.questionCount)
      });
      return;
    }

    if (key === "characterSet") {
      const characterSet = value as CharacterSet;
      onSettingsChange({
        ...settings,
        characterSet,
        questionCount: clampQuestionCount(settings.language, characterSet, settings.questionCount)
      });
      return;
    }

    if (key === "questionCount") {
      onSettingsChange({ ...settings, questionCount: clampQuestionCount(settings.language, settings.characterSet, value as number) });
      return;
    }

    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-5xl rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-slate-200 sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-orange-600">{copy.appName}</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">{copy.headline[settings.characterSet]}</h1>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-lg font-black text-slate-800">
                {copy.language}
                <select
                  className="min-h-14 rounded-2xl border-2 border-slate-200 bg-white px-4 text-xl"
                  value={settings.language}
                  onChange={(event) => setValue("language", event.target.value as LanguageCode)}
                >
                  <option value="pl">{languageNames.pl}</option>
                  <option value="en">{languageNames.en}</option>
                </select>
              </label>
              <div className="grid gap-2 text-lg font-black text-slate-800">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label={copy.chooseGame}>
                  {(["letters", "digits"] as const).map((characterSet) => {
                    const active = settings.characterSet === characterSet;
                    return (
                      <button
                        key={characterSet}
                        className={`min-h-12 rounded-xl px-4 text-lg font-black transition ${
                          active ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"
                        }`}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setValue("characterSet", characterSet)}
                      >
                        {copy.characterSetTabs[characterSet]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="grid gap-2 text-lg font-black text-slate-800">
                {copy.questions}
                <div className="flex items-center gap-3">
                  <button
                    className="control-button w-16 bg-slate-900 text-2xl text-white"
                    type="button"
                    aria-label={copy.decreaseQuestionCount}
                    onClick={() => setValue("questionCount", settings.questionCount - 1)}
                  >
                    -
                  </button>
                  <input
                    className="min-h-14 w-24 rounded-2xl border-2 border-slate-200 text-center text-2xl font-black"
                    type="number"
                    min={MIN_QUESTION_COUNT}
                    max={maxQuestionCount}
                    value={settings.questionCount}
                    onChange={(event) => setValue("questionCount", Number(event.target.value))}
                  />
                  <button
                    className="control-button w-16 bg-slate-900 text-2xl text-white"
                    type="button"
                    aria-label={copy.increaseQuestionCount}
                    onClick={() => setValue("questionCount", settings.questionCount + 1)}
                  >
                    +
                  </button>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-950">{copy.chooseGame}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {gameOptions.map((game) => {
                const active = settings.gameMode === game.mode;
                const title = copy.gameTitles[settings.characterSet][game.mode];
                return (
                  <button
                    key={game.mode}
                    className={`min-h-28 rounded-3xl border-4 p-4 text-left shadow-sm transition ${
                      active ? "border-slate-950 bg-amber-100" : "border-transparent bg-white"
                    }`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setValue("gameMode", game.mode)}
                  >
                    <span className={`mb-4 block h-3 w-16 rounded-full ${game.accent}`} />
                    <span className="block text-xl font-black text-slate-950">{title}</span>
                  </button>
                );
              })}
            </div>
            <button
              className="control-button mt-6 w-full bg-orange-500 px-6 py-4 text-2xl text-white shadow-lg shadow-orange-200"
              type="button"
              onClick={onStart}
            >
              {copy.start}
            </button>
            <div className="mt-4">
              <StampCollection stamps={stamps} language={settings.language} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
