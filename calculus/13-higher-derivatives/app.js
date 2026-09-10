'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const t=arg(2,2);
const position=t=>t**3, velocity=t=>3*t*t, acceleration=t=>6*t;
console.log(`At time ${t}: position=${fmt(position(t))}`);
console.log(`first derivative (velocity)=${fmt(velocity(t))}`);
console.log(`second derivative (acceleration)=${fmt(acceleration(t))}`);
