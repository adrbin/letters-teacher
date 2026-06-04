import { PointerEvent, useEffect, useRef } from "react";
import type { Stroke } from "../handwriting/recognizer";

type Props = {
  strokes: Stroke[];
  onChange: (strokes: Stroke[]) => void;
};

export function DrawingCanvas({ strokes, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    context.scale(scale, scale);
    context.clearRect(0, 0, rect.width, rect.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 14;
    context.strokeStyle = "#0f172a";

    for (const stroke of strokes) {
      if (stroke.length === 0) continue;
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      for (const point of stroke.slice(1)) {
        context.lineTo(point.x, point.y);
      }
      context.stroke();
    }
  }, [strokes]);

  const addPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const next = [...strokes];
    const current = next[next.length - 1] ?? [];
    next[next.length - 1] = [...current, point];
    onChange(next);
  };

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto h-72 w-full max-w-2xl touch-none rounded-3xl border-4 border-dashed border-sky-300 bg-white shadow-inner"
      role="img"
      aria-label="Drawing area"
      tabIndex={0}
      onPointerDown={(event) => {
        drawingRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        onChange([...strokes, []]);
        window.requestAnimationFrame(() => addPoint(event));
      }}
      onPointerMove={(event) => {
        if (drawingRef.current) addPoint(event);
      }}
      onPointerUp={() => {
        drawingRef.current = false;
      }}
      onPointerCancel={() => {
        drawingRef.current = false;
      }}
    />
  );
}
