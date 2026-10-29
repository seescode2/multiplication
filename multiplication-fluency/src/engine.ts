export type Digits = 2 | 3 | 4;
export interface Snapshot {
  rows: string[];
  active: string | null;
  result: string;
  carry: number;
  carryColumn: number;
  adding: boolean;
}
export interface Choice {
  value: string;
  feedback: string;
}
export interface Step {
  kind: "shift" | "multiply" | "carry" | "row" | "add" | "total";
  title: string;
  question: string;
  answer: string;
  explanation: string;
  hint: string;
  topColumn?: number;
  bottomColumn?: number;
  choices: Choice[];
  snapshot: Snapshot;
}
export interface Problem {
  id: string;
  top: number;
  bottom: number;
  digits: Digits;
  answer: number;
  steps: Step[];
}
export const places = [
  "ones",
  "tens",
  "hundreds",
  "thousands",
  "ten-thousands",
  "hundred-thousands",
  "millions",
  "ten-millions",
];
export const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const clone = (s: Snapshot): Snapshot => ({ ...s, rows: [...s.rows] });
export const initialSnapshot = (): Snapshot => ({
  rows: [],
  active: null,
  result: "",
  carry: 0,
  carryColumn: 0,
  adding: false,
});
function choices(
  answer: string,
  alternatives: string[],
  random: () => number,
): Choice[] {
  const values = [...new Set([answer, ...alternatives])].slice(0, 4);
  for (let candidate = 0; values.length < 4; candidate++) {
    if (!values.includes(String(candidate))) values.push(String(candidate));
  }
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.map((value) => ({
    value,
    feedback:
      value === answer
        ? "Exactly. Follow the place value, then the arithmetic."
        : "Not quite yet. Check the digit, its place value, and any incoming carry. You can try again.",
  }));
}
export function buildProblem(
  top: number,
  bottom: number,
  id = `${top}-${bottom}`,
  random = seeded(top + bottom),
): Problem {
  if (
    !Number.isInteger(top) ||
    top < 10 ||
    top > 9999 ||
    !Number.isInteger(bottom) ||
    bottom < 1 ||
    bottom >= 10 ** String(top).length
  )
    throw new Error(
      "Use a 2–4 digit top number and a 1–N digit bottom number.",
    );
  const digits = String(top).length as Digits;
  const tops = String(top).split("").reverse().map(Number),
    bottoms = String(bottom).split("").reverse().map(Number);
  const steps: Step[] = [];
  let state = initialSnapshot();
  function push(
    step: Omit<Step, "snapshot" | "choices">,
    alternatives: string[],
  ) {
    steps.push({
      ...step,
      snapshot: clone(state),
      choices: choices(step.answer, alternatives, random),
    });
  }
  for (let row = 0; row < bottoms.length; row++) {
    const factor = bottoms[row],
      scale = 10 ** row;
    let carry = 0,
      written = "";
    state = {
      ...state,
      active: row ? "0".repeat(row) : "",
      carry: 0,
      carryColumn: 0,
    };
    if (row > 0)
      push(
        {
          kind: "shift",
          title: `Line up the ${places[row]} row`,
          question: `We are multiplying by the ${places[row]} digit, ${factor}. How many place-value zeros start this row?`,
          answer: `${row} ${row === 1 ? "zero" : "zeros"}`,
          explanation: `The digit ${factor} is worth ${factor * scale}. Shift this partial product ${row} ${row === 1 ? "place" : "places"} to the left by starting with ${row} ${row === 1 ? "zero" : "zeros"}. Even a zero digit gets its own row.`,
          hint: `The ${places[row]} place is ${scale} times the ones place.`,
          bottomColumn: row,
        },
        [
          `${row - 1} ${row - 1 === 1 ? "zero" : "zeros"}`,
          `${row + 1} zeros`,
          `${row + 2} zeros`,
        ],
      );
    for (let col = 0; col < tops.length; col++) {
      const incoming = carry,
        total = tops[col] * factor + incoming,
        digit = total % 10;
      carry = Math.floor(total / 10);
      written = String(digit) + written;
      state = {
        ...state,
        active: written + "0".repeat(row),
        carry,
        carryColumn: col + 1,
      };
      const phrase = (d: number, c: number) => `Write ${d}; carry ${c}`;
      push(
        {
          kind: "multiply",
          title: `Multiply the ${places[col]} digit`,
          question: `${factor} × ${tops[col]}${incoming ? ` + ${incoming} carried` : ""}: what do we write and carry?`,
          answer: phrase(digit, carry),
          explanation: `${factor} × ${tops[col]}${incoming ? ` + ${incoming}` : ""} = ${total}. Write ${digit} in this row's ${places[col + row]} column.${carry ? ` Carry ${carry} to the next multiplication.` : " There is no carry."}`,
          hint: `Multiply ${factor} by ${tops[col]}${incoming ? `, then add the incoming carry of ${incoming}` : ""}. Keep the ones digit and carry the tens.`,
          topColumn: col,
          bottomColumn: row,
        },
        [
          phrase((digit + 1) % 10, carry),
          phrase(digit, (carry + 1) % 10),
          phrase((digit + 9) % 10, carry),
        ],
      );
    }
    if (carry) {
      written = String(carry) + written;
      state = { ...state, active: written + "0".repeat(row), carry: 0 };
      push(
        {
          kind: "carry",
          title: "Write the remaining carry",
          question: `There are no top digits left. What happens to the carry of ${carry}?`,
          answer: `Write ${carry} at the left of this row`,
          explanation: `The carry still belongs to the product. Write ${carry} to the left of the digits already calculated.`,
          hint: "A carry is part of the answer; do not discard it.",
          bottomColumn: row,
        },
        [
          "Discard the carry",
          `Add ${carry} to the bottom number`,
          "Start the next row without it",
        ],
      );
    }
    const partial = top * factor * scale;
    state = {
      ...state,
      rows: [...state.rows, String(partial)],
      active: null,
      carry: 0,
    };
    push(
      {
        kind: "row",
        title: `Finish the ${places[row]} partial product`,
        question: `What is ${top} × ${factor * scale}, the value of this entire row?`,
        answer: String(partial),
        explanation: `${top} × ${factor * scale} = ${partial}. This row accounts for the ${places[row]} digit of ${bottom}. ${row + 1 < bottoms.length ? "Start the next row with a fresh carry of zero." : "Now combine the partial products."}`,
        hint: `Read the whole row, including its place-value zeros. A zero multiplier contributes 0.`,
        bottomColumn: row,
      },
      [
        String(partial + scale),
        String(partial + 10 * scale),
        String(partial === 0 ? top : partial - scale),
      ],
    );
  }
  let sumCarry = 0,
    result = "";
  const width = Math.max(...state.rows.map((r) => r.length));
  for (let col = 0; col < width || sumCarry; col++) {
    const terms = state.rows.map((r) => Number(r[r.length - 1 - col] ?? 0)),
      incoming = sumCarry;
    const total = terms.reduce((a, b) => a + b, 0) + incoming;
    sumCarry = Math.floor(total / 10);
    const digit = total % 10;
    result = String(digit) + result;
    state = {
      ...state,
      adding: true,
      result,
      carry: sumCarry,
      carryColumn: col + 1,
    };
    push(
      {
        kind: "add",
        title: `Add the ${places[col]} column`,
        question: `${terms.join(" + ")}${incoming ? ` + ${incoming} carried` : ""}: what do we write and carry?`,
        answer: `Write ${digit}; carry ${sumCarry}`,
        explanation: `The ${places[col]} column totals ${total}. Write ${digit}${sumCarry ? ` and carry ${sumCarry} to the next column` : ". No carry is needed"}.`,
        hint: "Line up equal place values. Add the digits in this column and include any incoming carry.",
      },
      [
        `Write ${(digit + 1) % 10}; carry ${sumCarry}`,
        `Write ${digit}; carry ${(sumCarry + 1) % 10}`,
        `Write ${(digit + 9) % 10}; carry ${sumCarry}`,
      ],
    );
  }
  state = { ...state, result: String(top * bottom), carry: 0 };
  push(
    {
      kind: "total",
      title: "Read the final product",
      question: "What is the product after adding all the partial products?",
      answer: String(top * bottom),
      explanation: `${top} × ${bottom} = ${top * bottom}. Each row counted one place of the bottom number; adding the rows gives the whole product.`,
      hint: "Read the full sum from left to right.",
    },
    [
      String(top * bottom + 1),
      String(top * bottom + 10),
      String(top * bottom + 100),
    ],
  );
  if (Number(result) !== top * bottom)
    throw new Error("Long multiplication failed verification");
  return { id, top, bottom, digits, answer: top * bottom, steps };
}
export function generateProblem(
  digits: Digits,
  seed: number,
  previous?: Problem,
): Problem {
  const random = seeded(seed),
    int = (min: number, max: number) =>
      min + Math.floor(random() * (max - min + 1));
  for (let attempt = 0; attempt < 100; attempt++) {
    const top = int(10 ** (digits - 1), 10 ** digits - 1);
    const bottomDigits = int(1, digits); // Uniform digit-length selection, not a bias toward long numbers.
    const bottom = int(10 ** (bottomDigits - 1), 10 ** bottomDigits - 1);
    if (top !== previous?.top || bottom !== previous?.bottom)
      return buildProblem(top, bottom, `${seed}-${attempt}`, random);
  }
  throw new Error("Could not generate a fresh problem");
}
export function parseAnswer(value: string): number | null {
  const trimmed = value.trim();
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(trimmed)) return null;
  const n = Number(trimmed.replaceAll(",", ""));
  return Number.isSafeInteger(n) ? n : null;
}
