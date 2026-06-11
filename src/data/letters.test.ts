import { describe, expect, it } from "vitest";
import { getCharacters, getLetters, letterImageIds, matchesCharacterTranscript, matchesLetterTranscript } from "./letters";

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

  it("includes accessible example image metadata for every supported letter", () => {
    for (const language of ["en", "pl"] as const) {
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

    expect(getCharacters("en", "digits").find((digit) => digit.display === "4")?.speechText).toBe("four");
    expect(getCharacters("pl", "digits").find((digit) => digit.display === "4")?.speechText).toBe("cztery");
  });

  it("matches spoken digit transcripts", () => {
    const englishSeven = getCharacters("en", "digits").find((digit) => digit.display === "7")!;
    const polishZero = getCharacters("pl", "digits").find((digit) => digit.display === "0")!;

    expect(matchesCharacterTranscript(englishSeven, "seven")).toBe(true);
    expect(matchesCharacterTranscript(englishSeven, "number 7")).toBe(true);
    expect(matchesCharacterTranscript(polishZero, "zero")).toBe(true);
  });
});
