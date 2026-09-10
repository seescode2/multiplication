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

const lo=Math.trunc(num(2,-4)),hi=Math.trunc(num(3,4)),xs=range(lo,hi),ys=xs.map(x=>x*x); console.log('x:   '+xs.map(fmt).join('  ')); console.log('x²:  '+ys.map(fmt).join('  ')); console.log('First differences: '+ys.slice(1).map((y,i)=>y-ys[i]).join(', '));
