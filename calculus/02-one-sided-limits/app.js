'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const jump = arg(2, 3);
const f = x => x < jump ? 1 : 5;
console.log(`The rule jumps at x = ${jump}.`);
for (const h of [.1, .01, .001]) console.log(`h=${h}: from left → ${f(jump-h)}, from right → ${f(jump+h)}`);
console.log('The two one-sided limits disagree, so the two-sided limit does not exist.');
