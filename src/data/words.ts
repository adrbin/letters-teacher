import type { LanguageCode, LetterItem } from "../types";

type WordDefinition = {
  word: string;
  imageId: string;
  alt: string;
  aliases?: string[];
};

const englishWords: WordDefinition[] = [
  { word: "mom", imageId: "family-mom", alt: "mom" },
  { word: "dad", imageId: "family-dad", alt: "dad" },
  { word: "cat", imageId: "cat", alt: "cat" },
  { word: "dog", imageId: "dog", alt: "dog" },
  { word: "sun", imageId: "sun", alt: "sun" },
  { word: "car", imageId: "vehicle", alt: "car" },
  { word: "bus", imageId: "bus", alt: "bus" },
  { word: "bed", imageId: "bed", alt: "bed" },
  { word: "hat", imageId: "hat", alt: "hat" },
  { word: "cup", imageId: "cup", alt: "cup" },
  { word: "pig", imageId: "pig", alt: "pig" },
  { word: "hen", imageId: "hen", alt: "hen" },
  { word: "fox", imageId: "fox", alt: "fox" },
  { word: "cow", imageId: "cow", alt: "cow" },
  { word: "ant", imageId: "ant", alt: "ant" },
  { word: "bee", imageId: "bee", alt: "bee" },
  { word: "egg", imageId: "egg", alt: "egg" },
  { word: "eye", imageId: "eye", alt: "eye" },
  { word: "ear", imageId: "ear", alt: "ear" },
  { word: "nose", imageId: "nose", alt: "nose" },
  { word: "hand", imageId: "hand", alt: "hand" },
  { word: "foot", imageId: "foot", alt: "foot" },
  { word: "shoe", imageId: "shoe", alt: "shoe" },
  { word: "sock", imageId: "sock", alt: "sock" },
  { word: "fish", imageId: "fish", alt: "fish" },
  { word: "duck", imageId: "duck", alt: "duck" },
  { word: "bird", imageId: "bird", alt: "bird" },
  { word: "ball", imageId: "ball", alt: "ball" },
  { word: "doll", imageId: "doll", alt: "doll" },
  { word: "book", imageId: "book", alt: "book" },
  { word: "moon", imageId: "moon", alt: "moon" },
  { word: "star", imageId: "star", alt: "star" },
  { word: "rain", imageId: "rain", alt: "rain" },
  { word: "tree", imageId: "tree", alt: "tree" },
  { word: "leaf", imageId: "leaf", alt: "leaf" },
  { word: "cake", imageId: "cake", alt: "cake" }
];

const polishWords: WordDefinition[] = [
  { word: "mama", imageId: "family-mom", alt: "mama" },
  { word: "tata", imageId: "family-dad", alt: "tata" },
  { word: "kot", imageId: "cat", alt: "kot" },
  { word: "pies", imageId: "dog", alt: "pies" },
  { word: "dom", imageId: "house", alt: "dom" },
  { word: "auto", imageId: "vehicle", alt: "auto" },
  { word: "bus", imageId: "bus", alt: "bus" },
  { word: "las", imageId: "forest", alt: "las" },
  { word: "lis", imageId: "fox", alt: "lis" },
  { word: "osa", imageId: "wasp", alt: "osa" },
  { word: "ul", imageId: "hive", alt: "ul" },
  { word: "oko", imageId: "eye", alt: "oko" },
  { word: "nos", imageId: "nose", alt: "nos" },
  { word: "ząb", imageId: "tooth", alt: "ząb", aliases: ["zab"] },
  { word: "ucho", imageId: "ear", alt: "ucho" },
  { word: "ręka", imageId: "hand", alt: "ręka", aliases: ["reka"] },
  { word: "noga", imageId: "leg", alt: "noga" },
  { word: "but", imageId: "shoe", alt: "but" },
  { word: "sok", imageId: "juice", alt: "sok" },
  { word: "ser", imageId: "cheese", alt: "ser" },
  { word: "ryż", imageId: "rice", alt: "ryż", aliases: ["ryz"] },
  { word: "sól", imageId: "salt", alt: "sól", aliases: ["sol"] },
  { word: "lód", imageId: "ice", alt: "lód", aliases: ["lod"] },
  { word: "woda", imageId: "water", alt: "woda" },
  { word: "koń", imageId: "horse", alt: "koń", aliases: ["kon"] },
  { word: "miś", imageId: "bear", alt: "miś", aliases: ["mis"] },
  { word: "gęś", imageId: "goose", alt: "gęś", aliases: ["ges"] },
  { word: "żaba", imageId: "frog", alt: "żaba", aliases: ["zaba"] },
  { word: "ryba", imageId: "fish", alt: "ryba" },
  { word: "rak", imageId: "crab", alt: "rak" },
  { word: "kura", imageId: "hen", alt: "kura" },
  { word: "foka", imageId: "seal", alt: "foka" },
  { word: "mysz", imageId: "mouse", alt: "mysz" },
  { word: "lala", imageId: "doll", alt: "lala" },
  { word: "piłka", imageId: "ball", alt: "piłka", aliases: ["pilka"] },
  { word: "koc", imageId: "blanket", alt: "koc" }
];

function makeWords(language: LanguageCode, words: WordDefinition[]): LetterItem[] {
  return words.map((item) => ({
    display: item.word,
    speechText: item.word,
    aliases: [item.word, ...(item.aliases ?? [])],
    language,
    characterSet: "words",
    example: {
      word: item.word,
      imageId: item.imageId,
      alt: item.alt
    }
  }));
}

export const wordsByLanguage: Record<LanguageCode, LetterItem[]> = {
  en: makeWords("en", englishWords),
  pl: makeWords("pl", polishWords)
};

export const wordImageIds = new Set([...englishWords, ...polishWords].map((word) => word.imageId));
