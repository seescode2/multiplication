'use strict';

const opposite = Number(process.argv[2] ?? 3);
const adjacent = Number(process.argv[3] ?? 4);
const hypotenuse = Math.hypot(opposite, adjacent);
console.log(`Sides: opposite=${opposite}, adjacent=${adjacent}, hypotenuse=${hypotenuse.toFixed(3)}`);
console.log(`SOH: sin = ${(opposite / hypotenuse).toFixed(3)}`);
console.log(`CAH: cos = ${(adjacent / hypotenuse).toFixed(3)}`);
console.log(`TOA: tan = ${(opposite / adjacent).toFixed(3)}`);
