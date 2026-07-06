import {
  ArrowLeft,
  CaseSensitive,
  Check,
  Languages,
  Lightbulb,
  LightbulbOff,
  ListChecks,
  Settings as SettingsIcon,
  Volume2,
  VolumeX
} from "lucide-react";
import { languageNames } from "../data/letters";
import { getMaxQuestionCount, MIN_QUESTION_COUNT, updateSessionSetting } from "../game/settings";
import { getCopy } from "../i18n";
import type { LanguageCode, LetterCase, SessionSettings } from "../types";
import { IconLabel } from "./IconLabel";

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
  const showHints = settings.showHints !== false;

  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  const setValue = <Key extends keyof SessionSettings>(key: Key, value: SessionSettings[Key]) => {
    onSettingsChange(updateSessionSetting(settings, key, value));
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-3xl rounded-[2rem] bg-white/92 p-5 shadow-soft ring-1 ring-slate-200 sm:p-8">
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

        <div className="mt-6 grid gap-5">
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
              <option value="zh">{languageNames.zh}</option>
            </select>
          </label>

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

          <label className="grid justify-items-center gap-2 text-center text-lg font-black text-slate-800">
            <IconLabel icon={ListChecks}>{copy.questions}</IconLabel>
            <div className="flex items-center justify-center gap-3">
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

          <button
            className="control-button flex min-h-16 items-center justify-between gap-4 bg-slate-100 px-5 text-left text-slate-950"
            type="button"
            aria-label={copy.showHints}
            aria-pressed={showHints}
            onClick={() => handleAction(copy.showHints, () => setValue("showHints", !showHints))}
          >
            <IconLabel icon={showHints ? Lightbulb : LightbulbOff} className="justify-start">
              {copy.showHints}
            </IconLabel>
            <span className="rounded-full bg-white px-3 py-1 text-base font-black">
              {showHints ? copy.readUiActionsOn : copy.readUiActionsOff}
            </span>
          </button>

          <button
            className="control-button mt-2 w-full bg-orange-500 px-6 py-4 text-2xl text-white shadow-lg shadow-orange-200"
            type="button"
            onClick={() => handleAction(copy.done, onClose)}
          >
            <IconLabel icon={Check}>{copy.done}</IconLabel>
          </button>
        </div>
      </section>
    </main>
  );
}
