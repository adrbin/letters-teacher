import { describe, expect, it } from "vitest";
import { normalizeStrokes, recognizeExpectedLetter, recognizeLetter, type Stroke } from "./recognizer";

describe("handwriting recognizer", () => {
  it("normalizes empty drawings", () => {
    expect(normalizeStrokes([])).toHaveLength(576);
    expect(normalizeStrokes([]).every((cell) => cell === 0)).toBe(true);
  });

  it("recognizes a simple A-like stroke from candidate letters", () => {
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

  it("validates common block letters against the target", () => {
    const fixtures: Array<[string, Stroke[]]> = [
      [
        "L",
        [
          [
            { x: 24, y: 8 },
            { x: 24, y: 92 },
            { x: 84, y: 92 }
          ]
        ]
      ],
      [
        "T",
        [
          [
            { x: 10, y: 10 },
            { x: 90, y: 10 }
          ],
          [
            { x: 50, y: 10 },
            { x: 50, y: 94 }
          ]
        ]
      ],
      [
        "X",
        [
          [
            { x: 16, y: 10 },
            { x: 84, y: 90 }
          ],
          [
            { x: 84, y: 10 },
            { x: 16, y: 90 }
          ]
        ]
      ]
    ];

    for (const [letter, strokes] of fixtures) {
      expect(recognizeExpectedLetter(strokes, letter, ["A", "L", "T", "X"]).matches).toBe(true);
    }
  });

  it("requires the target instead of accepting the closest wrong letter", () => {
    const lLike: Stroke[] = [
      [
        { x: 24, y: 8 },
        { x: 24, y: 92 },
        { x: 84, y: 92 }
      ]
    ];

    expect(recognizeExpectedLetter(lLike, "A", ["A", "L", "T"]).matches).toBe(false);
  });

  it("supports Polish diacritic templates when their marks are drawn", () => {
    const lSlash: Stroke[] = [
      [
        { x: 24, y: 8 },
        { x: 24, y: 92 },
        { x: 84, y: 92 }
      ],
      [
        { x: 22, y: 58 },
        { x: 72, y: 42 }
      ]
    ];
    const zDot: Stroke[] = [
      [
        { x: 16, y: 10 },
        { x: 84, y: 10 },
        { x: 16, y: 90 },
        { x: 86, y: 90 }
      ],
      [
        { x: 62, y: 2 },
        { x: 63, y: 2 }
      ]
    ];

    expect(recognizeExpectedLetter(lSlash, "Ł", ["L", "Ł"]).matches).toBe(true);
    expect(recognizeExpectedLetter(zDot, "Ż", ["Z", "Ż"]).matches).toBe(true);
    expect(recognizeExpectedLetter(lSlash.slice(0, 1), "Ł", ["L", "Ł"]).matches).toBe(false);
  });
});
