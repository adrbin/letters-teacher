import type { CharacterSet, LanguageCode, LetterItem } from "../types";
import { stripPinyinToneMarks } from "./pinyin";
import { wordImageIds, wordsByLanguage } from "./words";

type ExampleDefinition = { word: string; hanzi?: string; imageId: string; alt: string };

const languageLocales: Record<LanguageCode, string> = {
  en: "en-US",
  pl: "pl-PL",
  zh: "zh-CN"
};

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

const chineseSpeechNames: Record<string, string> = {
  A: "a",
  B: "bê",
  C: "cê",
  D: "dê",
  E: "e",
  F: "êf",
  G: "gê",
  H: "ha",
  I: "yi",
  J: "jie",
  K: "kê",
  L: "êl",
  M: "êm",
  N: "nê",
  O: "o",
  P: "pê",
  Q: "qiu",
  R: "ar",
  S: "ês",
  T: "tê",
  U: "wu",
  V: "vê",
  W: "wa",
  X: "xi",
  Y: "ya",
  Z: "zê"
};

const chineseNames: Record<string, string[]> = Object.fromEntries(
  Object.entries(chineseSpeechNames).map(([letter, name]) => [letter, Array.from(new Set([name, stripPinyinToneMarks(name)]))])
);

const chineseExamples: Record<string, ExampleDefinition> = {
  A: { word: "āyí", hanzi: "阿姨", imageId: "family-mom", alt: "阿姨" },
  B: { word: "bāshì", hanzi: "巴士", imageId: "bus", alt: "巴士" },
  C: { word: "chē", hanzi: "车", imageId: "vehicle", alt: "车" },
  D: { word: "dàngāo", hanzi: "蛋糕", imageId: "cake", alt: "蛋糕" },
  E: { word: "ěrduo", hanzi: "耳朵", imageId: "ear", alt: "耳朵" },
  F: { word: "fángzi", hanzi: "房子", imageId: "house", alt: "房子" },
  G: { word: "gǒu", hanzi: "狗", imageId: "dog", alt: "狗" },
  H: { word: "huā", hanzi: "花", imageId: "count-flower", alt: "花" },
  I: { word: "yī", hanzi: "一", imageId: "count-flower", alt: "一朵花" },
  J: { word: "jīdàn", hanzi: "鸡蛋", imageId: "egg", alt: "鸡蛋" },
  K: { word: "kǎchē", hanzi: "卡车", imageId: "vehicle", alt: "卡车" },
  L: { word: "lǜyè", hanzi: "绿叶", imageId: "leaf", alt: "绿叶" },
  M: { word: "māo", hanzi: "猫", imageId: "cat", alt: "猫" },
  N: { word: "niú", hanzi: "牛", imageId: "cow", alt: "牛" },
  O: { word: "o", imageId: "orange", alt: "橙子" },
  P: { word: "píngguǒ", hanzi: "苹果", imageId: "fruit-red", alt: "苹果" },
  Q: { word: "qiú", hanzi: "球", imageId: "ball", alt: "球" },
  R: { word: "rén", hanzi: "人", imageId: "family-dad", alt: "人" },
  S: { word: "shù", hanzi: "树", imageId: "tree", alt: "树" },
  T: { word: "tàiyáng", hanzi: "太阳", imageId: "sun", alt: "太阳" },
  U: { word: "wǔ", hanzi: "五", imageId: "count-flower", alt: "五朵花" },
  V: { word: "vê", imageId: "vehicle", alt: "vê" },
  W: { word: "wáwa", hanzi: "娃娃", imageId: "doll", alt: "娃娃" },
  X: { word: "xīngxing", hanzi: "星星", imageId: "star", alt: "星星" },
  Y: { word: "yú", hanzi: "鱼", imageId: "fish", alt: "鱼" },
  Z: { word: "zhū", hanzi: "猪", imageId: "pig", alt: "猪" }
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
const digits = "0123456789".split("");

const englishDigitNames: Record<string, string[]> = {
  "0": ["0", "zero", "oh"],
  "1": ["1", "one", "won"],
  "2": ["2", "two", "too", "to"],
  "3": ["3", "three"],
  "4": ["4", "four", "for"],
  "5": ["5", "five"],
  "6": ["6", "six"],
  "7": ["7", "seven"],
  "8": ["8", "eight", "ate"],
  "9": ["9", "nine"]
};

const englishDigitSpeechNames: Record<string, string> = {
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine"
};

const polishDigitNames: Record<string, string[]> = {
  "0": ["0", "zero"],
  "1": ["1", "jeden", "jedynka"],
  "2": ["2", "dwa", "dwójka", "dwojka"],
  "3": ["3", "trzy", "trójka", "trojka"],
  "4": ["4", "cztery", "czwórka", "czworka"],
  "5": ["5", "pięć", "piec", "piątka", "piatka"],
  "6": ["6", "sześć", "szesc", "szóstka", "szostka"],
  "7": ["7", "siedem", "siódemka", "siodemka"],
  "8": ["8", "osiem", "ósemka", "osemka"],
  "9": ["9", "dziewięć", "dziewiec", "dziewiątka", "dziewiatka"]
};

const polishDigitSpeechNames: Record<string, string> = {
  "0": "zero",
  "1": "jeden",
  "2": "dwa",
  "3": "trzy",
  "4": "cztery",
  "5": "pięć",
  "6": "sześć",
  "7": "siedem",
  "8": "osiem",
  "9": "dziewięć"
};

const chineseDigitNames: Record<string, string[]> = {
  "0": ["零", "líng", "ling"],
  "1": ["一", "yī", "yi"],
  "2": ["二", "èr", "er"],
  "3": ["三", "sān", "san"],
  "4": ["四", "sì", "si"],
  "5": ["五", "wǔ", "wu"],
  "6": ["六", "liù", "liu"],
  "7": ["七", "qī", "qi"],
  "8": ["八", "bā", "ba"],
  "9": ["九", "jiǔ", "jiu"]
};

const chineseDigitSpeechNames: Record<string, string> = {
  "0": "零",
  "1": "一",
  "2": "二",
  "3": "三",
  "4": "四",
  "5": "五",
  "6": "六",
  "7": "七",
  "8": "八",
  "9": "九"
};

const englishDigitExamples: Record<string, { word: string; imageId: string; alt: string }> = {
  "0": { word: "empty basket", imageId: "count-empty", alt: "empty basket" },
  "1": { word: "one flower", imageId: "count-flower", alt: "one flower" },
  "2": { word: "two butterflies", imageId: "count-butterfly", alt: "two butterflies" },
  "3": { word: "three leaves", imageId: "count-leaf", alt: "three leaves" },
  "4": { word: "four stars", imageId: "count-star", alt: "four stars" },
  "5": { word: "five flowers", imageId: "count-flower", alt: "five flowers" },
  "6": { word: "six butterflies", imageId: "count-butterfly", alt: "six butterflies" },
  "7": { word: "seven leaves", imageId: "count-leaf", alt: "seven leaves" },
  "8": { word: "eight stars", imageId: "count-star", alt: "eight stars" },
  "9": { word: "nine flowers", imageId: "count-flower", alt: "nine flowers" }
};

const polishDigitExamples: Record<string, { word: string; imageId: string; alt: string }> = {
  "0": { word: "pusty koszyk", imageId: "count-empty", alt: "pusty koszyk" },
  "1": { word: "jeden kwiatek", imageId: "count-flower", alt: "jeden kwiatek" },
  "2": { word: "dwa motyle", imageId: "count-butterfly", alt: "dwa motyle" },
  "3": { word: "trzy listki", imageId: "count-leaf", alt: "trzy listki" },
  "4": { word: "cztery gwiazdki", imageId: "count-star", alt: "cztery gwiazdki" },
  "5": { word: "pięć kwiatków", imageId: "count-flower", alt: "piec kwiatkow" },
  "6": { word: "sześć motyli", imageId: "count-butterfly", alt: "szesc motyli" },
  "7": { word: "siedem listków", imageId: "count-leaf", alt: "siedem listkow" },
  "8": { word: "osiem gwiazdek", imageId: "count-star", alt: "osiem gwiazdek" },
  "9": { word: "dziewięć kwiatków", imageId: "count-flower", alt: "dziewiec kwiatkow" }
};

const chineseDigitExamples: Record<string, ExampleDefinition> = {
  "0": { word: "零", hanzi: "零", imageId: "count-empty", alt: "空篮子" },
  "1": { word: "一朵花", hanzi: "一", imageId: "count-flower", alt: "一朵花" },
  "2": { word: "两只蝴蝶", hanzi: "二", imageId: "count-butterfly", alt: "两只蝴蝶" },
  "3": { word: "三片叶子", hanzi: "三", imageId: "count-leaf", alt: "三片叶子" },
  "4": { word: "四颗星星", hanzi: "四", imageId: "count-star", alt: "四颗星星" },
  "5": { word: "五朵花", hanzi: "五", imageId: "count-flower", alt: "五朵花" },
  "6": { word: "六只蝴蝶", hanzi: "六", imageId: "count-butterfly", alt: "六只蝴蝶" },
  "7": { word: "七片叶子", hanzi: "七", imageId: "count-leaf", alt: "七片叶子" },
  "8": { word: "八颗星星", hanzi: "八", imageId: "count-star", alt: "八颗星星" },
  "9": { word: "九朵花", hanzi: "九", imageId: "count-flower", alt: "九朵花" }
};

function makeLetters(
  language: LanguageCode,
  alphabet: string[],
  aliases: Record<string, string[]>,
  speechNames: Record<string, string>,
  examples: Record<string, ExampleDefinition>
): LetterItem[] {
  return alphabet.map((letter) => ({
    display: letter,
    speechText: speechNames[letter] ?? letter.toLocaleLowerCase(languageLocales[language]),
    aliases: [letter.toLowerCase(), ...(aliases[letter] ?? [])],
    language,
    characterSet: "letters",
    example: examples[letter]
  }));
}

function makeDigits(
  language: LanguageCode,
  aliases: Record<string, string[]>,
  speechNames: Record<string, string>,
  examples: Record<string, ExampleDefinition>
): LetterItem[] {
  return digits.map((digit) => ({
    display: digit,
    speechText: speechNames[digit] ?? digit,
    aliases: [digit, ...(aliases[digit] ?? [])],
    language,
    characterSet: "digits",
    example: examples[digit]
  }));
}

export const lettersByLanguage: Record<LanguageCode, LetterItem[]> = {
  en: makeLetters("en", englishAlphabet, englishNames, englishSpeechNames, englishExamples),
  pl: makeLetters("pl", polishAlphabet, polishAliases, polishSpeechNames, polishExamples),
  zh: makeLetters("zh", englishAlphabet, chineseNames, chineseSpeechNames, chineseExamples)
};

export const digitsByLanguage: Record<LanguageCode, LetterItem[]> = {
  en: makeDigits("en", englishDigitNames, englishDigitSpeechNames, englishDigitExamples),
  pl: makeDigits("pl", polishDigitNames, polishDigitSpeechNames, polishDigitExamples),
  zh: makeDigits("zh", chineseDigitNames, chineseDigitSpeechNames, chineseDigitExamples)
};

export const letterImageIds = new Set([
  ...Object.values(englishExamples).map((example) => example.imageId),
  ...Object.values(polishExamples).map((example) => example.imageId),
  ...Object.values(chineseExamples).map((example) => example.imageId),
  ...Object.values(englishDigitExamples).map((example) => example.imageId),
  ...Object.values(polishDigitExamples).map((example) => example.imageId),
  ...Object.values(chineseDigitExamples).map((example) => example.imageId),
  ...wordImageIds
]);

export const languageNames: Record<LanguageCode, string> = {
  en: "English",
  pl: "Polski",
  zh: "Chinese"
};

export const speechLocales: Record<LanguageCode, string> = languageLocales;

export function getLetters(language: LanguageCode): LetterItem[] {
  return lettersByLanguage[language];
}

export function getWords(language: LanguageCode): LetterItem[] {
  return wordsByLanguage[language];
}

export function getCharacters(language: LanguageCode, characterSet: CharacterSet): LetterItem[] {
  if (characterSet === "digits") return digitsByLanguage[language];
  if (characterSet === "words") return wordsByLanguage[language];
  return lettersByLanguage[language];
}

function normalizeTranscript(value: string, language: LanguageCode): string {
  return value
    .trim()
    .toLocaleLowerCase(languageLocales[language])
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

export const matchesCharacterTranscript = matchesLetterTranscript;
