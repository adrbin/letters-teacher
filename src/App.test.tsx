import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const cancelSpeechMock = vi.fn();
const getVoicesMock = vi.fn(() => [
  { lang: "pl-PL", name: "Polish", default: false, localService: true, voiceURI: "pl" },
  { lang: "en-US", name: "English", default: true, localService: true, voiceURI: "en" }
] as SpeechSynthesisVoice[]);
const speakMock = vi.fn();

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
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: undefined });
    Object.defineProperty(window, "webkitSpeechRecognition", { configurable: true, value: undefined });
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
});
