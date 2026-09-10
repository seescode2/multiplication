'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,2), f=n=>n*n+1;
console.log(`Secant slopes near x=${x} for f(x)=x²+1`);
for(const h of [1,.5,.1,.01,.001]) console.log(`h=${h}: ${fmt((f(x+h)-f(x))/h)}`);
console.log(`They approach ${fmt(2*x)}.`);
