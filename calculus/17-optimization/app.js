'use strict';

function stop(message) { console.error(message); process.exit(1); }
function arg(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function fmt(value) { return Number(Number(value).toFixed(6)); }

const perimeter=arg(2,20); if(perimeter<=0) stop('Perimeter must be positive.');
let best={area:-Infinity};
for(let width=.1;width<perimeter/2;width+=.1){const height=perimeter/2-width, area=width*height;if(area>best.area)best={width,height,area};}
console.log(`Perimeter=${perimeter}. Testing many rectangles...`);
console.log(`best sampled width=${fmt(best.width)}, height=${fmt(best.height)}, area=${fmt(best.area)}`);
console.log(`Calculus predicts a square: each side ${fmt(perimeter/4)}.`);
