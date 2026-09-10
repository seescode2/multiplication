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

const a=num(2,2),b=num(3,3),c=num(4,8); if(a===0||b===0) stop('a and b must not be zero.'); const x=b*c/a; console.log(`${a}/${b} = ${c}/x`); console.log(`Cross multiply: ${a}x = ${b*c}`); console.log(`x = ${fmt(x)}`); console.log(`Check: ${fmt(a/b)} = ${fmt(c/x)}`);
