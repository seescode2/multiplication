'use strict';

const opposite = Number(process.argv[2] ?? 3);
const adjacent = Number(process.argv[3] ?? 4);
const angle = Math.atan2(opposite, adjacent) * 180 / Math.PI;
console.log(`angle = tan⁻¹(${opposite} ÷ ${adjacent})`);
console.log(`angle ≈ ${angle.toFixed(2)}°`);
