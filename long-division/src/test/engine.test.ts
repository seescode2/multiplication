import { describe, expect, it } from "vitest";
import {
  buildProblem,
  generateProblem,
  parseAnswer,
  type Digits,
} from "../engine";
const counts = [1, 2, 3, 4] as Digits[];
describe("independent digit selectors and generated arithmetic", () => {
  for (const a of counts)
    for (const b of counts)
      it(`${a}-digit dividend / ${b}-digit divisor across 100 seeds`, () => {
        let previous;
        for (let seed = 0; seed < 100; seed++) {
          const p = generateProblem(a, b, seed, previous);
          expect(String(p.dividend)).toHaveLength(a);
          expect(String(p.divisor)).toHaveLength(b);
          expect(
            p.dividend === previous?.dividend &&
              p.divisor === previous?.divisor,
          ).toBe(false);
          expect(p.quotient * p.divisor + p.remainder).toBe(p.dividend);
          expect(p.remainder).toBeGreaterThanOrEqual(0);
          expect(p.remainder).toBeLessThan(p.divisor);
          expect(Number(p.steps.at(-1)!.snapshot.quotient.join(""))).toBe(
            p.quotient,
          );
          expect(p.steps.at(-1)!.snapshot.remainder).toBe(p.remainder);
          for (const st of p.steps) {
            expect(st.choices).toHaveLength(4);
            expect(new Set(st.choices.map((c) => c.value)).size).toBe(4);
            expect(
              st.choices.filter((c) => c.value === st.answer),
            ).toHaveLength(1);
          }
          previous = p;
        }
      });
  it("is deterministic and does not repeat a consecutive pair", () => {
    const p = generateProblem(3, 2, 42);
    expect(generateProblem(3, 2, 42)).toEqual(p);
    expect(generateProblem(3, 2, 42, p)).not.toEqual(p);
  });
});
describe("the long-division algorithm", () => {
  it.each([
    [1234, 12],
    [1005, 5],
    [1010, 10],
    [9999, 1],
    [3, 9999],
    [64, 8],
    [9, 9],
    [1000, 999],
    [1001, 1000],
    [9999, 9999],
    [7, 3],
  ])("solves %i ÷ %i in aligned, verified steps", (a, b) => {
    const p = buildProblem(a, b),
      digitList = String(a).split("").map(Number),
      offset = 4 - digitList.length;
    const groupStep = p.steps[0];
    expect(groupStep.kind).toBe("select");
    const firstGroup = Number(groupStep.answer);
    expect(firstGroup).toBe(
      Number(String(a).slice(0, groupStep.column - offset + 1)),
    );
    if (firstGroup >= b)
      expect(
        Number(String(a).slice(0, groupStep.column - offset)),
      ).toBeLessThan(b);
    else expect(firstGroup).toBe(a);
    let group = firstGroup,
      rem = 0,
      q = 0;
    for (const st of p.steps) {
      if (st.kind === "divide") {
        q = Number(st.answer);
        expect(q).toBe(Math.floor(group / b));
        expect(q).toBeGreaterThanOrEqual(0);
        expect(q).toBeLessThanOrEqual(9);
        expect(st.snapshot.quotient[st.column]).toBe(st.answer);
      }
      if (st.kind === "multiply") {
        expect(Number(st.answer)).toBe(q * b);
        const row = st.snapshot.rows.at(-1)!;
        expect(row.kind).toBe("product");
        expect(row.end).toBe(st.column);
        expect(Number(row.text)).toBe(q * b);
      }
      if (st.kind === "subtract") {
        rem = group - q * b;
        expect(Number(st.answer)).toBe(rem);
        expect(rem).toBeLessThan(b);
        expect(Number(st.snapshot.rows.at(-1)!.text)).toBe(rem);
      }
      if (st.kind === "bring-down") {
        group = rem * 10 + digitList[st.column - offset];
        expect(Number(st.answer)).toBe(group);
        expect(Number(st.snapshot.rows.at(-1)!.text)).toBe(group);
      }
      if (st.kind === "remainder") expect(Number(st.answer)).toBe(rem);
    }
    expect(p.quotient).toBe(Math.floor(a / b));
    expect(p.remainder).toBe(a % b);
  });
  it("keeps internal and trailing zero quotient digits", () => {
    expect(
      buildProblem(1005, 5)
        .steps.filter((s) => s.kind === "divide")
        .map((s) => s.answer),
    ).toEqual(["2", "0", "1"]);
    expect(
      buildProblem(1010, 10)
        .steps.filter((s) => s.kind === "divide")
        .map((s) => s.answer),
    ).toEqual(["1", "0", "1"]);
    expect(
      buildProblem(1200, 6)
        .steps.filter((s) => s.kind === "divide")
        .map((s) => s.answer),
    ).toEqual(["2", "0", "0"]);
  });
  it("handles a larger divisor without changing the requested sizes", () => {
    const p = buildProblem(7, 1234);
    expect(p.quotient).toBe(0);
    expect(p.remainder).toBe(7);
    expect(p.steps.filter((s) => s.kind === "bring-down")).toHaveLength(0);
    expect(p.steps[0].explanation).toContain("smaller");
  });
  it("keeps earlier board snapshots immutable", () => {
    const p = buildProblem(1234, 12);
    expect(p.steps[0].snapshot.rows).toHaveLength(0);
    expect(p.steps[0].snapshot.quotient.join("")).toBe("");
    expect(
      p.steps.find((s) => s.kind === "subtract")!.snapshot.rows.at(-1)!.text,
    ).toBe("0");
  });
  it("does not offer a numerically true distractor in the final check", () => {
    for (let a = 1; a <= 40; a++)
      for (let b = 1; b <= 20; b++) {
        const p = buildProblem(a, b),
          st = p.steps.at(-1)!;
        for (const c of st.choices) {
          const expression = c.value
            .replace(/×/g, "*")
            .replace(/−/g, "-")
            .split("=");
          const value = Function(`return (${expression[0]})`)() as number;
          expect(value === Number(expression[1])).toBe(c.value === st.answer);
        }
      }
  });
  it.each([
    [0, 5],
    [10000, 3],
    [1, 0],
    [-3, 4],
    [1.5, 2],
  ])("rejects unsupported operands %s / %s", (a, b) =>
    expect(() => buildProblem(a, b)).toThrow(),
  );
});
describe("practice numeric input", () => {
  it.each([
    ["0", 0],
    ["1,234", 1234],
    [" 27 ", 27],
  ])("accepts %s", (s, n) => expect(parseAnswer(s)).toBe(n));
  it.each(["", "1,23", "-1", "3.5", "1/2", "Infinity", "1e3"])(
    "rejects %s",
    (s) => expect(parseAnswer(s)).toBeNull(),
  );
});
