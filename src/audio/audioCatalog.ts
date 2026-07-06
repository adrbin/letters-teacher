import { getCharacters } from "../data/letters";
import { getCopy } from "../i18n";
import type { CharacterSet, GameMode, LanguageCode } from "../types";

export const audioLanguages = ["pl", "en", "zh"] as const satisfies LanguageCode[];
export const audioCharacterSets = ["letters", "digits", "words"] as const satisfies CharacterSet[];
export const audioGameModes = ["hear-pick", "hear-write", "see-pick-sound", "see-say"] as const satisfies GameMode[];

export const languageVoiceIds: Record<LanguageCode, string> = {
  pl: "Xb7hH8MSUJpSbSDYk0k2",
  en: "EXAVITQu4vr4xnSDxMaL",
  zh: "cgSgspJ2msm6clMCkdW9"
};

export const languageCodes: Record<LanguageCode, string> = {
  pl: "pl",
  en: "en",
  zh: "zh"
};

export type AudioCatalogEntry = {
  id: string;
  language: LanguageCode;
  languageCode: string;
  text: string;
  path: string;
  voiceId: string;
  kind: "character" | "ui";
  characterSet?: CharacterSet;
};

function hashText(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export function getAudioId(language: LanguageCode, text: string): string {
  return `${language}-${text.length.toString(36)}-${hashText(text)}`;
}

export function getAudioPath(language: LanguageCode, text: string): string {
  return `/audio/${language}/${getAudioId(language, text)}.mp3`;
}

function makeEntry(language: LanguageCode, text: string, kind: AudioCatalogEntry["kind"], characterSet?: CharacterSet): AudioCatalogEntry {
  return {
    id: getAudioId(language, text),
    language,
    languageCode: languageCodes[language],
    text,
    path: getAudioPath(language, text),
    voiceId: languageVoiceIds[language],
    kind,
    characterSet
  };
}

function getUiActionTexts(language: LanguageCode): string[] {
  const copy = getCopy(language);
  return [
    copy.settings,
    copy.back,
    copy.done,
    copy.decreaseQuestionCount,
    copy.increaseQuestionCount,
    copy.readUiActionsAloud,
    copy.playAgain,
    copy.chooseAnotherGame,
    copy.nextQuestion,
    copy.showResults,
    copy.clear,
    copy.check,
    copy.undo,
    copy.chooseThisSound,
    copy.startRecording,
    copy.stopRecording,
    ...audioCharacterSets.map((characterSet) => copy.characterSetTabs[characterSet]),
    ...Object.values(copy.letterCaseOptions),
    ...audioCharacterSets.flatMap((characterSet) => audioGameModes.map((gameMode) => copy.gameTitles[characterSet][gameMode]))
  ];
}

export function buildAudioCatalogEntries(): AudioCatalogEntry[] {
  return audioLanguages.flatMap((language) => [
    ...audioCharacterSets.flatMap((characterSet) =>
      getCharacters(language, characterSet).map((character) => makeEntry(language, character.speechText, "character", characterSet))
    ),
    ...getUiActionTexts(language).map((text) => makeEntry(language, text, "ui"))
  ]);
}

export function buildUniqueAudioCatalogEntries(): AudioCatalogEntry[] {
  const seen = new Set<string>();
  const entries: AudioCatalogEntry[] = [];

  for (const entry of buildAudioCatalogEntries()) {
    const key = `${entry.language}\u0000${entry.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push(entry);
  }

  return entries;
}
