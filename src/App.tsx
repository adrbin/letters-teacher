import { useEffect, useMemo, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { SetupScreen } from "./components/SetupScreen";
import { speechLocales } from "./data/letters";
import { createSession, summarizeSession, type SessionState } from "./game/session";
import { loadStamps, saveStamp } from "./game/stamps";
import type { EarnedStamp, SessionSettings } from "./types";

const defaultSettings: SessionSettings = {
  language: "pl",
  characterSet: "letters",
  gameMode: "hear-pick",
  questionCount: 10
};

export default function App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [session, setSession] = useState<SessionState | null>(null);
  const [stamps, setStamps] = useState<EarnedStamp[]>(() => loadStamps());
  const [newStamp, setNewStamp] = useState<EarnedStamp | null>(null);

  const summary = useMemo(() => (session?.completed ? summarizeSession(session) : null), [session]);
  const activeLanguage = session?.settings.language ?? settings.language;

  useEffect(() => {
    document.documentElement.lang = speechLocales[activeLanguage];
  }, [activeLanguage]);

  useEffect(() => {
    if (!summary || !session) {
      setNewStamp(null);
      return;
    }

    const saved = saveStamp(session.settings, summary);
    setStamps(saved.stamps);
    setNewStamp(saved.isNew ? saved.stamp : null);
  }, [session, summary]);

  if (summary && session) {
    return (
      <ResultsScreen
        settings={session.settings}
        summary={summary}
        stamps={stamps.filter((stamp) => stamp.language === session.settings.language && stamp.characterSet === session.settings.characterSet)}
        newStamp={newStamp}
        onPlayAgain={() => setSession(createSession(session.settings))}
        onChooseGame={() => setSession(null)}
      />
    );
  }

  if (session) {
    return <GameScreen session={session} onSessionChange={setSession} onExit={() => setSession(null)} />;
  }

  return (
    <SetupScreen
      settings={settings}
      stamps={stamps.filter((stamp) => stamp.language === settings.language && stamp.characterSet === settings.characterSet)}
      onSettingsChange={setSettings}
      onStart={() => setSession(createSession(settings))}
    />
  );
}
