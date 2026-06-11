import type { LetterItem } from "../types";

type Props = {
  letter: LetterItem;
  compact?: boolean;
};

const warmIds = new Set(["fruit-red", "orange", "lemon", "sun", "cake", "gift"]);
const coolIds = new Set(["water", "rain", "ice", "screen", "xray"]);
const greenIds = new Set(["leaf", "tree", "frog", "mountain", "hive"]);
const vehicleIds = new Set(["vehicle", "boat"]);

function getPalette(imageId: string) {
  if (warmIds.has(imageId)) return { main: "#fb923c", accent: "#facc15", bg: "#ffedd5" };
  if (coolIds.has(imageId)) return { main: "#38bdf8", accent: "#0ea5e9", bg: "#e0f2fe" };
  if (greenIds.has(imageId)) return { main: "#4ade80", accent: "#16a34a", bg: "#dcfce7" };
  if (vehicleIds.has(imageId)) return { main: "#60a5fa", accent: "#1d4ed8", bg: "#dbeafe" };
  return { main: "#f472b6", accent: "#a855f7", bg: "#fae8ff" };
}

function ExampleShape({ imageId }: { imageId: string }) {
  const palette = getPalette(imageId);

  if (imageId === "house" || imageId === "castle") {
    return (
      <>
        <path d="M22 56 L64 22 L106 56 Z" fill={palette.main} />
        <rect x="30" y="56" width="68" height="46" rx="8" fill={palette.accent} />
        <rect x="57" y="74" width="16" height="28" rx="4" fill="#fff7ed" />
      </>
    );
  }

  if (vehicleIds.has(imageId)) {
    return (
      <>
        <rect x="22" y="50" width="84" height="34" rx="12" fill={palette.main} />
        <path d="M42 50 L55 34 H82 L94 50 Z" fill={palette.accent} />
        <circle cx="44" cy="88" r="9" fill="#172554" />
        <circle cx="88" cy="88" r="9" fill="#172554" />
      </>
    );
  }

  if (imageId === "ball" || imageId === "balloon" || imageId === "yarn") {
    return (
      <>
        <circle cx="64" cy="58" r="34" fill={palette.main} />
        <path d="M36 48 Q64 72 92 48" fill="none" stroke="#fff7ed" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 25 Q50 58 64 91" fill="none" stroke={palette.accent} strokeWidth="7" strokeLinecap="round" />
      </>
    );
  }

  if (imageId === "pencil" || imageId === "needle") {
    return (
      <>
        <rect x="28" y="60" width="72" height="18" rx="8" fill={palette.main} transform="rotate(-28 64 69)" />
        <path d="M94 42 L108 36 L104 51 Z" fill="#78350f" />
      </>
    );
  }

  if (imageId === "umbrella" || imageId === "kite") {
    return (
      <>
        <path d="M24 66 Q64 22 104 66 Z" fill={palette.main} />
        <path d="M64 66 V98 Q64 108 54 108" fill="none" stroke={palette.accent} strokeWidth="8" strokeLinecap="round" />
      </>
    );
  }

  if (imageId === "rain" || imageId === "smoke") {
    return (
      <>
        <ellipse cx="52" cy="48" rx="30" ry="20" fill={palette.main} />
        <ellipse cx="78" cy="50" rx="28" ry="22" fill={palette.accent} />
        <path d="M44 76 L36 94 M64 76 L56 98 M84 76 L76 94" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
      </>
    );
  }

  if (["cat", "dog", "horse", "foal", "seal", "goose", "moth", "butterfly", "fish", "crab", "snail", "doll"].includes(imageId)) {
    return (
      <>
        <circle cx="64" cy="58" r="32" fill={palette.main} />
        <circle cx="52" cy="54" r="5" fill="#172554" />
        <circle cx="76" cy="54" r="5" fill="#172554" />
        <path d="M52 72 Q64 82 76 72" fill="none" stroke="#172554" strokeWidth="5" strokeLinecap="round" />
        <circle cx="32" cy="52" r="14" fill={palette.accent} />
        <circle cx="96" cy="52" r="14" fill={palette.accent} />
      </>
    );
  }

  if (["tooth", "egg", "eye", "nose", "moon"].includes(imageId)) {
    return (
      <>
        <ellipse cx="64" cy="60" rx="30" ry="38" fill="#f8fafc" stroke={palette.accent} strokeWidth="7" />
        <circle cx="64" cy="60" r="10" fill={palette.main} />
      </>
    );
  }

  return (
    <>
      <circle cx="64" cy="60" r="34" fill={palette.main} />
      <path d="M64 24 C78 42 94 46 104 60 C88 65 78 80 64 98 C50 80 40 65 24 60 C34 46 50 42 64 24 Z" fill={palette.accent} opacity="0.78" />
      <circle cx="64" cy="60" r="12" fill="#fff7ed" />
    </>
  );
}

export function LetterImage({ letter, compact = false }: Props) {
  const sizeClasses = compact ? "h-28 w-28" : "h-40 w-40 sm:h-48 sm:w-48";

  if (letter.characterSet === "digits") {
    return (
      <figure className="grid justify-items-center gap-2">
        <div
          className={`${sizeClasses} grid place-items-center rounded-[1.75rem] bg-cyan-100 text-center text-7xl font-black leading-none text-cyan-950 shadow-lg ring-4 ring-cyan-300`}
          role="img"
          aria-label={`digit ${letter.display}`}
        >
          {letter.display}
        </div>
        <figcaption className="rounded-full bg-white/85 px-4 py-1 text-lg font-black text-slate-950 shadow-sm">
          {letter.display}
        </figcaption>
      </figure>
    );
  }

  if (!letter.example) return null;

  return (
    <figure className="grid justify-items-center gap-2">
      <svg
        className={`${sizeClasses} drop-shadow-lg`}
        viewBox="0 0 128 128"
        role="img"
        aria-label={letter.example.alt}
      >
        <rect width="128" height="128" rx="28" fill={getPalette(letter.example.imageId).bg} />
        <ExampleShape imageId={letter.example.imageId} />
      </svg>
      <figcaption className="rounded-full bg-white/85 px-4 py-1 text-lg font-black text-slate-950 shadow-sm">
        {letter.display} - {letter.example.word}
      </figcaption>
    </figure>
  );
}
