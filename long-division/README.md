# Division Lab

An independent long-division trainer in `long-division/`, matching the style of Algebra Lab and Multiplication Lab. The other apps and their progress remain unchanged.

## Run

Requires Node.js 20.19+ and npm. No backend, account, API key, or external service is required.

```sh
cd long-division
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Vite prints the development or preview address. The production `dist/` folder can be served by a static host, including in a subdirectory. If the cloud's npm cache is unwritable, use `npm ci --cache /tmp/division-npm-cache`.

## Standard terms and controls

- **Dividend:** the number being divided, inside the bracket.
- **Divisor:** the number you divide by, outside the bracket.
- **Quotient:** the whole-number answer, above the dividend.
- **Remainder:** what is left after all digits have been used; always smaller than the divisor.

**Dividend digits** and **Divisor digits** are independent dropdowns, each offering 1, 2, 3, or 4 digits. Both numbers have exactly the selected lengths. Defaults are a 3-digit dividend and 1-digit divisor. A divisor larger than the dividend is supported: the quotient is 0 and the remainder is the entire dividend. Zero divisors and identical consecutive problems are excluded.

This trainer uses whole-number quotients and remainders rather than extending into decimal places. Problems can divide exactly or leave remainders. The random generator does not promise a particular ratio of exact answers; a longer divisor than dividend necessarily gives a zero quotient.

## Learning modes

- **Learn:** reveal one step per click. Find the shortest starting group, divide, multiply, subtract, bring down one digit, and repeat. Quotient digits align above their dividend columns. All explanations remain in the open, collapsible step history.
- **Predict:** choose the next group, quotient digit, product, difference, brought-down number, remainder, or multiplication check. Choices use the current arithmetic. Wrong choices give feedback and unlimited retries. A correct choice or Show Me This Step reveals one step; Continue advances explicitly.
- **Practice:** solve on paper and enter the quotient and remainder separately. Whole numbers with optional correctly grouped commas are accepted. A blank remainder means 0; Enter submits from either field. Incorrect answers do not reveal the result. Hints and incremental worked solutions are available.

Changing either selector generates a fresh problem. Changing modes resets interaction on the same problem. Start Over replays it; New/Next Problem gives fresh independent practice after guidance.

Each completion checks `divisor × quotient + remainder = dividend` and `0 ≤ remainder < divisor`. Internal and trailing zero quotient digits are retained. When a brought-down group is too small, the algorithm writes a zero in the quotient before continuing.

## Honest, local progress

Progress stays in this browser's localStorage under `long-division-v1`, separate from the other apps. Learn, Predict, independent Practice, and guided Practice have separate counts. First-try accuracy uses completed independent problems as its denominator; accuracy by dividend size uses the same rule. Predict counts the first decision on each step, including in-progress problems; requesting a step is assisted.

Hints and viewing steps in any mode make subsequent work on that same problem guided. Mistakes remain recorded through Start Over. Unique problem/step IDs prevent duplicate credit. Reset requires confirmation. Malformed saved data safely resets; unavailable storage shows a warning. One active tab is supported; concurrent tab updates are not merged.

Controls use native labels and radio buttons, mode tabs support arrow/Home/End keys, and reset uses a native modal dialog. The division board has screen-reader descriptions, mobile layouts, and reduced-motion support. There are no timers or leaderboards.

## Architecture and verification

- `src/engine.ts`: seeded generation, the shared deterministic algorithm, shuffled prediction choices, and immutable board snapshots.
- `src/state.ts`: interactions, submission guards, completion rules, and defensive progress persistence.
- `src/components/Board.tsx`: conventional aligned division bracket, quotient, products, differences, and brought-down digits.
- `src/test/`: all 16 digit-length combinations across 1,600 generated problems; arithmetic transformations and alignment; zero quotient digits; larger divisors; exact and remainder answers; replay guards; storage; and React interactions.

The completed algorithm is verified against the quotient/remainder reconstruction identity. All arithmetic uses exact safe integers within the supported range. No AI or API generates, solves, or grades problems. React, TypeScript, Vite, Tailwind CSS, bundled KaTeX, and Lucide icons match the other trainers.
