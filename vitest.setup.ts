import "@testing-library/jest-dom/vitest";

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
