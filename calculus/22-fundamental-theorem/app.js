'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const a=arg(2,1), b=arg(3,4), position=t=>t*t, velocity=t=>2*t;
const n=10000,w=(b-a)/n;let accumulated=0;
for(let i=0;i<n;i++) accumulated+=velocity(a+(i+.5)*w)*w;
console.log(`Accumulated velocity from t=${a} to t=${b}: ${fmt(accumulated)}`);
console.log(`Position change: ${fmt(position(b))} - ${fmt(position(a))} = ${fmt(position(b)-position(a))}`);
