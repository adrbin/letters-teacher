export type Point = { x: number; y: number };
export type Stroke = Point[];

export type RecognitionResult = {
  letter: string | null;
  confidence: number;
};

const SIZE = 16;

export function normalizeStrokes(strokes: Stroke[], size = SIZE): number[] {
  const points = strokes.flat();
  if (points.length === 0) return Array(size * size).fill(0);

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const scale = Math.max(maxX - minX, maxY - minY, 1);
  const grid = Array(size * size).fill(0);

  for (const stroke of strokes) {
    for (let index = 1; index < stroke.length; index += 1) {
      const from = stroke[index - 1];
      const to = stroke[index];
      const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y), 1);

      for (let step = 0; step <= steps; step += 1) {
        const progress = step / steps;
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        const normalizedX = Math.round(((x - minX) / scale) * (size - 1));
        const normalizedY = Math.round(((y - minY) / scale) * (size - 1));
        grid[normalizedY * size + normalizedX] = 1;
      }
    }
  }

  return grid;
}

function similarity(sample: number[], template: number[]): number {
  let overlap = 0;
  let union = 0;

  for (let index = 0; index < sample.length; index += 1) {
    if (sample[index] || template[index]) union += 1;
    if (sample[index] && template[index]) overlap += 1;
  }

  return union === 0 ? 0 : overlap / union;
}

function makeTemplate(letter: string): Stroke[] {
  const upper = letter.toUpperCase();
  if (upper === "I") return [[{ x: 50, y: 5 }, { x: 50, y: 95 }]];
  if (upper === "L") return [[{ x: 25, y: 5 }, { x: 25, y: 90 }, { x: 85, y: 90 }]];
  if (upper === "T") return [[{ x: 10, y: 10 }, { x: 90, y: 10 }], [{ x: 50, y: 10 }, { x: 50, y: 95 }]];
  if (upper === "X") return [[{ x: 15, y: 10 }, { x: 85, y: 90 }], [{ x: 85, y: 10 }, { x: 15, y: 90 }]];
  if (upper === "V") return [[{ x: 15, y: 10 }, { x: 50, y: 90 }, { x: 85, y: 10 }]];
  if (upper === "A" || upper === "Ą") {
    return [
      [
        { x: 15, y: 95 },
        { x: 50, y: 5 },
        { x: 85, y: 95 }
      ],
      [
        { x: 32, y: 55 },
        { x: 68, y: 55 }
      ]
    ];
  }
  return [[{ x: 20, y: 50 }, { x: 80, y: 50 }]];
}

export function recognizeLetter(strokes: Stroke[], expectedLetters: string[]): RecognitionResult {
  const sample = normalizeStrokes(strokes);
  const scored = expectedLetters.map((letter) => ({
    letter,
    confidence: similarity(sample, normalizeStrokes(makeTemplate(letter)))
  }));
  scored.sort((a, b) => b.confidence - a.confidence);

  const best = scored[0];
  if (!best || best.confidence < 0.16) {
    return { letter: null, confidence: best?.confidence ?? 0 };
  }

  return best;
}
