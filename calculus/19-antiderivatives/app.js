'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,4), C=arg(3,7);
const original=x=>2*x, anti=x=>x*x+C, h=1e-5;
const recovered=(anti(x+h)-anti(x-h))/(2*h);
console.log(`f(x)=2x. One antiderivative is F(x)=x²+${C}.`);
console.log(`At x=${x}: f(x)=${fmt(original(x))}, numerical F′(x)=${fmt(recovered)}`);
console.log('Changing C shifts F but does not change F′.');
