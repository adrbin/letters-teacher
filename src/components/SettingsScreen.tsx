import {
  ArrowLeft,
  BookOpen,
  CaseSensitive,
  Check,
  Gamepad2,
  Hash,
  Languages,
  ListChecks,
  Mic,
  MousePointerClick,
  PencilLine,
  Settings as SettingsIcon,
  Shapes,
  Volume2,
  VolumeX,
  type LucideIcon
} from "lucide-react";
import { languageNames } from "../data/letters";
import { getMaxQuestionCount, MIN_QUESTION_COUNT, updateSessionSetting } from "../game/settings";
import { getCopy } from "../i18n";
import type { CharacterSet, GameMode, LanguageCode, LetterCase, SessionSettings } from "../types";
import { IconLabel } from "./IconLabel";

const gameOptions: Array<{ mode: GameMode; accent: string; icon: LucideIcon }> = [
  { mode: "hear-pick", accent: "bg-orange-500", icon: Volume2 },
  { mode: "hear-write", accent: "bg-sky-500", icon: PencilLine },
  { mode: "see-pick-sound", accent: "bg-emerald-500", icon: MousePointerClick },
  { mode: "see-say", accent: "bg-fuchsia-500", icon: Mic }
];

const characterSetIcons: Record<CharacterSet, LucideIcon> = {
  letters: Shapes,
  digits: Hash,
  words: BookOpen
};

type Props = {
  settings: SessionSettings;
  readUiActionsAloud: boolean;
  onSettingsChange: (settings: SessionSettings) => void;
  onReadUiActionsAloudChange: (enabled: boolean) => void;
  onClose: () => void;
  onUiAction: (label: string) => void;
};

export function SettingsScreen({
  settings,
  readUiActionsAloud,
  onSettingsChange,
  onReadUiActionsAloudChange,
  onClose,
  onUiAction
}: Props) {
  const copy = getCopy(settings.language);
  const maxQuestionCount = getMaxQuestionCount(settings.language, settings.characterSet);

  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  const setValue = <Key extends keyof SessionSettings>(key: Key, value: SessionSettings[Key]) => {
    onSettingsChange(updateSessionSetting(settings, key, value));
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-5xl rounded-[2rem] bg-white/92 p-5 shadow-soft ring-1 ring-slate-200 sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <button
            className="control-button bg-slate-100 px-4 text-slate-950"
            type="button"
            onClick={() => handleAction(copy.back, onClose)}
          >
            <IconLabel icon={ArrowLeft}>{copy.back}</IconLabel>
          </button>
          <h1 className="flex items-center gap-2 text-3xl font-black text-slate-950">
            <SettingsIcon aria-hidden="true" focusable="false" className="h-8 w-8 text-orange-500" />
            {copy.settings}
          </h1>
        </header>

        <div className="mt-6 grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="grid gap-5">
            <label className="grid gap-2 text-lg font-black text-slate-800">
              <IconLabel icon={Languages} className="justify-start">
                {copy.language}
              </IconLabel>
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
              <IconLabel icon={Shapes} className="justify-start">
                {copy.headline[settings.characterSet]}
              </IconLabel>
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label={copy.chooseGame}>
                {(["letters", "digits", "words"] as const).map((characterSet) => {
                  const active = settings.characterSet === characterSet;
                  const CharacterSetIcon = characterSetIcons[characterSet];
                  return (
                    <button
                      key={characterSet}
                      className={`min-h-12 rounded-xl px-3 text-base font-black transition sm:text-lg ${
                        active ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"
                      }`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleAction(copy.characterSetTabs[characterSet], () => setValue("characterSet", characterSet))}
                    >
                      <IconLabel icon={CharacterSetIcon} iconClassName="h-5 w-5">
                        {copy.characterSetTabs[characterSet]}
                      </IconLabel>
                    </button>
                  );
                })}
              </div>
            </div>

            {settings.characterSet !== "digits" && (
              <div className="grid gap-2 text-lg font-black text-slate-800">
                <IconLabel icon={CaseSensitive} className="justify-start">
                  {copy.letterCase}
                </IconLabel>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1" role="group" aria-label={copy.letterCase}>
                  {(["uppercase", "lowercase"] as const).map((letterCase) => {
                    const active = settings.letterCase !== "lowercase" ? letterCase === "uppercase" : letterCase === "lowercase";
                    return (
                      <button
                        key={letterCase}
                        className={`min-h-12 rounded-xl px-4 text-lg font-black transition ${
                          active ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"
                        }`}
                        type="button"
                        aria-pressed={active}
                        aria-label={copy.letterCaseOptions[letterCase]}
                        onClick={() => handleAction(copy.letterCaseOptions[letterCase], () => setValue("letterCase", letterCase as LetterCase))}
                      >
                        {letterCase === "uppercase" ? "ABC" : "abc"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <label className="grid gap-2 text-lg font-black text-slate-800">
              <IconLabel icon={ListChecks} className="justify-start">
                {copy.questions}
              </IconLabel>
              <div className="flex items-center gap-3">
                <button
                  className="control-button w-16 bg-slate-900 text-2xl text-white"
                  type="button"
                  aria-label={copy.decreaseQuestionCount}
                  onClick={() => handleAction(copy.decreaseQuestionCount, () => setValue("questionCount", settings.questionCount - 1))}
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
                  onClick={() => handleAction(copy.increaseQuestionCount, () => setValue("questionCount", settings.questionCount + 1))}
                >
                  +
                </button>
              </div>
            </label>

            <button
              className="control-button flex min-h-16 items-center justify-between gap-4 bg-slate-100 px-5 text-left text-slate-950"
              type="button"
              aria-label={copy.readUiActionsAloud}
              aria-pressed={readUiActionsAloud}
              onClick={() => handleAction(copy.readUiActionsAloud, () => onReadUiActionsAloudChange(!readUiActionsAloud))}
            >
              <IconLabel icon={readUiActionsAloud ? Volume2 : VolumeX} className="justify-start">
                {copy.readUiActionsAloud}
              </IconLabel>
              <span className="rounded-full bg-white px-3 py-1 text-base font-black">
                {readUiActionsAloud ? copy.readUiActionsOn : copy.readUiActionsOff}
              </span>
            </button>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-slate-950">
              <Gamepad2 aria-hidden="true" focusable="false" className="h-7 w-7 text-orange-500" />
              {copy.chooseGame}
            </h2>
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
                    onClick={() => handleAction(title, () => setValue("gameMode", game.mode))}
                  >
                    <span className={`mb-4 block h-3 w-16 rounded-full ${game.accent}`} />
                    <IconLabel icon={game.icon} className="justify-start text-xl font-black text-slate-950">
                      {title}
                    </IconLabel>
                  </button>
                );
              })}
            </div>
            <button
              className="control-button mt-6 w-full bg-orange-500 px-6 py-4 text-2xl text-white shadow-lg shadow-orange-200"
              type="button"
              onClick={() => handleAction(copy.done, onClose)}
            >
              <IconLabel icon={Check}>{copy.done}</IconLabel>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
