import { getCharacters } from "../data/letters";
import { getCatalogStampSpeechTexts } from "../game/stampSpeech";
import { getCopy, getOpeningPrompt, getResultAnnouncement } from "../i18n";
import type { CharacterSet, GameMode, LanguageCode, ResultGrade } from "../types";

export const audioLanguages = ["pl", "en", "zh"] as const satisfies LanguageCode[];
export const audioCharacterSets = ["letters", "digits", "words"] as const satisfies CharacterSet[];
export const audioGameModes = ["hear-pick", "hear-write", "see-pick-sound", "see-say"] as const satisfies GameMode[];
export const audioResultGrades = ["perfect", "almost-perfect", "very-good", "good", "keep-practicing"] as const satisfies ResultGrade[];

export const languageVoiceIds: Record<LanguageCode, string> = {
  pl: "pl-PL-ZofiaNeural",
  en: "en-US-AnaNeural",
  zh: "zh-CN-XiaoxiaoNeural"
};

export const languageCodes: Record<LanguageCode, string> = {
  pl: "pl-PL",
  en: "en-US",
  zh: "zh-CN"
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
    ...audioCharacterSets.map((characterSet) => getOpeningPrompt(language, characterSet)),
    ...Object.values(copy.letterCaseOptions),
    ...Object.values(copy.feedback),
    ...audioResultGrades.map((grade) => getResultAnnouncement(language, grade)),
    ...audioCharacterSets.flatMap((characterSet) => audioGameModes.map((gameMode) => copy.gameTitles[characterSet][gameMode])),
    ...audioCharacterSets.flatMap((characterSet) => audioGameModes.map((gameMode) => copy.gameShortTitles[characterSet][gameMode])),
    ...getCatalogStampSpeechTexts(language, audioCharacterSets)
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
