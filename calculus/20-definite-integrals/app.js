'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const a=arg(2,0), b=arg(3,4), n=10000, f=x=>x;
const width=(b-a)/n; let sum=0;
for(let i=0;i<n;i++) sum+=f(a+(i+.5)*width)*width;
console.log(`Adding ${n} thin signed rectangles under f(x)=x from ${a} to ${b}.`);
console.log(`estimated integral=${fmt(sum)}`);
console.log(`exact integral=(b²-a²)/2=${fmt((b*b-a*a)/2)}`);
