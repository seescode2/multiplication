'use strict';

const sideA = Number(process.argv[2] ?? 3);
const sideB = Number(process.argv[3] ?? 4);
const scale = Number(process.argv[4] ?? 2);
console.log(`Original sides: ${sideA}, ${sideB}`);
console.log(`Similar sides: ${sideA * scale}, ${sideB * scale}`);
console.log(`Every matching side was multiplied by ${scale}.`);
