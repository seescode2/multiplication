'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const n=arg(2,3), x=arg(3,2), f=t=>t**n, h=1e-5;
const exact=n*x**(n-1), estimate=(f(x+h)-f(x))/h;
console.log(`f(x)=x^${n} at x=${x}`);
console.log(`Power rule: ${n}·${x}^${n-1} = ${fmt(exact)}`);
console.log(`Tiny-step check: ${fmt(estimate)}`);
