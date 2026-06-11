import type { LetterItem } from "../types";

type Props = {
  letter: LetterItem;
  compact?: boolean;
};

const warmIds = new Set(["fruit-red", "orange", "lemon", "sun", "cake", "gift", "count-star", "count-flower"]);
const coolIds = new Set(["water", "rain", "ice", "screen", "xray", "count-empty"]);
const greenIds = new Set(["leaf", "tree", "frog", "mountain", "hive", "count-leaf"]);
const vehicleIds = new Set(["vehicle", "boat"]);

function getPalette(imageId: string) {
  if (warmIds.has(imageId)) return { main: "#fb923c", accent: "#facc15", bg: "#ffedd5" };
  if (coolIds.has(imageId)) return { main: "#38bdf8", accent: "#0ea5e9", bg: "#e0f2fe" };
  if (greenIds.has(imageId)) return { main: "#4ade80", accent: "#16a34a", bg: "#dcfce7" };
  if (vehicleIds.has(imageId)) return { main: "#60a5fa", accent: "#1d4ed8", bg: "#dbeafe" };
  return { main: "#f472b6", accent: "#a855f7", bg: "#fae8ff" };
}

function FruitShape({ kind = "apple" }: { kind?: "apple" | "orange" | "lemon" }) {
  const isLemon = kind === "lemon";
  const fill = kind === "apple" ? "#ef4444" : kind === "orange" ? "#fb923c" : "#facc15";
  return (
    <>
      <ellipse cx="64" cy="68" rx={isLemon ? 38 : 32} ry={isLemon ? 24 : 34} fill={fill} transform={isLemon ? "rotate(-16 64 68)" : undefined} />
      <path d="M65 34 Q74 26 84 30 Q78 44 66 43" fill="#16a34a" />
      <path d="M61 42 Q60 34 67 28" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
      {!isLemon && <circle cx="52" cy="58" r="6" fill="#fff7ed" opacity="0.85" />}
    </>
  );
}

function FaceShape({ kind }: { kind: "cat" | "dog" | "horse" | "foal" | "seal" | "frog" | "doll" }) {
  const color = kind === "frog" ? "#4ade80" : kind === "seal" ? "#94a3b8" : kind === "horse" || kind === "foal" ? "#a16207" : "#f472b6";
  const earColor = kind === "dog" ? "#92400e" : kind === "frog" ? "#16a34a" : "#facc15";
  return (
    <>
      {(kind === "cat" || kind === "dog") && (
        <>
          <path d="M38 50 L48 26 L58 51 Z" fill={earColor} />
          <path d="M70 51 L82 26 L92 50 Z" fill={earColor} />
        </>
      )}
      {kind === "frog" && (
        <>
          <circle cx="45" cy="34" r="14" fill={color} />
          <circle cx="83" cy="34" r="14" fill={color} />
        </>
      )}
      {(kind === "horse" || kind === "foal") && <path d="M55 22 Q76 34 76 64 L58 61 Q54 42 55 22" fill="#78350f" />}
      {kind === "seal" && <path d="M34 82 Q22 74 26 58 Q42 68 45 86" fill="#64748b" />}
      {kind === "doll" && <path d="M36 38 Q64 12 92 38 Q84 28 64 28 Q44 28 36 38" fill="#78350f" />}
      <circle cx="64" cy="62" r={kind === "foal" ? 27 : 32} fill={color} />
      <circle cx="52" cy="56" r="5" fill="#172554" />
      <circle cx="76" cy="56" r="5" fill="#172554" />
      <path d="M52 74 Q64 83 76 74" fill="none" stroke="#172554" strokeWidth="5" strokeLinecap="round" />
      {kind === "dog" && <ellipse cx="64" cy="66" rx="9" ry="7" fill="#fff7ed" />}
    </>
  );
}

