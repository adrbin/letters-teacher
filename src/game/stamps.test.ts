import { afterEach, describe, expect, it, vi } from "vitest";
import { getLetters } from "../data/letters";
import type { LetterResult, SessionSummary } from "../types";
import { loadStamps, saveStamp } from "./stamps";

const baseSummary: SessionSummary = {
  totalScore: 0,
  maxScore: 100,
  accuracy: 0,
  strongLetters: [],
  practiceLetters: [],
  results: []
};

function result(letter: string): LetterResult {
  return {
    letter,
    attempts: 1,
    awardedPoints: 1,
    maxPoints: 1,
    correct: true
  };
}

function summary(accuracy: number, letters: string[]): SessionSummary {
  return {
    ...baseSummary,
    totalScore: accuracy,
    accuracy,
    results: letters.map(result)
  };
}

describe("stamps", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("does not award alphabet stamps below the score threshold", () => {
    expect(saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(59, ["A"])).stamp).toBeNull();
    expect(loadStamps()).toEqual([]);
  });

  it("awards a letter stamp at the score threshold", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const saved = saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(60, ["A", "B"]), "2026-06-10T10:00:00.000Z");

    expect(saved.isNew).toBe(true);
    expect(saved.stamp).toMatchObject({
      kind: "character",
      characterSet: "letters",
      language: "en",
      character: "A",
      word: "apple",
      imageId: "fruit-red",
      alt: "red apple",
      score: 60,
      maxScore: 100
    });
    expect(loadStamps()).toHaveLength(1);
  });

  it("prioritizes practiced letters that are not already collected", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");

    const saved = saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A", "B"]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "character", characterSet: "letters", language: "en", character: "B", word: "ball" });
    expect(loadStamps().filter((stamp) => stamp.kind === "character").map((stamp) => stamp.character)).toEqual(["A", "B"]);
  });

  it("falls back to an uncollected alphabet letter when practiced letters are already collected", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");

    const saved = saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "character", characterSet: "letters", language: "en", character: "B", word: "ball" });
  });

  it("converts a full alphabet into a completed alphabet stamp and starts a new cycle", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const englishLetters = getLetters("en").map((letter) => letter.display);

    for (const [index, letter] of englishLetters.slice(0, -1).entries()) {
      saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, [letter]), `2026-06-10T10:00:${String(index).padStart(2, "0")}.000Z`);
    }

    const saved = saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, [englishLetters.at(-1)!]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "collection-complete", characterSet: "letters", language: "en", completedCount: 1 });
    expect(loadStamps()).toEqual([expect.objectContaining({ kind: "collection-complete", characterSet: "letters", language: "en", completedCount: 1 })]);

    const nextCycle = saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:02:00.000Z");

    expect(nextCycle.stamp).toMatchObject({ kind: "character", characterSet: "letters", language: "en", character: "A" });
    expect(loadStamps()).toEqual([
      expect.objectContaining({ kind: "collection-complete", characterSet: "letters", language: "en", completedCount: 1 }),
      expect.objectContaining({ kind: "character", characterSet: "letters", language: "en", character: "A" })
    ]);
  });

  it("keeps English and Polish stamp progress separate", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");
    saveStamp({ language: "pl", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:01:00.000Z");

    expect(loadStamps()).toEqual([
      expect.objectContaining({ kind: "character", characterSet: "letters", language: "en", character: "A", word: "apple" }),
      expect.objectContaining({ kind: "character", characterSet: "letters", language: "pl", character: "A", word: "auto" })
    ]);
  });

  it("keeps letter and digit stamp progress separate", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    saveStamp({ language: "en", characterSet: "letters", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");
    saveStamp({ language: "en", characterSet: "digits", gameMode: "hear-pick" }, summary(95, ["1"]), "2026-06-10T10:01:00.000Z");

    expect(loadStamps()).toEqual([
      expect.objectContaining({ kind: "character", characterSet: "letters", language: "en", character: "A" }),
      expect.objectContaining({ kind: "character", characterSet: "digits", language: "en", character: "1" })
    ]);
  });

  it("converts a full digit collection into a completed digits stamp", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    for (const digit of ["0", "1", "2", "3", "4", "5", "6", "7", "8"]) {
      saveStamp({ language: "pl", characterSet: "digits", gameMode: "hear-pick" }, summary(95, [digit]), `2026-06-10T10:00:0${digit}.000Z`);
    }

    const saved = saveStamp({ language: "pl", characterSet: "digits", gameMode: "hear-pick" }, summary(95, ["9"]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "collection-complete", characterSet: "digits", language: "pl", completedCount: 1 });
    expect(loadStamps()).toEqual([expect.objectContaining({ kind: "collection-complete", characterSet: "digits", language: "pl", completedCount: 1 })]);
  });

  it("fails gracefully when storage cannot be read", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(loadStamps()).toEqual([]);
    expect(saveStamp({ language: "pl", characterSet: "letters", gameMode: "see-say" }, summary(80, ["A"])).stamp).toMatchObject({
      kind: "character",
      characterSet: "letters",
      language: "pl",
      character: "A"
    });
  });
});
