'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const point = arg(2, 2), pointValue = arg(3, 4);
const nearby = x => x * x;
const expected = nearby(point);
console.log(`Nearby values approach ${fmt(expected)}, but f(${point}) is defined as ${pointValue}.`);
console.log(pointValue === expected ? 'Continuous: the limit equals the function value.' : 'Not continuous: there is a hole or a mismatched point.');
