import { describe, expect, it } from "vitest";
import { getCharacters, getLetters, languageNames, letterImageIds, matchesCharacterTranscript, matchesLetterTranscript, speechLocales } from "./letters";

describe("letters", () => {
  it("matches aliases for spoken letters", () => {
    const englishA = getLetters("en").find((letter) => letter.display === "A")!;
    const polishOgonek = getLetters("pl").find((letter) => letter.display === "Ą")!;

    expect(matchesLetterTranscript(englishA, "ay")).toBe(true);
    expect(matchesLetterTranscript(polishOgonek, "a z ogonkiem")).toBe(true);
  });

  it("matches noisy Polish speech recognition transcripts", () => {
    const polishZdot = getLetters("pl").find((letter) => letter.display === "Ż")!;
    const polishOacute = getLetters("pl").find((letter) => letter.display === "Ó")!;
    const polishT = getLetters("pl").find((letter) => letter.display === "T")!;

    expect(matchesLetterTranscript(polishZdot, "Żet.")).toBe(true);
    expect(matchesLetterTranscript(polishZdot, "rz")).toBe(true);
    expect(matchesLetterTranscript(polishOacute, "u")).toBe(true);
    expect(matchesLetterTranscript(polishT, "ty")).toBe(true);
  });

  it("keeps display letters uppercase while using speakable names", () => {
    const englishA = getLetters("en").find((letter) => letter.display === "A")!;
    const polishB = getLetters("pl").find((letter) => letter.display === "B")!;

    expect(englishA.display).toBe("A");
    expect(englishA.speechText).toBe("ay");
    expect(polishB.display).toBe("B");
    expect(polishB.speechText).toBe("be");
  });

  it("exposes Chinese metadata and pinyin letter names for the A-Z alphabet", () => {
    const chineseLetters = getLetters("zh");
    const chineseB = chineseLetters.find((letter) => letter.display === "B")!;
    const chineseQ = chineseLetters.find((letter) => letter.display === "Q")!;

    expect(languageNames.zh).toBe("Chinese");
    expect(speechLocales.zh).toBe("zh-CN");
    expect(chineseLetters.map((letter) => letter.display)).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
    expect(chineseB.speechText).toBe("bê");
    expect(chineseQ.speechText).toBe("qiu");
    expect(matchesLetterTranscript(chineseB, "be")).toBe(true);
    expect(matchesLetterTranscript(chineseQ, "qiu")).toBe(true);
  });

  it("includes accessible example image metadata for every supported letter", () => {
    for (const language of ["en", "pl", "zh"] as const) {
      for (const letter of getLetters(language)) {
        expect(letter.example?.word).toBeTruthy();
        expect(letter.example?.alt).toBeTruthy();
        expect(letterImageIds.has(letter.example!.imageId)).toBe(true);
      }
    }
  });

  it("exposes digits with localized speech names and aliases", () => {
    expect(getCharacters("en", "digits").map((digit) => digit.display)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    expect(getCharacters("pl", "digits").map((digit) => digit.display)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    expect(getCharacters("zh", "digits").map((digit) => digit.display)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

    expect(getCharacters("en", "digits").find((digit) => digit.display === "4")?.speechText).toBe("four");
    expect(getCharacters("pl", "digits").find((digit) => digit.display === "4")?.speechText).toBe("cztery");
    expect(getCharacters("zh", "digits").find((digit) => digit.display === "4")?.speechText).toBe("四");
  });

  it("includes accessible example image metadata for every supported digit", () => {
    for (const language of ["en", "pl", "zh"] as const) {
      for (const digit of getCharacters(language, "digits")) {
        expect(digit.example?.word).toBeTruthy();
        expect(digit.example?.alt).toBeTruthy();
        expect(letterImageIds.has(digit.example!.imageId)).toBe(true);
      }
    }
  });

  it("matches spoken digit transcripts", () => {
    const englishSeven = getCharacters("en", "digits").find((digit) => digit.display === "7")!;
    const polishZero = getCharacters("pl", "digits").find((digit) => digit.display === "0")!;
    const chineseFour = getCharacters("zh", "digits").find((digit) => digit.display === "4")!;

    expect(matchesCharacterTranscript(englishSeven, "seven")).toBe(true);
    expect(matchesCharacterTranscript(englishSeven, "number 7")).toBe(true);
    expect(matchesCharacterTranscript(polishZero, "zero")).toBe(true);
    expect(matchesCharacterTranscript(chineseFour, "si")).toBe(true);
    expect(matchesCharacterTranscript(chineseFour, "四")).toBe(true);
  });

  it("exposes simple beginner words for each language", () => {
    expect(getCharacters("en", "words").map((word) => word.display)).toEqual([
      "mom",
      "dad",
      "cat",
      "dog",
      "sun",
      "car",
      "bus",
      "bed",
      "hat",
      "cup",
      "pig",
      "hen",
      "fox",
      "cow",
      "ant",
      "bee",
      "egg",
      "eye",
      "ear",
      "nose",
      "hand",
      "foot",
      "shoe",
      "sock",
      "fish",
      "duck",
      "bird",
      "ball",
      "doll",
      "book",
      "moon",
      "star",
      "rain",
      "tree",
      "leaf",
      "cake"
    ]);
    expect(getCharacters("pl", "words").map((word) => word.display)).toEqual([
      "mama",
      "tata",
      "kot",
      "pies",
      "dom",
      "auto",
      "bus",
      "las",
      "lis",
      "osa",
      "ul",
      "oko",
      "nos",
      "ząb",
      "ucho",
      "ręka",
      "noga",
      "but",
      "sok",
      "ser",
      "ryż",
      "sól",
      "lód",
      "woda",
      "koń",
      "miś",
      "gęś",
      "żaba",
      "ryba",
      "rak",
      "kura",
      "foka",
      "mysz",
      "lala",
      "piłka",
      "koc"
    ]);
    expect(getCharacters("zh", "words").map((word) => word.display)).toEqual([
      "māma",
      "bàba",
      "māo",
      "gǒu",
      "tàiyáng",
      "chē",
      "bāshì",
      "chuáng",
      "màozi",
      "bēizi",
      "zhū",
      "jī",
      "húli",
      "niú",
      "mǎyǐ",
      "mìfēng",
      "jīdàn",
      "yǎnjing",
      "ěrduo",
      "bízi",
      "shǒu",
      "jiǎo",
      "xié",
      "wàzi",
      "yú",
      "yā",
      "niǎo",
      "qiú",
      "wáwa",
      "shū",
      "yuèliang",
      "xīngxing",
      "yǔ",
      "shù",
      "yèzi",
      "dàngāo"
    ]);
  });

  it("includes accessible example image metadata for every supported word", () => {
    for (const language of ["en", "pl", "zh"] as const) {
      const words = getCharacters(language, "words");

      expect(new Set(words.map((word) => word.display)).size).toBe(36);

      for (const word of words) {
        if (language === "zh") {
          expect(word.speechText).toBe(word.example?.hanzi);
          expect(word.example?.hanzi).toBeTruthy();
        } else {
          expect(word.speechText).toBe(word.display);
        }
        expect(word.aliases).toContain(word.display);
        expect(word.example?.word).toBe(word.display);
        expect(word.example?.alt).toBeTruthy();
        expect(letterImageIds.has(word.example!.imageId)).toBe(true);
      }
    }
  });

  it("matches Polish word transcripts without diacritics", () => {
    const polishTooth = getCharacters("pl", "words").find((word) => word.display === "ząb")!;
    const polishHand = getCharacters("pl", "words").find((word) => word.display === "ręka")!;
    const polishBall = getCharacters("pl", "words").find((word) => word.display === "piłka")!;

    expect(matchesCharacterTranscript(polishTooth, "zab")).toBe(true);
    expect(matchesCharacterTranscript(polishHand, "reka")).toBe(true);
    expect(matchesCharacterTranscript(polishBall, "pilka")).toBe(true);
  });

  it("matches Chinese word transcripts with Hanzi, tone-marked pinyin, and toneless pinyin", () => {
    const chineseCat = getCharacters("zh", "words").find((word) => word.display === "māo")!;
    const chineseSun = getCharacters("zh", "words").find((word) => word.display === "tàiyáng")!;

    expect(chineseCat.speechText).toBe("猫");
    expect(chineseCat.example?.hanzi).toBe("猫");
    expect(matchesCharacterTranscript(chineseCat, "猫")).toBe(true);
    expect(matchesCharacterTranscript(chineseCat, "māo")).toBe(true);
    expect(matchesCharacterTranscript(chineseCat, "mao")).toBe(true);
    expect(matchesCharacterTranscript(chineseSun, "taiyang")).toBe(true);
    expect(matchesCharacterTranscript(chineseSun, "太阳")).toBe(true);
  });
});
