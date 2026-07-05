import { BookOpen, Gamepad2, ListChecks, Play, Settings } from "lucide-react";
import { getCopy } from "../i18n";
import type { EarnedStamp, SessionSettings } from "../types";
import { IconLabel } from "./IconLabel";
import { StampCollection } from "./StampBadge";

type Props = {
  settings: SessionSettings;
  stamps: EarnedStamp[];
  onStart: () => void;
  onOpenSettings: () => void;
  onUiAction: (label: string) => void;
};

export function HomeScreen({ settings, stamps, onStart, onOpenSettings, onUiAction }: Props) {
  const copy = getCopy(settings.language);
  const gameTitle = copy.gameTitles[settings.characterSet][settings.gameMode];

  const handleAction = (label: string, action: () => void) => {
    onUiAction(label);
    action();
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <section className="w-full max-w-4xl rounded-[2rem] bg-white/92 p-5 text-center shadow-soft ring-1 ring-slate-200 sm:p-8">
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

        <div className="mx-auto mt-8 grid max-w-2xl justify-items-center gap-5">
          <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-orange-100 text-orange-600 ring-4 ring-orange-200">
            <BookOpen aria-hidden="true" focusable="false" className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-6xl">{copy.headline[settings.characterSet]}</h1>
          <div className="grid gap-2 text-xl font-black text-slate-700">
            <p>
              <IconLabel icon={Gamepad2} iconClassName="h-5 w-5">
                {gameTitle}
              </IconLabel>
            </p>
            <p>
              <IconLabel icon={ListChecks} iconClassName="h-5 w-5">
                {copy.questions}: {settings.questionCount}
              </IconLabel>
            </p>
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

        <div className="mt-8 text-left">
          <StampCollection stamps={stamps} language={settings.language} />
        </div>
      </section>
    </main>
  );
}
