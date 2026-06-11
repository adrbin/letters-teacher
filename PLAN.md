# Letters Teacher PWA Specification Plan

## Summary

Build a client-side React + Tailwind CSS PWA for children age 4+ to practice letters and digits through four flashcard-style character games. The app supports Polish and English, uses browser APIs for speech synthesis and speech recognition, works offline for installed app assets, and keeps the UI responsive across iPhone, iPad, and desktop.

The pronunciation game will use browser speech recognition even if the browser requires network access. All other app behavior and assets should remain available offline.

## Key Product Design

- **Parent setup first**: language, number of questions, and game selection are configured before play.
- **Child-first play UI**: large touch targets, high contrast, simple prompts, playful feedback, no dense instructions during gameplay.
- **Scoring**: each question starts at full value; every wrong attempt reduces the available points for that question. A failed attempt gives encouraging feedback and keeps the child on the same question.
- **Default session length**: 10 questions per game, configurable by parent.
- **Languages**:
  - English alphabet: A-Z.
  - Polish alphabet: include Polish letters appropriate for early learning, including diacritics such as `Ą`, `Ć`, `Ę`, `Ł`, `Ń`, `Ó`, `Ś`, `Ź`, `Ż`.
  - Digits: 0-9 in separate letter/digit practice tabs.
  - Speech synthesis uses `SpeechSynthesisUtterance` with language-specific voice/language hints.

## Core Screens And Text Mockups

### 1. Home / Setup

```text
+------------------------------------------------+
| Letters Teacher                                |
|                                                |
| Language: [ Polish v ]                         |
| Questions: [-] 10 [+]                          |
|                                                |
| Choose a game                                  |
| [ Hear letter -> Pick card ]                   |
| [ Hear letter -> Write it ]                    |
| [ See letter -> Pick sound ]                   |
| [ See letter -> Say it ]                       |
|                                                |
| [ Start ]                                      |
+------------------------------------------------+
```

### 2. Game 1: Hear Letter, Pick Card

```text
+------------------------------------------------+
| 3 / 10                         Score: 18       |
|                                                |
|        [ big speaker button ]                   |
|                                                |
| Pick the letter you hear                        |
|                                                |
|      [ A ]        [ M ]                         |
|      [ Ł ]        [ S ]                         |
|                                                |
| feedback area                                  |
+------------------------------------------------+
```

Behavior:
- Sound auto-plays when the question starts.
- Speaker button repeats the sound.
- Four cards are shown; one correct, three distractors.
- Wrong choice marks that card as incorrect, reduces available points, and allows another choice.

### 3. Game 2: Hear Letter, Write It

```text
+------------------------------------------------+
| 3 / 10                         Score: 18       |
|                                                |
|        [ big speaker button ]                   |
|                                                |
| Draw the letter                                 |
|                                                |
|   +----------------------------------------+   |
|   |                                        |   |
|   |            drawing canvas              |   |
|   |                                        |   |
|   +----------------------------------------+   |
|                                                |
| [ clear ]                         [ check ]    |
| feedback area                                  |
+------------------------------------------------+
```

Behavior:
- Touch and mouse input draw strokes on a canvas.
- Recognition starts with a simple, testable local recognizer suitable for letters:
  - Normalize strokes into a fixed-size drawing.
  - Compare against stored template glyphs/strokes per language.
  - Accept if confidence passes threshold.
- Keep recognition logic isolated so it can later be replaced by a stronger model/library.

### 4. Game 3: See Letter, Pick Sound

```text
+------------------------------------------------+
| 3 / 10                         Score: 18       |
|                                                |
|                 Ł                              |
|                                                |
| Pick the matching sound                         |
|                                                |
|      [ speaker ]  [ speaker ]                  |
|      [ speaker ]  [ speaker ]                  |
|                                                |
| feedback area                                  |
+------------------------------------------------+
```

Behavior:
- The visible letter is the target.
- Four buttons each play one letter sound.
- The child chooses the sound that matches the visible letter.
- Wrong answers reduce points and remain replayable.

### 5. Game 4: See Letter, Say It

```text
+------------------------------------------------+
| 3 / 10                         Score: 18       |
|                                                |
|                 R                              |
|                                                |
| Say this letter                                 |
|                                                |
|              [ record button ]                 |
|                                                |
| heard: "r"                                     |
| feedback area                                  |
+------------------------------------------------+
```

Behavior:
- Uses Web Speech Recognition where available.
- Uses language-specific recognition locale.
- Compares recognized transcript against valid spoken forms for the target letter.
- If unsupported, show a clear unavailable state for this game rather than breaking the session.

### 6. Results

```text
+------------------------------------------------+
| Great work!                                    |
|                                                |
|      Score: 82 / 100                           |
|                                                |
|  [ animated score meter / stars ]              |
|                                                |
| Strong letters: A M S                          |
| Practice again: Ł Ż R                          |
|                                                |
| [ Play again ]        [ Choose another game ]  |
+------------------------------------------------+
```

Behavior:
- Show total score, max score, accuracy, and letters needing practice.
- Use simple animation or progress visualization.
- Allow replaying the same settings or returning to setup.

## Implementation Changes

- Scaffold a React + TypeScript app using PNPM, Vite, Tailwind CSS, and PWA support.
- Use modular feature folders:
  - app shell and routing/state
  - language/letter data
  - speech synthesis and speech recognition hooks
  - scoring/session engine
  - shared game UI components
  - one component module per game
  - handwriting canvas and recognizer
- Use a small state machine/session reducer for question progression, attempts, scoring, and completion.
- Use deterministic question generation that avoids duplicate distractors and supports tests.
- Add PWA manifest and service worker caching for app shell/assets so the app can be installed and used offline except for browser-dependent speech recognition.

## Public Interfaces / Types

- `LanguageCode`: `en | pl`
- `LetterItem`: letter display value, speech text, recognition aliases, language code.
- `GameMode`: `hear-pick | hear-write | see-pick-sound | see-say`
- `SessionSettings`: language, game mode, question count.
- `Question`: target letter plus distractors where applicable.
- `AttemptResult`: correct/incorrect, awarded points, remaining possible points, feedback message.
- `SessionSummary`: total score, max score, per-letter results, missed letters.

## TDD Plan

- Start with unit tests for pure logic:
  - letter lists per language
  - question generation
  - distractor uniqueness
  - scoring decay after wrong attempts
  - session completion after configured question count
  - result summary aggregation
- Add hook/component tests:
  - setup settings update correctly
  - answer selection gives feedback and does not advance on wrong guess
  - correct answer advances question
  - results screen appears after final question
- Add handwriting recognizer tests with simple fixture strokes/templates.
- Add speech API wrapper tests using mocked browser APIs.
- Add PWA smoke test:
  - manifest exists
  - service worker registration path is configured
  - production build succeeds.

## Accessibility And Responsive Criteria

- All controls reachable by keyboard.
- Buttons have accessible names, including icon-only speaker/record buttons.
- Feedback is announced through an ARIA live region.
- Touch targets are at least 44px.
- Layout works at mobile, tablet, and desktop widths.
- No text-only color feedback; use icons, labels, and state changes.
- Avoid feature explanation text inside game screens; setup can include brief parent-facing labels.

## Assumptions

- Text wireframes in the app specification are sufficient for mockups.
- Speech recognition may require network depending on browser behavior.
- The app starts as a single-page PWA with local state only; no backend, auth, or persistence beyond optional local settings.
- External libraries should be limited to React/Vite/Tailwind/PWA tooling/testing utilities unless a specific need appears during implementation.
