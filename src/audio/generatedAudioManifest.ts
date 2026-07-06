import type { LanguageCode } from "../types";
import manifestData from "./generatedAudioManifest.json";

export type GeneratedAudioManifestEntry = {
  id: string;
  language: LanguageCode;
  languageCode: string;
  text: string;
  path: string;
  voiceId: string;
};

export type GeneratedAudioManifest = {
  version: number;
  modelId: string;
  outputFormat: string;
  entries: GeneratedAudioManifestEntry[];
};

export const generatedAudioManifest = manifestData as GeneratedAudioManifest;

export function getAudioManifestEntry(
  manifest: GeneratedAudioManifest,
  language: LanguageCode,
  text: string
): GeneratedAudioManifestEntry | undefined {
  return manifest.entries.find((entry) => entry.language === language && entry.text === text);
}
