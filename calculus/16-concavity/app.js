'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const center=arg(2,0), second=x=>6*(x-center);
console.log(`For f(x)=(x-${center})³:`);
for(const x of [center-2,center-1,center,center+1,center+2]) {
 const d2=second(x), shape=d2<0?'concave down':d2>0?'concave up':'inflection point';
 console.log(`x=${x}: second derivative=${fmt(d2)} → ${shape}`);
}
