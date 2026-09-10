'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,2), f=x=>x*x, fp=x=>2*x, g=x=>x+1, gp=()=>1;
if(g(x)===0) stop('x = -1 makes the original denominator zero.');
const top=fp(x)*g(x)-f(x)*gp(x), bottom=g(x)**2;
console.log(`For x²/(x+1) at x=${x}: numerator=${fmt(top)}, denominator=${fmt(bottom)}`);
console.log(`quotient derivative=${fmt(top/bottom)}`);
