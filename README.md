# Letters Teacher

A React PWA for helping children learn letters, digits, and simple words through playful practice games. The app supports Polish, English, and Chinese, uses static generated speech audio plus browser speech recognition, includes local handwriting and tile spelling practice flows, and is designed to work well on phones, tablets, and desktops.

Try it at: https://letters-teacher.netlify.app

## Features

- Practice letters, digits, or simple words in separate tabs.
- Practice Chinese with A-Z pinyin letters, Mandarin digit names, tone-marked pinyin words, and Simplified Chinese character hints.
- Hear a character or word sound from static MP3 audio and pick the matching card.
- Hear a character sound from static MP3 audio and write it on a drawing canvas.
- Hear a word sound from static MP3 audio and spell it with large letter tiles.
- See a character or word and pick the matching static sound.
- See a character or word and pronounce it with speech recognition where supported.
- Configurable language and question count.
- Scoring that rewards correct answers and reduces points after wrong attempts.
- Results screen with progress feedback and earned stamps.
- PWA manifest and service worker assets for installable offline use.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- Testing Library
- PNPM

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run tests:

```bash
pnpm test
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Development Workflow

Use red/green TDD for changes:

1. Write or update a failing test for the behavior.
2. Implement the smallest change that makes it pass.
3. Refactor with tests still passing.

Prefer small React components, custom hooks for reusable stateful behavior, and pure functions for game/session logic. Add external libraries only when they are necessary.

## Project Structure

```text
src/
  components/      React UI components
  data/            Letter, digit, word, and locale metadata
  audio/           Static speech audio catalog and generated manifest
  game/            Session, scoring, stamps, and question generation
  handwriting/     Handwriting recognizer
  hooks/           Browser API and reusable React hooks
  App.tsx          Top-level app flow
  i18n.ts          UI copy
  types.ts         Shared types
public/
  audio/           Generated MP3 clips and service-worker audio manifest
  manifest.webmanifest
  sw.js
```

## Static Audio Generation

All TTS-style audio is pre-generated as MP3 files and served from `public/audio`. The app does not call browser speech synthesis or ElevenLabs at runtime.

Generate or refresh audio:

```bash
ELEVENLABS_API_KEY=... pnpm run generate:audio
```

Verify that manifests and MP3 files match the current app catalog:

```bash
pnpm run generate:audio -- --check
```

## Browser Support Notes

Static speech audio uses normal browser audio playback. Speech recognition support varies by browser and may require network access. The app should handle unsupported speech recognition with a clear unavailable state.

## Product Notes

The app is intended for children age 4+ with setup by a parent. Gameplay screens should stay simple, visual, accessible, and touch-friendly. Polish, English, and Chinese are supported, with practice for letters, digits, and simple beginner words. Chinese word practice keeps pinyin as the spelling target while showing Simplified Chinese characters for familiarity.
