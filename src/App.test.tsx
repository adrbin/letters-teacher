import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

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

  it("translates setup UI when the language changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: /baw się literami/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/język/i), "en");

    expect(screen.getByRole("heading", { name: /play with letters/i })).toBeInTheDocument();
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
      { x: 18, y: 8 },
      { x: 18, y: 92 }
    ]);
    drawStroke(canvas, [
      { x: 82, y: 8 },
      { x: 82, y: 92 }
    ]);
    drawStroke(canvas, [
      { x: 18, y: 50 },
      { x: 82, y: 50 }
    ]);

    await user.click(screen.getByRole("button", { name: /check/i }));

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

  it("cleans up speech recognition when a spoken answer advances the question", async () => {
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: WorkingSpeechRecognition });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /zobacz literę, powiedz ją/i }));
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /zacznij nagrywanie/i }));

    await act(async () => {
      WorkingSpeechRecognition.instances[0].onresult?.({ results: [[{ transcript: "air" }, { transcript: "r" }]] });
    });

    expect(screen.getByText("2 / 10")).toBeInTheDocument();
    expect(WorkingSpeechRecognition.instances[0].abort).toHaveBeenCalledTimes(1);
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
