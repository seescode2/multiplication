# Multiplication Lab

A multi-digit multiplication fluency trainer in the same visual style as Algebra Lab. This independent app lives entirely in `multiplication-fluency/`; the original times-table app and Algebra Lab are unchanged.

## Run

Requires Node.js 20.19+ and npm. No backend, account, API key, or external runtime service is needed.

```sh
cd multiplication-fluency
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Vite prints the development/preview address. The production `dist/` folder can be served by a static host, including in a subdirectory. If the cloud's default npm cache is unwritable, use `npm ci --cache /tmp/multiplication-npm-cache`.

## How it works

- **Number of digits: 2, 3, or 4.** The top number always has exactly the selected length. The bottom number has between one and that many digits. Its _length_ is sampled uniformly, then a positive number of that length is chosen. Consecutive identical pairs are avoided. Numbers can contain zeros.
- **Learn:** reveal one step per click: multiply a digit, include the incoming carry, write a digit, carry to the next column, shift the next row, and add the partial products column by column. Complete explanations remain in an expandable step history.
- **Predict:** choose the next written digit/carry, shift, partial product, or column sum. Choices are generated for the actual arithmetic. Wrong choices give a hint and unlimited retries. Correct choices reveal one step; Continue explicitly advances. Show Me This Step provides help without first-choice credit.
- **Practice:** solve on paper, then enter the final product. Enter submits; whole-number answers with or without correctly grouped commas are accepted. Mistakes do not reveal the answer. Hints and incremental worked solutions are available.

Carries are shown above the working columns. Multiplication proceeds right to left, resets the carry for every partial-product row, and keeps zero-multiplier rows. Each new row shifts one column left. Addition includes its own carries. The same engine produces the board, predictions, and solution in every mode. Integer arithmetic is exact throughout the supported range (maximum product: 99,980,001).

Changing the digit selector generates a fresh problem. Switching modes resets interaction on the same problem; Start Over replays it. Use New/Next Problem for independent work after seeing guidance.

## Progress

Learning progress stays in this browser's localStorage under `multiplication-fluency-v1`. It is separate from Algebra Lab's progress. Learn, Predict, independent Practice, and guided Practice are counted separately. First-try accuracy uses completed independent problems as its denominator; accuracy by top-number length uses the same rule. Predict tracks the first choice for each decision, including in-progress problems; requesting help counts as assisted. No timers or competitive scores.

Hints or seeing steps in any mode make later practice on that same problem guided. Wrong attempts stay recorded across Start Over. Replays and repeated submissions cannot inflate completion counts. Reset requires confirmation. Unavailable storage shows a warning; malformed saved data is safely ignored. Progress is designed for one active browser tab, rather than synchronized multi-tab use.

## Code and checks

- `src/engine.ts`: seeded generation and the authoritative digit/carry/shift/addition algorithm; immutable board snapshots and shuffled choices.
- `src/state.ts`: mode transitions, guarded submissions, honest progress accounting, and persistence validation.
- `src/components/Board.tsx`: aligned long multiplication with active-digit highlighting and accessible text equivalents.
- `src/test/`: generator distribution, 900 generated products, partial products, carries, zero digits, answer parsing, mode transitions, replay guards, storage, and React interaction tests.

React, TypeScript, Vite, Tailwind CSS, KaTeX, and Lucide icons match the algebra app's stack and visual language. All assets are bundled locally. Controls are keyboard accessible, choices use radio buttons, mode tabs support arrow/Home/End keys, reset uses a native modal dialog, and reduced-motion preferences are respected.
