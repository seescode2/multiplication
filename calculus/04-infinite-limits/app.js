'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const start = Math.abs(arg(2, 1));
console.log('Approaching zero for f(x) = 1/x²');
for (const scale of [1, .1, .01, .001]) { const x=start*scale; console.log(`x=±${fmt(x)} → f(x)=${fmt(1/(x*x))}`); }
console.log('The outputs grow without bound: the limit is +Infinity.');
