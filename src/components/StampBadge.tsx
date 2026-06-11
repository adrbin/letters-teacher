import { getCopy } from "../i18n";
import type { EarnedStamp, LanguageCode, StampTier } from "../types";

const tierStyles: Record<StampTier, string> = {
  bronze: "bg-orange-100 text-orange-950 ring-orange-300",
  silver: "bg-slate-100 text-slate-950 ring-slate-300",
  gold: "bg-amber-100 text-amber-950 ring-amber-300"
};

const tierMarks: Record<StampTier, string> = {
  bronze: "B",
  silver: "S",
  gold: "G"
};

export function StampBadge({
  stamp,
  language,
  isNew = false
}: {
  stamp: EarnedStamp;
  language: LanguageCode;
  isNew?: boolean;
}) {
  const copy = getCopy(language);
  const label = copy.stampTier(stamp.tier);

  return (
    <div
      className={`stamp-badge ${tierStyles[stamp.tier]} ${isNew ? "stamp-badge-new" : ""} grid min-h-24 place-items-center rounded-full p-4 text-center font-black ring-4`}
      aria-label={`${label} ${copy.stamp}`}
    >
      <span className="text-4xl leading-none">{tierMarks[stamp.tier]}</span>
      <span className="text-sm uppercase">{label}</span>
    </div>
  );
}

export function StampCollection({ stamps, language }: { stamps: EarnedStamp[]; language: LanguageCode }) {
  const copy = getCopy(language);

  return (
    <section className="rounded-3xl bg-white/75 p-4 ring-1 ring-slate-200" aria-label={copy.stampCollection}>
      <h2 className="text-lg font-black text-slate-950">{copy.stampCollection}</h2>
      {stamps.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {stamps.map((stamp) => (
            <StampBadge key={stamp.id} stamp={stamp} language={language} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-base font-bold text-slate-600">{copy.noStampsYet}</p>
      )}
    </section>
  );
}
