import { getCharacters } from "../data/letters";
import { getCopy } from "../i18n";
import type { CharacterSet, EarnedStamp, LanguageCode, LetterItem } from "../types";

const languageLocales: Record<LanguageCode, string> = {
  en: "en-US",
  pl: "pl-PL",
  zh: "zh-CN"
};

export const collectionCompleteSpeechCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

function findCurrentItem(language: LanguageCode, characterSet: CharacterSet, character: string): LetterItem | undefined {
  return getCharacters(language, characterSet).find((item) => item.display === character);
}

function getStampWord(language: LanguageCode, characterSet: CharacterSet, character: string, word?: string, hanzi?: string): string | undefined {
  const currentItem = findCurrentItem(language, characterSet, character);
  const resolvedWord = word ?? currentItem?.example?.word;
  const resolvedHanzi = hanzi ?? currentItem?.example?.hanzi;

  if (resolvedHanzi && (resolvedWord ?? character)) {
    return `${resolvedWord ?? character} ${resolvedHanzi}`;
  }

  return resolvedWord;
}

export function getCharacterStampSpeechLabel(
  language: LanguageCode,
  characterSet: CharacterSet,
  character: string,
  word?: string,
  hanzi?: string
): string {
  const copy = getCopy(language);
  return copy.stampCharacterLabel[characterSet](character, getStampWord(language, characterSet, character, word, hanzi));
}

export function getStampSpeechLabel(stamp: EarnedStamp, language: LanguageCode): string {
  const copy = getCopy(language);

  if (stamp.kind === "collection-complete") {
    return copy.collectionCompleteLabel[stamp.characterSet](stamp.completedCount);
  }

  return getCharacterStampSpeechLabel(language, stamp.characterSet, stamp.character, stamp.word, stamp.hanzi);
}

export function getStampAriaLabel(stamp: EarnedStamp, language: LanguageCode): string {
  const copy = getCopy(language);
  if (stamp.kind === "collection-complete") return getStampSpeechLabel(stamp, language);
  return `${getStampSpeechLabel(stamp, language)} ${copy.stamp}`;
}

export function createStampLetterItem(stamp: EarnedStamp, language: LanguageCode): LetterItem | null {
  if (stamp.kind === "collection-complete") return null;

  const currentItem = findCurrentItem(language, stamp.characterSet, stamp.character);
  const example =
    stamp.word && stamp.imageId && stamp.alt
      ? {
          word: stamp.word,
          hanzi: stamp.hanzi,
          imageId: stamp.imageId,
          alt: stamp.alt
        }
      : currentItem?.example;

  return {
    display: stamp.character,
    speechText: stamp.hanzi ?? currentItem?.speechText ?? stamp.character,
    aliases: [stamp.character.toLocaleLowerCase(languageLocales[language])],
    language,
    characterSet: stamp.characterSet,
    example
  };
}

export function getCatalogStampSpeechTexts(language: LanguageCode, characterSets: readonly CharacterSet[]): string[] {
  const copy = getCopy(language);

  return [
    ...characterSets.flatMap((characterSet) =>
      getCharacters(language, characterSet).map((character) =>
        getCharacterStampSpeechLabel(language, characterSet, character.display, character.example?.word, character.example?.hanzi)
      )
    ),
    ...characterSets.flatMap((characterSet) => collectionCompleteSpeechCounts.map((count) => copy.collectionCompleteLabel[characterSet](count)))
  ];
}
