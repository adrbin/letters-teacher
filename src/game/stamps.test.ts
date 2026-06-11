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
    expect(saveStamp({ language: "en", gameMode: "hear-pick" }, summary(59, ["A"])).stamp).toBeNull();
    expect(loadStamps()).toEqual([]);
  });

  it("awards a letter stamp at the score threshold", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const saved = saveStamp({ language: "en", gameMode: "hear-pick" }, summary(60, ["A", "B"]), "2026-06-10T10:00:00.000Z");

    expect(saved.isNew).toBe(true);
    expect(saved.stamp).toMatchObject({
      kind: "letter",
      language: "en",
      letter: "A",
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
    saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");

    const saved = saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, ["A", "B"]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "letter", language: "en", letter: "B", word: "ball" });
    expect(loadStamps().filter((stamp) => stamp.kind === "letter").map((stamp) => stamp.letter)).toEqual(["A", "B"]);
  });

  it("falls back to an uncollected alphabet letter when practiced letters are already collected", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");

    const saved = saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "letter", language: "en", letter: "B", word: "ball" });
  });

  it("converts a full alphabet into a completed alphabet stamp and starts a new cycle", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const englishLetters = getLetters("en").map((letter) => letter.display);

    for (const [index, letter] of englishLetters.slice(0, -1).entries()) {
      saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, [letter]), `2026-06-10T10:00:${String(index).padStart(2, "0")}.000Z`);
    }

    const saved = saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, [englishLetters.at(-1)!]), "2026-06-10T10:01:00.000Z");

    expect(saved.stamp).toMatchObject({ kind: "alphabet-complete", language: "en", completedCount: 1 });
    expect(loadStamps()).toEqual([expect.objectContaining({ kind: "alphabet-complete", language: "en", completedCount: 1 })]);

    const nextCycle = saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:02:00.000Z");

    expect(nextCycle.stamp).toMatchObject({ kind: "letter", language: "en", letter: "A" });
    expect(loadStamps()).toEqual([
      expect.objectContaining({ kind: "alphabet-complete", language: "en", completedCount: 1 }),
      expect.objectContaining({ kind: "letter", language: "en", letter: "A" })
    ]);
  });

  it("keeps English and Polish stamp progress separate", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    saveStamp({ language: "en", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:00:00.000Z");
    saveStamp({ language: "pl", gameMode: "hear-pick" }, summary(95, ["A"]), "2026-06-10T10:01:00.000Z");

    expect(loadStamps()).toEqual([
      expect.objectContaining({ kind: "letter", language: "en", letter: "A", word: "apple" }),
      expect.objectContaining({ kind: "letter", language: "pl", letter: "A", word: "auto" })
    ]);
  });

  it("fails gracefully when storage cannot be read", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(loadStamps()).toEqual([]);
    expect(saveStamp({ language: "pl", gameMode: "see-say" }, summary(80, ["A"])).stamp).toMatchObject({
      kind: "letter",
      language: "pl",
      letter: "A"
    });
  });
});
