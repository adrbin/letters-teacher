export type Point = { x: number; y: number };
export type Stroke = Point[];

export type RecognitionResult = {
  letter: string | null;
  confidence: number;
};

export type ExpectedRecognitionResult = RecognitionResult & {
  matches: boolean;
  runnerUp: RecognitionResult;
};

const SIZE = 24;
const MIN_CONFIDENCE = 0.2;
const TARGET_MIN_CONFIDENCE = 0.1;
const TARGET_RUNNER_UP_RATIO = 0.72;
const MIN_TOTAL_LENGTH = 28;

const BASE_LETTERS: Record<string, string> = {
  Ą: "A",
  Ć: "C",
  Ę: "E",
  Ł: "L",
  Ń: "N",
  Ó: "O",
  Ś: "S",
  Ź: "Z",
  Ż: "Z"
};

function p(x: number, y: number): Point {
  return { x, y };
}

function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number, steps = 10): Stroke {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = from + ((to - from) * index) / steps;
    return p(cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
  });
}

function markCells(grid: number[], size: number, x: number, y: number, radius = 1) {
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const gx = x + dx;
      const gy = y + dy;
      if (gx >= 0 && gx < size && gy >= 0 && gy < size) {
        grid[gy * size + gx] = 1;
      }
    }
  }
}

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
    for (let index = 0; index < stroke.length; index += 1) {
      const from = stroke[index];
      const to = stroke[index + 1] ?? from;
      const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y), 1);

      for (let step = 0; step <= steps; step += 1) {
        const progress = step / steps;
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        const normalizedX = Math.round(((x - minX) / scale) * (size - 1));
        const normalizedY = Math.round(((y - minY) / scale) * (size - 1));
        markCells(grid, size, normalizedX, normalizedY);
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

function acute(): Stroke {
  return [p(58, 12), p(74, 0)];
}

function dot(): Stroke {
  return [p(62, 2), p(63, 2)];
}

function ogonek(x = 64): Stroke {
  return [p(x, 92), p(x + 8, 104), p(x - 4, 112)];
}

function slash(): Stroke {
  return [p(22, 58), p(72, 42)];
}

const TEMPLATES: Record<string, Stroke[][]> = {
  A: [[[p(14, 94), p(50, 6), p(86, 94)], [p(30, 56), p(70, 56)]]],
  B: [[[p(20, 8), p(20, 92)], arc(42, 30, 26, 22, -Math.PI / 2, Math.PI / 2), arc(42, 70, 28, 22, -Math.PI / 2, Math.PI / 2)]],
  C: [[arc(54, 50, 38, 42, 0.25 * Math.PI, 1.75 * Math.PI)]],
  D: [[[p(20, 8), p(20, 92)], arc(36, 50, 42, 42, -Math.PI / 2, Math.PI / 2)]],
  E: [[[p(76, 8), p(20, 8), p(20, 92), p(78, 92)], [p(20, 50), p(68, 50)]]],
  F: [[[p(20, 92), p(20, 8), p(78, 8)], [p(20, 50), p(66, 50)]]],
  G: [[arc(54, 50, 38, 42, 0.2 * Math.PI, 1.85 * Math.PI), [p(56, 56), p(84, 56), p(84, 76)]]],
  H: [[[p(18, 8), p(18, 92)], [p(82, 8), p(82, 92)], [p(18, 50), p(82, 50)]]],
  I: [[[p(50, 8), p(50, 92)]], [[p(25, 8), p(75, 8)], [p(50, 8), p(50, 92)], [p(25, 92), p(75, 92)]]],
  J: [[[p(78, 8), p(78, 70)], arc(54, 70, 24, 22, 0, Math.PI)]],
  K: [[[p(20, 8), p(20, 92)], [p(78, 8), p(22, 52), p(82, 92)]]],
  L: [[[p(24, 8), p(24, 92), p(84, 92)]]],
  M: [[[p(14, 92), p(14, 8), p(50, 52), p(86, 8), p(86, 92)]]],
  N: [[[p(18, 92), p(18, 8), p(82, 92), p(82, 8)]]],
  O: [[arc(50, 50, 38, 42, 0, Math.PI * 2, 16)]],
  P: [[[p(20, 92), p(20, 8)], arc(44, 30, 28, 22, -Math.PI / 2, Math.PI / 2), [p(44, 52), p(20, 52)]]],
  Q: [[arc(50, 48, 36, 40, 0, Math.PI * 2, 16), [p(58, 68), p(86, 96)]]],
  R: [[[p(20, 92), p(20, 8)], arc(44, 30, 28, 22, -Math.PI / 2, Math.PI / 2), [p(44, 52), p(82, 92)]]],
  S: [[arc(54, 30, 32, 22, 0.1 * Math.PI, 1.25 * Math.PI), arc(46, 70, 32, 22, 1.25 * Math.PI, 2.1 * Math.PI)]],
  T: [[[p(10, 10), p(90, 10)], [p(50, 10), p(50, 94)]]],
  U: [[[p(18, 8), p(18, 64)], arc(50, 64, 32, 28, Math.PI, 0), [p(82, 64), p(82, 8)]]],
  V: [[[p(14, 8), p(50, 92), p(86, 8)]]],
  W: [[[p(10, 8), p(28, 92), p(50, 50), p(72, 92), p(90, 8)]]],
  X: [[[p(16, 10), p(84, 90)], [p(84, 10), p(16, 90)]]],
  Y: [[[p(14, 8), p(50, 48), p(86, 8)], [p(50, 48), p(50, 94)]]],
  Z: [[[p(16, 10), p(84, 10), p(16, 90), p(86, 90)]]],
  "0": [[arc(50, 50, 36, 42, 0, Math.PI * 2, 16)]],
  "1": [[[p(44, 26), p(58, 10), p(58, 92)], [p(36, 92), p(78, 92)]]],
  "2": [[[p(22, 32), p(38, 10), p(76, 16), p(84, 40), p(18, 92), p(88, 92)]]],
  "3": [[[p(24, 16), p(78, 16), p(54, 50), p(82, 76), p(66, 92), p(24, 86)]]],
  "4": [[[p(76, 92), p(76, 10), p(18, 62), p(88, 62)]]],
  "5": [[[p(82, 10), p(28, 10), p(24, 48), p(70, 48), p(86, 68), p(70, 92), p(28, 88)]]],
  "6": [[[p(76, 14), p(34, 34), p(24, 70), p(42, 92), p(76, 86), p(82, 58), p(48, 54)]]],
  "7": [[[p(18, 12), p(86, 12), p(42, 92)]]],
  "8": [
    [
      [p(50, 8), p(78, 24), p(50, 50), p(22, 24), p(50, 8)],
      [p(50, 50), p(82, 72), p(50, 94), p(18, 72), p(50, 50)]
    ]
  ],
  "9": [[[p(76, 52), p(44, 54), p(24, 34), p(38, 12), p(74, 16), p(84, 48), p(72, 92)]]]
};

function makeTemplates(letter: string): Stroke[][] {
  const upper = letter.toUpperCase();
  const base = BASE_LETTERS[upper] ?? upper;
  const templates = TEMPLATES[base];
  if (!templates) return [];

  return templates.map((template) => {
    if (upper === "Ą") return [...template, ogonek(64)];
    if (upper === "Ć" || upper === "Ń" || upper === "Ó" || upper === "Ś" || upper === "Ź") return [...template, acute()];
    if (upper === "Ę") return [...template, ogonek(42)];
    if (upper === "Ł") return [...template, slash()];
    if (upper === "Ż") return [...template, dot()];
    return template;
  });
}

function scoreLetter(strokes: Stroke[], letter: string): number {
  const sample = normalizeStrokes(strokes);
  const templates = makeTemplates(letter);
  if (templates.length === 0) return 0;

  return Math.max(...templates.map((template) => similarity(sample, normalizeStrokes(template))));
}

function scoreLetters(strokes: Stroke[], expectedLetters: string[]) {
  return expectedLetters
    .map((letter) => ({ letter, confidence: scoreLetter(strokes, letter) }))
    .sort((a, b) => b.confidence - a.confidence);
}

function totalLength(strokes: Stroke[]): number {
  return strokes.reduce(
    (total, stroke) =>
      total +
      stroke.slice(1).reduce((strokeTotal, point, index) => {
        const previous = stroke[index];
        return strokeTotal + Math.hypot(point.x - previous.x, point.y - previous.y);
      }, 0),
    0
  );
}

export function recognizeLetter(strokes: Stroke[], expectedLetters: string[]): RecognitionResult {
  const [best] = scoreLetters(strokes, expectedLetters);
  if (!best || best.confidence < MIN_CONFIDENCE) {
    return { letter: null, confidence: best?.confidence ?? 0 };
  }

  return best;
}

export function recognizeExpectedLetter(strokes: Stroke[], expectedLetter: string, candidateLetters: string[]): ExpectedRecognitionResult {
  const scored = scoreLetters(strokes, Array.from(new Set([expectedLetter, ...candidateLetters])));
  const target = scored.find((score) => score.letter === expectedLetter) ?? { letter: expectedLetter, confidence: 0 };
  const runnerUp = scored.find((score) => score.letter !== expectedLetter) ?? { letter: null, confidence: 0 };
  const best = scored[0];
  const matches =
    totalLength(strokes) >= MIN_TOTAL_LENGTH &&
    target.confidence >= TARGET_MIN_CONFIDENCE &&
    (best?.letter === expectedLetter || target.confidence >= runnerUp.confidence * TARGET_RUNNER_UP_RATIO);

  return {
    letter: matches ? expectedLetter : best?.letter ?? null,
    confidence: target.confidence,
    matches,
    runnerUp
  };
}
