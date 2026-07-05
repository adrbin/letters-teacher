import { getCharacters } from "../data/letters";
import type { CharacterSet, CharacterStamp, CollectionCompleteStamp, EarnedStamp, LanguageCode, SessionSummary } from "../types";

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

function isCharacterSet(value: unknown): value is CharacterSet {
  return value === "letters" || value === "digits" || value === "words";
}

function isCharacterStamp(value: unknown): value is CharacterStamp {
  const stamp = value as Partial<CharacterStamp>;
  return (
    stamp?.kind === "character" &&
    typeof stamp.id === "string" &&
    isLanguage(stamp.language) &&
    isCharacterSet(stamp.characterSet) &&
    typeof stamp.character === "string" &&
    (typeof stamp.word === "undefined" || typeof stamp.word === "string") &&
    (typeof stamp.imageId === "undefined" || typeof stamp.imageId === "string") &&
    (typeof stamp.alt === "undefined" || typeof stamp.alt === "string") &&
    typeof stamp.earnedAt === "string" &&
    typeof stamp.score === "number" &&
    typeof stamp.maxScore === "number"
  );
}

function isCollectionCompleteStamp(value: unknown): value is CollectionCompleteStamp {
  const stamp = value as Partial<CollectionCompleteStamp>;
  return (
    stamp?.kind === "collection-complete" &&
    typeof stamp.id === "string" &&
    isLanguage(stamp.language) &&
    isCharacterSet(stamp.characterSet) &&
    typeof stamp.earnedAt === "string" &&
    typeof stamp.completedCount === "number"
  );
}

function isStamp(value: unknown): value is EarnedStamp {
  return isCharacterStamp(value) || isCollectionCompleteStamp(value);
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function createCharacterStamp(
  language: LanguageCode,
  characterSet: CharacterSet,
  character: string,
  summary: SessionSummary,
  earnedAt: string
): CharacterStamp | null {
  const item = getCharacters(language, characterSet).find((candidate) => candidate.display === character);
  if (!item) return null;

  return {
    kind: "character",
    id: `${language}:${characterSet}:character:${item.display}`,
    language,
    characterSet,
    character: item.display,
    word: item.example?.word,
    imageId: item.example?.imageId,
    alt: item.example?.alt,
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
  settings: { language: LanguageCode; characterSet: CharacterSet; gameMode?: unknown },
  summary: SessionSummary,
  earnedAt = new Date().toISOString()
): { stamp: EarnedStamp | null; stamps: EarnedStamp[]; isNew: boolean } {
  const stamps = loadStamps();
  if (summary.accuracy < MIN_STAMP_ACCURACY) return { stamp: null, stamps, isNew: false };

  const collection = getCharacters(settings.language, settings.characterSet).map((letter) => letter.display);
  const collectedCharacters = new Set(
    stamps
      .filter(
        (stamp): stamp is CharacterStamp =>
          stamp.kind === "character" && stamp.language === settings.language && stamp.characterSet === settings.characterSet
      )
      .map((stamp) => stamp.character)
  );
  const uncollectedCharacters = collection.filter((character) => !collectedCharacters.has(character));
  const practicedCharacters = summary.results.map((result) => result.letter).filter((character) => collection.includes(character));
  const practicedCandidates = practicedCharacters.filter((character) => !collectedCharacters.has(character));
  const selectedCharacter = pickRandom(practicedCandidates.length > 0 ? practicedCandidates : uncollectedCharacters);
  if (!selectedCharacter) return { stamp: null, stamps, isNew: false };

  const characterStamp = createCharacterStamp(settings.language, settings.characterSet, selectedCharacter, summary, earnedAt);
  if (!characterStamp) return { stamp: null, stamps, isNew: false };

  const nextCollectedCharacters = new Set([...collectedCharacters, characterStamp.character]);
  const completesCollection = nextCollectedCharacters.size >= collection.length;
  const stampsWithoutCurrentCharacters = stamps.filter(
    (stamp) => !(stamp.kind === "character" && stamp.language === settings.language && stamp.characterSet === settings.characterSet)
  );

  if (completesCollection) {
    const existingCompletion = stamps.find(
      (stamp) =>
        stamp.kind === "collection-complete" && stamp.language === settings.language && stamp.characterSet === settings.characterSet
    );
    const completionStamp: EarnedStamp = {
      kind: "collection-complete",
      id: `${settings.language}:${settings.characterSet}:complete`,
      language: settings.language,
      characterSet: settings.characterSet,
      completedCount: existingCompletion?.kind === "collection-complete" ? existingCompletion.completedCount + 1 : 1,
      earnedAt
    };
    const nextStamps = [
      ...stampsWithoutCurrentCharacters.filter(
        (stamp) =>
          !(stamp.kind === "collection-complete" && stamp.language === settings.language && stamp.characterSet === settings.characterSet)
      ),
      completionStamp
    ];

    try {
      saveStamps(nextStamps);
    } catch {
      return { stamp: completionStamp, stamps, isNew: true };
    }

    return { stamp: completionStamp, stamps: nextStamps, isNew: true };
  }

  const nextStamps = [...stamps, characterStamp];
  try {
    saveStamps(nextStamps);
  } catch {
    return { stamp: characterStamp, stamps, isNew: true };
  }

  return { stamp: characterStamp, stamps: nextStamps, isNew: true };
}
