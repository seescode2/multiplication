'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const initial=arg(2,2),k=arg(3,.5),time=arg(4,3), solution=t=>initial*Math.exp(k*t);
console.log(`For y′=${k}y and y(0)=${initial}, separation gives ln|y|=${k}t+C.`);
for(let t=0;t<=time;t+=time/3 || 1) console.log(`t=${fmt(t)} → y=${fmt(solution(t))}, slope=${fmt(k*solution(t))}`);
console.log(`At t=${time}, y=${fmt(solution(time))}.`);
