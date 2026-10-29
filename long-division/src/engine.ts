export type Digits = 1 | 2 | 3 | 4;
export interface Row {
  kind: "product" | "difference";
  text: string;
  end: number;
}
export interface Snapshot {
  quotient: string[];
  rows: Row[];
  group: number | null;
  column: number;
  remainder: number | null;
}
export interface Choice {
  value: string;
  feedback: string;
}
export interface Step {
  kind:
    | "select"
    | "divide"
    | "multiply"
    | "subtract"
    | "bring-down"
    | "remainder"
    | "check";
  title: string;
  question: string;
  answer: string;
  explanation: string;
  hint: string;
  column: number;
  choices: Choice[];
  snapshot: Snapshot;
}
export interface Problem {
  id: string;
  dividend: number;
  divisor: number;
  digits: Digits;
  divisorDigits: Digits;
  quotient: number;
  remainder: number;
  steps: Step[];
}
export const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const initialSnapshot = (): Snapshot => ({
  quotient: ["", "", "", ""],
  rows: [],
  group: null,
  column: 0,
  remainder: null,
});
const clone = (s: Snapshot): Snapshot => ({
  ...s,
  quotient: [...s.quotient],
  rows: s.rows.map((r) => ({ ...r })),
});
function choices(
  answer: string,
  alternatives: string[],
  feedback: string,
  random: () => number,
): Choice[] {
  const values = [...new Set([answer, ...alternatives])].slice(0, 4);
  for (let n = 0; values.length < 4; n++)
    if (!values.includes(String(n))) values.push(String(n));
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.map((value) => ({
    value,
    feedback: value === answer ? "Exactly." : feedback,
  }));
}
export function buildProblem(
  dividend: number,
  divisor: number,
  id = `${dividend}-${divisor}`,
  random = seeded(dividend + divisor),
): Problem {
  if (
    !Number.isInteger(dividend) ||
    dividend < 1 ||
    dividend > 9999 ||
    !Number.isInteger(divisor) ||
    divisor < 1 ||
    divisor > 9999
  )
    throw new Error("Use positive whole numbers with 1–4 digits.");
  const digitList = String(dividend).split("").map(Number),
    offset = 4 - digitList.length;
  let index = 0,
    group = digitList[0],
    state = initialSnapshot();
  while (group < divisor && index < digitList.length - 1) {
    index++;
    group = group * 10 + digitList[index];
  }
  const steps: Step[] = [];
  function push(
    step: Omit<Step, "choices" | "snapshot" | "column">,
    alternatives: string[],
    feedback: string,
  ) {
    steps.push({
      ...step,
      column: index + offset,
      snapshot: clone(state),
      choices: choices(step.answer, alternatives, feedback, random),
    });
  }
  state = { ...state, group, column: index + offset };
  push(
    {
      kind: "select",
      title: "Find the first group",
      question: "Starting from the left, which first group should we divide?",
      answer: String(group),
      explanation:
        group < divisor
          ? `All the dividend's digits make ${group}, still smaller than ${divisor}. We can fit 0 whole groups and keep the dividend as the remainder.`
          : `Read from the left until the group is at least ${divisor}. The first group is ${group}; write its quotient digit above the last digit of this group.`,
      hint: `Read the dividend from left to right. Use the shortest first group at least as big as ${divisor}, or the whole dividend if it is smaller.`,
    },
    [String(group + 1), String(group * 10), String(Math.max(0, group - 1))],
    "Use consecutive digits starting at the left. Stop at the first group large enough for the divisor, or at the end of the dividend.",
  );
  for (;;) {
    const q = Math.floor(group / divisor),
      product = q * divisor,
      remainder = group - product;
    state = { ...state, quotient: [...state.quotient], column: index + offset };
    state.quotient[index + offset] = String(q);
    push(
      {
        kind: "divide",
        title: "Divide: choose a quotient digit",
        question: `How many whole groups of ${divisor} fit into ${group}?`,
        answer: String(q),
        explanation: `${divisor} fits ${q} ${q === 1 ? "time" : "times"}: ${q} × ${divisor} = ${product}, while ${q + 1} × ${divisor} = ${(q + 1) * divisor} is too much. Write ${q} above this column.${q === 0 ? " Keep this zero: it holds the place in the quotient." : ""}`,
        hint: `Find the largest whole digit whose product with ${divisor} does not exceed ${group}. Zero is sometimes needed.`,
      },
      [String(q + 1), String(Math.max(0, q - 1)), String(q + 2)],
      "The quotient digit must fit without going over. Compare the divisor times your digit with the current group.",
    );
    state = {
      ...state,
      rows: [
        ...state.rows,
        { kind: "product", text: String(product), end: index + offset },
      ],
    };
    push(
      {
        kind: "multiply",
        title: "Multiply: check what we used",
        question: `What is ${q} × ${divisor}?`,
        answer: String(product),
        explanation: `Multiply the new quotient digit by the divisor: ${q} × ${divisor} = ${product}. Write this below ${group}, lining up the rightmost digits.`,
        hint: `Multiply ${divisor} by the quotient digit you just wrote, ${q}.`,
      },
      [
        String(product + divisor),
        String(product + 1),
        String(Math.max(0, product - divisor)),
      ],
      "Multiply the divisor by the current quotient digit, not by the entire quotient.",
    );
    state = {
      ...state,
      rows: [
        ...state.rows,
        { kind: "difference", text: String(remainder), end: index + offset },
      ],
    };
    push(
      {
        kind: "subtract",
        title: "Subtract: find what is left",
        question: `What is ${group} − ${product}?`,
        answer: String(remainder),
        explanation: `${group} − ${product} = ${remainder}. This amount is smaller than ${divisor}, so the quotient digit was as large as possible.`,
        hint: "Subtract the product you just wrote from the current group.",
      },
      [
        String(remainder + 1),
        String(group + product),
        String(Math.max(0, remainder - 1)),
      ],
      "Subtract the product from the current group. Do not subtract from the entire original dividend.",
    );
    if (index === digitList.length - 1) {
      state = { ...state, remainder };
      push(
        {
          kind: "remainder",
          title: "Read the remainder",
          question: "There are no dividend digits left. What is the remainder?",
          answer: String(remainder),
          explanation:
            remainder === 0
              ? "Nothing is left over. The remainder is 0, so this division is exact."
              : `There are ${remainder} left over. Since ${remainder} < ${divisor}, no more whole groups fit. This is the remainder.`,
          hint: "Read the final difference. A valid remainder is always smaller than the divisor.",
        },
        [String(remainder + 1), String(divisor), String(remainder + divisor)],
        "The remainder is the final amount left after subtraction, not the quotient or the divisor.",
      );
      break;
    }
    index++;
    const next = digitList[index],
      newGroup = remainder * 10 + next;
    const rows = state.rows.map((r) => ({ ...r }));
    rows[rows.length - 1] = {
      kind: "difference",
      text: `${remainder}${next}`,
      end: index + offset,
    };
    state = { ...state, rows, group: newGroup, column: index + offset };
    push(
      {
        kind: "bring-down",
        title: "Bring down the next digit",
        question: `Bring down ${next} beside the ${remainder} left over. What is the new group?`,
        answer: String(newGroup),
        explanation: `The ${remainder} left over becomes ${remainder * 10} in the next place. Bring down ${next}: ${remainder} × 10 + ${next} = ${newGroup}. Now repeat divide, multiply, and subtract.${newGroup < divisor ? " This group is smaller than the divisor, so a zero quotient digit will be needed." : ""}`,
        hint: `The new group is ${remainder} × 10 + ${next}. Bring down just one digit, even if the group is small.`,
      },
      [String(remainder + next), String(newGroup + 1), String(newGroup + 10)],
      "Bringing down a digit changes place value: multiply the leftover amount by 10, then add that one next digit.",
    );
    group = newGroup;
  }
  const quotient = Math.floor(dividend / divisor),
    remainder = dividend % divisor;
  push(
    {
      kind: "check",
      title: "Check the whole division",
      question:
        "Which multiplication-and-addition statement checks the answer?",
      answer: `${divisor} × ${quotient} + ${remainder} = ${dividend}`,
      explanation: `Divisor × quotient + remainder = dividend: ${divisor} × ${quotient} + ${remainder} = ${dividend}. The remainder ${remainder} is smaller than the divisor ${divisor}.`,
      hint: "Multiply the divisor by the quotient, then add the remainder. You should get the original dividend.",
    },
    [
      `${divisor} × ${quotient} + ${remainder + 1} = ${dividend}`,
      `${divisor} × ${quotient + 1} + ${remainder} = ${dividend}`,
      `${divisor} × ${quotient} − ${remainder + 1} = ${dividend}`,
    ],
    "A division check uses divisor × quotient + remainder, and must equal the original dividend.",
  );
  if (
    Number(state.quotient.join("")) !== quotient ||
    state.remainder !== remainder ||
    divisor * quotient + remainder !== dividend
  )
    throw new Error("Division verification failed");
  return {
    id,
    dividend,
    divisor,
    digits: digitList.length as Digits,
    divisorDigits: String(divisor).length as Digits,
    quotient,
    remainder,
    steps,
  };
}
export function generateProblem(
  dividendDigits: Digits,
  divisorDigits: Digits,
  seed: number,
  previous?: Problem,
): Problem {
  const random = seeded(seed),
    int = (d: Digits) =>
      10 ** (d - 1) + Math.floor(random() * (9 * 10 ** (d - 1)));
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = int(dividendDigits),
      b = int(divisorDigits);
    if (a !== previous?.dividend || b !== previous?.divisor)
      return buildProblem(a, b, `${seed}-${attempt}`, random);
  }
  throw new Error("Could not generate a fresh division problem");
}
export function parseAnswer(value: string): number | null {
  const s = value.trim();
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(s)) return null;
  const n = Number(s.replaceAll(",", ""));
  return Number.isSafeInteger(n) ? n : null;
}
