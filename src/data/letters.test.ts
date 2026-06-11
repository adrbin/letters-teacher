import { describe, expect, it } from "vitest";
import { getLetters, matchesLetterTranscript } from "./letters";

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
});
