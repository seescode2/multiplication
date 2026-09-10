'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const n=Math.max(1,Math.floor(arg(2,4))), a=0,b=2,f=x=>x*x,w=(b-a)/n;
let left=0,right=0,middle=0;
for(let i=0;i<n;i++){left+=f(a+i*w)*w;right+=f(a+(i+1)*w)*w;middle+=f(a+(i+.5)*w)*w;}
console.log(`${n} rectangles for x² on [0,2], exact area=8/3≈${fmt(8/3)}`);
console.log(`left=${fmt(left)}, right=${fmt(right)}, midpoint=${fmt(middle)}`);
