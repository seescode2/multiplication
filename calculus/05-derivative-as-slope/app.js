'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x = arg(2, 3), f = n => n*n, h=.0001;
const slope=(f(x+h)-f(x))/h;
console.log(`For f(x)=x² at x=${x}:`);
console.log(`nearby rise=${fmt(f(x+h)-f(x))}, run=${h}`);
console.log(`estimated instant slope=${fmt(slope)} (exactly ${fmt(2*x)})`);
