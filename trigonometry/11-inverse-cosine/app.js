'use strict';

const adjacent = Number(process.argv[2] ?? 4);
const hypotenuse = Number(process.argv[3] ?? 5);
const angle = Math.acos(adjacent / hypotenuse) * 180 / Math.PI;
console.log(`angle = cos⁻¹(${adjacent} ÷ ${hypotenuse})`);
console.log(`angle ≈ ${angle.toFixed(2)}°`);
