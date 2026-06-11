import type { GameMode, LanguageCode } from "./types";

type Copy = {
  appName: string;
  headline: string;
  language: string;
  questions: string;
  chooseGame: string;
  start: string;
  back: string;
  score: string;
  ready: string;
  pointPrefix: string;
  playLetterSound: string;
  pickLetterYouHear: string;
  drawLetter: string;
  clear: string;
  check: string;
  pickMatchingSound: string;
  chooseThisSound: string;
  sayThisLetter: string;
  stopRecording: string;
  startRecording: string;
  chooseAnotherGame: string;
  speechRecognitionUnavailable: string;
  speechRecognitionTryAgain: string;
  speechSynthesisUnavailable: string;
  heard: string;
  greatWork: string;
  accuracy: string;
  strongLetters: string;
  practiceAgain: string;
  playAgain: string;
  stamp: string;
  stampCollection: string;
  newStamp: string;
  noStampsYet: string;
  decreaseQuestionCount: string;
  increaseQuestionCount: string;
  chooseLetter: (letter: string) => string;
  playSound: (number: number) => string;
  letterExample: (letter: string, word: string) => string;
  stampLetterLabel: (letter: string, word: string) => string;
  alphabetCompleteLabel: (count: number) => string;
  alphabetCompleteTitle: string;
  gameTitles: Record<GameMode, string>;
  feedback: Record<string, string>;
};

const copies: Record<LanguageCode, Copy> = {
  en: {
    appName: "Letters Teacher",
    headline: "Play with letters",
    language: "Language",
    questions: "Questions",
    chooseGame: "Choose a game",
    start: "Start",
    back: "Back",
    score: "Score",
    ready: "Ready!",
    pointPrefix: "+",
    playLetterSound: "Play letter sound",
    pickLetterYouHear: "Pick the letter you hear",
    drawLetter: "Draw the letter",
    clear: "Clear",
    check: "Check",
    pickMatchingSound: "Pick the matching sound",
    chooseThisSound: "Choose this sound",
    sayThisLetter: "Say this letter",
    stopRecording: "Stop recording",
    startRecording: "Start recording",
    chooseAnotherGame: "Choose another game",
    speechRecognitionUnavailable: "Speech recognition is not available in this browser.",
    speechRecognitionTryAgain: "I could not hear that. Try again.",
    speechSynthesisUnavailable: "Speech is not available in this browser.",
    heard: "Heard",
    greatWork: "Great work!",
    accuracy: "Accuracy",
    strongLetters: "Strong letters",
    practiceAgain: "Practice again",
    playAgain: "Play again",
    stamp: "stamp",
    stampCollection: "Stamp collection",
    newStamp: "New stamp!",
    noStampsYet: "Win a game to collect stamps.",
    decreaseQuestionCount: "Decrease question count",
    increaseQuestionCount: "Increase question count",
    chooseLetter: (letter) => `Choose ${letter}`,
    playSound: (number) => `Play sound ${number}`,
    letterExample: (letter, word) => `${letter} as in ${word}`,
    stampLetterLabel: (letter, word) => `${letter} as in ${word}`,
    alphabetCompleteLabel: (count) => `Completed alphabet stamp x${count}`,
    alphabetCompleteTitle: "Alphabet complete",
    gameTitles: {
      "hear-pick": "Hear letter, pick card",
      "hear-write": "Hear letter, write it",
      "see-pick-sound": "See letter, pick sound",
      "see-say": "See letter, say it"
    },
    feedback: {
      "This game is finished.": "This game is finished.",
      "Almost. Try once more.": "Almost. Try once more.",
      "Wonderful!": "Wonderful!",
      "You got it!": "You got it!"
    }
  },
  pl: {
    appName: "Nauczyciel liter",
    headline: "Baw się literami",
    language: "Język",
    questions: "Pytania",
    chooseGame: "Wybierz grę",
    start: "Start",
    back: "Wróć",
    score: "Punkty",
    ready: "Gotowe!",
    pointPrefix: "+",
    playLetterSound: "Odtwórz dźwięk litery",
    pickLetterYouHear: "Wybierz literę, którą słyszysz",
    drawLetter: "Narysuj literę",
    clear: "Wyczyść",
    check: "Sprawdź",
    pickMatchingSound: "Wybierz pasujący dźwięk",
    chooseThisSound: "Wybierz ten dźwięk",
    sayThisLetter: "Powiedz tę literę",
    stopRecording: "Zatrzymaj nagrywanie",
    startRecording: "Zacznij nagrywanie",
    chooseAnotherGame: "Wybierz inną grę",
    speechRecognitionUnavailable: "Rozpoznawanie mowy nie jest dostępne w tej przeglądarce.",
    speechRecognitionTryAgain: "Nie udało mi się usłyszeć. Spróbuj jeszcze raz.",
    speechSynthesisUnavailable: "Odtwarzanie mowy nie jest dostępne w tej przeglądarce.",
    heard: "Usłyszano",
    greatWork: "Świetna robota!",
    accuracy: "Dokładność",
    strongLetters: "Mocne litery",
    practiceAgain: "Poćwicz ponownie",
    playAgain: "Zagraj ponownie",
    stamp: "stempel",
    stampCollection: "Kolekcja stempli",
    newStamp: "Nowy stempel!",
    noStampsYet: "Wygraj grę, aby zdobyć stemple.",
    decreaseQuestionCount: "Zmniejsz liczbę pytań",
    increaseQuestionCount: "Zwiększ liczbę pytań",
    chooseLetter: (letter) => `Wybierz ${letter}`,
    playSound: (number) => `Odtwórz dźwięk ${number}`,
    letterExample: (letter, word) => `${letter} jak ${word}`,
    stampLetterLabel: (letter, word) => `${letter} jak ${word}`,
    alphabetCompleteLabel: (count) => `Ukończony alfabet stempel x${count}`,
    alphabetCompleteTitle: "Ukończony alfabet",
    gameTitles: {
      "hear-pick": "Usłysz literę, wybierz kartę",
      "hear-write": "Usłysz literę, napisz ją",
      "see-pick-sound": "Zobacz literę, wybierz dźwięk",
      "see-say": "Zobacz literę, powiedz ją"
    },
    feedback: {
      "This game is finished.": "Ta gra jest zakończona.",
      "Almost. Try once more.": "Prawie. Spróbuj jeszcze raz.",
      "Wonderful!": "Wspaniale!",
      "You got it!": "Udało się!"
    }
  }
};

export function getCopy(language: LanguageCode): Copy {
  return copies[language];
}

export function translateFeedback(language: LanguageCode, feedback: string): string {
  if (!feedback) return "";
  return copies[language].feedback[feedback] ?? feedback;
}
