import { afterEach, describe, expect, it, vi } from "vitest";
import type { SessionSummary } from "../types";
import { createStampId, getStampTier, loadStamps, saveStamp } from "./stamps";

const baseSummary: SessionSummary = {
  totalScore: 0,
  maxScore: 100,
  accuracy: 0,
  strongLetters: [],
  practiceLetters: [],
  results: []
};

describe("stamps", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("assigns stamp tiers from score thresholds", () => {
    expect(getStampTier({ ...baseSummary, accuracy: 59 })).toBeNull();
    expect(getStampTier({ ...baseSummary, accuracy: 60 })).toBe("bronze");
    expect(getStampTier({ ...baseSummary, accuracy: 80 })).toBe("silver");
    expect(getStampTier({ ...baseSummary, accuracy: 95 })).toBe("gold");
  });

  it("persists stamps without duplicates", () => {
    const summary = { ...baseSummary, totalScore: 95, accuracy: 95 };
    const first = saveStamp({ language: "en", gameMode: "hear-pick" }, summary, "2026-06-10T10:00:00.000Z");
    const second = saveStamp({ language: "en", gameMode: "hear-pick" }, summary, "2026-06-10T10:01:00.000Z");

    expect(first.isNew).toBe(true);
    expect(second.isNew).toBe(false);
    expect(loadStamps()).toHaveLength(1);
    expect(loadStamps()[0].id).toBe(createStampId("en", "hear-pick", "gold"));
  });

  it("fails gracefully when storage cannot be read", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(loadStamps()).toEqual([]);
    expect(saveStamp({ language: "pl", gameMode: "see-say" }, { ...baseSummary, accuracy: 80 }).stamp?.tier).toBe("silver");
  });
});
