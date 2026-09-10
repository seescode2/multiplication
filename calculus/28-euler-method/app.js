'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

let y=arg(2,1), step=arg(3,.25), steps=Math.max(1,Math.floor(arg(4,4))); if(step<=0)stop('Step size must be positive.');
let t=0; console.log('Solving y′=y with Euler steps:');
for(let i=0;i<steps;i++){console.log(`t=${fmt(t)}, y≈${fmt(y)}, slope=${fmt(y)}`);y+=step*y;t+=step;}
console.log(`t=${fmt(t)}, Euler y≈${fmt(y)}, exact y=${fmt(arg(2,1)*Math.exp(t))}`);
