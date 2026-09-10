'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const target = arg(2, 2);
const f = x => x * x;
console.log(`Approaching x = ${target} for f(x) = x²`);
for (const h of [1, .5, .1, .01, .001]) console.log(`h=${h}: left ${fmt(f(target-h))} | right ${fmt(f(target+h))}`);
console.log(`Both sides approach ${fmt(f(target))}.`);
