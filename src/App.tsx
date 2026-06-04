import { useEffect, useMemo, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { SetupScreen } from "./components/SetupScreen";
import { speechLocales } from "./data/letters";
import { createSession, summarizeSession, type SessionState } from "./game/session";
import type { SessionSettings } from "./types";

const defaultSettings: SessionSettings = {
  language: "pl",
  gameMode: "hear-pick",
  questionCount: 10
};

export default function App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [session, setSession] = useState<SessionState | null>(null);

  const summary = useMemo(() => (session?.completed ? summarizeSession(session) : null), [session]);
  const activeLanguage = session?.settings.language ?? settings.language;

  useEffect(() => {
    document.documentElement.lang = speechLocales[activeLanguage];
  }, [activeLanguage]);

  if (summary && session) {
    return (
      <ResultsScreen
        settings={session.settings}
        summary={summary}
        onPlayAgain={() => setSession(createSession(session.settings))}
        onChooseGame={() => setSession(null)}
      />
    );
  }

  if (session) {
    return <GameScreen session={session} onSessionChange={setSession} onExit={() => setSession(null)} />;
  }

  return <SetupScreen settings={settings} onSettingsChange={setSettings} onStart={() => setSession(createSession(settings))} />;
}
