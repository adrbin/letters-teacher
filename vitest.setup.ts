import "@testing-library/jest-dom/vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => ({
    beginPath: () => undefined,
    clearRect: () => undefined,
    lineTo: () => undefined,
    moveTo: () => undefined,
    scale: () => undefined,
    stroke: () => undefined,
    set lineCap(_: string) {},
    set lineJoin(_: string) {},
    set lineWidth(_: number) {},
    set strokeStyle(_: string) {}
  })
});
