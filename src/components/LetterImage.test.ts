import { describe, expect, it } from "vitest";
import { getCenteredCountItemTransform, getDigitGridPositions } from "./LetterImage";

describe("getDigitGridPositions", () => {
  it("centers one item", () => {
    expect(getDigitGridPositions(1)).toEqual([{ x: 64, y: 64 }]);
  });

  it("places four items in a centered two-by-two grid", () => {
    expect(getDigitGridPositions(4)).toEqual([
      { x: 44, y: 44 },
      { x: 84, y: 44 },
      { x: 44, y: 84 },
      { x: 84, y: 84 }
    ]);
  });

  it("places five items as two, one, then two centered rows", () => {
    expect(getDigitGridPositions(5)).toEqual([
      { x: 44, y: 30 },
      { x: 84, y: 30 },
      { x: 64, y: 64 },
      { x: 44, y: 98 },
      { x: 84, y: 98 }
    ]);
  });

  it("places eight items as three, two, then three centered rows", () => {
    expect(getDigitGridPositions(8)).toEqual([
      { x: 28, y: 30 },
      { x: 64, y: 30 },
      { x: 100, y: 30 },
      { x: 44, y: 64 },
      { x: 84, y: 64 },
      { x: 28, y: 98 },
      { x: 64, y: 98 },
      { x: 100, y: 98 }
    ]);
  });

  it("fills a full three-by-three grid for nine items", () => {
    expect(getDigitGridPositions(9)).toEqual([
      { x: 28, y: 30 },
      { x: 64, y: 30 },
      { x: 100, y: 30 },
      { x: 28, y: 64 },
      { x: 64, y: 64 },
      { x: 100, y: 64 },
      { x: 28, y: 98 },
      { x: 64, y: 98 },
      { x: 100, y: 98 }
    ]);
  });
});

describe("getCenteredCountItemTransform", () => {
  it("centers scaled 128-viewBox count items on the target coordinate", () => {
    expect(getCenteredCountItemTransform(64, 64)).toBe("translate(39.68 39.68) scale(0.38)");
  });
});
