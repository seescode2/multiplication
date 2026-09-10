'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const center=arg(2,3), f=x=>(x-center)**2+1, derivative=x=>2*(x-center);
console.log(`f(x)=(x-${center})²+1`);
for(const x of [center-1,center,center+1]) console.log(`x=${x}: f=${fmt(f(x))}, slope=${fmt(derivative(x))}`);
console.log(`The critical point is x=${center}, where slope is zero.`);
