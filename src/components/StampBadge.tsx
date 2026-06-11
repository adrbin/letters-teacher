import { getCopy } from "../i18n";
import { getCharacters } from "../data/letters";
import type { EarnedStamp, LanguageCode, LetterItem } from "../types";
import { LetterImage } from "./LetterImage";

function StampBadge({
  stamp,
  language,
  isNew = false
}: {
  stamp: EarnedStamp;
  language: LanguageCode;
  isNew?: boolean;
}) {
  const copy = getCopy(language);

  if (stamp.kind === "collection-complete") {
    return (
      <div
        className={`stamp-badge ${isNew ? "stamp-badge-new" : ""} grid min-h-32 min-w-32 place-items-center rounded-3xl bg-emerald-100 p-4 text-center font-black text-emerald-950 ring-4 ring-emerald-300`}
        aria-label={copy.collectionCompleteLabel[stamp.characterSet](stamp.completedCount)}
      >
        <span className="text-4xl leading-none">{stamp.characterSet === "digits" ? "123" : "ABC"}</span>
        <span className="text-sm uppercase">{copy.collectionCompleteTitle[stamp.characterSet]}</span>
        <span className="rounded-full bg-white/80 px-3 py-1 text-lg">x{stamp.completedCount}</span>
      </div>
    );
  }

  const currentItem = getCharacters(language, stamp.characterSet).find((item) => item.display === stamp.character);
  const example =
    stamp.word && stamp.imageId && stamp.alt
      ? {
          word: stamp.word,
          imageId: stamp.imageId,
          alt: stamp.alt
        }
      : currentItem?.example;
  const letter: LetterItem = {
    display: stamp.character,
    speechText: stamp.character,
    aliases: [stamp.character.toLocaleLowerCase(language === "pl" ? "pl-PL" : "en-US")],
    language,
    characterSet: stamp.characterSet,
    example
  };

  return (
    <div
      className={`stamp-badge ${isNew ? "stamp-badge-new" : ""} rounded-3xl bg-white p-3 text-center font-black text-slate-950 shadow-sm ring-4 ring-amber-200`}
      aria-label={`${copy.stampCharacterLabel[stamp.characterSet](stamp.character, stamp.word)} ${copy.stamp}`}
    >
      <LetterImage letter={letter} compact />
    </div>
  );
}

export function StampCollection({ stamps, language }: { stamps: EarnedStamp[]; language: LanguageCode }) {
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
            <StampBadge key={stamp.id} stamp={stamp} language={language} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-base font-bold text-slate-600">{copy.noStampsYet}</p>
      )}
    </section>
  );
}

export { StampBadge };
