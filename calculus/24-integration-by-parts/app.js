'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const a=arg(2,0),b=arg(3,2), anti=x=>(x-1)*Math.exp(x);
const uv=x=>x*Math.exp(x), remaining=Math.exp(b)-Math.exp(a);
console.log(`For ∫x·eˣ dx on [${a},${b}], choose u=x and dv=eˣdx.`);
console.log(`boundary uv = ${fmt(uv(b)-uv(a))}; subtract ∫eˣdx = ${fmt(remaining)}.`);
console.log(`result=${fmt(anti(b)-anti(a))}`);
