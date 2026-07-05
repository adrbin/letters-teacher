import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { getLetters } from "./data/letters";
import { generateQuestions } from "./game/questionGenerator";
import { saveStamp } from "./game/stamps";

const cancelSpeechMock = vi.fn();
const getVoicesMock = vi.fn(() => [
  { lang: "pl-PL", name: "Polish", default: false, localService: true, voiceURI: "pl" },
  { lang: "en-US", name: "English", default: true, localService: true, voiceURI: "en" }
] as SpeechSynthesisVoice[]);
const speakMock = vi.fn();

type MockSpeechRecognitionEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };

class WorkingSpeechRecognition {
  static instances: WorkingSpeechRecognition[] = [];

  lang = "";
  interimResults = false;
  maxAlternatives = 1;
  onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
  onerror: ((event?: { error?: string }) => void) | null = null;
  onend: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn(() => {
    this.onend?.();
  });
  abort = vi.fn(() => {
    this.onend?.();
  });

  constructor() {
    WorkingSpeechRecognition.instances.push(this);
  }
}

function prepareCanvas(canvas: HTMLElement) {
  Object.defineProperty(canvas, "getBoundingClientRect", {
    configurable: true,
    value: () => ({ left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200, x: 0, y: 0, toJSON: () => ({}) })
  });
  Object.defineProperty(canvas, "setPointerCapture", { configurable: true, value: vi.fn() });
  Object.defineProperty(canvas, "hasPointerCapture", { configurable: true, value: () => true });
  Object.defineProperty(canvas, "releasePointerCapture", { configurable: true, value: vi.fn() });
}

function pointerEvent(type: string, init: { clientX?: number; clientY?: number; pointerId?: number }) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: init.clientX ?? 0 },
    clientY: { value: init.clientY ?? 0 },
    pointerId: { value: init.pointerId ?? 1 }
  });
  return event;
}

function drawStroke(canvas: HTMLElement, points: Array<{ x: number; y: number }>) {
  const [first, ...rest] = points;
  fireEvent(canvas, pointerEvent("pointerdown", { clientX: first.x, clientY: first.y, pointerId: 1 }));
  for (const point of rest) {
    fireEvent(canvas, pointerEvent("pointermove", { clientX: point.x, clientY: point.y, pointerId: 1 }));
  }
  fireEvent(canvas, pointerEvent("pointerup", { pointerId: 1 }));
}

async function continueAfterCorrectAnswer(user: ReturnType<typeof userEvent.setup>, isFinalQuestion = false) {
  await user.click(screen.getByRole("button", { name: isFinalQuestion ? /pokaż wyniki/i : /następne pytanie/i }));
}

async function chooseSpellingTiles(user: ReturnType<typeof userEvent.setup>, word: string) {
  for (const letter of Array.from(word)) {
    const availableTile = screen
      .getAllByRole("button", { name: new RegExp(`^add ${letter}`, "i") })
      .find((button) => !(button as HTMLButtonElement).disabled);

    expect(availableTile).toBeTruthy();
    await user.click(availableTile!);
  }
}

async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /ustawienia|settings/i }));
}

async function closeSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /gotowe|done/i }));
}

Object.defineProperty(window, "speechSynthesis", {
  configurable: true,
  value: {
    cancel: cancelSpeechMock,
    getVoices: getVoicesMock,
    speak: speakMock
  }
});

class MockSpeechSynthesisUtterance {
  lang = "";
  pitch = 1;
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onerror: (() => void) | null = null;

  constructor(public text: string) {}
}

Object.defineProperty(window, "SpeechSynthesisUtterance", {
  configurable: true,
  value: MockSpeechSynthesisUtterance
});
Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
  configurable: true,
  value: MockSpeechSynthesisUtterance
});

