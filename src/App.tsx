import { useEffect, useMemo, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { speechLocales } from "./data/letters";
import { createSession, summarizeSession, type SessionState } from "./game/session";
import { loadAppSettings, saveAppSettings, updateSessionSetting } from "./game/settings";
import { loadStamps, saveStamp } from "./game/stamps";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import type { AppSettings, CharacterSet, EarnedStamp, GameMode, SessionSettings } from "./types";

type AppView = "home" | "settings";

function shouldPlayQuestionPrompt(session: SessionState): boolean {
  return session.settings.gameMode === "hear-pick" || session.settings.gameMode === "hear-write";
}

export default function App() {
  const [appSettings, setAppSettings] = useState<AppSettings>(() => loadAppSettings());
  const [view, setView] = useState<AppView>("home");
  const [session, setSession] = useState<SessionState | null>(null);
  const [stamps, setStamps] = useState<EarnedStamp[]>(() => loadStamps());
  const [newStamp, setNewStamp] = useState<EarnedStamp | null>(null);
  const audio = useAudioPlayback();

  const summary = useMemo(() => (session?.completed ? summarizeSession(session) : null), [session]);
  const settings = appSettings.session;
  const activeLanguage = session?.settings.language ?? settings.language;

  useEffect(() => {
    saveAppSettings(appSettings);
  }, [appSettings]);

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

  const setSettings = (settings: SessionSettings) => {
    setAppSettings((current) => ({ ...current, session: settings }));
  };

  const setSessionSetting = <Key extends keyof SessionSettings>(key: Key, value: SessionSettings[Key]) => {
    setAppSettings((current) => ({ ...current, session: updateSessionSetting(current.session, key, value) }));
  };

  const setReadUiActionsAloud = (readUiActionsAloud: boolean) => {
    setAppSettings((current) => ({ ...current, readUiActionsAloud }));
  };

  const speakUiAction = (label: string) => {
    if (appSettings.readUiActionsAloud) {
      audio.speakText(label, activeLanguage);
    }
  };

  const playOpeningPrompt = (session: SessionState) => {
    if (shouldPlayQuestionPrompt(session)) {
      audio.speak(session.questions[session.currentIndex].target);
    }
  };

  const startSession = () => {
    const nextSession = createSession(settings);
    setSession(nextSession);
    setView("home");
    playOpeningPrompt(nextSession);
  };

  const chooseHome = () => {
    setSession(null);
    setView("home");
  };

  if (summary && session) {
    return (
      <ResultsScreen
        settings={session.settings}
        summary={summary}
        stamps={stamps.filter((stamp) => stamp.language === session.settings.language && stamp.characterSet === session.settings.characterSet)}
        newStamp={newStamp}
        onPlayAgain={() => {
          const nextSession = createSession(session.settings);
          setSession(nextSession);
          playOpeningPrompt(nextSession);
        }}
        onChooseGame={chooseHome}
        onUiAction={speakUiAction}
      />
    );
  }

  if (session) {
    return <GameScreen session={session} onSessionChange={setSession} onExit={chooseHome} onUiAction={speakUiAction} audio={audio} />;
  }

  if (view === "settings") {
    return (
      <SettingsScreen
        settings={settings}
        readUiActionsAloud={appSettings.readUiActionsAloud}
        onSettingsChange={setSettings}
        onReadUiActionsAloudChange={setReadUiActionsAloud}
        onClose={() => setView("home")}
        onUiAction={speakUiAction}
      />
    );
  }

  return (
    <HomeScreen
      settings={settings}
      stamps={stamps.filter((stamp) => stamp.language === settings.language && stamp.characterSet === settings.characterSet)}
      onStart={startSession}
      onCharacterSetChange={(characterSet: CharacterSet) => setSessionSetting("characterSet", characterSet)}
      onGameModeChange={(gameMode: GameMode) => setSessionSetting("gameMode", gameMode)}
      onOpenSettings={() => setView("settings")}
      onUiAction={speakUiAction}
    />
  );
}
