'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const a=arg(2,0),b=arg(3,2), F=x=>(x*x+1)**2/2;
const ua=a*a+1,ub=b*b+1;
console.log(`For ∫2x(x²+1) dx from ${a} to ${b}, let u=x²+1 and du=2x dx.`);
console.log(`x-bounds [${a},${b}] become u-bounds [${fmt(ua)},${fmt(ub)}].`);
console.log(`∫u du = u²/2 gives ${fmt((ub*ub-ua*ua)/2)} (check: ${fmt(F(b)-F(a))}).`);
