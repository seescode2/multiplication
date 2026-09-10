'use strict';

const adjacent = Number(process.argv[2] ?? 4);
const hypotenuse = Number(process.argv[3] ?? 5);
const cosine = adjacent / hypotenuse;
console.log(`cos(angle) = adjacent ÷ hypotenuse`);
console.log(`cos(angle) = ${adjacent} ÷ ${hypotenuse} = ${cosine.toFixed(4)}`);
