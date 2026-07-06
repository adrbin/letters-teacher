import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const EDGE_TTS_PACKAGE = "edge-tts==7.2.8";
const MODEL_ID = "edge-tts@7.2.8";
const OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
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
      continue;
    }

    const audioStats = await stat(audioPath);
    if (audioStats.size === 0) {
      failures.push(`Empty audio: ${path.relative(PROJECT_ROOT, audioPath)}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Static audio check failed:\n${failures.join("\n")}`);
  }

  console.log(`Static audio check passed for ${manifest.entries.length} files.`);
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

function runEdgeTts(entry, audioPath) {
  const args = ["--from", EDGE_TTS_PACKAGE, "edge-tts", "--voice", entry.voiceId, "--text", entry.text, "--write-media", audioPath];

  return new Promise((resolve, reject) => {
    const child = spawn("uvx", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    child.on("error", (error) => {
      if (error.code === "ENOENT") {
        reject(new Error("uvx is required to generate Edge TTS audio. Install uv, then rerun pnpm run generate:audio."));
        return;
      }
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      const details = stderr.trim();
      reject(new Error(`Edge TTS failed with exit code ${code} for ${entry.language} ${entry.id}${details ? `:\n${details}` : ""}`));
    });
  });
}

async function generateAudio(entries, force) {
  for (const [index, entry] of entries.entries()) {
    const audioPath = publicFilePath(entry.path);
    await mkdir(path.dirname(audioPath), { recursive: true });

    if (!force && (await pathExists(audioPath))) {
      console.log(`${index + 1}/${entries.length} skipped ${entry.path}`);
      continue;
    }

    await runEdgeTts(entry, audioPath);
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
