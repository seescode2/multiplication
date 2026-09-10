'use strict';

function num(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function stop(message) { console.error(message); process.exit(1); }
function fmt(value) { return Number(Number(value).toFixed(6)); }
function gcd(a, b) { a=Math.abs(a); b=Math.abs(b); while(b) [a,b]=[b,a%b]; return a || 1; }
function range(start,end) { const step=start<=end?1:-1; return Array.from({length:Math.abs(end-start)+1},(_,i)=>start+i*step); }
function bar(start,end,marks=[]) { return range(start,end).map(n=>marks.includes(n)?`[${n}]`:` ${n} `).join('—'); }

const m1=num(2,2),b1=num(3,1),m2=num(4,-1),b2=num(5,7); console.log(`y = ${m1}x + ${b1}`); console.log(`y = ${m2}x + ${b2}`); if(m1===m2) console.log(b1===b2?'Same line: infinitely many solutions.':'Parallel lines: no solution.'); else {const x=(b2-b1)/(m1-m2),y=m1*x+b1; console.log(`Intersection: (${fmt(x)}, ${fmt(y)})`);}
