'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const x=arg(2,2), inside=x=>3*x+1;
const outsideRate=2*inside(x), insideRate=3;
console.log(`For (3x+1)² at x=${x}: inside=${inside(x)}`);
console.log(`outside rate=${fmt(outsideRate)}, inside rate=${insideRate}`);
console.log(`chain-rule derivative=${fmt(outsideRate*insideRate)}`);
