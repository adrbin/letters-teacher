import type { ReactNode } from "react";
import { getCopy } from "../i18n";
import { createStampLetterItem, getStampAriaLabel, getStampSpeechLabel } from "../game/stampSpeech";
import type { EarnedStamp, LanguageCode } from "../types";
import { LetterImage } from "./LetterImage";

type StampSpeakHandler = (label: string, language: LanguageCode) => void;

function StampFrame({
  className,
  ariaLabel,
  speechLabel,
  language,
  onSpeakLabel,
  children
}: {
  className: string;
  ariaLabel: string;
  speechLabel: string;
  language: LanguageCode;
  onSpeakLabel?: StampSpeakHandler;
  children: ReactNode;
}) {
  if (!onSpeakLabel) {
    return (
      <div className={className} aria-label={ariaLabel}>
        {children}
      </div>
    );
  }

  return (
    <button className={className} type="button" aria-label={ariaLabel} onClick={() => onSpeakLabel(speechLabel, language)}>
      {children}
    </button>
  );
}

function StampBadge({
  stamp,
  language,
  isNew = false,
  onSpeakLabel
}: {
  stamp: EarnedStamp;
  language: LanguageCode;
  isNew?: boolean;
  onSpeakLabel?: StampSpeakHandler;
}) {
  const copy = getCopy(language);
  const speechLabel = getStampSpeechLabel(stamp, language);
  const ariaLabel = getStampAriaLabel(stamp, language);

  if (stamp.kind === "collection-complete") {
    return (
      <StampFrame
        className={`stamp-badge ${isNew ? "stamp-badge-new" : ""} grid min-h-32 min-w-32 place-items-center rounded-3xl bg-emerald-100 p-4 text-center font-black text-emerald-950 ring-4 ring-emerald-300`}
        ariaLabel={ariaLabel}
        speechLabel={speechLabel}
        language={language}
        onSpeakLabel={onSpeakLabel}
      >
        <span className="text-4xl leading-none">
          {stamp.characterSet === "digits" ? "123" : stamp.characterSet === "words" ? (stamp.language === "zh" ? "词语" : "WORD") : "ABC"}
        </span>
        <span className="text-sm uppercase">{copy.collectionCompleteTitle[stamp.characterSet]}</span>
        <span className="rounded-full bg-white/80 px-3 py-1 text-lg">x{stamp.completedCount}</span>
      </StampFrame>
    );
  }

  const letter = createStampLetterItem(stamp, language);
  if (!letter) return null;

  return (
    <StampFrame
      className={`stamp-badge ${isNew ? "stamp-badge-new" : ""} rounded-3xl bg-white p-3 text-center font-black text-slate-950 shadow-sm ring-4 ring-amber-200`}
      ariaLabel={ariaLabel}
      speechLabel={speechLabel}
      language={language}
      onSpeakLabel={onSpeakLabel}
    >
      <LetterImage letter={letter} compact />
    </StampFrame>
  );
}

export function StampCollection({ stamps, language, onSpeakLabel }: { stamps: EarnedStamp[]; language: LanguageCode; onSpeakLabel?: StampSpeakHandler }) {
  const copy = getCopy(language);
  const sortedStamps = [...stamps].sort((first, second) => {
    if (first.kind === second.kind) return first.id.localeCompare(second.id);
    return first.kind === "collection-complete" ? -1 : 1;
  });

  return (
    <section className="rounded-3xl bg-white/75 p-4 ring-1 ring-slate-200" aria-label={copy.stampCollection}>
      <h2 className="text-lg font-black text-slate-950">{copy.stampCollection}</h2>
      {sortedStamps.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {sortedStamps.map((stamp) => (
            <StampBadge key={stamp.id} stamp={stamp} language={language} onSpeakLabel={onSpeakLabel} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-base font-bold text-slate-600">{copy.noStampsYet}</p>
      )}
    </section>
  );
}

export { StampBadge };
