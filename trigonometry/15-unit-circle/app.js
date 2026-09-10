'use strict';

const angle = Number(process.argv[2] ?? 60);
const radians = angle * Math.PI / 180;
const x = Math.cos(radians), y = Math.sin(radians);
console.log(`At ${angle}° on the unit circle:`);
console.log(`(cos, sin) = (${x.toFixed(3)}, ${y.toFixed(3)})`);
console.log(`Distance from center ≈ ${Math.hypot(x, y).toFixed(3)}`);
