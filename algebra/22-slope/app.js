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

const x1=num(2,1),y1=num(3,2),x2=num(4,5),y2=num(5,10),rise=y2-y1,run=x2-x1; console.log(`Rise = ${y2} - ${y1} = ${rise}`); console.log(`Run = ${x2} - ${x1} = ${run}`); console.log(run===0?'Slope is undefined (vertical line).':`Slope = ${rise}/${run} = ${fmt(rise/run)}`);
