import type { CharacterSet, GameMode, LanguageCode } from "./types";

type Copy = {
  appName: string;
  headline: Record<CharacterSet, string>;
  language: string;
  questions: string;
  characterSetTabs: Record<CharacterSet, string>;
  chooseGame: string;
  start: string;
  back: string;
  score: string;
  ready: string;
  pointPrefix: string;
  playCharacterSound: Record<CharacterSet, string>;
  pickCharacterYouHear: Record<CharacterSet, string>;
  drawCharacter: Record<CharacterSet, string>;
  clear: string;
  check: string;
  pickMatchingSound: string;
  chooseThisSound: string;
  sayThisCharacter: Record<CharacterSet, string>;
  stopRecording: string;
  startRecording: string;
  chooseAnotherGame: string;
  speechRecognitionUnavailable: string;
  speechRecognitionTryAgain: string;
  speechSynthesisUnavailable: string;
  heard: string;
  greatWork: string;
  accuracy: string;
  strongCharacters: Record<CharacterSet, string>;
  practiceAgain: string;
  playAgain: string;
  stamp: string;
  stampCollection: string;
  newStamp: string;
  noStampsYet: string;
  decreaseQuestionCount: string;
  increaseQuestionCount: string;
  chooseCharacter: Record<CharacterSet, (character: string) => string>;
  playSound: (number: number) => string;
  characterExample: Record<CharacterSet, (character: string, word?: string) => string>;
  stampCharacterLabel: Record<CharacterSet, (character: string, word?: string) => string>;
  collectionCompleteLabel: Record<CharacterSet, (count: number) => string>;
  collectionCompleteTitle: Record<CharacterSet, string>;
  gameTitles: Record<CharacterSet, Record<GameMode, string>>;
  feedback: Record<string, string>;
};

