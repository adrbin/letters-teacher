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

  it("validates common digit drawings against the target", () => {
    const fixtures: Array<[string, Stroke[]]> = [
      ["0", [[{ x: 50, y: 8 }, { x: 82, y: 20 }, { x: 88, y: 58 }, { x: 74, y: 92 }, { x: 28, y: 90 }, { x: 14, y: 56 }, { x: 22, y: 18 }, { x: 50, y: 8 }]]],
      ["1", [[{ x: 44, y: 26 }, { x: 58, y: 10 }, { x: 58, y: 92 }], [{ x: 36, y: 92 }, { x: 78, y: 92 }]]],
      ["2", [[{ x: 22, y: 32 }, { x: 38, y: 10 }, { x: 76, y: 16 }, { x: 84, y: 40 }, { x: 18, y: 92 }, { x: 88, y: 92 }]]],
      ["5", [[{ x: 82, y: 10 }, { x: 28, y: 10 }, { x: 24, y: 48 }, { x: 70, y: 48 }, { x: 86, y: 68 }, { x: 70, y: 92 }, { x: 28, y: 88 }]]],
      ["8", [[{ x: 50, y: 8 }, { x: 78, y: 24 }, { x: 50, y: 50 }, { x: 22, y: 24 }, { x: 50, y: 8 }], [{ x: 50, y: 50 }, { x: 82, y: 72 }, { x: 50, y: 94 }, { x: 18, y: 72 }, { x: 50, y: 50 }]]]
    ];

    for (const [digit, strokes] of fixtures) {
      expect(recognizeExpectedLetter(strokes, digit, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]).matches).toBe(true);
    }
  });
});
