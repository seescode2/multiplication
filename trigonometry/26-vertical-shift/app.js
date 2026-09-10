'use strict';

const angle = Number(process.argv[2] ?? 30);
const shift = Number(process.argv[3] ?? 2);
const before = Math.sin(angle * Math.PI / 180);
console.log(`sin(${angle}°) = ${before.toFixed(3)}`);
console.log(`sin(${angle}°) + ${shift} = ${(before + shift).toFixed(3)}`);
console.log(`The wave's middle line is now y = ${shift}.`);
