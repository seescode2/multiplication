'use strict';

const opposite = Number(process.argv[2] ?? 3);
const hypotenuse = Number(process.argv[3] ?? 5);
const sine = opposite / hypotenuse;
console.log(`sin(angle) = opposite ÷ hypotenuse`);
console.log(`sin(angle) = ${opposite} ÷ ${hypotenuse} = ${sine.toFixed(4)}`);
