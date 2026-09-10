'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const radius=arg(2,3), radiusRate=arg(3,2); if(radius<0) stop('Radius cannot be negative.');
const area=Math.PI*radius**2, areaRate=2*Math.PI*radius*radiusRate;
console.log(`radius=${radius}, dr/dt=${radiusRate}`);
console.log(`area=${fmt(area)}`);
console.log(`dA/dt=2πr·dr/dt=${fmt(areaRate)} square units per time`);
