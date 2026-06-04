import type { LanguageCode, LetterItem } from "../types";

const englishNames: Record<string, string[]> = {
  A: ["a", "ay", "hey"],
  B: ["b", "bee", "be"],
  C: ["c", "see", "sea"],
  D: ["d", "dee"],
  E: ["e", "ee"],
  F: ["f", "ef"],
  G: ["g", "gee"],
  H: ["h", "aitch", "h"],
  I: ["i", "eye"],
  J: ["j", "jay"],
  K: ["k", "kay"],
  L: ["l", "el"],
  M: ["m", "em"],
  N: ["n", "en"],
  O: ["o", "oh"],
  P: ["p", "pee"],
  Q: ["q", "cue", "queue"],
  R: ["r", "are"],
  S: ["s", "ess"],
  T: ["t", "tee", "tea"],
  U: ["u", "you"],
  V: ["v", "vee"],
  W: ["w", "double you", "double u"],
  X: ["x", "ex"],
  Y: ["y", "why"],
  Z: ["z", "zed", "zee"]
};

const englishSpeechNames: Record<string, string> = {
  A: "ay",
  B: "bee",
  C: "see",
  D: "dee",
  E: "ee",
  F: "ef",
  G: "gee",
  H: "aitch",
  I: "eye",
  J: "jay",
  K: "kay",
  L: "el",
  M: "em",
  N: "en",
  O: "oh",
  P: "pee",
  Q: "cue",
  R: "are",
  S: "ess",
  T: "tee",
  U: "you",
  V: "vee",
  W: "double you",
  X: "ex",
  Y: "why",
  Z: "zed"
};

const polishAliases: Record<string, string[]> = {
  A: ["a"],
  Ą: ["ą", "a z ogonkiem"],
  B: ["b", "be"],
  C: ["c", "ce"],
  Ć: ["ć", "cie"],
  D: ["d", "de"],
  E: ["e"],
  Ę: ["ę", "e z ogonkiem"],
  F: ["f", "ef"],
  G: ["g", "gie"],
  H: ["h", "ha"],
  I: ["i"],
  J: ["j", "jot"],
  K: ["k", "ka"],
  L: ["l", "el"],
  Ł: ["ł", "eł"],
  M: ["m", "em"],
  N: ["n", "en"],
  Ń: ["ń", "eń"],
  O: ["o"],
  Ó: ["ó", "u kreskowane", "o kreskowane"],
  P: ["p", "pe"],
  R: ["r", "er"],
  S: ["s", "es"],
  Ś: ["ś", "eś"],
  T: ["t", "te"],
  U: ["u"],
  W: ["w", "wu"],
  Y: ["y", "igrek"],
  Z: ["z", "zet"],
  Ź: ["ź", "ziet"],
  Ż: ["ż", "żet"]
};

const polishSpeechNames: Record<string, string> = {
  A: "a",
  Ą: "ą",
  B: "be",
  C: "ce",
  Ć: "cie",
  D: "de",
  E: "e",
  Ę: "ę",
  F: "ef",
  G: "gie",
  H: "ha",
  I: "i",
  J: "jot",
  K: "ka",
  L: "el",
  Ł: "eł",
  M: "em",
  N: "en",
  Ń: "eń",
  O: "o",
  Ó: "ó",
  P: "pe",
  R: "er",
  S: "es",
  Ś: "eś",
  T: "te",
  U: "u",
  W: "wu",
  Y: "igrek",
  Z: "zet",
  Ź: "ziet",
  Ż: "żet"
};

const englishAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const polishAlphabet = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ".split("");

function makeLetters(
  language: LanguageCode,
  alphabet: string[],
  aliases: Record<string, string[]>,
  speechNames: Record<string, string>
): LetterItem[] {
  return alphabet.map((letter) => ({
    display: letter,
    speechText: speechNames[letter] ?? letter.toLocaleLowerCase(language === "pl" ? "pl-PL" : "en-US"),
    aliases: [letter.toLowerCase(), ...(aliases[letter] ?? [])],
    language
  }));
}

export const lettersByLanguage: Record<LanguageCode, LetterItem[]> = {
  en: makeLetters("en", englishAlphabet, englishNames, englishSpeechNames),
  pl: makeLetters("pl", polishAlphabet, polishAliases, polishSpeechNames)
};

export const languageNames: Record<LanguageCode, string> = {
  en: "English",
  pl: "Polski"
};

export const speechLocales: Record<LanguageCode, string> = {
  en: "en-US",
  pl: "pl-PL"
};

export function getLetters(language: LanguageCode): LetterItem[] {
  return lettersByLanguage[language];
}

export function matchesLetterTranscript(letter: LetterItem, transcript: string): boolean {
  const cleaned = transcript.trim().toLocaleLowerCase(letter.language === "pl" ? "pl-PL" : "en-US");
  return letter.aliases.some((alias) => cleaned === alias || cleaned.includes(alias));
}
