'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const center=arg(2,0), derivative=x=>2*(x-center);
for(const x of [center-2,center-1,center,center+1,center+2]) {
 const d=derivative(x), behavior=d<0?'decreasing':d>0?'increasing':'flat';
 console.log(`x=${x}: derivative=${fmt(d)} → ${behavior}`);
}
