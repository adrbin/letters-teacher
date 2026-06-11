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

const englishExamples: Record<string, { word: string; imageId: string; alt: string }> = {
  A: { word: "apple", imageId: "fruit-red", alt: "red apple" },
  B: { word: "ball", imageId: "ball", alt: "colorful ball" },
  C: { word: "cat", imageId: "cat", alt: "smiling cat face" },
  D: { word: "dog", imageId: "dog", alt: "happy dog face" },
  E: { word: "egg", imageId: "egg", alt: "white egg" },
  F: { word: "fish", imageId: "fish", alt: "orange fish" },
  G: { word: "gift", imageId: "gift", alt: "wrapped gift" },
  H: { word: "house", imageId: "house", alt: "small house" },
  I: { word: "ice", imageId: "ice", alt: "ice pop" },
  J: { word: "jam", imageId: "jar", alt: "jam jar" },
  K: { word: "kite", imageId: "kite", alt: "bright kite" },
  L: { word: "leaf", imageId: "leaf", alt: "green leaf" },
  M: { word: "moon", imageId: "moon", alt: "crescent moon" },
  N: { word: "nest", imageId: "nest", alt: "bird nest" },
  O: { word: "orange", imageId: "orange", alt: "orange fruit" },
  P: { word: "pencil", imageId: "pencil", alt: "yellow pencil" },
  Q: { word: "queen", imageId: "crown", alt: "gold crown" },
  R: { word: "rain", imageId: "rain", alt: "rain cloud" },
  S: { word: "sun", imageId: "sun", alt: "bright sun" },
  T: { word: "tree", imageId: "tree", alt: "green tree" },
  U: { word: "umbrella", imageId: "umbrella", alt: "red umbrella" },
  V: { word: "van", imageId: "vehicle", alt: "blue van" },
  W: { word: "water", imageId: "water", alt: "water drop" },
  X: { word: "x-ray", imageId: "xray", alt: "x-ray card" },
  Y: { word: "yarn", imageId: "yarn", alt: "ball of yarn" },
  Z: { word: "zip", imageId: "zip", alt: "zipper" }
};

