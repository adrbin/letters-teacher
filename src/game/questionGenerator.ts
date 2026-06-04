import { getLetters } from "../data/letters";
import type { LanguageCode, Question } from "../types";

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRandom(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function generateQuestions(language: LanguageCode, questionCount: number, seed = "letters-teacher"): Question[] {
  const random = createRandom(`${seed}-${language}-${questionCount}`);
  const letters = getLetters(language);
  const targets: Question[] = [];
  let shuffledLetters = shuffle(letters, random);

  for (let index = 0; index < questionCount; index += 1) {
    if (index > 0 && index % shuffledLetters.length === 0) {
      shuffledLetters = shuffle(letters, random);
    }

    const target = shuffledLetters[index % shuffledLetters.length];
    const distractors = shuffle(
      letters.filter((letter) => letter.display !== target.display),
      random
    ).slice(0, 3);
    const options = shuffle([target, ...distractors], random);

    targets.push({
      id: `${language}-${index}-${target.display}`,
      target,
      options
    });
  }

  return targets;
}