const copies: Record<LanguageCode, Copy> = {
  en: {
    appName: "Letters Teacher",
    headline: {
      letters: "Play with letters",
      digits: "Play with digits"
    },
    language: "Language",
    questions: "Questions",
    characterSetTabs: {
      letters: "Letters",
      digits: "Digits"
    },
    chooseGame: "Choose a game",
    start: "Start",
    back: "Back",
    score: "Score",
    ready: "Ready!",
    pointPrefix: "+",
    playCharacterSound: {
      letters: "Play letter sound",
      digits: "Play digit sound"
    },
    pickCharacterYouHear: {
      letters: "Pick the letter you hear",
      digits: "Pick the digit you hear"
    },
    drawCharacter: {
      letters: "Draw the letter",
      digits: "Draw the digit"
    },
    clear: "Clear",
    check: "Check",
    pickMatchingSound: "Pick the matching sound",
    chooseThisSound: "Choose this sound",
    sayThisCharacter: {
      letters: "Say this letter",
      digits: "Say this digit"
    },
    stopRecording: "Stop recording",
    startRecording: "Start recording",
    chooseAnotherGame: "Choose another game",
    speechRecognitionUnavailable: "Speech recognition is not available in this browser.",
    speechRecognitionTryAgain: "I could not hear that. Try again.",
    speechSynthesisUnavailable: "Speech is not available in this browser.",
    heard: "Heard",
    greatWork: "Great work!",
    accuracy: "Accuracy",
    strongCharacters: {
      letters: "Strong letters",
      digits: "Strong digits"
    },
    practiceAgain: "Practice again",
    playAgain: "Play again",
    stamp: "stamp",
    stampCollection: "Stamp collection",
    newStamp: "New stamp!",
    noStampsYet: "Win a game to collect stamps.",
    decreaseQuestionCount: "Decrease question count",
    increaseQuestionCount: "Increase question count",
    chooseCharacter: {
      letters: (letter) => `Choose ${letter}`,
      digits: (digit) => `Choose digit ${digit}`
    },
    playSound: (number) => `Play sound ${number}`,
    characterExample: {
      letters: (letter, word) => `${letter} as in ${word}`,
      digits: (digit) => `Digit ${digit}`
    },
    stampCharacterLabel: {
      letters: (letter, word) => `${letter} as in ${word}`,
      digits: (digit) => `Digit ${digit}`
    },
    collectionCompleteLabel: {
      letters: (count) => `Completed alphabet stamp x${count}`,
      digits: (count) => `Completed digits stamp x${count}`
    },
    collectionCompleteTitle: {
      letters: "Alphabet complete",
      digits: "Digits complete"
    },
    gameTitles: {
      letters: {
        "hear-pick": "Hear letter, pick card",
        "hear-write": "Hear letter, write it",
        "see-pick-sound": "See letter, pick sound",
        "see-say": "See letter, say it"
      },
      digits: {
        "hear-pick": "Hear digit, pick card",
        "hear-write": "Hear digit, write it",
        "see-pick-sound": "See digit, pick sound",
        "see-say": "See digit, say it"
      }
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
    headline: {
      letters: "Baw się literami",
      digits: "Baw się cyframi"
    },
    language: "Język",
    questions: "Pytania",
    characterSetTabs: {
      letters: "Litery",
      digits: "Cyfry"
    },
    chooseGame: "Wybierz grę",
    start: "Start",
    back: "Wróć",
    score: "Punkty",
    ready: "Gotowe!",
    pointPrefix: "+",
    playCharacterSound: {
      letters: "Odtwórz dźwięk litery",
      digits: "Odtwórz dźwięk cyfry"
    },
    pickCharacterYouHear: {
      letters: "Wybierz literę, którą słyszysz",
      digits: "Wybierz cyfrę, którą słyszysz"
    },
    drawCharacter: {
      letters: "Narysuj literę",
      digits: "Narysuj cyfrę"
    },
    clear: "Wyczyść",
    check: "Sprawdź",
    pickMatchingSound: "Wybierz pasujący dźwięk",
    chooseThisSound: "Wybierz ten dźwięk",
    sayThisCharacter: {
      letters: "Powiedz tę literę",
      digits: "Powiedz tę cyfrę"
    },
    stopRecording: "Zatrzymaj nagrywanie",
    startRecording: "Zacznij nagrywanie",
    chooseAnotherGame: "Wybierz inną grę",
    speechRecognitionUnavailable: "Rozpoznawanie mowy nie jest dostępne w tej przeglądarce.",
    speechRecognitionTryAgain: "Nie udało mi się usłyszeć. Spróbuj jeszcze raz.",
    speechSynthesisUnavailable: "Odtwarzanie mowy nie jest dostępne w tej przeglądarce.",
    heard: "Usłyszano",
    greatWork: "Świetna robota!",
    accuracy: "Dokładność",
    strongCharacters: {
      letters: "Mocne litery",
      digits: "Mocne cyfry"
    },
    practiceAgain: "Poćwicz ponownie",
    playAgain: "Zagraj ponownie",
    stamp: "stempel",
    stampCollection: "Kolekcja stempli",
    newStamp: "Nowy stempel!",
    noStampsYet: "Wygraj grę, aby zdobyć stemple.",
    decreaseQuestionCount: "Zmniejsz liczbę pytań",
    increaseQuestionCount: "Zwiększ liczbę pytań",
    chooseCharacter: {
      letters: (letter) => `Wybierz ${letter}`,
      digits: (digit) => `Wybierz cyfrę ${digit}`
    },
    playSound: (number) => `Odtwórz dźwięk ${number}`,
    characterExample: {
      letters: (letter, word) => `${letter} jak ${word}`,
      digits: (digit) => `Cyfra ${digit}`
    },
    stampCharacterLabel: {
      letters: (letter, word) => `${letter} jak ${word}`,
      digits: (digit) => `Cyfra ${digit}`
    },
    collectionCompleteLabel: {
      letters: (count) => `Ukończony alfabet stempel x${count}`,
      digits: (count) => `Ukończone cyfry stempel x${count}`
    },
    collectionCompleteTitle: {
      letters: "Ukończony alfabet",
      digits: "Ukończone cyfry"
    },
    gameTitles: {
      letters: {
        "hear-pick": "Usłysz literę, wybierz kartę",
        "hear-write": "Usłysz literę, napisz ją",
        "see-pick-sound": "Zobacz literę, wybierz dźwięk",
        "see-say": "Zobacz literę, powiedz ją"
      },
      digits: {
        "hear-pick": "Usłysz cyfrę, wybierz kartę",
        "hear-write": "Usłysz cyfrę, napisz ją",
        "see-pick-sound": "Zobacz cyfrę, wybierz dźwięk",
        "see-say": "Zobacz cyfrę, powiedz ją"
      }
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
