import {
  add,
  div,
  equal,
  mul,
  neg,
  rat,
  sub,
  text,
  type Rational,
} from "./rational";
import {
  canonical,
  equationTex,
  linear,
  num,
  product,
  quotient,
  satisfies,
  sum,
  x,
  type Equation,
} from "./expressions";

export const families = [
  "addition",
  "multiplication",
  "two-step",
  "proportion",
] as const;
export type Family = (typeof families)[number];
export type Selection = Family | "mixed";
export type Difficulty = "beginner" | "intermediate";
export const familyNames: Record<Family, string> = {
  addition: "Addition / Subtraction",
  multiplication: "Multiplication / Division",
  "two-step": "Two-Step Equations",
  proportion: "Proportions",
};
export interface Operation {
  kind: "add" | "multiply" | "divide";
  value: Rational;
}
export interface Choice {
  id: string;
  label: string;
  equation?: Equation;
  classification: "preferred" | "inefficient" | "incorrect";
  feedback: string;
  operation?: Operation;
  appliedEquation?: Equation;
}
export interface Step {
  current: Equation;
  result: Equation;
  kind: "operation" | "simplify" | "present";
  title: string;
  explanation: string;
  hint: string;
  operation?: Operation;
  choices: Choice[];
}
export interface Parameters {
  a: number;
  b: number;
  c: Rational;
  denominator?: number;
  variant?: "times" | "divide";
}
export interface Problem {
  id: string;
  family: Family;
  difficulty: Difficulty;
  params: Parameters;
  equation: Equation;
  solution: Rational;
  steps: Step[];
  signature: string;
}
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = <T>(items: T[], random: () => number): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
export function operationLabel(op: Operation) {
  const v = text(op.value);
  if (op.kind === "add")
    return op.value.n < 0
      ? `Subtract ${text(neg(op.value))} from both sides`
      : `Add ${v} to both sides`;
  return `${op.kind === "multiply" ? "Multiply" : "Divide"} both sides by ${v}`;
}
export function applyOperation(eq: Equation, op: Operation): Equation {
  const apply =
    op.kind === "add" ? sum : op.kind === "multiply" ? product : quotient;
  // Put the multiplier before each expression to show the balanced operation clearly.
  return op.kind === "multiply"
    ? {
        left: product(num(op.value), eq.left),
        right: product(num(op.value), eq.right),
      }
    : {
        left: apply(eq.left, num(op.value)),
        right: apply(eq.right, num(op.value)),
      };
}
function choicesFor(
  step: Omit<Step, "choices">,
  index: number,
  random: () => number,
): Choice[] {
  const preferred: Choice = {
    id: `${index}-preferred`,
    label: step.title,
    classification: "preferred",
    feedback: step.explanation,
    equation: step.kind !== "operation" ? step.result : undefined,
    operation: step.operation,
    appliedEquation: step.result,
  };
  let others: Choice[];
  if (step.operation) {
    const { kind, value } = step.operation;
    const coefficient = linear(step.current.left).a;
    const candidates: Operation[] = [
      {
        kind:
          kind === "add" ? "add" : kind === "divide" ? "multiply" : "divide",
        value: kind === "add" ? neg(value) : value,
      },
      {
        kind: coefficient.n && !equal(coefficient, rat(1)) ? "divide" : "add",
        value:
          coefficient.n && !equal(coefficient, rat(1)) ? coefficient : rat(2),
      },
      { kind: "multiply", value: rat(2) },
      { kind: "add", value: rat(3) },
    ];
    const unique = candidates
      .filter(
        (op, i, all) =>
          !(op.kind === kind && equal(op.value, value)) &&
          all.findIndex(
            (other) => other.kind === op.kind && equal(other.value, op.value),
          ) === i,
      )
      .slice(0, 2);
    others = unique.map((op, i) => ({
      id: `${index}-alternative-${i}`,
      label: operationLabel(op),
      classification: "inefficient",
      operation: op,
      appliedEquation: applyOperation(step.current, op),
      feedback: `That keeps equality because you do the same thing to both sides. It is less direct here. ${step.hint}`,
    }));
    others.push({
      id: `${index}-one-side`,
      label: operationLabel(step.operation).replace(
        "both sides",
        "only the left side",
      ),
      classification: "incorrect",
      feedback: `Changing only one side does not keep the equation balanced. ${step.hint}`,
    });
  } else {
    const wrong = [1, -1, 2].map((offset) =>
      linear(step.result.right).a.n
        ? {
            ...step.result,
            left: canonical(sum(step.result.left, num(offset))),
          }
        : {
            ...step.result,
            right: canonical(sum(step.result.right, num(offset))),
          },
    );
    others = wrong.map((equation, i) => ({
      id: `${index}-arithmetic-${i}`,
      label: "Simplified equation",
      equation,
      classification: "incorrect",
      feedback: `Check the arithmetic on each side. Simplifying must keep the same values. ${step.hint}`,
    }));
  }
  return shuffle([preferred, ...others], random);
}
export function makeProblem(
  family: Family,
  difficulty: Difficulty,
  params: Parameters,
  id: string,
  random = seeded(1),
): Problem {
  const { a, b, c, variant = "times", denominator = 1 } = params;
  if (!a || (family === "proportion" && (!denominator || !c.n)))
    throw new Error("Equation must have one solution");
  let equation: Equation;
  if (family === "addition") equation = { left: sum(x, num(b)), right: num(c) };
  else if (family === "multiplication")
    equation = {
      left: variant === "times" ? product(num(a), x) : quotient(x, num(a)),
      right: num(c),
    };
  else if (family === "two-step")
    equation = { left: sum(product(num(a), x), num(b)), right: num(c) };
  else
    equation = {
      left: quotient(num(a), num(denominator)),
      right: quotient(x, num(c)),
    };
  const left = linear(equation.left),
    right = linear(equation.right);
  const solution = div(sub(right.b, left.b), sub(left.a, right.a));
  let current = equation;
  const steps: Step[] = [];
  function push(
    result: Equation,
    kind: Step["kind"],
    title: string,
    explanation: string,
    hint: string,
    operation?: Operation,
  ) {
    const next = { current, result, kind, title, explanation, hint, operation };
    steps.push({ ...next, choices: choicesFor(next, steps.length, random) });
    current = result;
  }
  function operation(op: Operation, why: string, hint: string) {
    push(
      applyOperation(current, op),
      "operation",
      operationLabel(op),
      why,
      hint,
      op,
    );
  }
  function simplify() {
    push(
      { left: canonical(current.left), right: canonical(current.right) },
      "simplify",
      "Simplify both sides",
      "Calculate each side. We have changed how it looks, not what it means.",
      "Combine the numbers and cancel inverse operations on each side.",
    );
  }
  if (family === "proportion") {
    operation(
      { kind: "multiply", value: c },
      `Multiplying both sides by ${text(c)} undoes division by ${text(c)} on the side with x. Equality stays balanced.`,
      `Which multiplication cancels the denominator under x?`,
    );
    push(
      { left: quotient(num(mul(c, rat(a))), num(denominator)), right: x },
      "simplify",
      "Cancel the division on the right",
      `On the right, multiplying and dividing by ${text(c)} cancel. On the left, multiply the numerator.`,
      "Multiply the numerator on the left and cancel the matching factors on the right.",
    );
    simplify();
    push(
      { left: x, right: num(solution) },
      "present",
      "Write x on the left",
      "Equality works in both directions. We can read the same statement with x on the left.",
      "Swap the two entire sides without changing their values.",
    );
  } else {
    if (family === "addition" || family === "two-step") {
      operation(
        { kind: "add", value: rat(-b) },
        `Undo ${b < 0 ? "subtraction" : "addition"} first. ${operationLabel({ kind: "add", value: rat(-b) })} to keep equality and remove the constant beside x.`,
        `Use the inverse of ${b < 0 ? `subtracting ${-b}` : `adding ${b}`}.`,
      );
      simplify();
    }
    if (family === "multiplication" || family === "two-step") {
      const op: Operation = {
        kind:
          family === "multiplication" && variant === "divide"
            ? "multiply"
            : "divide",
        value: rat(a),
      };
      operation(
        op,
        `${operationLabel(op)}. ${op.kind === "divide" ? "Division undoes multiplication" : "Multiplication undoes division"}, leaving x by itself after simplification.`,
        `Undo ${op.kind === "divide" ? "multiplication" : "division"} by ${a}.`,
      );
      simplify();
    }
  }
  const problem = {
    id,
    family,
    difficulty,
    params,
    equation,
    solution,
    steps,
    signature: equationTex(equation),
  };
  if (
    !satisfies(equation, solution) ||
    steps.some((step) => !satisfies(step.result, solution))
  )
    throw new Error("Invalid generated solution");
  return problem;
}
export function generateProblem(
  selection: Selection,
  difficulty: Difficulty,
  seed: number,
  previousSignature?: string,
): Problem {
  const random = seeded(seed),
    int = (lo: number, hi: number) => lo + Math.floor(random() * (hi - lo + 1));
  for (let attempt = 0; attempt < 100; attempt++) {
    const family = selection === "mixed" ? families[int(0, 3)] : selection;
    const advanced = difficulty === "intermediate";
    let a = int(2, advanced ? 16 : 9),
      b = int(1, advanced ? 25 : 9) * (random() < 0.5 ? -1 : 1);
    if (advanced && random() < 0.3) a *= -1;
    let answer = rat(
      int(1, advanced ? 24 : 12) * (advanced && random() < 0.55 ? -1 : 1),
      advanced && random() < 0.3 ? 2 : 1,
    );
    if (!advanced && b < 0 && answer.n <= -b) answer = rat(-b + int(1, 8));
    const variant = random() < 0.5 ? "times" : "divide";
    let c =
      family === "addition"
        ? add(answer, rat(b))
        : family === "two-step"
          ? add(mul(rat(a), answer), rat(b))
          : variant === "times"
            ? mul(rat(a), answer)
            : answer;
    if (family === "multiplication" && variant === "divide") c = answer; // x/a=c gives an integer x for beginner.
    const denominator = int(3, advanced ? 21 : 12);
    if (family === "proportion") {
      a = int(1, advanced ? 18 : 7) * (advanced && random() < 0.4 ? -1 : 1);
      // Beginner target denominators are multiples of the reduced denominator.
      c = rat(advanced ? int(2, 25) : rat(a, denominator).d * int(2, 5));
    }
    const p = makeProblem(
      family,
      difficulty,
      { a, b, c, denominator, variant },
      `${seed}-${attempt}`,
      random,
    );
    if (p.signature !== previousSignature) return p;
  }
  throw new Error("Could not generate a fresh equation");
}
