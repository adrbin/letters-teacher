import type { LetterCase, LetterItem, LanguageCode } from "../types";

const languageLocales: Record<LanguageCode, string> = {
  en: "en-US",
  pl: "pl-PL"
};

export function normalizeLetterCase(letterCase: LetterCase | undefined): LetterCase {
  return letterCase === "lowercase" ? "lowercase" : "uppercase";
}

function formatText(value: string, language: LanguageCode, letterCase: LetterCase | undefined): string {
  const normalizedCase = normalizeLetterCase(letterCase);
  const locale = languageLocales[language];
  return normalizedCase === "lowercase" ? value.toLocaleLowerCase(locale) : value.toLocaleUpperCase(locale);
}

export function getCharacterDisplayText(character: LetterItem, letterCase: LetterCase | undefined): string {
  if (character.characterSet === "digits") return character.display;
  return formatText(character.display, character.language, letterCase);
}

export function getExampleDisplayWord(character: LetterItem, letterCase: LetterCase | undefined): string | undefined {
  if (!character.example?.word) return undefined;
  if (character.characterSet === "digits") return character.example.word;
  return formatText(character.example.word, character.language, letterCase);
}
