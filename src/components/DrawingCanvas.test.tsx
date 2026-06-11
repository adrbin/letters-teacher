import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Stroke } from "../handwriting/recognizer";
import { DrawingCanvas } from "./DrawingCanvas";

function pointerEvent(type: string, init: { clientX?: number; clientY?: number; pointerId?: number }) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: init.clientX ?? 0 },
    clientY: { value: init.clientY ?? 0 },
    pointerId: { value: init.pointerId ?? 1 }
  });
  return event;
}

describe("DrawingCanvas", () => {
  it("records the first pointer point synchronously and appends moves", () => {
    const changes: Stroke[][] = [];
    const onChange = vi.fn((next: Stroke[]) => {
      changes.push(next);
    });

    const { rerender } = render(<DrawingCanvas strokes={[]} onChange={onChange} />);
    const canvas = screen.getByRole("img", { name: /drawing area/i });
    Object.defineProperty(canvas, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ left: 10, top: 20, width: 200, height: 200, bottom: 220, right: 210, x: 10, y: 20, toJSON: () => ({}) })
    });
    Object.defineProperty(canvas, "setPointerCapture", { configurable: true, value: vi.fn() });
    Object.defineProperty(canvas, "hasPointerCapture", { configurable: true, value: () => true });
    Object.defineProperty(canvas, "releasePointerCapture", { configurable: true, value: vi.fn() });

    fireEvent(canvas, pointerEvent("pointerdown", { clientX: 30, clientY: 50, pointerId: 1 }));
    expect(changes.at(-1)).toEqual([[{ x: 20, y: 30 }]]);

    fireEvent(canvas, pointerEvent("pointermove", { clientX: 70, clientY: 90, pointerId: 1 }));
    expect(changes.at(-1)).toEqual([
      [
        { x: 20, y: 30 },
        { x: 60, y: 70 }
      ]
    ]);

    fireEvent(document, pointerEvent("pointerup", { pointerId: 1 }));
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(1);
    rerender(<DrawingCanvas strokes={changes.at(-1) ?? []} onChange={onChange} />);
  });
});