const polishAliases: Record<string, string[]> = {
  A: ["a"],
  Ą: ["ą", "a z ogonkiem", "on", "om"],
  B: ["b", "be", "by"],
  C: ["c", "ce"],
  Ć: ["ć", "cie", "ci"],
  D: ["d", "de", "dy"],
  E: ["e"],
  Ę: ["ę", "e z ogonkiem", "en", "em"],
  F: ["f", "ef"],
  G: ["g", "gie"],
  H: ["h", "ha"],
  I: ["i"],
  J: ["j", "jot"],
  K: ["k", "ka"],
  L: ["l", "el"],
  Ł: ["ł", "eł", "el"],
  M: ["m", "em"],
  N: ["n", "en"],
  Ń: ["ń", "eń", "eni", "ni"],
  O: ["o"],
  Ó: ["ó", "u", "u kreskowane", "o kreskowane"],
  P: ["p", "pe", "py"],
  R: ["r", "er"],
  S: ["s", "es"],
  Ś: ["ś", "eś", "si"],
  T: ["t", "te", "ty"],
  U: ["u"],
  W: ["w", "wu"],
  Y: ["y", "igrek"],
  Z: ["z", "zet"],
  Ź: ["ź", "ziet", "zi"],
  Ż: ["ż", "żet", "rz", "rzet"]
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

const polishExamples: Record<string, { word: string; imageId: string; alt: string }> = {
  A: { word: "auto", imageId: "vehicle", alt: "niebieskie auto" },
  Ą: { word: "ząb", imageId: "tooth", alt: "bialy zab" },
  B: { word: "balon", imageId: "balloon", alt: "kolorowy balon" },
  C: { word: "cytryna", imageId: "lemon", alt: "zolta cytryna" },
  Ć: { word: "ćma", imageId: "moth", alt: "kolorowa cma" },
  D: { word: "dom", imageId: "house", alt: "maly dom" },
  E: { word: "ekran", imageId: "screen", alt: "ekran tabletu" },
  Ę: { word: "gęś", imageId: "goose", alt: "biala ges" },
  F: { word: "foka", imageId: "seal", alt: "szara foka" },
  G: { word: "gitara", imageId: "guitar", alt: "czerwona gitara" },
  H: { word: "hamak", imageId: "hammock", alt: "kolorowy hamak" },
  I: { word: "igla", imageId: "needle", alt: "igla z nitka" },
  J: { word: "jabłko", imageId: "fruit-red", alt: "czerwone jablko" },
  K: { word: "kot", imageId: "cat", alt: "usmiechniety kot" },
  L: { word: "lalka", imageId: "doll", alt: "lalka" },
  Ł: { word: "łódka", imageId: "boat", alt: "mala lodka" },
  M: { word: "motyl", imageId: "butterfly", alt: "kolorowy motyl" },
  N: { word: "nos", imageId: "nose", alt: "nos" },
  Ń: { word: "koń", imageId: "horse", alt: "brazowy kon" },
  O: { word: "oko", imageId: "eye", alt: "oko" },
  Ó: { word: "góra", imageId: "mountain", alt: "zielona gora" },
  P: { word: "pies", imageId: "dog", alt: "wesoly pies" },
  R: { word: "rak", imageId: "crab", alt: "czerwony rak" },
  S: { word: "słońce", imageId: "sun", alt: "jasne slonce" },
  Ś: { word: "ślimak", imageId: "snail", alt: "slimak" },
  T: { word: "tort", imageId: "cake", alt: "urodzinowy tort" },
  U: { word: "ul", imageId: "hive", alt: "ul" },
  W: { word: "woda", imageId: "water", alt: "kropla wody" },
  Y: { word: "dym", imageId: "smoke", alt: "dym" },
  Z: { word: "zamek", imageId: "castle", alt: "zamek" },
  Ź: { word: "źrebak", imageId: "foal", alt: "zrebak" },
  Ż: { word: "żaba", imageId: "frog", alt: "zielona zaba" }
};

const englishAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const polishAlphabet = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ".split("");

function makeLetters(
  language: LanguageCode,
  alphabet: string[],
  aliases: Record<string, string[]>,
  speechNames: Record<string, string>,
  examples: Record<string, { word: string; imageId: string; alt: string }>
): LetterItem[] {
  return alphabet.map((letter) => ({
    display: letter,
    speechText: speechNames[letter] ?? letter.toLocaleLowerCase(language === "pl" ? "pl-PL" : "en-US"),
    aliases: [letter.toLowerCase(), ...(aliases[letter] ?? [])],
    language,
    example: examples[letter]
  }));
}

export const lettersByLanguage: Record<LanguageCode, LetterItem[]> = {
  en: makeLetters("en", englishAlphabet, englishNames, englishSpeechNames, englishExamples),
  pl: makeLetters("pl", polishAlphabet, polishAliases, polishSpeechNames, polishExamples)
};

export const letterImageIds = new Set([
  ...Object.values(englishExamples).map((example) => example.imageId),
  ...Object.values(polishExamples).map((example) => example.imageId)
]);

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

function normalizeTranscript(value: string, language: LanguageCode): string {
  return value
    .trim()
    .toLocaleLowerCase(language === "pl" ? "pl-PL" : "en-US")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesLetterTranscript(letter: LetterItem, transcript: string): boolean {
  const cleaned = normalizeTranscript(transcript, letter.language);
  const words = cleaned.split(" ").filter(Boolean);
  return letter.aliases.some((alias) => {
    const normalizedAlias = normalizeTranscript(alias, letter.language);
    return cleaned === normalizedAlias || words.includes(normalizedAlias) || cleaned.includes(` ${normalizedAlias} `);
  });
}
