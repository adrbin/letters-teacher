import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("updates setup settings and starts a game", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
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
    expect(screen.getByText(`${target.display} jak ${target.example!.word}`)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: target.example!.alt })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /wybierz/i })).not.toBeInTheDocument();

    await continueAfterCorrectAnswer(user);

    expect(screen.getByText("2 / 10")).toBeInTheDocument();
  });

  it("previews a sound before submitting it on the see letter screen", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /zobacz literę, wybierz dźwięk/i }));
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

    await user.click(screen.getByRole("button", { name: /zobacz literę, wybierz dźwięk/i }));
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("img", { name: target.example!.alt })).toBeInTheDocument();
  });

  it("translates setup UI when the language changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: /baw się literami/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/język/i), "en");

    expect(screen.getByRole("heading", { name: /play with letters/i })).toBeInTheDocument();
  });

  it("switches to digit games and clamps question count to ten", async () => {
    const user = userEvent.setup();
    render(<App />);

    const questionCount = screen.getByRole("spinbutton") as HTMLInputElement;
    await user.clear(questionCount);
    await user.type(questionCount, "30");

    await user.click(screen.getByRole("tab", { name: /cyfry/i }));

    expect(questionCount).toHaveValue(10);
    expect(questionCount).toHaveAttribute("max", "10");
    expect(screen.getByRole("heading", { name: /baw się cyframi/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("heading", { name: /wybierz cyfrę/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /wybierz cyfrę/i })).toHaveLength(4);
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
      await user.click(screen.getByRole("tab", { name: /cyfry/i }));
      await user.click(screen.getByRole("button", { name: gameName }));
      await user.click(screen.getByRole("button", { name: /^start$/i }));

      expect(screen.getByText(/\d \/ 10/)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
      unmount();
    }
  });

  it("shows previously earned stamps on setup", () => {
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

    await user.click(screen.getByRole("tab", { name: /cyfry/i }));

    expect(screen.getByLabelText(/cyfra 4 stempel/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /cztery gwiazdki/i })).toBeInTheDocument();
  });

  it("awards a new stamp on the results screen", async () => {
    const user = userEvent.setup();
    const questions = generateQuestions("pl", "letters", 3, "session-1000-0.00289");
    render(<App />);

    for (let count = 0; count < 7; count += 1) {
      await user.click(screen.getByRole("button", { name: /zmniejsz liczbę pytań/i }));
    }
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

    for (let count = 0; count < 7; count += 1) {
      await user.click(screen.getByRole("button", { name: /zmniejsz liczbę pytań/i }));
    }
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

    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
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

    await user.selectOptions(screen.getByLabelText(/język/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
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

    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    expect(await screen.findByText(/rozpoznawanie mowy nie jest dostępne/i)).toBeInTheDocument();
  });

  it("lets a child stop an active speech recording", async () => {
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: WorkingSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    expect(screen.getByRole("button", { name: /zatrzymaj nagrywanie/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /zatrzymaj nagrywanie/i }));

    expect(WorkingSpeechRecognition.instances[0].stop).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /zacznij nagrywanie/i })).toBeInTheDocument();
  });

  it("cleans up speech recognition when a spoken answer shows success feedback", async () => {
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: WorkingSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
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

    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
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
