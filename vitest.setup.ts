import "@testing-library/jest-dom/vitest";

function createMemoryStorage(): Storage {
  let store: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] ?? null,
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    }
  };
}

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: createMemoryStorage()
});

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => ({
    arc: () => undefined,
    beginPath: () => undefined,
    clearRect: () => undefined,
    fill: () => undefined,
    lineTo: () => undefined,
    moveTo: () => undefined,
    scale: () => undefined,
    stroke: () => undefined,
    set fillStyle(_: string) {},
    set lineCap(_: string) {},
    set lineJoin(_: string) {},
    set lineWidth(_: number) {},
    set strokeStyle(_: string) {}
  })
});
