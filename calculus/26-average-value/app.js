'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

let a=arg(2,0),b=arg(3,3); if(a===b)stop('Use two different endpoints.'); if(a>b)[a,b]=[b,a];
const integral=(b**3-a**3)/3, average=integral/(b-a);
console.log(`For f(x)=x² on [${a},${b}]:`);
console.log(`total area=${fmt(integral)}, width=${fmt(b-a)}`);
console.log(`average height=${fmt(average)}`);
