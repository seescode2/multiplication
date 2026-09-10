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

const p=num(2,25),amount=num(3,80),answer=p/100*amount; console.log(`${p}% = ${p}/100 = ${fmt(p/100)}`); console.log(`${p}% of ${amount} = ${fmt(answer)}`); const filled=Math.max(0,Math.min(20,Math.round(p/5))); console.log(`[${'#'.repeat(filled)}${'.'.repeat(20-filled)}]`);
