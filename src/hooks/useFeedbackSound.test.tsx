import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFeedbackSound } from "./useFeedbackSound";

class MockAudioParam {
  setValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class MockOscillator {
  type: OscillatorType = "sine";
  frequency = new MockAudioParam();
  connect = vi.fn();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
  onended: ((event: Event) => void) | null = null;
}

class MockGain {
  gain = new MockAudioParam();
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockAudioContext {
  static instances: MockAudioContext[] = [];

  currentTime = 1;
  destination = {};
  state: AudioContextState = "running";
  oscillators: MockOscillator[] = [];
  gains: MockGain[] = [];
  close = vi.fn(() => Promise.resolve());
  resume = vi.fn(() => Promise.resolve());
  createOscillator = vi.fn(() => {
    const oscillator = new MockOscillator();
    this.oscillators.push(oscillator);
    return oscillator as unknown as OscillatorNode;
  });
  createGain = vi.fn(() => {
    const gain = new MockGain();
    this.gains.push(gain);
    return gain as unknown as GainNode;
  });

  constructor() {
    MockAudioContext.instances.push(this);
  }
}

describe("useFeedbackSound", () => {
  const originalAudioContext = window.AudioContext;
  const originalWebkitAudioContext = (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  beforeEach(() => {
    MockAudioContext.instances = [];
    Object.defineProperty(window, "AudioContext", { configurable: true, value: MockAudioContext });
    Object.defineProperty(window, "webkitAudioContext", { configurable: true, value: undefined });
  });

  afterEach(() => {
    Object.defineProperty(window, "AudioContext", { configurable: true, value: originalAudioContext });
    Object.defineProperty(window, "webkitAudioContext", { configurable: true, value: originalWebkitAudioContext });
    vi.restoreAllMocks();
  });

  it("reuses one audio context and disconnects finished beep nodes", () => {
    const { result } = renderHook(() => useFeedbackSound());

    act(() => result.current("incorrect"));
    act(() => result.current("correct"));

    expect(MockAudioContext.instances).toHaveLength(1);
    const context = MockAudioContext.instances[0];
    expect(context.createOscillator).toHaveBeenCalledTimes(3);
    expect(context.createGain).toHaveBeenCalledTimes(3);

    for (const oscillator of context.oscillators) {
      expect(oscillator.disconnect).not.toHaveBeenCalled();
      oscillator.onended?.(new Event("ended"));
      expect(oscillator.disconnect).toHaveBeenCalledTimes(1);
    }
    for (const gain of context.gains) {
      expect(gain.disconnect).toHaveBeenCalledTimes(1);
    }
  });

  it("closes the audio context on unmount", () => {
    const { result, unmount } = renderHook(() => useFeedbackSound());

    act(() => result.current("incorrect"));
    const context = MockAudioContext.instances[0];
    unmount();

    expect(context.close).toHaveBeenCalledTimes(1);
  });
});
