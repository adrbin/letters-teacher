export type LanguageCode = "en" | "pl";

export type GameMode = "hear-pick" | "hear-write" | "see-pick-sound" | "see-say";

export type LetterItem = {
  display: string;
  speechText: string;
  aliases: string[];
  language: LanguageCode;
  example?: {
    word: string;
    imageId: string;
    alt: string;
  };
};

export type SessionSettings = {
  language: LanguageCode;
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

export type LetterStamp = {
  kind: "letter";
  id: string;
  language: LanguageCode;
  letter: string;
  word: string;
  imageId: string;
  alt: string;
  earnedAt: string;
  score: number;
  maxScore: number;
};

export type AlphabetCompleteStamp = {
  kind: "alphabet-complete";
  id: string;
  language: LanguageCode;
  completedCount: number;
  earnedAt: string;
};

export type EarnedStamp = LetterStamp | AlphabetCompleteStamp;
