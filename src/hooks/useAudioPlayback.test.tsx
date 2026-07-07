import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAudioPlayback } from "./useAudioPlayback";

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

class MockAudio {
  static instances: MockAudio[] = [];
  static playResults: Array<Promise<void>> = [];

  currentTime = 0;
  preload = "";
  pause = vi.fn();
  play = vi.fn(() => MockAudio.playResults.shift() ?? Promise.resolve());

  constructor(public src = "") {
    MockAudio.instances.push(this);
  }
}

describe("useAudioPlayback", () => {
  const originalWindowAudio = window.Audio;
  const originalGlobalAudio = globalThis.Audio;

  beforeEach(() => {
    MockAudio.instances = [];
    MockAudio.playResults = [];
    Object.defineProperty(window, "Audio", { configurable: true, value: MockAudio });
    Object.defineProperty(globalThis, "Audio", { configurable: true, value: MockAudio });
  });

  afterEach(() => {
    Object.defineProperty(window, "Audio", { configurable: true, value: originalWindowAudio });
    Object.defineProperty(globalThis, "Audio", { configurable: true, value: originalGlobalAudio });
    vi.restoreAllMocks();
  });

  it("ignores play rejections from interrupted stale audio", async () => {
    const stalePlayback = deferred<void>();
    const latestPlayback = deferred<void>();
    MockAudio.playResults = [stalePlayback.promise, latestPlayback.promise];
    const { result } = renderHook(() => useAudioPlayback());

    act(() => {
      expect(result.current.speakText("Nauczyciel liter. Baw się literami", "pl")).toBe(true);
    });
    act(() => {
      expect(result.current.speakText("Wspaniale!", "pl")).toBe(true);
    });

    expect(MockAudio.instances).toHaveLength(2);
    expect(MockAudio.instances[0].pause).toHaveBeenCalledTimes(1);

    await act(async () => {
      stalePlayback.reject(new Error("interrupted by newer audio"));
      await stalePlayback.promise.catch(() => undefined);
    });

    expect(result.current.error).toBe("");

    await act(async () => {
      latestPlayback.reject(new Error("blocked"));
      await latestPlayback.promise.catch(() => undefined);
    });

    expect(result.current.error).toBe("Odtwarzanie dźwięku nie jest dostępne w tej przeglądarce.");
  });
});
