'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,2); if(x<=0) stop('Use x > 0 so ln(x) is defined.');
const h=1e-6;
console.log(`At x=${x}:`);
console.log(`slope of e^x ≈ ${fmt((Math.exp(x+h)-Math.exp(x))/h)}; e^x=${fmt(Math.exp(x))}`);
console.log(`slope of ln(x) ≈ ${fmt((Math.log(x+h)-Math.log(x))/h)}; 1/x=${fmt(1/x)}`);
