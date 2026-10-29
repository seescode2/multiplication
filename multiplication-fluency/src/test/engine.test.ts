import { describe, expect, it } from "vitest";
import {
  buildProblem,
  generateProblem,
  parseAnswer,
  type Digits,
} from "../engine";

describe("problem generation", () => {
  it.each([2, 3, 4] as Digits[])(
    "keeps %s digits on top and samples all bottom lengths",
    (digits) => {
      const lengths = new Set<number>();
      let previous;
      for (let seed = 0; seed < 300; seed++) {
        const p = generateProblem(digits, seed, previous);
        expect(String(p.top)).toHaveLength(digits);
        lengths.add(String(p.bottom).length);
        expect(p.bottom).toBeGreaterThan(0);
        expect(String(p.bottom).length).toBeLessThanOrEqual(digits);
        expect(p.top === previous?.top && p.bottom === previous?.bottom).toBe(
          false,
        );
        expect(p.answer).toBe(p.top * p.bottom);
        previous = p;
      }
      expect([...lengths].sort()).toEqual(
        Array.from({ length: digits }, (_, i) => i + 1),
      );
    },
  );
  it("is deterministic and skips a consecutive duplicate", () => {
    const p = generateProblem(4, 42);
    expect(generateProblem(4, 42)).toEqual(p);
    const next = generateProblem(4, 42, p);
    expect([next.top, next.bottom]).not.toEqual([p.top, p.bottom]);
  });
});
describe("authoritative long-multiplication steps", () => {
  it.each([
    [99, 99],
    [1234, 305],
    [1000, 1000],
    [9999, 9999],
    [101, 20],
    [24, 3],
    [1042, 9008],
    [10, 10],
  ])(
    "solves %i × %i with carries, zero rows, and aligned partial products",
    (top, bottom) => {
      const p = buildProblem(top, bottom),
        bottomDigits = String(bottom).split("").reverse().map(Number);
      const completed = p.steps.filter((s) => s.kind === "row");
      expect(completed.map((s) => Number(s.answer))).toEqual(
        bottomDigits.map((d, i) => top * d * 10 ** i),
      );
      expect(
        completed
          .at(-1)!
          .snapshot.rows.map(Number)
          .reduce((a, b) => a + b, 0),
      ).toBe(top * bottom);
      const final = p.steps.at(-1)!;
      expect(final.snapshot.result).toBe(String(top * bottom));
      expect(final.snapshot.carry).toBe(0);
      expect(final.snapshot.active).toBeNull();
      const additions = p.steps.filter((s) => s.kind === "add");
      additions.forEach((s, i) =>
        expect(Number(s.snapshot.result)).toBe((top * bottom) % 10 ** (i + 1)),
      );
      for (const s of p.steps) {
        expect(s.choices).toHaveLength(4);
        expect(new Set(s.choices.map((c) => c.value)).size).toBe(4);
        expect(s.choices.filter((c) => c.value === s.answer)).toHaveLength(1);
        if (s.kind === "multiply") {
          const col = s.topColumn!,
            row = s.bottomColumn!,
            digit = Number(String(top).at(-1 - col));
          const rowSteps = p.steps.filter(
            (st) => st.kind === "multiply" && st.bottomColumn === row,
          );
          const incoming = col ? rowSteps[col - 1].snapshot.carry : 0;
          const total = digit * bottomDigits[row] + incoming;
          expect(s.answer).toBe(
            `Write ${total % 10}; carry ${Math.floor(total / 10)}`,
          );
          expect(s.snapshot.active!.endsWith("0".repeat(row))).toBe(true);
        }
      }
    },
  );
  it("keeps zero multiplier rows and shifts by the digit place, not the digit value", () => {
    const p = buildProblem(1234, 305);
    expect(
      p.steps.filter((s) => s.kind === "shift").map((s) => s.answer),
    ).toEqual(["1 zero", "2 zeros"]);
    expect(
      p.steps.filter((s) => s.kind === "row").map((s) => s.answer),
    ).toEqual(["6170", "0", "370200"]);
    expect(p.answer).toBe(376370);
  });
  it("resets the carry between partial-product rows", () => {
    const p = buildProblem(999, 99);
    expect(
      p.steps
        .filter((s) => s.kind === "multiply" && s.topColumn === 0)
        .map((s) => s.answer),
    ).toEqual(["Write 1; carry 8", "Write 1; carry 8"]);
  });
  it("verifies 900 generated products and column sums", () => {
    for (const d of [2, 3, 4] as Digits[])
      for (let i = 0; i < 300; i++) {
        const p = generateProblem(d, i);
        expect(Number(p.steps.at(-1)!.snapshot.result)).toBe(p.top * p.bottom);
        expect(
          p.steps
            .filter((s) => s.kind === "row")
            .reduce((sum, s) => sum + Number(s.answer), 0),
        ).toBe(p.answer);
      }
  });
  it.each([
    [1, 4],
    [12345, 2],
    [34, 100],
    [12, 0],
    [12, 1.5],
  ])("rejects unsupported input %s × %s", (a, b) =>
    expect(() => buildProblem(a, b)).toThrow(),
  );
});
describe("answer validation", () => {
  it.each([
    ["1234", 1234],
    [" 1,234 ", 1234],
    ["0", 0],
    ["99,980,001", 99980001],
  ])("accepts %s", (value, answer) => expect(parseAnswer(value)).toBe(answer));
  it.each(["", "1,23", "12 34", "1.5", "Infinity", "1e3", "-5", "1/2", "NaN"])(
    "rejects %s",
    (value) => expect(parseAnswer(value)).toBeNull(),
  );
});
