'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const cutoff=arg(2,10); if(cutoff<=1)stop('Use a cutoff greater than 1.');
console.log('For ∫₁^∞ 1/x² dx, replace infinity with a growing cutoff R.');
for(const R of [2,5,cutoff,cutoff*10]) console.log(`R=${fmt(R)}: area=1-1/R=${fmt(1-1/R)}`);
console.log('As R grows, the areas approach 1, so this improper integral converges.');
