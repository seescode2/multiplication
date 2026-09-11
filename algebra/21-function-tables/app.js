"use strict";

function num(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function stop(message) {
  console.error(message);
  process.exit(1);
}
function fmt(value) {
  return Number(Number(value).toFixed(6));
}
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
function range(start, end) {
  const step = start <= end ? 1 : -1;
  return Array.from(
    { length: Math.abs(end - start) + 1 },
    (_, i) => start + i * step,
  );
}
function bar(start, end, marks = []) {
  return range(start, end)
    .map((n) => (marks.includes(n) ? `[${n}]` : ` ${n} `))
    .join("—");
}

const m = num(2, 3),
  b = num(3, -2),
  lo = Math.trunc(num(4, -2)),
  hi = Math.trunc(num(5, 2));
console.log(`Rule: y = ${m}x + ${b}`);
console.log(" x | y\n---+---");
range(lo, hi).forEach((x) =>
  console.log(`${String(x).padStart(2)} | ${fmt(m * x + b)}`),
);
