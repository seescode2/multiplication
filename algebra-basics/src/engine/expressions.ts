import { add, div, equal, mul, rat, tex, type Rational } from "./rational";

export type Expr =
  | { kind: "number"; value: Rational }
  | { kind: "variable" }
  | { kind: "add" | "multiply" | "divide"; a: Expr; b: Expr };
export interface Equation {
  left: Expr;
  right: Expr;
}
export interface Linear {
  a: Rational;
  b: Rational;
}
export const num = (n: number | Rational): Expr => ({
  kind: "number",
  value: typeof n === "number" ? rat(n) : n,
});
export const x: Expr = { kind: "variable" };
export const sum = (a: Expr, b: Expr): Expr => ({ kind: "add", a, b });
export const product = (a: Expr, b: Expr): Expr => ({ kind: "multiply", a, b });
export const quotient = (a: Expr, b: Expr): Expr => ({ kind: "divide", a, b });
export function linear(e: Expr): Linear {
  if (e.kind === "number") return { a: rat(0), b: e.value };
  if (e.kind === "variable") return { a: rat(1), b: rat(0) };
  const a = linear(e.a),
    b = linear(e.b);
  if (e.kind === "add") return { a: add(a.a, b.a), b: add(a.b, b.b) };
  if (e.kind === "divide") {
    if (b.a.n) throw new Error("Variable denominator");
    return { a: div(a.a, b.b), b: div(a.b, b.b) };
  }
  if (a.a.n && b.a.n) throw new Error("Nonlinear expression");
  return { a: add(mul(a.a, b.b), mul(b.a, a.b)), b: mul(a.b, b.b) };
}
export const evaluate = (e: Expr, value: Rational) => {
  const { a, b } = linear(e);
  return add(mul(a, value), b);
};
export const satisfies = (e: Equation, value: Rational) =>
  equal(evaluate(e.left, value), evaluate(e.right, value));
export function canonical(e: Expr): Expr {
  const { a, b } = linear(e);
  if (!a.n) return num(b);
  const variable = equal(a, rat(1)) ? x : product(num(a), x);
  return b.n ? sum(variable, num(b)) : variable;
}
export function expressionTex(e: Expr): string {
  if (e.kind === "number") return tex(e.value);
  if (e.kind === "variable") return "x";
  const a = expressionTex(e.a),
    b = expressionTex(e.b);
  if (e.kind === "divide") return `\\frac{${a}}{${b}}`;
  if (e.kind === "add")
    return `${a} ${b.startsWith("-") ? "- " + b.slice(1) : "+ " + b}`;
  if (e.a.kind === "number" && e.b.kind === "variable")
    return equal(e.a.value, rat(-1)) ? "-x" : `${a}x`;
  const wrap = (part: Expr, value: string) =>
    part.kind === "add" || (part.kind === "number" && part.value.n < 0)
      ? `\\left(${value}\\right)`
      : value;
  return `${wrap(e.a, a)} \\times ${wrap(e.b, b)}`;
}
export const equationTex = (e: Equation) =>
  `${expressionTex(e.left)} = ${expressionTex(e.right)}`;
