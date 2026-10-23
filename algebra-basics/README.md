# Algebra Lab

A focused algebra fluency trainer for seventh-grade learners. Learn the algorithm, predict the next step, solve independently, then connect the equation to everyday situations. Everything stays in this subfolder; the other math apps are independent.

## Run locally

Requires Node.js 20.19+ (Node 22+ recommended) and npm. No backend, accounts, API keys, or services are needed.

```sh
cd algebra-basics
npm ci
npm run dev
```

Vite prints the local development address. To test and build:

```sh
npm test
npm run build
npm run preview
```

`dist/` is a standalone static site. It can be hosted in a subdirectory because asset paths are relative. In this cloud workspace, if the default npm cache is not writable, use `npm ci --cache /tmp/algebra-npm-cache`.

## Learning modes

- **Learn:** reveal exactly one operation or simplification per click. Previous lines and explanations stay visible.
- **Predict:** choose among equation-specific, shuffled operations or simplified equations. Legal but less direct operations receive different feedback from errors. Correct answers and explicit help reveal one line; Continue starts the next decision.
- **Practice:** solve on paper and enter an integer, decimal, or fraction. Enter checks the answer. Retry without a limit, request a hint, or reveal the same worked solution one line at a time.

All modes support addition/subtraction, multiplication/division, two-step equations, and proportions, plus mixed practice. Beginner problems have positive integer solutions. Intermediate problems include larger numbers, signed values, and exact fractional answers. Use a fraction for an exact nonterminating decimal (for example, `1/3`, rather than a rounded decimal).

Changing type or difficulty generates a fresh problem. Changing modes resets the interaction on the current problem, making it easy to go from watching to predicting to practicing. Start Over replays the same equation; New Problem avoids an identical consecutive equation.

## Progress and privacy

Progress is saved only in this browser's localStorage, under `algebra-lab-progress-v1`. Nothing is transmitted. Browser storage availability is checked, and corrupt/incompatible records safely start fresh. Reset progress asks for confirmation.

Independent completions exclude any problem where a hint or worked solution was requested. A correct answer after retries still counts as an independent completion, but not a first-try success. First-try accuracy uses completed independent problems as its denominator; per-type accuracy uses the same definition. Guided completions and Learn completions have separate counts. Predict accuracy counts the first decision for each step: an incorrect first choice or requesting the step counts as assisted, even if the next attempt is correct. Decision counts include in-progress problems. There are no penalties for retries. Abandoned Practice problems do not count as completions.

Each completion/decision is keyed by problem ID and mode/step so duplicate submissions, Start Over, and revisiting a mode cannot inflate statistics. Assistance and incorrect attempts are remembered across replay. Practicing the same equation after seeing solution steps in Learn or Predict counts as guided; use a fresh problem for independent practice. Progress is intended for one active tab; simultaneous edits from multiple tabs are not merged.

## Code map

- `src/engine/rational.ts`: normalized, exact rational arithmetic and strict numeric input parsing.
- `src/engine/expressions.ts`: expression trees, readable KaTeX notation, exact affine evaluation.
- `src/engine/problems.ts`: seeded generation, structure-derived transformations, substitution validation, and dynamically classified prediction choices.
- `src/engine/stories.ts`: parameterized stories with the exact coefficients, constants, units, and solution. Signed contexts replace nonsensical negative purchases.
- `src/session.ts`: shared interaction state machine, incremental help, submission guards, and completion rules.
- `src/progress.ts`: separate learning metrics, event deduplication, and defensive persistence.
- `src/components/`: reusable math, solution history, progress, and real-life connection components.
- `src/test/`: engine invariants across 960 generated equations, exact arithmetic, stories, prediction classifications, session transitions, persistence, and React interaction tests.

The engine uses exact safe-integer rational arithmetic, not floating-point equation solving. An expression tree retains the actual operation on each side; simplification normalizes each side independently. Every generated solution and transformation is checked by exact substitution. Tests additionally verify each operation, each simplification's coefficients, and the unique solution of every line. No AI is used to generate, solve, validate, or select steps.

React, TypeScript, Vite, Tailwind CSS, and locally bundled KaTeX power the interface. No external fonts or runtime requests are required. Controls are labeled; choices use native radio buttons; mode tabs support arrow/Home/End keys; reset uses a native modal dialog; reduced-motion preferences are respected.
