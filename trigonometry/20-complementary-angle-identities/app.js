'use strict';

const angle = Number(process.argv[2] ?? 25);
const complement = 90 - angle;
const left = Math.sin(angle * Math.PI / 180);
const right = Math.cos(complement * Math.PI / 180);
console.log(`${angle}° and ${complement}° are complementary.`);
console.log(`sin(${angle}°) = ${left.toFixed(6)}`);
console.log(`cos(${complement}°) = ${right.toFixed(6)}`);
