import { generateQuestions } from "./questionGenerator";
import type { AttemptResult, LetterResult, Question, ResultGrade, SessionSettings, SessionSummary } from "../types";
import { normalizeLetterCase } from "./displayCase";

const MAX_POINTS_PER_QUESTION = 10;
const WRONG_ATTEMPT_PENALTY = 3;
const MIN_POINTS_FOR_SUCCESS = 1;

export type SessionState = {
  settings: SessionSettings;
  questions: Question[];
  currentIndex: number;
  score: number;
  results: LetterResult[];
  pendingResult: AttemptResult | null;
  wrongAttempts: string[];
  lastFeedback: string;
  completed: boolean;
};

function createRuntimeSeed(): string {
  return `session-${Date.now()}-${Math.random()}`;
}

export function createSession(settings: SessionSettings, seed?: string): SessionState {
  return {
    settings: { ...settings, letterCase: normalizeLetterCase(settings.letterCase) },
    questions: generateQuestions(settings.language, settings.characterSet, settings.questionCount, seed ?? createRuntimeSeed()),
    currentIndex: 0,
    score: 0,
    results: [],
    pendingResult: null,
    wrongAttempts: [],
    lastFeedback: "",
    completed: false
  };
}

export function remainingPoints(wrongAttemptCount: number): number {
  return Math.max(MIN_POINTS_FOR_SUCCESS, MAX_POINTS_PER_QUESTION - wrongAttemptCount * WRONG_ATTEMPT_PENALTY);
}

export function getResultGrade(accuracy: number): ResultGrade {
  if (accuracy >= 100) return "perfect";
  if (accuracy >= 90) return "almost-perfect";
  if (accuracy >= 70) return "very-good";
  if (accuracy >= 50) return "good";
  return "keep-practicing";
}

export function answerQuestion(state: SessionState, answer: string): { state: SessionState; result: AttemptResult } {
  if (state.completed || state.pendingResult) {
    return {
      state,
      result: {
        correct: false,
        awardedPoints: 0,
        remainingPoints: 0,
        feedback: "This game is finished."
      }
    };
  }

  const question = state.questions[state.currentIndex];
  const correct = answer === question.target.display;
  const availablePoints = remainingPoints(state.wrongAttempts.length);

  if (!correct) {
    const wrongAttempts = [...state.wrongAttempts, answer || "try-again"];
    const nextPoints = remainingPoints(wrongAttempts.length);
    return {
      state: {
        ...state,
        wrongAttempts,
        lastFeedback: "Almost. Try once more."
      },
      result: {
        correct: false,
        awardedPoints: 0,
        remainingPoints: nextPoints,
        feedback: "Almost. Try once more."
      }
    };
  }

  const result: LetterResult = {
    letter: question.target.display,
    attempts: state.wrongAttempts.length + 1,
    awardedPoints: availablePoints,
    maxPoints: MAX_POINTS_PER_QUESTION,
    correct: true
  };
  const results = [...state.results, result];
  const feedback = availablePoints === MAX_POINTS_PER_QUESTION ? "Wonderful!" : "You got it!";
  const attemptResult: AttemptResult = {
    correct: true,
    awardedPoints: availablePoints,
    remainingPoints: availablePoints,
    feedback
  };

  return {
    state: {
      ...state,
      score: state.score + availablePoints,
      results,
      pendingResult: attemptResult,
      lastFeedback: feedback
    },
    result: attemptResult
  };
}

export function advanceQuestion(state: SessionState): SessionState {
  if (state.completed || !state.pendingResult) {
    return state;
  }

  const nextIndex = state.currentIndex + 1;
  const completed = nextIndex >= state.questions.length;

  return {
    ...state,
    currentIndex: completed ? state.currentIndex : nextIndex,
    pendingResult: null,
    wrongAttempts: [],
    lastFeedback: "",
    completed
  };
}

export function summarizeSession(state: SessionState): SessionSummary {
  const totalScore = state.results.reduce((sum, result) => sum + result.awardedPoints, 0);
  const maxScore = state.questions.length * MAX_POINTS_PER_QUESTION;
  const strongLetters = state.results
    .filter((result) => result.awardedPoints >= 7)
    .map((result) => result.letter);
  const practiceLetters = state.results
    .filter((result) => result.awardedPoints < 7 || result.attempts > 1)
    .map((result) => result.letter);

  return {
    totalScore,
    maxScore,
    accuracy: maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100),
    strongLetters: [...new Set(strongLetters)].slice(0, 6),
    practiceLetters: [...new Set(practiceLetters)].slice(0, 6),
    results: state.results
  };
}
