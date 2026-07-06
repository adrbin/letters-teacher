import type { CharacterSet, GameMode, LanguageCode, LetterCase } from "./types";

type Copy = {
  appName: string;
  headline: Record<CharacterSet, string>;
  language: string;
  questions: string;
  questionCountSummary: (count: number) => string;
  letterCase: string;
  letterCaseOptions: Record<LetterCase, string>;
  characterSetTabs: Record<CharacterSet, string>;
  choosePractice: string;
  chooseGame: string;
  settings: string;
  done: string;
  start: string;
  back: string;
  score: string;
  ready: string;
  pointPrefix: string;
  readUiActionsAloud: string;
  readUiActionsOn: string;
  readUiActionsOff: string;
  playSoundAction: string;
  playCharacterSound: Record<CharacterSet, string>;
  pickCharacterYouHear: Record<CharacterSet, string>;
  drawCharacter: Record<CharacterSet, string>;
  clear: string;
  check: string;
  undo: string;
  pickMatchingSound: string;
  chooseThisSound: string;
  sayThisCharacter: Record<CharacterSet, string>;
  stopRecording: string;
  startRecording: string;
  chooseAnotherGame: string;
  nextQuestion: string;
  showResults: string;
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
  addSpellingTile: (letter: string, position: number) => string;
  removeSpellingTile: (letter: string, position: number) => string;
  spelledWord: string;
  playSound: (number: number) => string;
  characterExample: Record<CharacterSet, (character: string, word?: string) => string>;
  stampCharacterLabel: Record<CharacterSet, (character: string, word?: string) => string>;
  collectionCompleteLabel: Record<CharacterSet, (count: number) => string>;
  collectionCompleteTitle: Record<CharacterSet, string>;
  gameTitles: Record<CharacterSet, Record<GameMode, string>>;
  gameShortTitles: Record<CharacterSet, Record<GameMode, string>>;
  feedback: Record<string, string>;
};

