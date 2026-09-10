'use strict';

const opposite = Number(process.argv[2] ?? 3);
const adjacent = Number(process.argv[3] ?? 4);
const tangent = opposite / adjacent;
console.log(`tan(angle) = opposite ÷ adjacent`);
console.log(`tan(angle) = ${opposite} ÷ ${adjacent} = ${tangent.toFixed(4)}`);
