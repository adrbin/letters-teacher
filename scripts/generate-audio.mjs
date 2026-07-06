import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const MODEL_ID = "eleven_v3";
const OUTPUT_FORMAT = "mp3_44100_128";
const MANIFEST_VERSION = 1;
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_MANIFEST_PATH = path.join(PROJECT_ROOT, "src/audio/generatedAudioManifest.json");
const PUBLIC_MANIFEST_PATH = path.join(PROJECT_ROOT, "public/audio/audio-manifest.json");

function parseArgs(argv) {
  const languagesArg = argv.find((arg) => arg.startsWith("--languages="));

  return {
    check: argv.includes("--check"),
    force: argv.includes("--force"),
    manifestOnly: argv.includes("--manifest-only"),
    languages: languagesArg ? languagesArg.slice("--languages=".length).split(",").filter(Boolean) : null
  };
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function publicFilePath(urlPath) {
  return path.join(PROJECT_ROOT, "public", urlPath.replace(/^\//, ""));
}

async function loadCatalogEntries() {
  const server = await createServer({
    root: PROJECT_ROOT,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent"
  });

  try {
    const catalog = await server.ssrLoadModule("/src/audio/audioCatalog.ts");
    return catalog.buildUniqueAudioCatalogEntries();
  } finally {
    await server.close();
  }
}

function makeManifest(entries) {
  return {
    version: MANIFEST_VERSION,
    modelId: MODEL_ID,
    outputFormat: OUTPUT_FORMAT,
    entries: entries.map(({ id, language, languageCode, text, path: audioPath, voiceId }) => ({
      id,
      language,
      languageCode,
      text,
      path: audioPath,
      voiceId
    }))
  };
}

function stringifyManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

async function writeManifests(manifest) {
  const contents = stringifyManifest(manifest);
  await mkdir(path.dirname(APP_MANIFEST_PATH), { recursive: true });
  await mkdir(path.dirname(PUBLIC_MANIFEST_PATH), { recursive: true });
  await writeFile(APP_MANIFEST_PATH, contents);
  await writeFile(PUBLIC_MANIFEST_PATH, contents);
}

async function checkGeneratedAudio(manifest) {
  const expected = stringifyManifest(manifest);
  const failures = [];

  for (const manifestPath of [APP_MANIFEST_PATH, PUBLIC_MANIFEST_PATH]) {
    if (!(await pathExists(manifestPath))) {
      failures.push(`Missing manifest: ${path.relative(PROJECT_ROOT, manifestPath)}`);
      continue;
    }

    const actual = await readFile(manifestPath, "utf8");
    if (actual !== expected) {
      failures.push(`Outdated manifest: ${path.relative(PROJECT_ROOT, manifestPath)}`);
    }
  }

  for (const entry of manifest.entries) {
    const audioPath = publicFilePath(entry.path);
    if (!(await pathExists(audioPath))) {
      failures.push(`Missing audio: ${path.relative(PROJECT_ROOT, audioPath)}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Static audio check failed:\n${failures.join("\n")}`);
  }

  console.log(`Static audio check passed for ${manifest.entries.length} files.`);
}

function getRetryDelayMs(response, attempt) {
  const retryAfter = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }
  return 1000 * attempt;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createSpeech(entry, apiKey) {
  const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${entry.voiceId}`);
  url.searchParams.set("output_format", OUTPUT_FORMAT);

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text: entry.text,
        model_id: MODEL_ID,
        language_code: entry.languageCode
      })
    });

    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }

    const details = await response.text();
    if (attempt < 4 && (response.status === 429 || response.status >= 500)) {
      await sleep(getRetryDelayMs(response, attempt));
      continue;
    }

    throw new Error(`ElevenLabs request failed with ${response.status} for ${entry.language} ${entry.id}: ${details.slice(0, 500)}`);
  }

  throw new Error(`ElevenLabs request failed for ${entry.language} ${entry.id}`);
}

function filterEntriesByLanguage(entries, languages) {
  if (!languages) return entries;

  const requestedLanguages = new Set(languages);
  const knownLanguages = new Set(entries.map((entry) => entry.language));
  const unknownLanguages = [...requestedLanguages].filter((language) => !knownLanguages.has(language));

  if (unknownLanguages.length > 0) {
    throw new Error(`Unknown audio language(s): ${unknownLanguages.join(", ")}`);
  }

  return entries.filter((entry) => requestedLanguages.has(entry.language));
}

async function generateAudio(entries, force) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("Set ELEVENLABS_API_KEY before running audio generation.");
  }

  for (const [index, entry] of entries.entries()) {
    const audioPath = publicFilePath(entry.path);
    await mkdir(path.dirname(audioPath), { recursive: true });

    if (!force && (await pathExists(audioPath))) {
      console.log(`${index + 1}/${entries.length} skipped ${entry.path}`);
      continue;
    }

    const audio = await createSpeech(entry, apiKey);
    await writeFile(audioPath, audio);
    console.log(`${index + 1}/${entries.length} generated ${entry.path}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const entries = await loadCatalogEntries();
  const manifest = makeManifest(entries);
  const generationEntries = filterEntriesByLanguage(entries, args.languages);

  if (args.check) {
    await checkGeneratedAudio(manifest);
    return;
  }

  if (args.manifestOnly) {
    await writeManifests(manifest);
    console.log(`Wrote static audio manifest for ${manifest.entries.length} files.`);
    return;
  }

  await generateAudio(generationEntries, args.force);
  await writeManifests(manifest);
  console.log(`Wrote static audio manifest for ${manifest.entries.length} files.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
