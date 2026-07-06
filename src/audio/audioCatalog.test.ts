import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildAudioCatalogEntries, buildUniqueAudioCatalogEntries, languageCodes, languageVoiceIds } from "./audioCatalog";
import { generatedAudioManifest, getAudioManifestEntry } from "./generatedAudioManifest";

describe("audio catalog", () => {
  it("enumerates every generated character and UI utterance", () => {
    const entries = buildAudioCatalogEntries();
    const uniqueEntries = buildUniqueAudioCatalogEntries();

    expect(languageVoiceIds).toEqual({
      pl: "pl-PL-ZofiaNeural",
      en: "en-US-AnaNeural",
      zh: "zh-CN-XiaoxiaoNeural"
    });
    expect(languageCodes).toEqual({
      pl: "pl-PL",
      en: "en-US",
      zh: "zh-CN"
    });
    expect(entries.length).toBeGreaterThan(321);
    expect(uniqueEntries.length).toBeGreaterThan(319);
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "pl", languageCode: languageCodes.pl, text: "Ustawienia", voiceId: languageVoiceIds.pl })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "en", languageCode: languageCodes.en, text: "Listen and write", voiceId: languageVoiceIds.en })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "en", languageCode: languageCodes.en, text: "Letters Teacher. Play with letters", voiceId: languageVoiceIds.en })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "en", languageCode: languageCodes.en, text: "Show hints", voiceId: languageVoiceIds.en })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "pl", languageCode: languageCodes.pl, text: "Pokaż podpowiedzi", voiceId: languageVoiceIds.pl })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "zh", languageCode: languageCodes.zh, text: "显示提示", voiceId: languageVoiceIds.zh })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "en", languageCode: languageCodes.en, text: "Great work! Very good", voiceId: languageVoiceIds.en })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "en", languageCode: languageCodes.en, text: "D as in dog", voiceId: languageVoiceIds.en })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "pl", languageCode: languageCodes.pl, text: "Cyfra 4", voiceId: languageVoiceIds.pl })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "pl", languageCode: languageCodes.pl, text: "Ukończone słowa razy 8", voiceId: languageVoiceIds.pl })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "en", languageCode: languageCodes.en, text: "Words complete 8 times", voiceId: languageVoiceIds.en })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "zh", languageCode: languageCodes.zh, text: "完成词语 8 次", voiceId: languageVoiceIds.zh })
    );
    expect(entries).not.toContainEqual(expect.objectContaining({ language: "pl", text: "Ukończone słowa stempel x8" }));
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "zh", languageCode: languageCodes.zh, text: "词语 māo 猫", voiceId: languageVoiceIds.zh })
    );
    expect(entries).toContainEqual(
      expect.objectContaining({ language: "zh", languageCode: languageCodes.zh, text: "猫", voiceId: languageVoiceIds.zh })
    );
  });

  it("maps every unique catalog utterance to an existing static MP3", () => {
    const uniqueEntries = buildUniqueAudioCatalogEntries();

    expect(generatedAudioManifest.modelId).toBe("edge-tts@7.2.8");
    expect(generatedAudioManifest.outputFormat).toBe("audio-24khz-48kbitrate-mono-mp3");
    expect(generatedAudioManifest.entries).toHaveLength(uniqueEntries.length);

    for (const entry of uniqueEntries) {
      const manifestEntry = getAudioManifestEntry(generatedAudioManifest, entry.language, entry.text);
      expect(manifestEntry).toMatchObject({
        id: entry.id,
        language: entry.language,
        languageCode: entry.languageCode,
        text: entry.text,
        path: entry.path,
        voiceId: entry.voiceId
      });
      expect(manifestEntry?.path).toMatch(new RegExp(`^/audio/${entry.language}/.+\\.mp3$`));
      expect(existsSync(join(process.cwd(), "public", manifestEntry!.path))).toBe(true);
    }
  });
});