function FishShape() {
  return (
    <>
      <ellipse cx="58" cy="66" rx="34" ry="22" fill="#fb923c" />
      <path d="M88 66 L108 48 V84 Z" fill="#facc15" />
      <circle cx="46" cy="60" r="4" fill="#172554" />
      <path d="M44 72 Q56 80 68 72" fill="none" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function BirdShape({ kind }: { kind: "goose" | "moth" | "butterfly" }) {
  if (kind === "goose") {
    return (
      <>
        <ellipse cx="66" cy="74" rx="34" ry="22" fill="#f8fafc" stroke="#38bdf8" strokeWidth="5" />
        <circle cx="48" cy="48" r="17" fill="#f8fafc" stroke="#38bdf8" strokeWidth="5" />
        <path d="M32 48 L18 42 L32 37 Z" fill="#fb923c" />
        <circle cx="43" cy="44" r="4" fill="#172554" />
      </>
    );
  }

  return (
    <>
      <ellipse cx="45" cy="58" rx="22" ry="31" fill="#f472b6" transform="rotate(-24 45 58)" />
      <ellipse cx="83" cy="58" rx="22" ry="31" fill="#a855f7" transform="rotate(24 83 58)" />
      <ellipse cx="64" cy="66" rx="9" ry="30" fill="#78350f" />
      <circle cx="64" cy="36" r="8" fill="#78350f" />
      <path d="M58 32 Q48 22 40 28 M70 32 Q80 22 88 28" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      {kind === "moth" && <path d="M45 58 Q64 72 83 58" fill="none" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />}
    </>
  );
}

function PlantShape({ kind }: { kind: "leaf" | "tree" | "flower" }) {
  if (kind === "tree") {
    return (
      <>
        <rect x="57" y="66" width="14" height="32" rx="5" fill="#92400e" />
        <circle cx="64" cy="46" r="28" fill="#4ade80" />
        <circle cx="45" cy="58" r="19" fill="#16a34a" />
        <circle cx="83" cy="58" r="19" fill="#22c55e" />
      </>
    );
  }

  if (kind === "flower") {
    return (
      <>
        <path d="M64 56 V100" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="52" cy="78" rx="14" ry="8" fill="#4ade80" transform="rotate(-25 52 78)" />
        <ellipse cx="64" cy="42" rx="15" ry="23" fill="#f472b6" />
        <ellipse cx="43" cy="56" rx="15" ry="23" fill="#fb7185" transform="rotate(-60 43 56)" />
        <ellipse cx="85" cy="56" rx="15" ry="23" fill="#a855f7" transform="rotate(60 85 56)" />
        <circle cx="64" cy="60" r="12" fill="#facc15" />
      </>
    );
  }

  return (
    <>
      <path d="M30 78 C42 34 84 25 102 44 C86 86 50 102 30 78 Z" fill="#4ade80" />
      <path d="M36 78 Q64 66 96 44" fill="none" stroke="#166534" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function ExampleShape({ imageId }: { imageId: string }) {
  if (imageId === "fruit-red") return <FruitShape />;
  if (imageId === "orange") return <FruitShape kind="orange" />;
  if (imageId === "lemon") return <FruitShape kind="lemon" />;
  if (imageId === "cat" || imageId === "dog" || imageId === "horse" || imageId === "foal" || imageId === "seal" || imageId === "frog" || imageId === "doll") {
    return <FaceShape kind={imageId} />;
  }
  if (imageId === "fish") return <FishShape />;
  if (imageId === "goose" || imageId === "moth" || imageId === "butterfly") return <BirdShape kind={imageId} />;
  if (imageId === "leaf") return <PlantShape kind="leaf" />;
  if (imageId === "tree") return <PlantShape kind="tree" />;

  if (imageId === "house" || imageId === "castle") {
    return (
      <>
        <path d="M22 56 L64 22 L106 56 Z" fill={imageId === "castle" ? "#94a3b8" : "#fb923c"} />
        <rect x="30" y="56" width="68" height="46" rx={imageId === "castle" ? 4 : 8} fill={imageId === "castle" ? "#64748b" : "#facc15"} />
        {imageId === "castle" && (
          <>
            <rect x="34" y="38" width="16" height="22" fill="#64748b" />
            <rect x="78" y="38" width="16" height="22" fill="#64748b" />
          </>
        )}
        <rect x="57" y="74" width="16" height="28" rx="4" fill="#fff7ed" />
      </>
    );
  }

  if (imageId === "vehicle" || imageId === "boat") {
    return imageId === "boat" ? (
      <>
        <path d="M24 70 H104 L92 96 H40 Z" fill="#60a5fa" />
        <path d="M62 28 V70" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <path d="M66 34 L96 66 H66 Z" fill="#facc15" />
        <path d="M62 38 L34 66 H62 Z" fill="#fb923c" />
      </>
    ) : (
      <>
        <rect x="22" y="50" width="84" height="34" rx="12" fill="#60a5fa" />
        <path d="M42 50 L55 34 H82 L94 50 Z" fill="#1d4ed8" />
        <circle cx="44" cy="88" r="9" fill="#172554" />
        <circle cx="88" cy="88" r="9" fill="#172554" />
      </>
    );
  }

  if (imageId === "ball" || imageId === "balloon" || imageId === "yarn") {
    return (
      <>
        <circle cx="64" cy="58" r="34" fill={imageId === "balloon" ? "#f472b6" : "#fb923c"} />
        <path d="M36 48 Q64 72 92 48" fill="none" stroke="#fff7ed" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 25 Q50 58 64 91" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
        {imageId === "balloon" && <path d="M64 92 Q58 108 72 112" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />}
        {imageId === "yarn" && <path d="M34 72 Q70 35 94 78" fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />}
      </>
    );
  }

  if (imageId === "pencil" || imageId === "needle") {
    return (
      <>
        <rect x="28" y="60" width="72" height="18" rx="8" fill={imageId === "needle" ? "#94a3b8" : "#facc15"} transform="rotate(-28 64 69)" />
        <path d="M94 42 L108 36 L104 51 Z" fill="#78350f" />
        {imageId === "needle" && <path d="M33 83 Q47 100 64 86" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />}
      </>
    );
  }

  if (imageId === "umbrella" || imageId === "kite") {
    return (
      <>
        <path d="M24 66 Q64 22 104 66 Z" fill={imageId === "kite" ? "#facc15" : "#fb7185"} />
        {imageId === "kite" ? (
          <>
            <path d="M64 28 L102 66 L64 104 L26 66 Z" fill="#facc15" />
            <path d="M64 28 V104 M26 66 H102" stroke="#fb923c" strokeWidth="5" />
          </>
        ) : (
          <path d="M64 66 V98 Q64 108 54 108" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" />
        )}
      </>
    );
  }

  if (imageId === "rain" || imageId === "smoke") {
    return (
      <>
        <ellipse cx="52" cy="48" rx="30" ry="20" fill={imageId === "smoke" ? "#cbd5e1" : "#38bdf8"} />
        <ellipse cx="78" cy="50" rx="28" ry="22" fill={imageId === "smoke" ? "#94a3b8" : "#0ea5e9"} />
        {imageId === "rain" ? (
          <path d="M44 76 L36 94 M64 76 L56 98 M84 76 L76 94" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
        ) : (
          <path d="M42 78 Q58 66 70 82 T96 82" fill="none" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
        )}
      </>
    );
  }

  if (imageId === "tooth" || imageId === "egg" || imageId === "eye" || imageId === "nose" || imageId === "moon") {
    if (imageId === "moon") return <path d="M80 24 Q48 42 58 78 Q66 104 100 96 Q84 112 58 104 Q24 92 26 58 Q28 28 56 18 Q70 14 80 24 Z" fill="#facc15" />;
    if (imageId === "eye") {
      return (
        <>
          <path d="M22 64 Q64 28 106 64 Q64 100 22 64 Z" fill="#f8fafc" stroke="#38bdf8" strokeWidth="6" />
          <circle cx="64" cy="64" r="16" fill="#0ea5e9" />
          <circle cx="64" cy="64" r="7" fill="#172554" />
        </>
      );
    }
    if (imageId === "nose") {
      return (
        <>
          <path d="M64 28 Q52 58 48 80 Q48 98 66 98 Q86 96 82 78 Q74 54 64 28 Z" fill="#fb923c" />
          <circle cx="58" cy="86" r="4" fill="#78350f" />
          <circle cx="74" cy="86" r="4" fill="#78350f" />
        </>
      );
    }
    return (
      <>
        <ellipse cx="64" cy="60" rx="30" ry="38" fill="#f8fafc" stroke="#38bdf8" strokeWidth="7" />
        {imageId === "tooth" && <path d="M44 72 Q48 108 60 88 Q64 82 70 88 Q82 108 86 72" fill="#f8fafc" stroke="#38bdf8" strokeWidth="6" strokeLinejoin="round" />}
        {imageId === "egg" && <circle cx="64" cy="60" r="10" fill="#facc15" />}
      </>
    );
  }

  if (imageId === "gift") {
    return (
      <>
        <rect x="28" y="52" width="72" height="50" rx="8" fill="#f472b6" />
        <path d="M64 52 V102 M28 70 H100" stroke="#facc15" strokeWidth="8" />
        <path d="M64 48 Q44 28 40 48 Q48 58 64 48 Q84 28 88 48 Q80 58 64 48 Z" fill="#facc15" />
      </>
    );
  }

  if (imageId === "ice") {
    return (
      <>
        <rect x="42" y="30" width="44" height="58" rx="16" fill="#38bdf8" />
        <path d="M56 88 V108" stroke="#92400e" strokeWidth="10" strokeLinecap="round" />
        <path d="M54 44 Q64 54 74 44" fill="none" stroke="#e0f2fe" strokeWidth="6" strokeLinecap="round" />
      </>
    );
  }

  if (imageId === "jar") {
    return (
      <>
        <rect x="42" y="34" width="44" height="68" rx="12" fill="#f8fafc" stroke="#38bdf8" strokeWidth="6" />
        <rect x="48" y="24" width="32" height="16" rx="5" fill="#facc15" />
        <path d="M48 70 Q64 58 80 70 V96 H48 Z" fill="#ef4444" />
      </>
    );
  }

  if (imageId === "crown") {
    return (
      <>
        <path d="M26 84 L34 42 L54 66 L64 34 L76 66 L96 42 L104 84 Z" fill="#facc15" />
        <rect x="30" y="82" width="68" height="14" rx="5" fill="#fb923c" />
      </>
    );
  }

  if (imageId === "sun") {
    return (
      <>
        <circle cx="64" cy="64" r="26" fill="#facc15" />
        <path d="M64 20 V32 M64 96 V108 M20 64 H32 M96 64 H108 M33 33 L42 42 M86 86 L95 95 M95 33 L86 42 M42 86 L33 95" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
      </>
    );
  }

  if (imageId === "water") {
    return <path d="M64 24 C84 52 96 68 96 84 C96 104 82 112 64 112 C46 112 32 104 32 84 C32 68 44 52 64 24 Z" fill="#38bdf8" />;
  }

  if (imageId === "xray" || imageId === "screen") {
    return (
      <>
        <rect x="26" y="30" width="76" height="58" rx="10" fill={imageId === "screen" ? "#172554" : "#0f172a"} />
        {imageId === "screen" ? (
          <circle cx="64" cy="58" r="18" fill="#38bdf8" />
        ) : (
          <path d="M48 46 L80 78 M80 46 L48 78" stroke="#e0f2fe" strokeWidth="9" strokeLinecap="round" />
        )}
        <rect x="54" y="88" width="20" height="12" fill="#64748b" />
      </>
    );
  }

  if (imageId === "zip") {
    return (
      <>
        <path d="M50 24 V80" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
        <path d="M78 24 V80" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
        <path d="M50 24 L78 80 M78 24 L50 80" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
        <rect x="54" y="78" width="20" height="22" rx="5" fill="#fb923c" />
      </>
    );
  }

  if (imageId === "nest") {
    return (
      <>
        <path d="M32 76 Q64 102 96 76 Q88 104 64 104 Q40 104 32 76 Z" fill="#92400e" />
        <path d="M36 78 Q64 58 92 78" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="56" cy="66" rx="11" ry="15" fill="#e0f2fe" />
        <ellipse cx="72" cy="66" rx="11" ry="15" fill="#f8fafc" />
      </>
    );
  }

  if (imageId === "guitar") {
    return (
      <>
        <ellipse cx="54" cy="76" rx="22" ry="26" fill="#fb923c" />
        <ellipse cx="74" cy="60" rx="18" ry="22" fill="#facc15" />
        <rect x="76" y="28" width="12" height="52" rx="5" fill="#78350f" transform="rotate(34 82 54)" />
        <circle cx="62" cy="70" r="8" fill="#78350f" />
      </>
    );
  }

  if (imageId === "hammock") {
    return (
      <>
        <path d="M26 34 V98 M102 34 V98" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        <path d="M30 56 Q64 94 98 56" fill="none" stroke="#f472b6" strokeWidth="12" strokeLinecap="round" />
        <path d="M36 58 Q64 82 92 58" fill="none" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      </>
    );
  }

  if (imageId === "mountain") {
    return (
      <>
        <path d="M18 96 L52 38 L72 70 L88 48 L112 96 Z" fill="#16a34a" />
        <path d="M52 38 L62 56 L44 56 Z" fill="#f8fafc" />
      </>
    );
  }

  if (imageId === "crab") {
    return (
      <>
        <ellipse cx="64" cy="72" rx="30" ry="20" fill="#ef4444" />
        <circle cx="52" cy="58" r="5" fill="#172554" />
        <circle cx="76" cy="58" r="5" fill="#172554" />
        <path d="M34 68 Q18 48 34 38 M94 68 Q110 48 94 38" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
      </>
    );
  }

  if (imageId === "snail") {
    return (
      <>
        <circle cx="54" cy="68" r="27" fill="#f472b6" />
        <path d="M54 68 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0" fill="none" stroke="#a855f7" strokeWidth="6" />
        <path d="M78 80 H104 Q102 56 82 62" fill="#4ade80" />
        <circle cx="96" cy="54" r="4" fill="#172554" />
      </>
    );
  }

  if (imageId === "cake") {
    return (
      <>
        <rect x="30" y="62" width="68" height="34" rx="8" fill="#f472b6" />
        <rect x="38" y="46" width="52" height="20" rx="7" fill="#facc15" />
        <path d="M64 30 V44" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
        <path d="M64 22 Q56 32 64 34 Q72 32 64 22 Z" fill="#fb923c" />
      </>
    );
  }

  if (imageId === "hive") {
    return (
      <>
        <path d="M34 94 Q34 38 64 26 Q94 38 94 94 Z" fill="#facc15" />
        <path d="M40 54 H88 M36 72 H92" stroke="#92400e" strokeWidth="7" strokeLinecap="round" />
        <circle cx="64" cy="84" r="9" fill="#78350f" />
      </>
    );
  }

  return <PlantShape kind="flower" />;
}

const digitPositions = [
  { x: 64, y: 62 },
  { x: 46, y: 48 },
  { x: 82, y: 48 },
  { x: 46, y: 76 },
  { x: 82, y: 76 },
  { x: 28, y: 48 },
  { x: 100, y: 48 },
  { x: 28, y: 78 },
  { x: 100, y: 78 }
];

function CountItem({ imageId, x, y }: { imageId: string; x: number; y: number }) {
  if (imageId === "count-butterfly") {
    return (
      <g transform={`translate(${x - 16} ${y - 16}) scale(0.5)`}>
        <BirdShape kind="butterfly" />
      </g>
    );
  }

  if (imageId === "count-leaf") {
    return (
      <g transform={`translate(${x - 16} ${y - 16}) scale(0.5)`}>
        <PlantShape kind="leaf" />
      </g>
    );
  }

  if (imageId === "count-star") {
    return <path d={`M${x} ${y - 18} L${x + 5} ${y - 6} L${x + 18} ${y - 5} L${x + 8} ${y + 3} L${x + 11} ${y + 16} L${x} ${y + 9} L${x - 11} ${y + 16} L${x - 8} ${y + 3} L${x - 18} ${y - 5} L${x - 5} ${y - 6} Z`} fill="#facc15" stroke="#fb923c" strokeWidth="3" />;
  }

  return (
    <g transform={`translate(${x - 16} ${y - 18}) scale(0.5)`}>
      <PlantShape kind="flower" />
    </g>
  );
}

function DigitShape({ digit, imageId }: { digit: string; imageId: string }) {
  const count = Number.parseInt(digit, 10);
  if (!Number.isFinite(count) || count <= 0 || imageId === "count-empty") {
    return (
      <>
        <path d="M36 62 H92 L84 100 H44 Z" fill="#fb923c" />
        <path d="M44 62 Q64 34 84 62" fill="none" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
        <path d="M48 78 H80" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      {digitPositions.slice(0, count).map((position, index) => (
        <CountItem key={`${position.x}-${position.y}-${index}`} imageId={imageId} x={position.x} y={position.y} />
      ))}
    </>
  );
}

export function LetterImage({ letter, compact = false }: Props) {
  const sizeClasses = compact ? "h-28 w-28" : "h-40 w-40 sm:h-48 sm:w-48";

  if (letter.characterSet === "digits") {
    const imageId = letter.example?.imageId ?? "count-empty";

    return (
      <figure className="grid justify-items-center gap-2">
        <svg
          className={`${sizeClasses} drop-shadow-lg`}
          viewBox="0 0 128 128"
          role="img"
          aria-label={letter.example?.alt ?? `digit ${letter.display}`}
        >
          <rect width="128" height="128" rx="28" fill={getPalette(imageId).bg} />
          <DigitShape digit={letter.display} imageId={imageId} />
        </svg>
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
