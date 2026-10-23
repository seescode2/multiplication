import { describe, expect, it } from "vitest";
import {
  add,
  div,
  equal,
  mul,
  parseAnswer,
  rat,
  sub,
} from "../engine/rational";
import {
  evaluate,
  linear,
  satisfies,
  type Equation,
} from "../engine/expressions";
import {
  applyOperation,
  families,
  generateProblem,
  makeProblem,
  type Difficulty,
  type Family,
} from "../engine/problems";
import { storiesFor } from "../engine/stories";

function solve(e: Equation) {
  const l = linear(e.left),
    r = linear(e.right);
  return div(sub(r.b, l.b), sub(l.a, r.a));
}
describe("exact numeric answers", () => {
  it.each([
    ["6/8", rat(3, 4)],
    ["0.75", rat(3, 4)],
    ["-.5", rat(-1, 2)],
    ["  -3 / -6 ", rat(1, 2)],
    ["0", rat(0)],
    ["+5", rat(5)],
  ])("parses %s exactly", (value, answer) =>
    expect(parseAnswer(value)).toEqual(answer),
  );
  it.each([
    "",
    "1/0",
    "Infinity",
    "NaN",
    "1+2",
    "0x10",
    "1/2/3",
    "2 apples",
    "999999999999999999999",
    ".",
  ])("rejects %s", (value) => expect(parseAnswer(value)).toBeNull());
  it("normalizes signs and performs exact arithmetic", () => {
    expect(rat(6, -8)).toEqual(rat(-3, 4));
    expect(add(rat(1, 3), rat(1, 6))).toEqual(rat(1, 2));
    expect(mul(rat(2, 3), rat(9, 4))).toEqual(rat(3, 2));
  });
});
describe.each(["beginner", "intermediate"] as Difficulty[])(
  "%s generated equations",
  (difficulty) => {
    it.each(families)(
      "%s has one verified solution and equivalent, justified steps across 120 seeds",
      (family) => {
        let previous: string | undefined;
        for (let seed = 1; seed <= 120; seed++) {
          const p = generateProblem(family, difficulty, seed, previous);
          expect(p.family).toBe(family);
          expect(p.signature).not.toBe(previous);
          previous = p.signature;
          expect(solve(p.equation)).toEqual(p.solution);
          expect(satisfies(p.equation, p.solution)).toBe(true);
          expect(satisfies(p.equation, add(p.solution, rat(1)))).toBe(false);
          if (difficulty === "beginner") {
            expect(p.solution.n).toBeGreaterThan(0);
            expect(p.solution.d).toBe(1);
          }
          let current = p.equation;
          for (const step of p.steps) {
            expect(step.current).toEqual(current);
            expect(solve(step.result)).toEqual(p.solution);
            expect(step.explanation.length).toBeGreaterThan(10);
            if (step.operation)
              expect(applyOperation(current, step.operation)).toEqual(
                step.result,
              );
            else if (step.kind === "simplify") {
              expect(linear(current.left)).toEqual(linear(step.result.left));
              expect(linear(current.right)).toEqual(linear(step.result.right));
            } else {
              expect(linear(current.left)).toEqual(linear(step.result.right));
              expect(linear(current.right)).toEqual(linear(step.result.left));
            }
            expect(step.choices).toHaveLength(4);
            expect(
              step.choices.filter((c) => c.classification === "preferred"),
            ).toHaveLength(1);
            for (const choice of step.choices) {
              if (choice.classification === "inefficient") {
                expect(choice.operation).toBeDefined();
                expect(choice.appliedEquation).toEqual(
                  applyOperation(current, choice.operation!),
                );
                expect(solve(choice.appliedEquation!)).toEqual(p.solution);
                expect(choice.feedback).toContain("keeps equality");
              }
              if (choice.equation)
                expect(satisfies(choice.equation, p.solution)).toBe(
                  choice.classification === "preferred",
                );
            }
            current = step.result;
          }
          expect(linear(current.left)).toEqual({ a: rat(1), b: rat(0) });
          expect(linear(current.right)).toEqual({ a: rat(0), b: p.solution });
        }
      },
    );
  },
);
describe("specific mathematical structures", () => {
  it.each([
    ["addition", 1, 8, 17, 9],
    ["addition", 1, -6, 11, 17],
    ["multiplication", 4, 0, 28, 7],
    ["two-step", 5, 7, 32, 5],
    ["two-step", 4, -3, 25, 7],
  ] as [Family, number, number, number, number][])(
    "solves %s with a=%s b=%s c=%s",
    (family, a, b, c, answer) => {
      const p = makeProblem(family, "beginner", { a, b, c: rat(c) }, "example");
      expect(p.solution).toEqual(rat(answer));
      expect(p.steps[0].operation?.kind).toBe(
        family === "multiplication" ? "divide" : "add",
      );
      if (family !== "multiplication")
        expect(p.steps[0].operation?.value).toEqual(rat(-b));
    },
  );
  it("undoes division by multiplying both sides", () => {
    const p = makeProblem(
      "multiplication",
      "beginner",
      { a: 5, b: 0, c: rat(6), variant: "divide" },
      "division",
    );
    expect(p.solution).toEqual(rat(30));
    expect(p.steps[0].operation).toEqual({ kind: "multiply", value: rat(5) });
  });
  it("solves proportions with exact fractions and explicit symmetry", () => {
    const p = makeProblem(
      "proportion",
      "beginner",
      { a: 4, b: 0, c: rat(25), denominator: 10 },
      "proportion",
    );
    expect(p.solution).toEqual(rat(10));
    expect(p.steps.map((s) => s.kind)).toEqual([
      "operation",
      "simplify",
      "simplify",
      "present",
    ]);
    const fractional = makeProblem(
      "proportion",
      "intermediate",
      { a: -7, b: 0, c: rat(11), denominator: 13 },
      "negative",
    );
    expect(fractional.solution).toEqual(rat(-77, 13));
  });
  it("rejects equations without exactly one solution", () =>
    expect(() =>
      makeProblem("two-step", "beginner", { a: 0, b: 3, c: rat(3) }, "bad"),
    ).toThrow());
  it("is reproducible and mixed practice covers all four types", () => {
    expect(generateProblem("mixed", "intermediate", 42)).toEqual(
      generateProblem("mixed", "intermediate", 42),
    );
    expect(
      new Set(
        Array.from(
          { length: 100 },
          (_, i) => generateProblem("mixed", "beginner", i).family,
        ),
      ).size,
    ).toBe(4);
    const samples = Array.from({ length: 100 }, (_, i) =>
      generateProblem("mixed", "intermediate", i),
    );
    expect(samples.some((p) => p.solution.n < 0)).toBe(true);
    expect(samples.some((p) => p.params.b < 0)).toBe(true);
  });
  it("classifies dividing a two-step equation before removing the constant as legal but less direct", () => {
    const p = makeProblem(
      "two-step",
      "beginner",
      { a: 3, b: 5, c: rat(20) },
      "test",
    );
    const choice = p.steps[0].choices.find(
      (c) => c.operation?.kind === "divide" && equal(c.operation.value, rat(3)),
    );
    expect(choice?.classification).toBe("inefficient");
    expect(evaluate(choice!.appliedEquation!.left, rat(5))).toEqual(
      evaluate(choice!.appliedEquation!.right, rat(5)),
    );
    expect(
      p.steps[0].choices.find((c) => c.id.endsWith("one-side"))?.feedback,
    ).toContain("does not keep");
  });
});
describe("real-life templates", () => {
  it("maps exact costs, fees, and discounts to two-step equations", () => {
    for (const b of [5, -5]) {
      const p = makeProblem(
        "two-step",
        "beginner",
        { a: 3, b, c: rat(3 * 7 + b) },
        "story",
      );
      const stories = storiesFor(p);
      expect(stories).toHaveLength(3);
      expect(stories[0].question).toContain("3 identical notebooks");
      expect(stories[0].question).toContain(b > 0 ? "$5 fee" : "$5 discount");
      expect(stories[0].question).toContain(`$${3 * 7 + b}`);
      expect(stories[0].meaning).toContain("7 dollars");
    }
  });
  it("uses consistent rates and sensible units in proportions", () => {
    const p = makeProblem(
      "proportion",
      "beginner",
      { a: 4, b: 0, c: rat(25), denominator: 10 },
      "story",
    );
    const [recipe, speed, price] = storiesFor(p);
    expect(recipe.question).toContain("4 cups of flour for 10 batches");
    expect(recipe.question).toContain("25 batches");
    expect(recipe.meaning).toContain("10 cups");
    expect(speed.question).toContain("4 kilometers in 10 minutes");
    expect(price.question).toContain("10 meters of ribbon cost $4");
  });
  it("uses signed contexts for negative solutions, not negative purchases", () => {
    for (const family of families) {
      const p = makeProblem(
        family,
        "intermediate",
        { a: -4, b: 3, c: rat(11), denominator: 5 },
        family,
      );
      const stories = storiesFor(p);
      expect(stories).toHaveLength(3);
      expect(
        stories.every((story) => story.equationSignature === p.signature),
      ).toBe(true);
      expect(
        stories.some((story) => story.question.includes("notebooks")),
      ).toBe(false);
      expect(
        stories.every(
          (story) =>
            story.variable.includes("signed") ||
            story.variable.includes("negative"),
        ),
      ).toBe(true);
    }
  });
});
