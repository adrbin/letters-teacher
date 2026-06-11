Please create an educational app for learning letters and digits for children in a form of
a PWA React app. Please first let's create an app specification based on the
following requirements with some mockups.

## Tech stack

Use client-side React and Tailwind CSS, limit external libraries to only
necessary but don't reinvent the wheel, keep the code modular and components
short. Extract hooks where possible.

Use the TDD approach for development.

Use PNPM for package management.

If some command fails because of the sandbox, ask me to run it and I will run
it. Don't make strange workaround.

## App description

This should be a flashcard app with several games - screens:

1. Button with automatically played character sound. There are 4 cards with
   letters or digits. The user needs to choose the correct one and scores a point if
   guessed correctly.
2. Button with automatically played character sound. The user can write the character
   with touch input or mouse. The app recognizes the written character and grades
   if it is the correct one.
3. A character is shown. There are 4 buttons that after press play a sound. The
   user must choose the correct sound.
4. A character is shown. The user presses a record button and tries to pronounce
   the character. The app uses speech recognition and recognizes whether the
   correct character was said.

If a guess is failed, inform the user and let choose again. With each subsequent
choice, the user gets less points.

There should be a configurable number of exercise questions in each game
(default 10). After finishing show user the score in an interactive format.

## Accessibility

The game should support many languages available to choose: for now Polish and
English.

Use the browser API for generating character speech and other necessary
functionalities.

The game should work as a PWA application, fully possible for offline use.

The game should use responsive design and look good on the iPhone, iPad and PC.

The game should be accessible, intuitively understandable, visually pleasing and
interesting for 4+ year old children after setup by their parent.
