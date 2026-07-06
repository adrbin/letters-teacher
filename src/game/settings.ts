import { getCharacters } from "../data/letters";
import type { AppSettings, CharacterSet, GameMode, LanguageCode, LetterCase, SessionSettings } from "../types";

export const MIN_QUESTION_COUNT = 3;
export const MAX_CHARACTER_QUESTION_COUNT = 30;
export const MAX_WORD_QUESTION_COUNT = 36;

const STORAGE_KEY = "letters-teacher:settings";

export const defaultSessionSettings: SessionSettings = {
  language: "pl",
  characterSet: "letters",
  gameMode: "hear-pick",
  questionCount: 10,
  letterCase: "uppercase"
};

export const defaultAppSettings: AppSettings = {
  session: defaultSessionSettings,
  readUiActionsAloud: true
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isLanguage(value: unknown): value is LanguageCode {
  return value === "en" || value === "pl" || value === "zh";
}

function isCharacterSet(value: unknown): value is CharacterSet {
  return value === "letters" || value === "digits" || value === "words";
}

function isGameMode(value: unknown): value is GameMode {
  return value === "hear-pick" || value === "hear-write" || value === "see-pick-sound" || value === "see-say";
}

function isLetterCase(value: unknown): value is LetterCase {
  return value === "uppercase" || value === "lowercase";
}

export function getMaxQuestionCount(language: LanguageCode, characterSet: CharacterSet): number {
  const maxQuestionCount = characterSet === "words" ? MAX_WORD_QUESTION_COUNT : MAX_CHARACTER_QUESTION_COUNT;
  return Math.min(maxQuestionCount, getCharacters(language, characterSet).length);
}

export function clampQuestionCount(language: LanguageCode, characterSet: CharacterSet, questionCount: number): number {
  return Math.min(getMaxQuestionCount(language, characterSet), Math.max(MIN_QUESTION_COUNT, questionCount || defaultSessionSettings.questionCount));
}

export function normalizeSessionSettings(value: unknown): SessionSettings {
  const candidate = value as Partial<SessionSettings> | null;
  const language = isLanguage(candidate?.language) ? candidate.language : defaultSessionSettings.language;
  const characterSet = isCharacterSet(candidate?.characterSet) ? candidate.characterSet : defaultSessionSettings.characterSet;

  return {
    language,
    characterSet,
    gameMode: isGameMode(candidate?.gameMode) ? candidate.gameMode : defaultSessionSettings.gameMode,
    questionCount: clampQuestionCount(language, characterSet, Number(candidate?.questionCount)),
    letterCase: isLetterCase(candidate?.letterCase) ? candidate.letterCase : defaultSessionSettings.letterCase
  };
}

export function normalizeAppSettings(value: unknown): AppSettings {
  const candidate = value as Partial<AppSettings> | null;

  return {
    session: normalizeSessionSettings(candidate?.session),
    readUiActionsAloud:
      typeof candidate?.readUiActionsAloud === "boolean" ? candidate.readUiActionsAloud : defaultAppSettings.readUiActionsAloud
  };
}

export function loadAppSettings(): AppSettings {
  const storage = getStorage();
  if (!storage) return defaultAppSettings;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? normalizeAppSettings(JSON.parse(raw)) : defaultAppSettings;
  } catch {
    return defaultAppSettings;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(normalizeAppSettings(settings)));
}

export function updateSessionSetting<Key extends keyof SessionSettings>(
  settings: SessionSettings,
  key: Key,
  value: SessionSettings[Key]
): SessionSettings {
  if (key === "language") {
    const language = value as LanguageCode;
    return {
      ...settings,
      language,
      questionCount: clampQuestionCount(language, settings.characterSet, settings.questionCount)
    };
  }

  if (key === "characterSet") {
    const characterSet = value as CharacterSet;
    return {
      ...settings,
      characterSet,
      questionCount: clampQuestionCount(settings.language, characterSet, settings.questionCount)
    };
  }

  if (key === "questionCount") {
    return { ...settings, questionCount: clampQuestionCount(settings.language, settings.characterSet, value as number) };
  }

  return { ...settings, [key]: value };
}
