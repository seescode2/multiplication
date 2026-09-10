'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,2);
const f=x=>x*x, fp=x=>2*x, g=x=>x+1, gp=()=>1;
const first=fp(x)*g(x), second=f(x)*gp(x);
console.log(`For (x²)(x+1) at x=${x}:`);
console.log(`f′g = ${fmt(first)}, fg′ = ${fmt(second)}`);
console.log(`product derivative = ${fmt(first+second)}`);
