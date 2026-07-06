import {
  BookOpen,
  ListChecks,
  Mic,
  MousePointerClick,
  PencilLine,
  Play,
  Settings,
  Volume2,
  type LucideIcon
} from "lucide-react";
import { getCopy } from "../i18n";
import type { CharacterSet, EarnedStamp, GameMode, SessionSettings } from "../types";
import { DigitsIcon, LettersIcon } from "./CharacterSetIcons";
import { IconLabel } from "./IconLabel";
import { StampCollection } from "./StampBadge";

const characterOptions: Array<{ characterSet: CharacterSet; icon: LucideIcon }> = [
  { characterSet: "letters", icon: LettersIcon },
  { characterSet: "digits", icon: DigitsIcon },
  { characterSet: "words", icon: BookOpen }
];

const gameOptions: Array<{ mode: GameMode; accent: string; icon: LucideIcon }> = [
  { mode: "hear-pick", accent: "bg-orange-500", icon: Volume2 },
  { mode: "hear-write", accent: "bg-sky-500", icon: PencilLine },
  { mode: "see-pick-sound", accent: "bg-emerald-500", icon: MousePointerClick },
  { mode: "see-say", accent: "bg-fuchsia-500", icon: Mic }
];

type Props = {
  settings: SessionSettings;
  stamps: EarnedStamp[];
  onStart: () => void;
  onCharacterSetChange: (characterSet: CharacterSet) => void;
  onGameModeChange: (gameMode: GameMode) => void;
  onOpenSettings: () => void;
  onUiAction: (label: string) => void;
  onStampSpeak: (label: string, language: SessionSettings["language"]) => void;
};

export function HomeScreen({ settings, stamps, onStart, onCharacterSetChange, onGameModeChange, onOpenSettings, onUiAction, onStampSpeak }: Props) {
  const copy = getCopy(settings.language);
  const shortGameTitle = copy.gameShortTitles[settings.characterSet][settings.gameMode];

  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-5xl rounded-[2rem] bg-white/92 p-5 text-center shadow-soft ring-1 ring-slate-200 sm:p-8">
        <header className="flex items-center justify-between gap-3 text-left">
          <p className="text-sm font-black uppercase tracking-wide text-orange-600">{copy.appName}</p>
          <button
            className="control-button bg-slate-100 px-4 text-slate-950"
            type="button"
            onClick={() => handleAction(copy.settings, onOpenSettings)}
          >
            <IconLabel icon={Settings} iconClassName="h-5 w-5">
              {copy.settings}
            </IconLabel>
          </button>
        </header>

        <div className="mx-auto mt-8 grid max-w-2xl justify-items-center gap-4">
          <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-orange-100 text-orange-600 ring-4 ring-orange-200">
            <BookOpen aria-hidden="true" focusable="false" className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-6xl">{copy.headline[settings.characterSet]}</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-lg font-black text-slate-700 sm:text-xl">
            <IconLabel icon={ListChecks} iconClassName="h-5 w-5">
              {copy.questionCountSummary(settings.questionCount)}
            </IconLabel>
            <span aria-hidden="true" className="text-slate-300">
              |
            </span>
            <span>{shortGameTitle}</span>
          </div>
          <button
            className="control-button mt-2 w-full max-w-md bg-orange-500 px-6 py-5 text-3xl text-white shadow-lg shadow-orange-200"
            type="button"
            onClick={onStart}
          >
            <IconLabel icon={Play} iconClassName="h-8 w-8">
              {copy.start}
            </IconLabel>
          </button>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-6 text-left">
          <section aria-labelledby="practice-type-heading" className="grid gap-3">
            <h2 id="practice-type-heading" className="text-xl font-black text-slate-950">
              {copy.choosePractice}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {characterOptions.map((option) => {
                const active = settings.characterSet === option.characterSet;
                const CharacterIcon = option.icon;
                const title = copy.characterSetTabs[option.characterSet];
                return (
                  <button
                    key={option.characterSet}
                    className={`min-h-20 rounded-3xl border-4 p-3 text-center shadow-sm transition ${
                      active ? "border-slate-950 bg-amber-100 text-slate-950" : "border-transparent bg-white text-slate-700"
                    }`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleAction(title, () => onCharacterSetChange(option.characterSet))}
                  >
                    <IconLabel icon={CharacterIcon} iconClassName="h-6 w-6" className="flex-col gap-1 text-lg font-black">
                      {title}
                    </IconLabel>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="game-mode-heading" className="grid gap-3">
            <h2 id="game-mode-heading" className="text-xl font-black text-slate-950">
              {copy.chooseGame}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {gameOptions.map((game) => {
                const active = settings.gameMode === game.mode;
                const title = copy.gameTitles[settings.characterSet][game.mode];
                const shortTitle = copy.gameShortTitles[settings.characterSet][game.mode];
                return (
                  <button
                    key={game.mode}
                    className={`min-h-24 rounded-3xl border-4 p-4 text-left shadow-sm transition ${
                      active ? "border-slate-950 bg-amber-100 text-slate-950" : "border-transparent bg-white text-slate-700"
                    }`}
                    type="button"
                    aria-label={title}
                    aria-pressed={active}
                    onClick={() => handleAction(shortTitle, () => onGameModeChange(game.mode))}
                  >
                    <span className={`mb-3 block h-2 w-14 rounded-full ${game.accent}`} />
                    <IconLabel icon={game.icon} className="justify-start text-xl font-black">
                      {shortTitle}
                    </IconLabel>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 text-left">
          <StampCollection stamps={stamps} language={settings.language} onSpeakLabel={onStampSpeak} />
        </div>
      </section>
    </main>
  );
}
