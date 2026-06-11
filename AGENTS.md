# AGENTS.md

## Project

Letters Teacher is a client-side React, TypeScript, Tailwind CSS, and Vite PWA for helping children practice letters in Polish and English. It includes multiple letter games, browser speech APIs, offline app-shell support, and local handwriting recognition.

## Working Principles

- Use red/green TDD for development:
  - Red: write or update a focused failing test that describes the desired behavior.
  - Green: implement the smallest change that passes.
  - Refactor: simplify only after tests are passing.
- Prefer small, modular React components.
- Extract reusable stateful behavior into custom hooks.
- Keep domain logic outside components when it can be tested directly.
- Use external libraries only when they are necessary and clearly improve the result.
- Do not overcomplicate the solution.
- Avoid fallback-heavy code. Prefer one clear path with explicit unsupported states where platform features are unavailable.
- Preserve the existing structure and naming style unless there is a strong reason to change it.

## Commands

Use PNPM.

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

Use `pnpm test` before considering a change complete. Use `pnpm build` for changes that touch TypeScript config, bundling, public assets, or PWA behavior.

## Code Organization

- `src/components`: React UI components.
- `src/hooks`: browser API and reusable React behavior.
- `src/game`: session, scoring, stamps, and question generation logic.
- `src/data`: letter data and language-specific metadata.
- `src/handwriting`: handwriting recognition logic.
- `src/types.ts`: shared application types.

When adding features, keep components focused on rendering and interactions. Put scoring, question generation, recognition, or browser API orchestration in testable functions or hooks.

## Testing Guidance

- Add unit tests for pure logic in `src/game`, `src/data`, and `src/handwriting`.
- Add component tests for UI flows and user interactions.
- Mock browser APIs such as speech synthesis, speech recognition, canvas, storage, and service worker behavior as needed.
- Keep tests deterministic. Avoid randomness unless it is injected or controlled.
- Prefer focused tests over broad snapshot coverage.

## UI Guidance

- Design for children age 4+ after setup by a parent.
- Keep touch targets large and labels simple.
- Make screens responsive for phone, tablet, and desktop.
- Keep interactions accessible with semantic controls, useful labels, keyboard access, and visible feedback.
- Do not add dense explanatory text to gameplay screens.

## PWA And Browser APIs

- The app should remain usable offline for cached app assets.
- Speech synthesis should use browser APIs and language-specific locale hints.
- Speech recognition may depend on browser support. Show a clear unavailable state where needed.
- Avoid hiding platform limitations behind complex fallback chains.
