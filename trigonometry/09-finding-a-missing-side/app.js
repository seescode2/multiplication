'use strict';

const angle = Number(process.argv[2] ?? 30);
const hypotenuse = Number(process.argv[3] ?? 10);
const opposite = hypotenuse * Math.sin(angle * Math.PI / 180);
console.log(`opposite = hypotenuse × sin(angle)`);
console.log(`opposite = ${hypotenuse} × sin(${angle}°) = ${opposite.toFixed(3)}`);
