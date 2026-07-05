import type { LetterItem } from "../types";

type Props = {
  letter: LetterItem;
  compact?: boolean;
  showCaption?: boolean;
};

const warmIds = new Set(["fruit-red", "orange", "lemon", "sun", "cake", "gift", "count-star", "count-flower", "family-mom", "family-dad", "hat", "cup", "pig", "hen", "fox", "cow", "ant", "bee", "wasp", "egg", "ear", "hand", "shoe", "sock", "duck", "bird", "book", "star", "juice", "cheese", "rice", "salt", "bear", "mouse", "blanket"]);
const coolIds = new Set(["water", "rain", "ice", "screen", "xray", "count-empty", "bed", "foot", "leg"]);
const greenIds = new Set(["leaf", "tree", "frog", "mountain", "hive", "count-leaf", "forest"]);
const vehicleIds = new Set(["vehicle", "boat", "bus"]);

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

function PersonShape({ kind }: { kind: "mom" | "dad" }) {
  const hair = kind === "mom" ? "#78350f" : "#92400e";
  const shirt = kind === "mom" ? "#f472b6" : "#60a5fa";

  return (
    <>
      <circle cx="64" cy="48" r="25" fill="#fed7aa" />
      <path d={kind === "mom" ? "M38 48 Q42 20 64 22 Q86 20 90 48 Q80 34 64 34 Q48 34 38 48 Z" : "M40 42 Q64 18 88 42 Q76 32 64 32 Q52 32 40 42 Z"} fill={hair} />
      <circle cx="55" cy="48" r="4" fill="#172554" />
      <circle cx="73" cy="48" r="4" fill="#172554" />
      <path d="M54 62 Q64 70 74 62" fill="none" stroke="#172554" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 108 Q36 76 64 76 Q92 76 98 108 Z" fill={shirt} />
      <path d="M42 86 Q64 98 86 86" fill="none" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function BusShape() {
  return (
    <>
      <rect x="22" y="40" width="84" height="48" rx="12" fill="#facc15" />
      <rect x="32" y="50" width="18" height="16" rx="4" fill="#dbeafe" />
      <rect x="56" y="50" width="18" height="16" rx="4" fill="#dbeafe" />
      <rect x="80" y="50" width="16" height="16" rx="4" fill="#dbeafe" />
      <circle cx="42" cy="90" r="9" fill="#172554" />
      <circle cx="86" cy="90" r="9" fill="#172554" />
    </>
  );
}

function BedShape() {
  return (
    <>
      <rect x="24" y="54" width="80" height="38" rx="8" fill="#60a5fa" />
      <rect x="28" y="42" width="28" height="22" rx="8" fill="#f8fafc" />
      <path d="M24 76 H104" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 92 V104 M98 92 V104" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
    </>
  );
}

function HatShape() {
  return (
    <>
      <path d="M38 70 Q42 34 64 34 Q86 34 90 70 Z" fill="#f472b6" />
      <path d="M24 74 Q64 90 104 74" fill="none" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" />
      <circle cx="64" cy="30" r="8" fill="#facc15" />
    </>
  );
}

function CupShape() {
  return (
    <>
      <path d="M42 42 H82 L76 96 H48 Z" fill="#38bdf8" />
      <path d="M82 54 H94 Q104 62 96 76 Q90 84 78 78" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" />
      <path d="M48 54 H76" stroke="#e0f2fe" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function SimpleAnimalShape({ kind }: { kind: "pig" | "fox" | "cow" | "mouse" | "bear" }) {
  const fill = kind === "pig" ? "#f9a8d4" : kind === "fox" ? "#fb923c" : kind === "cow" ? "#f8fafc" : kind === "mouse" ? "#94a3b8" : "#a16207";
  const ear = kind === "fox" ? "#fb923c" : fill;

  return (
    <>
      <circle cx="64" cy="64" r="32" fill={fill} stroke={kind === "cow" ? "#172554" : "none"} strokeWidth="4" />
      <circle cx="42" cy="38" r="13" fill={ear} />
      <circle cx="86" cy="38" r="13" fill={ear} />
      {kind === "fox" && <path d="M44 42 L30 20 L58 34 M84 42 L98 20 L70 34" fill="#fb923c" />}
      {kind === "cow" && (
        <>
          <path d="M46 54 Q54 42 64 54 Q56 64 46 54 Z" fill="#172554" />
          <path d="M75 70 Q86 62 92 76 Q82 84 75 70 Z" fill="#172554" />
        </>
      )}
      <circle cx="53" cy="58" r="5" fill="#172554" />
      <circle cx="75" cy="58" r="5" fill="#172554" />
      <ellipse cx="64" cy="72" rx={kind === "pig" ? 13 : 10} ry="8" fill={kind === "pig" ? "#fb7185" : "#fff7ed"} />
      <path d="M54 84 Q64 92 74 84" fill="none" stroke="#172554" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

function InsectShape({ kind }: { kind: "ant" | "bee" | "wasp" }) {
  if (kind === "ant") {
    return (
      <>
        <circle cx="44" cy="66" r="13" fill="#78350f" />
        <circle cx="66" cy="66" r="15" fill="#92400e" />
        <circle cx="90" cy="66" r="18" fill="#78350f" />
        <path d="M48 78 L36 96 M66 82 L66 102 M84 80 L98 98 M48 54 L36 36 M66 50 L66 30 M84 54 L98 36" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <ellipse cx="52" cy="54" rx="18" ry="12" fill="#dbeafe" opacity="0.9" transform="rotate(-28 52 54)" />
      <ellipse cx="76" cy="54" rx="18" ry="12" fill="#dbeafe" opacity="0.9" transform="rotate(28 76 54)" />
      <ellipse cx="64" cy="70" rx="28" ry="20" fill="#facc15" />
      <path d="M52 54 V86 M66 52 V88 M80 58 V82" stroke={kind === "wasp" ? "#78350f" : "#172554"} strokeWidth="6" />
      <circle cx="48" cy="66" r="4" fill="#172554" />
    </>
  );
}

function EarShape() {
  return (
    <>
      <path d="M70 28 Q42 32 42 66 Q42 96 68 100 Q92 100 92 78 Q92 62 78 58 Q64 54 62 70" fill="#fed7aa" stroke="#fb923c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M64 48 Q78 52 76 66 Q74 80 62 84" fill="none" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function HandShape() {
  return (
    <>
      <path d="M42 64 V36 Q42 28 50 28 Q58 28 58 36 V60 V30 Q58 22 66 22 Q74 22 74 30 V60 V38 Q74 30 82 30 Q90 30 90 38 V70 Q90 98 66 104 Q42 98 36 76 Q32 64 42 64 Z" fill="#fed7aa" stroke="#fb923c" strokeWidth="5" strokeLinejoin="round" />
      <path d="M42 64 Q34 58 30 66 Q28 76 42 86" fill="#fed7aa" stroke="#fb923c" strokeWidth="5" strokeLinejoin="round" />
    </>
  );
}

function FootShape({ kind }: { kind: "foot" | "leg" }) {
  return (
    <>
      {kind === "leg" && <rect x="58" y="26" width="22" height="52" rx="9" fill="#fed7aa" />}
      <path d="M42 76 Q54 56 76 70 Q100 76 100 94 Q80 102 50 98 Q34 94 42 76 Z" fill="#fed7aa" stroke="#fb923c" strokeWidth="5" />
      <circle cx="88" cy="78" r="4" fill="#fb923c" />
      <circle cx="76" cy="74" r="4" fill="#fb923c" />
    </>
  );
}

function ShoeShape({ kind }: { kind: "shoe" | "sock" }) {
  if (kind === "sock") {
    return (
      <>
        <path d="M48 26 H78 V74 Q92 74 98 88 Q82 100 54 96 Q42 92 48 76 Z" fill="#f472b6" />
        <path d="M50 44 H76" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <path d="M30 80 Q46 58 72 72 Q92 76 104 92 Q80 102 42 98 Q28 94 30 80 Z" fill="#60a5fa" />
      <path d="M44 76 H78" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 70 L60 82 M64 70 L74 82" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

function SmallBirdShape({ kind }: { kind: "duck" | "bird" | "hen" }) {
  const body = kind === "duck" ? "#facc15" : kind === "hen" ? "#f8fafc" : "#38bdf8";

  return (
    <>
      <ellipse cx="66" cy="72" rx="34" ry="23" fill={body} />
      <circle cx="46" cy="50" r="18" fill={body} />
      <path d="M30 50 L16 44 L30 38 Z" fill="#fb923c" />
      {kind === "hen" && <path d="M38 34 Q46 20 54 34" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />}
      {kind === "bird" && <path d="M66 72 Q78 54 92 72" fill="none" stroke="#0ea5e9" strokeWidth="7" strokeLinecap="round" />}
      <circle cx="42" cy="46" r="4" fill="#172554" />
      <path d="M54 94 L48 104 M76 94 L82 104" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function BookShape() {
  return (
    <>
      <path d="M28 34 H60 Q68 34 68 42 V98 Q62 90 50 90 H28 Z" fill="#60a5fa" />
      <path d="M100 34 H76 Q68 34 68 42 V98 Q74 90 86 90 H100 Z" fill="#f472b6" />
      <path d="M68 42 V100" stroke="#172554" strokeWidth="5" strokeLinecap="round" />
      <path d="M36 52 H56 M80 52 H94" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function StarShape() {
  return <path d="M64 22 L75 50 L106 52 L82 71 L90 102 L64 84 L38 102 L46 71 L22 52 L53 50 Z" fill="#facc15" stroke="#fb923c" strokeWidth="5" strokeLinejoin="round" />;
}

function FoodShape({ kind }: { kind: "juice" | "cheese" | "rice" | "salt" }) {
  if (kind === "cheese") {
    return (
      <>
        <path d="M30 78 L96 42 V96 H30 Z" fill="#facc15" stroke="#fb923c" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="72" cy="76" r="7" fill="#fff7ed" />
        <circle cx="90" cy="88" r="5" fill="#fff7ed" />
      </>
    );
  }

  if (kind === "rice") {
    return (
      <>
        <path d="M30 68 H98 L88 100 H40 Z" fill="#38bdf8" />
        <path d="M38 66 Q64 38 90 66" fill="#f8fafc" />
        <circle cx="54" cy="64" r="4" fill="#cbd5e1" />
        <circle cx="68" cy="58" r="4" fill="#cbd5e1" />
        <circle cx="78" cy="66" r="4" fill="#cbd5e1" />
      </>
    );
  }

  if (kind === "salt") {
    return (
      <>
        <rect x="48" y="38" width="32" height="62" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="5" />
        <rect x="50" y="26" width="28" height="18" rx="6" fill="#94a3b8" />
        <circle cx="58" cy="34" r="2" fill="#172554" />
        <circle cx="66" cy="34" r="2" fill="#172554" />
        <circle cx="64" cy="72" r="8" fill="#e0f2fe" />
      </>
    );
  }

  return (
    <>
      <rect x="42" y="34" width="44" height="70" rx="10" fill="#fb923c" />
      <path d="M50 50 H78 V88 H50 Z" fill="#facc15" />
      <path d="M58 32 L72 18" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function BlanketShape() {
  return (
    <>
      <rect x="30" y="36" width="68" height="68" rx="12" fill="#f472b6" />
      <path d="M30 58 H98 M52 36 V104 M76 36 V104" stroke="#facc15" strokeWidth="6" />
      <path d="M36 98 Q42 108 48 98 Q54 108 60 98 Q66 108 72 98 Q78 108 84 98 Q90 108 96 98" fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function ExampleShape({ imageId }: { imageId: string }) {
  if (imageId === "family-mom") return <PersonShape kind="mom" />;
  if (imageId === "family-dad") return <PersonShape kind="dad" />;
  if (imageId === "bus") return <BusShape />;
  if (imageId === "bed") return <BedShape />;
  if (imageId === "hat") return <HatShape />;
  if (imageId === "cup") return <CupShape />;
  if (imageId === "pig" || imageId === "fox" || imageId === "cow" || imageId === "mouse" || imageId === "bear") {
    return <SimpleAnimalShape kind={imageId} />;
  }
  if (imageId === "ant" || imageId === "bee" || imageId === "wasp") return <InsectShape kind={imageId} />;
  if (imageId === "ear") return <EarShape />;
  if (imageId === "hand") return <HandShape />;
  if (imageId === "foot" || imageId === "leg") return <FootShape kind={imageId} />;
  if (imageId === "shoe" || imageId === "sock") return <ShoeShape kind={imageId} />;
  if (imageId === "duck" || imageId === "bird" || imageId === "hen") return <SmallBirdShape kind={imageId} />;
  if (imageId === "book") return <BookShape />;
  if (imageId === "star") return <StarShape />;
  if (imageId === "juice" || imageId === "cheese" || imageId === "rice" || imageId === "salt") return <FoodShape kind={imageId} />;
  if (imageId === "blanket") return <BlanketShape />;
  if (imageId === "forest") {
    return (
      <>
        <PlantShape kind="tree" />
        <g transform="translate(-30 18) scale(0.72)">
          <PlantShape kind="tree" />
        </g>
        <g transform="translate(38 18) scale(0.72)">
          <PlantShape kind="tree" />
        </g>
      </>
    );
  }

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

const digitGridColumns = {
  1: [64],
  2: [44, 84],
  3: [28, 64, 100]
} as const;

const digitGridRows: Record<number, readonly (1 | 2 | 3)[]> = {
  1: [1],
  2: [2],
  3: [3],
  4: [2, 2],
  5: [2, 1, 2],
  6: [3, 3],
  7: [3, 1, 3],
  8: [3, 2, 3],
  9: [3, 3, 3]
};

const digitGridRowY = {
  1: [64],
  2: [44, 84],
  3: [30, 64, 98]
} as const;

const countItemScale = 0.38;

export function getCenteredCountItemTransform(x: number, y: number): string {
  const offset = 64 * countItemScale;
  return `translate(${x - offset} ${y - offset}) scale(${countItemScale})`;
}

export function getDigitGridPositions(count: number): { x: number; y: number }[] {
  const rows = digitGridRows[count];
  if (!rows) return [];

  const rowY = digitGridRowY[rows.length as 1 | 2 | 3];
  return rows.flatMap((columns, rowIndex) =>
    digitGridColumns[columns].map((x) => ({
      x,
      y: rowY[rowIndex]
    }))
  );
}

function CountItem({ imageId, x, y }: { imageId: string; x: number; y: number }) {
  if (imageId === "count-butterfly") {
    return (
      <g transform={getCenteredCountItemTransform(x, y)}>
        <BirdShape kind="butterfly" />
      </g>
    );
  }

  if (imageId === "count-leaf") {
    return (
      <g transform={getCenteredCountItemTransform(x, y)}>
        <PlantShape kind="leaf" />
      </g>
    );
  }

  if (imageId === "count-star") {
    return <path d={`M${x} ${y - 18} L${x + 5} ${y - 6} L${x + 18} ${y - 5} L${x + 8} ${y + 3} L${x + 11} ${y + 16} L${x} ${y + 9} L${x - 11} ${y + 16} L${x - 8} ${y + 3} L${x - 18} ${y - 5} L${x - 5} ${y - 6} Z`} fill="#facc15" stroke="#fb923c" strokeWidth="3" />;
  }

  return (
    <g transform={getCenteredCountItemTransform(x, y)}>
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
      {getDigitGridPositions(count).map((position, index) => (
        <CountItem key={`${position.x}-${position.y}-${index}`} imageId={imageId} x={position.x} y={position.y} />
      ))}
    </>
  );
}

export function LetterImage({ letter, compact = false, showCaption = true }: Props) {
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
        {showCaption && (
          <figcaption className="rounded-full bg-white/85 px-4 py-1 text-lg font-black text-slate-950 shadow-sm">
            {letter.display}
          </figcaption>
        )}
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
      {showCaption && (
        <figcaption className="rounded-full bg-white/85 px-4 py-1 text-lg font-black text-slate-950 shadow-sm">
          {letter.characterSet === "words" ? letter.display : `${letter.display} - ${letter.example.word}`}
        </figcaption>
      )}
    </figure>
  );
}
