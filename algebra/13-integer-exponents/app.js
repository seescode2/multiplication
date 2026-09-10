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

const base=num(2,3),exp=Math.trunc(num(3,4)); if(exp<0) stop('Use a nonnegative exponent in this lab.'); const factors=exp===0?'no factors (special rule)':Array(exp).fill(base).join(' × '); console.log(`${base}^${exp}: ${factors}`); console.log(`Answer: ${base**exp}`);
