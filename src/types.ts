export type LanguageCode = "en" | "pl";

export type CharacterSet = "letters" | "digits";

export type GameMode = "hear-pick" | "hear-write" | "see-pick-sound" | "see-say";

export type CharacterItem = {
  display: string;
  speechText: string;
  aliases: string[];
  language: LanguageCode;
  characterSet: CharacterSet;
  example?: {
    word: string;
    imageId: string;
    alt: string;
  };
};

export type LetterItem = CharacterItem;

export type SessionSettings = {
  language: LanguageCode;
  characterSet: CharacterSet;
  gameMode: GameMode;
  questionCount: number;
};

export type Question = {
  id: string;
  target: LetterItem;
  options: LetterItem[];
};

export type AttemptResult = {
  correct: boolean;
  awardedPoints: number;
  remainingPoints: number;
  feedback: string;
};

export type LetterResult = {
  letter: string;
  attempts: number;
  awardedPoints: number;
  maxPoints: number;
  correct: boolean;
};

export type SessionSummary = {
  totalScore: number;
  maxScore: number;
  accuracy: number;
  strongLetters: string[];
  practiceLetters: string[];
  results: LetterResult[];
};

export type CharacterStamp = {
  kind: "character";
  id: string;
  language: LanguageCode;
  characterSet: CharacterSet;
  character: string;
  word?: string;
  imageId?: string;
  alt?: string;
  earnedAt: string;
  score: number;
  maxScore: number;
};

export type CollectionCompleteStamp = {
  kind: "collection-complete";
  id: string;
  language: LanguageCode;
  characterSet: CharacterSet;
  completedCount: number;
  earnedAt: string;
};

export type EarnedStamp = CharacterStamp | CollectionCompleteStamp;
