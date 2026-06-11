# Letters Teacher

A React PWA for helping children learn letters through playful flashcard games. The app supports Polish and English, uses browser speech APIs, includes a local handwriting practice flow, and is designed to work well on phones, tablets, and desktops.

## Features

- Hear a letter sound and pick the matching card.
- Hear a letter sound and write it on a drawing canvas.
- See a letter and pick the matching sound.
- See a letter and pronounce it with speech recognition where supported.
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
  data/            Letter data and locale metadata
  game/            Session, scoring, stamps, and question generation
  handwriting/     Handwriting recognizer
  hooks/           Browser API and reusable React hooks
  App.tsx          Top-level app flow
  i18n.ts          UI copy
  types.ts         Shared types
public/
  manifest.webmanifest
  sw.js
```

## Browser Support Notes

Speech synthesis and speech recognition are browser APIs. Speech synthesis is broadly available, while speech recognition support varies by browser and may require network access. The app should handle unsupported speech recognition with a clear unavailable state.

## Product Notes

The app is intended for children age 4+ with setup by a parent. Gameplay screens should stay simple, visual, accessible, and touch-friendly. Polish and English are the initial supported languages.
