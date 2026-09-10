'use strict';

const a = Number(process.argv[2] ?? 6);
const b = Number(process.argv[3] ?? 8);
const angle = Number(process.argv[4] ?? 30);
const area = 0.5 * a * b * Math.sin(angle * Math.PI / 180);
console.log(`Area = ½ × ${a} × ${b} × sin(${angle}°)`);
console.log(`Area ≈ ${area.toFixed(3)} square units`);
