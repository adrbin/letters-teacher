import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

type CharacterSetIconProps = Omit<LucideProps, "ref">;

function createGlyphIcon(glyph: string, fontSize: string, textLength: string, displayName: string): LucideIcon {
  const GlyphIcon = forwardRef<SVGSVGElement, CharacterSetIconProps>(function CharacterSetGlyphIcon(
    { color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, children, ...props },
    ref
  ) {
    const resolvedStrokeWidth =
      absoluteStrokeWidth && Number.isFinite(Number(size)) ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={resolvedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <text
          x="12"
          y="12.25"
          fill={color}
          stroke="none"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="ui-rounded, system-ui, sans-serif"
          fontSize={fontSize}
          fontWeight="900"
          textLength={textLength}
          lengthAdjust="spacingAndGlyphs"
        >
          {glyph}
        </text>
        {children}
      </svg>
    );
  });

  GlyphIcon.displayName = displayName;
  return GlyphIcon;
}

export const LettersIcon = createGlyphIcon("ABC", "15.5", "22", "LettersIcon");
export const DigitsIcon = createGlyphIcon("123", "16.5", "22", "DigitsIcon");
