'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

let a=arg(2,0),b=arg(3,1); if(a>b)[a,b]=[b,a];
const top=x=>Math.max(x,x*x), bottom=x=>Math.min(x,x*x), n=10000,w=(b-a)/n;let area=0;
for(let i=0;i<n;i++){const x=a+(i+.5)*w;area+=(top(x)-bottom(x))*w;}
console.log(`Adding top-minus-bottom gaps between y=x and y=x² on [${a},${b}].`);
console.log(`estimated geometric area=${fmt(area)}`);
