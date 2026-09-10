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

const a=num(2,1),b=num(3,-5),c=num(4,6); if(a===0) stop('a must not be zero for a quadratic.'); const d=b*b-4*a*c; console.log(`Discriminant b² - 4ac = ${fmt(d)}`); if(d<0) console.log('There are no real-number roots.'); else {const roots=[(-b+Math.sqrt(d))/(2*a),(-b-Math.sqrt(d))/(2*a)]; console.log(`Root${d===0?'':'s'}: ${[...new Set(roots.map(fmt))].join(', ')}`);}