describe("App", () => {
  beforeEach(() => {
    cancelSpeechMock.mockClear();
    getVoicesMock.mockClear();
    speakMock.mockClear();
    window.localStorage.clear();
    WorkingSpeechRecognition.instances = [];
    vi.spyOn(Date, "now").mockReturnValue(1000);
    vi.spyOn(Math, "random").mockReturnValue(0.00289);
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: undefined });
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts on a child-friendly home screen with setup controls moved to settings", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("button", { name: /^start$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ustawienia/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/język/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();

    await openSettings(user);

    expect(screen.getByRole("heading", { name: /ustawienia/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/język/i)).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("uses decorative SVG icons without changing button accessible names", () => {
    render(<App />);

    const settingsButton = screen.getByRole("button", { name: /ustawienia/i });

    expect(settingsButton).toHaveTextContent("Ustawienia");
    expect(settingsButton.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("reads UI action labels aloud when the setting is enabled", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);

    const utterance = speakMock.mock.calls.at(-1)?.[0] as SpeechSynthesisUtterance;
    expect(utterance.text).toBe("Ustawienia");
    expect(utterance.lang).toBe("pl-PL");
  });

  it("does not read the Start action over the first question prompt", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));

    await waitFor(() => expect(speakMock).toHaveBeenCalled());
    const spokenTexts = speakMock.mock.calls.map(([utterance]) => (utterance as SpeechSynthesisUtterance).text);

    expect(spokenTexts).not.toContain("Start");
  });

  it("does not read UI action labels aloud when the setting is disabled", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /czytaj przyciski/i }));
    speakMock.mockClear();

    await closeSettings(user);

    expect(speakMock).not.toHaveBeenCalled();
  });

  it("updates setup settings and starts a game", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("heading", { name: /draw the letter/i })).toBeInTheDocument();
  });

  it("keeps a child on the same question after a wrong card", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    const progress = screen.getByText("1 / 10");
    const cards = screen.getAllByRole("button", { name: /wybierz/i });
    await user.click(cards[0]);

    expect(progress).toBeInTheDocument();
  });

  it("shows success feedback with a letter image after a correct card", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("pl", "letters", 10, "session-1000-0.00289")[0].target;
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: `Wybierz ${target.display}` }));

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(screen.getByText("Wspaniale!")).toBeInTheDocument();
    expect(screen.getByText(`${target.display} jak ${target.example!.word.toLocaleUpperCase("pl-PL")}`)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: target.example!.alt })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /wybierz/i })).not.toBeInTheDocument();

    await continueAfterCorrectAnswer(user);

    expect(screen.getByText("2 / 10")).toBeInTheDocument();
  });

  it("previews a sound before submitting it on the see letter screen", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /zobacz literę, wybierz dźwięk/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    const progress = screen.getByText("1 / 10");
    await user.click(screen.getByRole("button", { name: /odtwórz dźwięk 1/i }));

    expect(progress).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /wybierz ten dźwięk/i })).toBeEnabled();
  });

  it("shows letter images in see-letter games", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("pl", "letters", 10, "session-1000-0.00289")[0].target;
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /zobacz literę, wybierz dźwięk/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("img", { name: target.example!.alt })).toBeInTheDocument();
  });

  it("translates setup UI when the language changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: /baw się literami/i })).toBeInTheDocument();

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await closeSettings(user);

    expect(screen.getByRole("heading", { name: /play with letters/i })).toBeInTheDocument();
  });

  it("switches to digit games and clamps question count to ten", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    const questionCount = screen.getByRole("spinbutton") as HTMLInputElement;
    await user.clear(questionCount);
    await user.type(questionCount, "30");

    await user.click(screen.getByRole("tab", { name: /cyfry/i }));

    expect(questionCount).toHaveValue(10);
    expect(questionCount).toHaveAttribute("max", "10");
    expect(screen.getByText(/baw się cyframi/i)).toBeInTheDocument();

    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("heading", { name: /wybierz cyfrę/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /wybierz cyfrę/i })).toHaveLength(4);
  });

  it("switches to word games and clamps question count to the word list", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("en", "words", 36, "session-1000-0.00289")[0].target;
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");

    await user.click(screen.getByRole("tab", { name: /words/i }));

    const questionCount = screen.getByRole("spinbutton") as HTMLInputElement;
    await user.clear(questionCount);
    await user.type(questionCount, "50");

    expect(questionCount).toHaveValue(36);
    expect(questionCount).toHaveAttribute("max", "36");
    expect(screen.getByText(/play with words/i)).toBeInTheDocument();

    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("heading", { name: /pick the word you hear/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /choose word/i })).toHaveLength(4);
    expect(screen.getByRole("button", { name: `Choose word ${target.display.toLocaleUpperCase("en-US")}` })).toBeInTheDocument();
  });

  it("uses lowercase letter cards when small letters are selected", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("pl", "letters", 10, "session-1000-0.00289")[0].target;
    const displayTarget = target.display.toLocaleLowerCase("pl-PL");
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /małe litery/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("button", { name: `Wybierz ${displayTarget}` })).toBeInTheDocument();
  });

  it("uses lowercase word cards when small letters are selected", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("en", "words", 10, "session-1000-0.00289")[0].target;
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("tab", { name: /words/i }));
    await user.click(screen.getByRole("button", { name: /small letters/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("button", { name: `Choose word ${target.display}` })).toBeInTheDocument();
  });

  it("starts each digit game with digit-specific labels", async () => {
    const user = userEvent.setup();
    const games = [
      { gameName: /usłysz cyfrę, wybierz kartę/i, heading: /wybierz cyfrę/i },
      { gameName: /usłysz cyfrę, napisz ją/i, heading: /narysuj cyfrę/i },
      { gameName: /zobacz cyfrę, wybierz dźwięk/i, heading: /wybierz pasujący dźwięk/i },
      { gameName: /zobacz cyfrę, powiedz ją/i, heading: /powiedz tę cyfrę/i }
    ];

    for (const { gameName, heading } of games) {
      const { unmount } = render(<App />);
      await openSettings(user);
      await user.click(screen.getByRole("tab", { name: /cyfry/i }));
      await user.click(screen.getByRole("button", { name: gameName }));
      await closeSettings(user);
      await user.click(screen.getByRole("button", { name: /^start$/i }));

      expect(screen.getByText(/\d \/ 10/)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
      unmount();
    }
  });

  it("starts each word game with word-specific labels", async () => {
    const user = userEvent.setup();
    const games = [
      { gameName: /hear word, pick card/i, heading: /pick the word you hear/i },
      { gameName: /hear word, spell it/i, heading: /spell the word/i },
      { gameName: /see word, pick sound/i, heading: /pick the matching sound/i },
      { gameName: /see word, say it/i, heading: /say this word/i }
    ];

    for (const { gameName, heading } of games) {
      const { unmount } = render(<App />);
      await openSettings(user);
      await user.selectOptions(screen.getByLabelText(/język|language/i), "en");
      await user.click(screen.getByRole("tab", { name: /words/i }));
      await user.click(screen.getByRole("button", { name: gameName }));
      await closeSettings(user);
      await user.click(screen.getByRole("button", { name: /^start$/i }));

      expect(screen.getByText(/\d \/ 10/)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
      unmount();
    }
  });

  it("shows previously earned stamps on home", () => {
    saveStamp(
      { language: "pl", characterSet: "letters", gameMode: "hear-pick" },
      {
        totalScore: 95,
        maxScore: 100,
        accuracy: 95,
        strongLetters: [],
        practiceLetters: [],
        results: [{ letter: "A", attempts: 1, awardedPoints: 1, maxPoints: 1, correct: true }]
      },
      "2026-06-10T10:00:00.000Z"
    );

    render(<App />);

    expect(screen.getByLabelText(/a jak auto stempel/i)).toBeInTheDocument();
  });

  it("shows previously earned digit stamps on the digit tab", async () => {
    const user = userEvent.setup();
    saveStamp(
      { language: "pl", characterSet: "digits", gameMode: "hear-pick" },
      {
        totalScore: 95,
        maxScore: 100,
        accuracy: 95,
        strongLetters: [],
        practiceLetters: [],
        results: [{ letter: "4", attempts: 1, awardedPoints: 1, maxPoints: 1, correct: true }]
      },
      "2026-06-10T10:00:00.000Z"
    );

    render(<App />);

    expect(screen.queryByLabelText(/cyfra 4 stempel/i)).not.toBeInTheDocument();

    await openSettings(user);
    await user.click(screen.getByRole("tab", { name: /cyfry/i }));
    await closeSettings(user);

    expect(screen.getByLabelText(/cyfra 4 stempel/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /cztery gwiazdki/i })).toBeInTheDocument();
  });

  it("shows previously earned word stamps on the words tab", async () => {
    const user = userEvent.setup();
    saveStamp(
      { language: "en", characterSet: "words", gameMode: "hear-pick" },
      {
        totalScore: 95,
        maxScore: 100,
        accuracy: 95,
        strongLetters: [],
        practiceLetters: [],
        results: [{ letter: "mom", attempts: 1, awardedPoints: 1, maxPoints: 1, correct: true }]
      },
      "2026-06-10T10:00:00.000Z"
    );

    render(<App />);
    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");

    expect(screen.queryByLabelText(/word mom stamp/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /words/i }));
    await closeSettings(user);

    expect(screen.getByLabelText(/word mom stamp/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /mom/i })).toBeInTheDocument();
  });

  it("awards a new stamp on the results screen", async () => {
    const user = userEvent.setup();
    const questions = generateQuestions("pl", "letters", 3, "session-1000-0.00289");
    render(<App />);

    await openSettings(user);
    for (let count = 0; count < 7; count += 1) {
      await user.click(screen.getByRole("button", { name: /zmniejsz liczbę pytań/i }));
    }
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    for (const [index, question] of questions.entries()) {
      await user.click(screen.getByRole("button", { name: `Wybierz ${question.target.display}` }));
      await continueAfterCorrectAnswer(user, index === questions.length - 1);
    }

    expect(screen.getByText(/nowy stempel/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(new RegExp(`${questions[0].target.display} jak ${questions[0].target.example!.word} stempel`, "i"))).toHaveLength(2);
  });

  it("shows a completed alphabet stamp when the last missing letter is earned", async () => {
    const user = userEvent.setup();
    const questions = generateQuestions("pl", "letters", 3, "session-1000-0.00289");
    const missingLetter = questions[0].target.display;

    for (const letter of getLetters("pl").map((item) => item.display).filter((letter) => letter !== missingLetter)) {
      saveStamp(
        { language: "pl", characterSet: "letters", gameMode: "hear-pick" },
        {
          totalScore: 95,
          maxScore: 100,
          accuracy: 95,
          strongLetters: [],
          practiceLetters: [],
          results: [{ letter, attempts: 1, awardedPoints: 1, maxPoints: 1, correct: true }]
        },
        "2026-06-10T10:00:00.000Z"
      );
    }

    render(<App />);

    await openSettings(user);
    for (let count = 0; count < 7; count += 1) {
      await user.click(screen.getByRole("button", { name: /zmniejsz liczbę pytań/i }));
    }
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    for (const [index, question] of questions.entries()) {
      await user.click(screen.getByRole("button", { name: `Wybierz ${question.target.display}` }));
      await continueAfterCorrectAnswer(user, index === questions.length - 1);
    }

    expect(screen.getByText(/nowy stempel/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/ukończony alfabet stempel x1/i)).toHaveLength(2);
  });

  it("clamps English quizzes to the available letter count", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    const questionCount = screen.getByRole("spinbutton") as HTMLInputElement;
    await user.clear(questionCount);
    await user.type(questionCount, "30");

    expect(questionCount).toHaveValue(30);

    await user.selectOptions(screen.getByLabelText(/język/i), "en");

    expect(questionCount).toHaveValue(26);
    expect(questionCount).toHaveAttribute("max", "26");

    await user.click(screen.getByRole("button", { name: /increase question count/i }));

    expect(questionCount).toHaveValue(26);
  });

  it("uses a locale-matched voice and speakable letter text", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /odtwórz dźwięk litery/i }));

    const utterance = speakMock.mock.calls.at(-1)?.[0] as SpeechSynthesisUtterance;
    expect(utterance.lang).toBe("pl-PL");
    expect(utterance.voice?.lang).toBe("pl-PL");
    expect(utterance.text).not.toMatch(/^[A-ZĄĆĘŁŃÓŚŹŻ]$/);
  });

  it("accepts a correct target drawing on the write screen", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    const canvas = screen.getByRole("img", { name: /drawing area/i });
    prepareCanvas(canvas);
    drawStroke(canvas, [
      { x: 10, y: 8 },
      { x: 28, y: 92 },
      { x: 50, y: 50 },
      { x: 72, y: 92 },
      { x: 90, y: 8 }
    ]);

    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /drawing area/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next question/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next question/i }));

    expect(screen.getByText("2 / 10")).toBeInTheDocument();
  });

  it("keeps the current write question after an incorrect drawing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    const canvas = screen.getByRole("img", { name: /drawing area/i });
    prepareCanvas(canvas);
    drawStroke(canvas, [
      { x: 24, y: 8 },
      { x: 24, y: 92 },
      { x: 84, y: 92 }
    ]);

    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
  });

  it("accepts a correctly spelled word with letter tiles", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("en", "words", 10, "session-1000-0.00289")[0].target;
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język|language/i), "en");
    await user.click(screen.getByRole("tab", { name: /words/i }));
    await user.click(screen.getByRole("button", { name: /hear word, spell it/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    await chooseSpellingTiles(user, target.display.toLocaleUpperCase("en-US"));
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(screen.getByText("Wonderful!")).toBeInTheDocument();
    expect(screen.getByText(`Word: ${target.display.toLocaleUpperCase("en-US")}`)).toBeInTheDocument();
  });

  it("accepts a lowercase spelled word with letter tiles", async () => {
    const user = userEvent.setup();
    const target = generateQuestions("en", "words", 10, "session-1000-0.00289")[0].target;
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język|language/i), "en");
    await user.click(screen.getByRole("tab", { name: /words/i }));
    await user.click(screen.getByRole("button", { name: /small letters/i }));
    await user.click(screen.getByRole("button", { name: /hear word, spell it/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    await chooseSpellingTiles(user, target.display);
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(screen.getByText("Wonderful!")).toBeInTheDocument();
    expect(screen.getByText(`Word: ${target.display}`)).toBeInTheDocument();
  });

  it("keeps duplicate spelling tiles independent", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.selectOptions(screen.getByLabelText(/język|language/i), "en");
    await user.click(screen.getByRole("tab", { name: /words/i }));
    await user.click(screen.getByRole("button", { name: /hear word, spell it/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    await chooseSpellingTiles(user, "MOM");

    expect(screen.getByText("MOM")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^add m/i }).filter((button) => (button as HTMLButtonElement).disabled)).toHaveLength(2);
  });

  it("shows unavailable guidance when exposed speech recognition fails at runtime", async () => {
    class BrokenSpeechRecognition {
      lang = "";
      interimResults = false;
      maxAlternatives = 1;
      onresult = null;
      onerror = null;
      onend = null;
      start = vi.fn(() => {
        throw new Error("network");
      });
      stop = vi.fn();
    }

    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: BrokenSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    expect(await screen.findByText(/rozpoznawanie mowy nie jest dostępne/i)).toBeInTheDocument();
  });

  it("lets a child stop an active speech recording", async () => {
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: WorkingSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    const startRecordingButton = screen.getByRole("button", { name: /zacznij nagrywanie/i });
    expect(startRecordingButton).toHaveTextContent("Zacznij nagrywanie");

    await user.click(startRecordingButton);

    const stopRecordingButton = screen.getByRole("button", { name: /zatrzymaj nagrywanie/i });
    expect(stopRecordingButton).toBeInTheDocument();
    expect(stopRecordingButton).toHaveTextContent("Zatrzymaj nagrywanie");

    await user.click(stopRecordingButton);

    expect(WorkingSpeechRecognition.instances[0].stop).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /zacznij nagrywanie/i })).toHaveTextContent("Zacznij nagrywanie");
  });

  it("cleans up speech recognition when a spoken answer shows success feedback", async () => {
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: WorkingSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    await act(async () => {
      WorkingSpeechRecognition.instances[0].onresult?.({ results: [[{ transcript: "ty" }]] });
    });

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(screen.getByText("Wspaniale!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /zacznij nagrywanie/i })).not.toBeInTheDocument();
    expect(WorkingSpeechRecognition.instances[0].abort).toHaveBeenCalledTimes(1);

    await continueAfterCorrectAnswer(user);

    expect(screen.getByText("2 / 10")).toBeInTheDocument();
  });

  it("keeps speech recognition retryable after temporary no-speech errors", async () => {
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: WorkingSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await openSettings(user);
    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await closeSettings(user);
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    await act(async () => {
      WorkingSpeechRecognition.instances[0].onerror?.({ error: "no-speech" });
    });

    expect(screen.getByRole("button", { name: /zacznij nagrywanie/i })).toBeInTheDocument();
    expect(screen.queryByText(/rozpoznawanie mowy nie jest dostępne/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    expect(WorkingSpeechRecognition.instances).toHaveLength(2);
  });
});
