'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

let a=arg(2,0),b=arg(3,2); if(a>b)[a,b]=[b,a]; const n=10000,w=(b-a)/n;let volume=0;
for(let i=0;i<n;i++){const radius=a+(i+.5)*w;volume+=Math.PI*radius*radius*w;}
console.log(`Rotating y=x on [${a},${b}] creates disks of area πx².`);
console.log(`estimated volume=${fmt(volume)}`);
console.log(`exact π(b³-a³)/3=${fmt(Math.PI*(b**3-a**3)/3)}`);
