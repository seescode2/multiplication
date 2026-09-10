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

const a=num(2,5),b=num(3,2),c=num(4,2),d=num(5,14); console.log(`${a}x + ${b} = ${c}x + ${d}`); if(a===c){console.log(b===d?'Every number works: both sides are identical.':'No solution: equal x-terms leave unequal numbers.');}else{const x=(d-b)/(a-c); console.log(`${a-c}x = ${d-b}`); console.log(`x = ${fmt(x)}`);}
