import { getLetters } from "../data/letters";
import type { EarnedStamp, LanguageCode, LetterStamp, SessionSummary } from "../types";

const STORAGE_KEY = "letters-teacher:stamps";
const MIN_STAMP_ACCURACY = 60;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isLanguage(value: unknown): value is LanguageCode {
  return value === "en" || value === "pl";
}

function isLetterStamp(value: unknown): value is LetterStamp {
  const stamp = value as Partial<LetterStamp>;
  return (
    stamp?.kind === "letter" &&
    typeof stamp.id === "string" &&
    isLanguage(stamp.language) &&
    typeof stamp.letter === "string" &&
    typeof stamp.word === "string" &&
    typeof stamp.imageId === "string" &&
    typeof stamp.alt === "string" &&
    typeof stamp.earnedAt === "string" &&
    typeof stamp.score === "number" &&
    typeof stamp.maxScore === "number"
  );
}

function isAlphabetCompleteStamp(value: unknown): value is EarnedStamp {
  const stamp = value as Partial<EarnedStamp>;
  return (
    stamp?.kind === "alphabet-complete" &&
    typeof stamp.id === "string" &&
    isLanguage(stamp.language) &&
    typeof stamp.earnedAt === "string" &&
    typeof stamp.completedCount === "number"
  );
}

function isStamp(value: unknown): value is EarnedStamp {
  return isLetterStamp(value) || isAlphabetCompleteStamp(value);
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function createLetterStamp(language: LanguageCode, letter: string, summary: SessionSummary, earnedAt: string): LetterStamp | null {
  const item = getLetters(language).find((candidate) => candidate.display === letter);
  if (!item?.example) return null;

  return {
    kind: "letter",
    id: `${language}:letter:${item.display}`,
    language,
    letter: item.display,
    word: item.example.word,
    imageId: item.example.imageId,
    alt: item.example.alt,
    earnedAt,
    score: summary.totalScore,
    maxScore: summary.maxScore
  };
}

export function loadStamps(): EarnedStamp[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStamp) : [];
  } catch {
    return [];
  }
}

function saveStamps(stamps: EarnedStamp[]): void {
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(stamps));
}

export function saveStamp(
  settings: { language: LanguageCode; gameMode?: unknown },
  summary: SessionSummary,
  earnedAt = new Date().toISOString()
): { stamp: EarnedStamp | null; stamps: EarnedStamp[]; isNew: boolean } {
  const stamps = loadStamps();
  if (summary.accuracy < MIN_STAMP_ACCURACY) return { stamp: null, stamps, isNew: false };

  const alphabet = getLetters(settings.language).map((letter) => letter.display);
  const collectedLetters = new Set(
    stamps
      .filter((stamp): stamp is LetterStamp => stamp.kind === "letter" && stamp.language === settings.language)
      .map((stamp) => stamp.letter)
  );
  const uncollectedLetters = alphabet.filter((letter) => !collectedLetters.has(letter));
  const practicedLetters = summary.results.map((result) => result.letter).filter((letter) => alphabet.includes(letter));
  const practicedCandidates = practicedLetters.filter((letter) => !collectedLetters.has(letter));
  const selectedLetter = pickRandom(practicedCandidates.length > 0 ? practicedCandidates : uncollectedLetters);
  if (!selectedLetter) return { stamp: null, stamps, isNew: false };

  const letterStamp = createLetterStamp(settings.language, selectedLetter, summary, earnedAt);
  if (!letterStamp) return { stamp: null, stamps, isNew: false };

  const nextCollectedLetters = new Set([...collectedLetters, letterStamp.letter]);
  const completesAlphabet = nextCollectedLetters.size >= alphabet.length;
  const stampsWithoutLanguageLetters = stamps.filter((stamp) => !(stamp.kind === "letter" && stamp.language === settings.language));

  if (completesAlphabet) {
    const existingCompletion = stamps.find(
      (stamp) => stamp.kind === "alphabet-complete" && stamp.language === settings.language
    );
    const completionStamp: EarnedStamp = {
      kind: "alphabet-complete",
      id: `${settings.language}:alphabet-complete`,
      language: settings.language,
      completedCount: existingCompletion?.kind === "alphabet-complete" ? existingCompletion.completedCount + 1 : 1,
      earnedAt
    };
    const nextStamps = [
      ...stampsWithoutLanguageLetters.filter((stamp) => !(stamp.kind === "alphabet-complete" && stamp.language === settings.language)),
      completionStamp
    ];

    try {
      saveStamps(nextStamps);
    } catch {
      return { stamp: completionStamp, stamps, isNew: true };
    }

    return { stamp: completionStamp, stamps: nextStamps, isNew: true };
  }

  const nextStamps = [...stamps, letterStamp];
  try {
    saveStamps(nextStamps);
  } catch {
    return { stamp: letterStamp, stamps, isNew: true };
  }

  return { stamp: letterStamp, stamps: nextStamps, isNew: true };
}
