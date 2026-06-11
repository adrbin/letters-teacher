import type { EarnedStamp, GameMode, LanguageCode, SessionSummary, StampTier } from "../types";

const STORAGE_KEY = "letters-teacher:stamps";

const stampThresholds: Array<{ tier: StampTier; minAccuracy: number }> = [
  { tier: "gold", minAccuracy: 95 },
  { tier: "silver", minAccuracy: 80 },
  { tier: "bronze", minAccuracy: 60 }
];

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isStamp(value: unknown): value is EarnedStamp {
  const stamp = value as Partial<EarnedStamp>;
  return (
    typeof stamp?.id === "string" &&
    (stamp.language === "en" || stamp.language === "pl") &&
    typeof stamp.gameMode === "string" &&
    (stamp.tier === "bronze" || stamp.tier === "silver" || stamp.tier === "gold") &&
    typeof stamp.earnedAt === "string" &&
    typeof stamp.score === "number" &&
    typeof stamp.maxScore === "number"
  );
}

export function getStampTier(summary: SessionSummary): StampTier | null {
  return stampThresholds.find((threshold) => summary.accuracy >= threshold.minAccuracy)?.tier ?? null;
}

export function createStampId(language: LanguageCode, gameMode: GameMode, tier: StampTier): string {
  return `${language}:${gameMode}:${tier}`;
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

export function saveStamp(
  settings: { language: LanguageCode; gameMode: GameMode },
  summary: SessionSummary,
  earnedAt = new Date().toISOString()
): { stamp: EarnedStamp | null; stamps: EarnedStamp[]; isNew: boolean } {
  const tier = getStampTier(summary);
  const stamps = loadStamps();
  if (!tier) return { stamp: null, stamps, isNew: false };

  const id = createStampId(settings.language, settings.gameMode, tier);
  const existing = stamps.find((stamp) => stamp.id === id) ?? null;
  if (existing) return { stamp: existing, stamps, isNew: false };

  const stamp: EarnedStamp = {
    id,
    language: settings.language,
    gameMode: settings.gameMode,
    tier,
    earnedAt,
    score: summary.totalScore,
    maxScore: summary.maxScore
  };
  const nextStamps = [...stamps, stamp];
  const storage = getStorage();

  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(nextStamps));
  } catch {
    return { stamp, stamps, isNew: true };
  }

  return { stamp, stamps: nextStamps, isNew: true };
}
