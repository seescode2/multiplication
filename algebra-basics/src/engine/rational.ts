export interface Rational {
  n: number;
  d: number;
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
export function rat(n: number, d = 1): Rational {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0)
    throw new Error("Invalid rational");
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d),
    sign = d < 0 ? -1 : 1;
  return { n: (sign * n) / g, d: (sign * d) / g };
}
export const add = (a: Rational, b: Rational) =>
  rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const neg = (a: Rational) => rat(-a.n, a.d);
export const sub = (a: Rational, b: Rational) => add(a, neg(b));
export const mul = (a: Rational, b: Rational) => rat(a.n * b.n, a.d * b.d);
export const div = (a: Rational, b: Rational) => rat(a.n * b.d, a.d * b.n);
export const equal = (a: Rational, b: Rational) => a.n === b.n && a.d === b.d;
export const text = (a: Rational) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);
export const tex = (a: Rational): string =>
  a.d === 1
    ? `${a.n}`
    : `${a.n < 0 ? "-" : ""}\\frac{${Math.abs(a.n)}}{${a.d}}`;
export function parseAnswer(input: string): Rational | null {
  const value = input.trim().replace(/−/g, "-");
  try {
    if (/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(value)) {
      const [n, d] = value.split("/").map(Number);
      return rat(n, d);
    }
    if (!/^[+-]?(?:\d+(?:\.\d{0,9})?|\.\d{1,9})$/.test(value)) return null;
    const digits = value.split(".")[1]?.length ?? 0;
    return rat(Math.round(Number(value) * 10 ** digits), 10 ** digits);
  } catch {
    return null;
  }
}
