import { describe, expect, it } from "vitest";
import { normalizeStrokes, recognizeLetter, type Stroke } from "./recognizer";

describe("handwriting recognizer", () => {
  it("normalizes empty drawings", () => {
    expect(normalizeStrokes([])).toHaveLength(256);
    expect(normalizeStrokes([]).every((cell) => cell === 0)).toBe(true);
  });

  it("recognizes a simple A-like stroke", () => {
    const strokes: Stroke[] = [
      [
        { x: 10, y: 90 },
        { x: 50, y: 5 },
        { x: 90, y: 90 }
      ],
      [
        { x: 30, y: 55 },
        { x: 70, y: 55 }
      ]
    ];

    expect(recognizeLetter(strokes, ["A", "L", "T"]).letter).toBe("A");
  });
});
