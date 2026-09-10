'use strict';

const opposite = Number(process.argv[2] ?? 3);
const hypotenuse = Number(process.argv[3] ?? 5);
const angle = Math.asin(opposite / hypotenuse) * 180 / Math.PI;
console.log(`angle = sin⁻¹(${opposite} ÷ ${hypotenuse})`);
console.log(`angle ≈ ${angle.toFixed(2)}°`);
