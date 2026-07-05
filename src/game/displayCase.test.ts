import { describe, expect, it } from "vitest";
import { getCharacters, getLetters } from "../data/letters";
import { getCharacterDisplayText, getExampleDisplayWord, normalizeLetterCase } from "./displayCase";

describe("display case", () => {
  it("defaults missing letter case settings to uppercase", () => {
    expect(normalizeLetterCase(undefined)).toBe("uppercase");
    expect(normalizeLetterCase("lowercase")).toBe("lowercase");
  });

  it("formats letters with locale-aware casing", () => {
    const polishOgonek = getLetters("pl").find((letter) => letter.display === "Ą")!;

    expect(getCharacterDisplayText(polishOgonek, "uppercase")).toBe("Ą");
    expect(getCharacterDisplayText(polishOgonek, "lowercase")).toBe("ą");
  });

  it("formats words as uppercase by default and lowercase when requested", () => {
    const englishWord = getCharacters("en", "words").find((word) => word.display === "mom")!;

    expect(getCharacterDisplayText(englishWord, undefined)).toBe("MOM");
    expect(getCharacterDisplayText(englishWord, "lowercase")).toBe("mom");
  });

  it("leaves digits unchanged", () => {
    const digit = getCharacters("pl", "digits").find((item) => item.display === "4")!;

    expect(getCharacterDisplayText(digit, "uppercase")).toBe("4");
    expect(getCharacterDisplayText(digit, "lowercase")).toBe("4");
  });

  it("formats example words for gameplay captions", () => {
    const polishA = getLetters("pl").find((letter) => letter.display === "A")!;

    expect(getExampleDisplayWord(polishA, "uppercase")).toBe("AUTO");
    expect(getExampleDisplayWord(polishA, "lowercase")).toBe("auto");
  });
});
