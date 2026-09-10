'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,1), h=1e-6;
const sinEstimate=(Math.sin(x+h)-Math.sin(x))/h;
const cosEstimate=(Math.cos(x+h)-Math.cos(x))/h;
console.log(`At x=${x} radians:`);
console.log(`sin slope ≈ ${fmt(sinEstimate)}; cos(x)=${fmt(Math.cos(x))}`);
console.log(`cos slope ≈ ${fmt(cosEstimate)}; -sin(x)=${fmt(-Math.sin(x))}`);
