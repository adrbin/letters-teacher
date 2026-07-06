import type { LanguageCode, LetterItem } from "../types";
import { stripPinyinToneMarks } from "./pinyin";

type WordDefinition = {
  word: string;
  hanzi?: string;
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

const chineseWords: WordDefinition[] = [
  { word: "māma", hanzi: "妈妈", imageId: "family-mom", alt: "妈妈" },
  { word: "bàba", hanzi: "爸爸", imageId: "family-dad", alt: "爸爸" },
  { word: "māo", hanzi: "猫", imageId: "cat", alt: "猫" },
  { word: "gǒu", hanzi: "狗", imageId: "dog", alt: "狗" },
  { word: "tàiyáng", hanzi: "太阳", imageId: "sun", alt: "太阳" },
  { word: "chē", hanzi: "车", imageId: "vehicle", alt: "车" },
  { word: "bāshì", hanzi: "巴士", imageId: "bus", alt: "巴士" },
  { word: "chuáng", hanzi: "床", imageId: "bed", alt: "床" },
  { word: "màozi", hanzi: "帽子", imageId: "hat", alt: "帽子" },
  { word: "bēizi", hanzi: "杯子", imageId: "cup", alt: "杯子" },
  { word: "zhū", hanzi: "猪", imageId: "pig", alt: "猪" },
  { word: "jī", hanzi: "鸡", imageId: "hen", alt: "鸡" },
  { word: "húli", hanzi: "狐狸", imageId: "fox", alt: "狐狸" },
  { word: "niú", hanzi: "牛", imageId: "cow", alt: "牛" },
  { word: "mǎyǐ", hanzi: "蚂蚁", imageId: "ant", alt: "蚂蚁" },
  { word: "mìfēng", hanzi: "蜜蜂", imageId: "bee", alt: "蜜蜂" },
  { word: "jīdàn", hanzi: "鸡蛋", imageId: "egg", alt: "鸡蛋" },
  { word: "yǎnjing", hanzi: "眼睛", imageId: "eye", alt: "眼睛" },
  { word: "ěrduo", hanzi: "耳朵", imageId: "ear", alt: "耳朵" },
  { word: "bízi", hanzi: "鼻子", imageId: "nose", alt: "鼻子" },
  { word: "shǒu", hanzi: "手", imageId: "hand", alt: "手" },
  { word: "jiǎo", hanzi: "脚", imageId: "foot", alt: "脚" },
  { word: "xié", hanzi: "鞋", imageId: "shoe", alt: "鞋" },
  { word: "wàzi", hanzi: "袜子", imageId: "sock", alt: "袜子" },
  { word: "yú", hanzi: "鱼", imageId: "fish", alt: "鱼" },
  { word: "yā", hanzi: "鸭", imageId: "duck", alt: "鸭" },
  { word: "niǎo", hanzi: "鸟", imageId: "bird", alt: "鸟" },
  { word: "qiú", hanzi: "球", imageId: "ball", alt: "球" },
  { word: "wáwa", hanzi: "娃娃", imageId: "doll", alt: "娃娃" },
  { word: "shū", hanzi: "书", imageId: "book", alt: "书" },
  { word: "yuèliang", hanzi: "月亮", imageId: "moon", alt: "月亮" },
  { word: "xīngxing", hanzi: "星星", imageId: "star", alt: "星星" },
  { word: "yǔ", hanzi: "雨", imageId: "rain", alt: "雨" },
  { word: "shù", hanzi: "树", imageId: "tree", alt: "树" },
  { word: "yèzi", hanzi: "叶子", imageId: "leaf", alt: "叶子" },
  { word: "dàngāo", hanzi: "蛋糕", imageId: "cake", alt: "蛋糕" }
];

function makeWords(language: LanguageCode, words: WordDefinition[]): LetterItem[] {
  return words.map((item) => ({
    display: item.word,
    speechText: item.hanzi ?? item.word,
    aliases: Array.from(new Set([item.word, stripPinyinToneMarks(item.word), item.hanzi, ...(item.aliases ?? [])].filter((alias): alias is string => Boolean(alias)))),
    language,
    characterSet: "words",
    example: {
      word: item.word,
      hanzi: item.hanzi,
      imageId: item.imageId,
      alt: item.alt
    }
  }));
}

export const wordsByLanguage: Record<LanguageCode, LetterItem[]> = {
  en: makeWords("en", englishWords),
  pl: makeWords("pl", polishWords),
  zh: makeWords("zh", chineseWords)
};

export const wordImageIds = new Set([...englishWords, ...polishWords, ...chineseWords].map((word) => word.imageId));