const copies: Record<LanguageCode, Copy> = {
  en: {
    appName: "Letters Teacher",
    headline: {
      letters: "Play with letters",
      digits: "Play with digits",
      words: "Play with words"
    },
    language: "Language",
    questions: "Questions",
    questionCountSummary: (count) => `${count} questions`,
    letterCase: "Letter case",
    letterCaseOptions: {
      uppercase: "Capital letters",
      lowercase: "Small letters"
    },
    characterSetTabs: {
      letters: "Letters",
      digits: "Digits",
      words: "Words"
    },
    choosePractice: "What to practice?",
    chooseGame: "Choose a game",
    settings: "Settings",
    done: "Done",
    start: "Start",
    back: "Back",
    score: "Score",
    ready: "Ready!",
    pointPrefix: "+",
    readUiActionsAloud: "Read buttons aloud",
    readUiActionsOn: "On",
    readUiActionsOff: "Off",
    playSoundAction: "Play",
    playCharacterSound: {
      letters: "Play letter sound",
      digits: "Play digit sound",
      words: "Play word sound"
    },
    pickCharacterYouHear: {
      letters: "Pick the letter you hear",
      digits: "Pick the digit you hear",
      words: "Pick the word you hear"
    },
    drawCharacter: {
      letters: "Draw the letter",
      digits: "Draw the digit",
      words: "Spell the word"
    },
    clear: "Clear",
    check: "Check",
    undo: "Undo",
    pickMatchingSound: "Pick the matching sound",
    chooseThisSound: "Choose this sound",
    sayThisCharacter: {
      letters: "Say this letter",
      digits: "Say this digit",
      words: "Say this word"
    },
    stopRecording: "Stop recording",
    startRecording: "Start recording",
    chooseAnotherGame: "Choose another game",
    nextQuestion: "Next question",
    showResults: "Show results",
    speechRecognitionUnavailable: "Speech recognition is not available in this browser.",
    speechRecognitionTryAgain: "I could not hear that. Try again.",
    speechSynthesisUnavailable: "Speech is not available in this browser.",
    heard: "Heard",
    greatWork: "Great work!",
    accuracy: "Accuracy",
    strongCharacters: {
      letters: "Strong letters",
      digits: "Strong digits",
      words: "Strong words"
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
      digits: (digit) => `Choose digit ${digit}`,
      words: (word) => `Choose word ${word}`
    },
    addSpellingTile: (letter, position) => `Add ${letter} tile ${position}`,
    removeSpellingTile: (letter, position) => `Remove ${letter} from slot ${position}`,
    spelledWord: "Spelled word",
    playSound: (number) => `Play sound ${number}`,
    characterExample: {
      letters: (letter, word) => `${letter} as in ${word}`,
      digits: (digit) => `Digit ${digit}`,
      words: (word) => `Word: ${word}`
    },
    stampCharacterLabel: {
      letters: (letter, word) => `${letter} as in ${word}`,
      digits: (digit) => `Digit ${digit}`,
      words: (word) => `Word ${word}`
    },
    collectionCompleteLabel: {
      letters: (count) => `Completed alphabet stamp x${count}`,
      digits: (count) => `Completed digits stamp x${count}`,
      words: (count) => `Completed words stamp x${count}`
    },
    collectionCompleteTitle: {
      letters: "Alphabet complete",
      digits: "Digits complete",
      words: "Words complete"
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
      },
      words: {
        "hear-pick": "Hear word, pick card",
        "hear-write": "Hear word, spell it",
        "see-pick-sound": "See word, pick sound",
        "see-say": "See word, say it"
      }
    },
    gameShortTitles: {
      letters: {
        "hear-pick": "Listen and pick",
        "hear-write": "Listen and write",
        "see-pick-sound": "Match sound",
        "see-say": "See and say"
      },
      digits: {
        "hear-pick": "Listen and pick",
        "hear-write": "Listen and write",
        "see-pick-sound": "Match sound",
        "see-say": "See and say"
      },
      words: {
        "hear-pick": "Listen and pick",
        "hear-write": "Listen and spell",
        "see-pick-sound": "Match sound",
        "see-say": "See and say"
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
      digits: "Baw się cyframi",
      words: "Baw się słowami"
    },
    language: "Język",
    questions: "Pytania",
    questionCountSummary: (count) => `${count} pytań`,
    letterCase: "Wielkość liter",
    letterCaseOptions: {
      uppercase: "Wielkie litery",
      lowercase: "Małe litery"
    },
    characterSetTabs: {
      letters: "Litery",
      digits: "Cyfry",
      words: "Słowa"
    },
    choosePractice: "Co ćwiczymy?",
    chooseGame: "Wybierz grę",
    settings: "Ustawienia",
    done: "Gotowe",
    start: "Start",
    back: "Wróć",
    score: "Punkty",
    ready: "Gotowe!",
    pointPrefix: "+",
    readUiActionsAloud: "Czytaj przyciski",
    readUiActionsOn: "Włączone",
    readUiActionsOff: "Wyłączone",
    playSoundAction: "Odtwórz",
    playCharacterSound: {
      letters: "Odtwórz dźwięk litery",
      digits: "Odtwórz dźwięk cyfry",
      words: "Odtwórz dźwięk słowa"
    },
    pickCharacterYouHear: {
      letters: "Wybierz literę, którą słyszysz",
      digits: "Wybierz cyfrę, którą słyszysz",
      words: "Wybierz słowo, które słyszysz"
    },
    drawCharacter: {
      letters: "Narysuj literę",
      digits: "Narysuj cyfrę",
      words: "Ułóż słowo"
    },
    clear: "Wyczyść",
    check: "Sprawdź",
    undo: "Cofnij",
    pickMatchingSound: "Wybierz pasujący dźwięk",
    chooseThisSound: "Wybierz ten dźwięk",
    sayThisCharacter: {
      letters: "Powiedz tę literę",
      digits: "Powiedz tę cyfrę",
      words: "Powiedz to słowo"
    },
    stopRecording: "Zatrzymaj nagrywanie",
    startRecording: "Zacznij nagrywanie",
    chooseAnotherGame: "Wybierz inną grę",
    nextQuestion: "Następne pytanie",
    showResults: "Pokaż wyniki",
    speechRecognitionUnavailable: "Rozpoznawanie mowy nie jest dostępne w tej przeglądarce.",
    speechRecognitionTryAgain: "Nie udało mi się usłyszeć. Spróbuj jeszcze raz.",
    speechSynthesisUnavailable: "Odtwarzanie mowy nie jest dostępne w tej przeglądarce.",
    heard: "Usłyszano",
    greatWork: "Świetna robota!",
    accuracy: "Dokładność",
    strongCharacters: {
      letters: "Mocne litery",
      digits: "Mocne cyfry",
      words: "Mocne słowa"
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
      digits: (digit) => `Wybierz cyfrę ${digit}`,
      words: (word) => `Wybierz słowo ${word}`
    },
    addSpellingTile: (letter, position) => `Dodaj ${letter}, kafelek ${position}`,
    removeSpellingTile: (letter, position) => `Usuń ${letter} z miejsca ${position}`,
    spelledWord: "Ułożone słowo",
    playSound: (number) => `Odtwórz dźwięk ${number}`,
    characterExample: {
      letters: (letter, word) => `${letter} jak ${word}`,
      digits: (digit) => `Cyfra ${digit}`,
      words: (word) => `Słowo: ${word}`
    },
    stampCharacterLabel: {
      letters: (letter, word) => `${letter} jak ${word}`,
      digits: (digit) => `Cyfra ${digit}`,
      words: (word) => `Słowo ${word}`
    },
    collectionCompleteLabel: {
      letters: (count) => `Ukończony alfabet stempel x${count}`,
      digits: (count) => `Ukończone cyfry stempel x${count}`,
      words: (count) => `Ukończone słowa stempel x${count}`
    },
    collectionCompleteTitle: {
      letters: "Ukończony alfabet",
      digits: "Ukończone cyfry",
      words: "Ukończone słowa"
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
      },
      words: {
        "hear-pick": "Usłysz słowo, wybierz kartę",
        "hear-write": "Usłysz słowo, ułóż je",
        "see-pick-sound": "Zobacz słowo, wybierz dźwięk",
        "see-say": "Zobacz słowo, powiedz je"
      }
    },
    gameShortTitles: {
      letters: {
        "hear-pick": "Słuchaj i wybierz",
        "hear-write": "Słuchaj i napisz",
        "see-pick-sound": "Dopasuj dźwięk",
        "see-say": "Zobacz i powiedz"
      },
      digits: {
        "hear-pick": "Słuchaj i wybierz",
        "hear-write": "Słuchaj i napisz",
        "see-pick-sound": "Dopasuj dźwięk",
        "see-say": "Zobacz i powiedz"
      },
      words: {
        "hear-pick": "Słuchaj i wybierz",
        "hear-write": "Słuchaj i ułóż",
        "see-pick-sound": "Dopasuj dźwięk",
        "see-say": "Zobacz i powiedz"
      }
    },
    feedback: {
      "This game is finished.": "Ta gra jest zakończona.",
      "Almost. Try once more.": "Prawie. Spróbuj jeszcze raz.",
      "Wonderful!": "Wspaniale!",
      "You got it!": "Udało się!"
    }
  },
  zh: {
    appName: "字母老师",
    headline: {
      letters: "玩字母",
      digits: "玩数字",
      words: "玩词语"
    },
    language: "语言",
    questions: "题数",
    questionCountSummary: (count) => `${count} 题`,
    letterCase: "字母大小写",
    letterCaseOptions: {
      uppercase: "大写字母",
      lowercase: "小写字母"
    },
    characterSetTabs: {
      letters: "字母",
      digits: "数字",
      words: "词语"
    },
    choosePractice: "练什么？",
    chooseGame: "选游戏",
    settings: "设置",
    done: "完成",
    start: "开始",
    back: "返回",
    score: "分数",
    ready: "准备好！",
    pointPrefix: "+",
    readUiActionsAloud: "读按钮",
    readUiActionsOn: "开",
    readUiActionsOff: "关",
    playSoundAction: "播放",
    playCharacterSound: {
      letters: "播放字母音",
      digits: "播放数字音",
      words: "播放词语音"
    },
    pickCharacterYouHear: {
      letters: "选听到的字母",
      digits: "选听到的数字",
      words: "选听到的词语"
    },
    drawCharacter: {
      letters: "写这个字母",
      digits: "写这个数字",
      words: "拼这个词"
    },
    clear: "清除",
    check: "检查",
    undo: "撤销",
    pickMatchingSound: "选匹配的声音",
    chooseThisSound: "选这个声音",
    sayThisCharacter: {
      letters: "说这个字母",
      digits: "说这个数字",
      words: "说这个词语"
    },
    stopRecording: "停止录音",
    startRecording: "开始录音",
    chooseAnotherGame: "换一个游戏",
    nextQuestion: "下一题",
    showResults: "看结果",
    speechRecognitionUnavailable: "这个浏览器不能语音识别。",
    speechRecognitionTryAgain: "没听清，再试一次。",
    speechSynthesisUnavailable: "这个浏览器不能播放语音。",
    heard: "听到",
    greatWork: "真棒！",
    accuracy: "正确率",
    strongCharacters: {
      letters: "强项字母",
      digits: "强项数字",
      words: "强项词语"
    },
    practiceAgain: "再练习",
    playAgain: "再玩一次",
    stamp: "印章",
    stampCollection: "印章收藏",
    newStamp: "新印章！",
    noStampsYet: "赢一局来收集印章。",
    decreaseQuestionCount: "减少题数",
    increaseQuestionCount: "增加题数",
    chooseCharacter: {
      letters: (letter) => `选择 ${letter}`,
      digits: (digit) => `选择数字 ${digit}`,
      words: (word) => `选择词语 ${word}`
    },
    addSpellingTile: (letter, position) => `添加 ${letter} 第 ${position} 块`,
    removeSpellingTile: (letter, position) => `移除 ${letter} 第 ${position} 格`,
    spelledWord: "拼出的词",
    playSound: (number) => `播放声音 ${number}`,
    characterExample: {
      letters: (letter, word) => `${letter}，例：${word}`,
      digits: (digit) => `数字 ${digit}`,
      words: (word, label) => `词语：${label ?? word}`
    },
    stampCharacterLabel: {
      letters: (letter, word) => `${letter}，例：${word}`,
      digits: (digit) => `数字 ${digit}`,
      words: (word, label) => `词语 ${label ?? word}`
    },
    collectionCompleteLabel: {
      letters: (count) => `完成字母印章 x${count}`,
      digits: (count) => `完成数字印章 x${count}`,
      words: (count) => `完成词语印章 x${count}`
    },
    collectionCompleteTitle: {
      letters: "字母完成",
      digits: "数字完成",
      words: "词语完成"
    },
    gameTitles: {
      letters: {
        "hear-pick": "听字母，选卡片",
        "hear-write": "听字母，写出来",
        "see-pick-sound": "看字母，选声音",
        "see-say": "看字母，说出来"
      },
      digits: {
        "hear-pick": "听数字，选卡片",
        "hear-write": "听数字，写出来",
        "see-pick-sound": "看数字，选声音",
        "see-say": "看数字，说出来"
      },
      words: {
        "hear-pick": "听词语，选卡片",
        "hear-write": "听词语，拼出来",
        "see-pick-sound": "看词语，选声音",
        "see-say": "看词语，说出来"
      }
    },
    gameShortTitles: {
      letters: {
        "hear-pick": "听一听选一选",
        "hear-write": "听一听写一写",
        "see-pick-sound": "配声音",
        "see-say": "看一看说一说"
      },
      digits: {
        "hear-pick": "听一听选一选",
        "hear-write": "听一听写一写",
        "see-pick-sound": "配声音",
        "see-say": "看一看说一说"
      },
      words: {
        "hear-pick": "听一听选一选",
        "hear-write": "听一听拼一拼",
        "see-pick-sound": "配声音",
        "see-say": "看一看说一说"
      }
    },
    feedback: {
      "This game is finished.": "游戏结束了。",
      "Almost. Try once more.": "差一点，再试一次。",
      "Wonderful!": "太棒了！",
      "You got it!": "答对了！"
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
