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

const x=num(2,-3),y=num(3,4); let place=x===0&&y===0?'the origin':x===0?'the y-axis':y===0?'the x-axis':`Quadrant ${x>0?(y>0?'I':'IV'):(y>0?'II':'III')}`; console.log(`Point (${x}, ${y}) is on ${place}.`); console.log(`Move ${Math.abs(x)} ${x<0?'left':'right'}, then ${Math.abs(y)} ${y<0?'down':'up'}.`);
