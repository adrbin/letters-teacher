import { useEffect, useRef } from "react";
import type { Stroke } from "../handwriting/recognizer";

type Props = {
  strokes: Stroke[];
  onChange: (strokes: Stroke[]) => void;
};

export function DrawingCanvas({ strokes, onChange }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const activePointerRef = useRef<number | null>(null);
  const activeTouchRef = useRef<number | null>(null);
  const lastPointerEventAtRef = useRef(0);
  const lastTouchEventAtRef = useRef(0);
  const strokesRef = useRef(strokes);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  const styleContext = (context: CanvasRenderingContext2D) => {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 14;
    context.strokeStyle = "#0f172a";
  };

  const drawSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const context = contextRef.current;
    if (!context) return;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  };

  const drawDot = (point: { x: number; y: number }) => {
    const context = contextRef.current;
    if (!context) return;
    context.beginPath();
    context.arc(point.x, point.y, 7, 0, Math.PI * 2);
    context.fillStyle = "#0f172a";
    context.fill();
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = wrapper.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    context.scale(scale, scale);
    context.clearRect(0, 0, rect.width, rect.height);
    styleContext(context);
    contextRef.current = context;

    for (const stroke of strokes) {
      if (stroke.length === 0) continue;
      if (stroke.length === 1) {
        drawDot(stroke[0]);
        continue;
      }
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      for (const point of stroke.slice(1)) {
        context.lineTo(point.x, point.y);
      }
      context.stroke();
    }
  }, [strokes]);

  const getPoint = (event: MouseEvent | PointerEvent | Touch) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return null;
    const rect = wrapper.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const addPoint = (event: MouseEvent | PointerEvent | Touch) => {
    const point = getPoint(event);
    if (!point) return;
    const next = [...strokesRef.current];
    const current = next[next.length - 1] ?? [];
    const previous = current[current.length - 1];
    next[next.length - 1] = [...current, point];
    strokesRef.current = next;
    if (previous) {
      drawSegment(previous, point);
    } else {
      drawDot(point);
    }
  };

  const startStroke = (point: { x: number; y: number } | null) => {
    const next = [...strokesRef.current, point ? [point] : []];
    strokesRef.current = next;
    if (point) drawDot(point);
  };

  const commitStrokes = () => {
    onChange(strokesRef.current);
  };

  const stopDrawing = (commit = true) => {
    const wasDrawing = drawingRef.current;
    drawingRef.current = false;
    activePointerRef.current = null;
    activeTouchRef.current = null;
    if (wasDrawing && commit) commitStrokes();
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const startPointer = (event: PointerEvent) => {
      lastPointerEventAtRef.current = Date.now();
      event.preventDefault();
      drawingRef.current = true;
      activePointerRef.current = event.pointerId;
      wrapper.setPointerCapture?.(event.pointerId);
      startStroke(getPoint(event));
    };

    const movePointer = (event: PointerEvent) => {
      if (!drawingRef.current || activePointerRef.current !== event.pointerId) return;
      lastPointerEventAtRef.current = Date.now();
      event.preventDefault();
      addPoint(event);
    };

    const endPointer = (event: PointerEvent) => {
      if (activePointerRef.current !== event.pointerId) return;
      lastPointerEventAtRef.current = Date.now();
      event.preventDefault();
      if (wrapper.hasPointerCapture?.(event.pointerId)) {
        wrapper.releasePointerCapture?.(event.pointerId);
      }
      stopDrawing();
    };

    const startMouse = (event: MouseEvent) => {
      if (Date.now() - lastPointerEventAtRef.current < 700 || Date.now() - lastTouchEventAtRef.current < 700) return;
      event.preventDefault();
      drawingRef.current = true;
      startStroke(getPoint(event));
    };

    const moveMouse = (event: MouseEvent) => {
      if (Date.now() - lastPointerEventAtRef.current < 700 || Date.now() - lastTouchEventAtRef.current < 700 || !drawingRef.current) return;
      event.preventDefault();
      addPoint(event);
    };

    const startTouch = (event: TouchEvent) => {
      if (Date.now() - lastPointerEventAtRef.current < 700) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      lastTouchEventAtRef.current = Date.now();
      event.preventDefault();
      drawingRef.current = true;
      activeTouchRef.current = touch.identifier;
      startStroke(getPoint(touch));
    };

    const moveTouch = (event: TouchEvent) => {
      if (Date.now() - lastPointerEventAtRef.current < 700 || !drawingRef.current) return;
      const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouchRef.current) ?? event.changedTouches[0];
      if (!touch) return;
      lastTouchEventAtRef.current = Date.now();
      event.preventDefault();
      addPoint(touch);
    };
    const stopAndCommit = () => stopDrawing();

    wrapper.addEventListener("pointerdown", startPointer);
    document.addEventListener("pointermove", movePointer);
    document.addEventListener("pointerup", endPointer);
    document.addEventListener("pointercancel", endPointer);
    wrapper.addEventListener("mousedown", startMouse);
    document.addEventListener("mousemove", moveMouse);
    document.addEventListener("mouseup", stopAndCommit);
    wrapper.addEventListener("touchstart", startTouch, { passive: false });
    document.addEventListener("touchmove", moveTouch, { passive: false });
    document.addEventListener("touchend", stopAndCommit);
    document.addEventListener("touchcancel", stopAndCommit);

    return () => {
      wrapper.removeEventListener("pointerdown", startPointer);
      document.removeEventListener("pointermove", movePointer);
      document.removeEventListener("pointerup", endPointer);
      document.removeEventListener("pointercancel", endPointer);
      wrapper.removeEventListener("mousedown", startMouse);
      document.removeEventListener("mousemove", moveMouse);
      document.removeEventListener("mouseup", stopAndCommit);
      wrapper.removeEventListener("touchstart", startTouch);
      document.removeEventListener("touchmove", moveTouch);
      document.removeEventListener("touchend", stopAndCommit);
      document.removeEventListener("touchcancel", stopAndCommit);
      stopDrawing(false);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="mx-auto h-72 w-full max-w-2xl touch-none rounded-3xl border-4 border-dashed border-sky-300 bg-white shadow-inner"
      role="img"
      aria-label="Drawing area"
      tabIndex={0}
      data-stroke-count={strokes.length}
      data-point-count={strokes.reduce((total, stroke) => total + stroke.length, 0)}
    >
      <canvas ref={canvasRef} className="pointer-events-none h-full w-full rounded-[1.25rem]" aria-hidden="true" />
    </div>
  );
}
