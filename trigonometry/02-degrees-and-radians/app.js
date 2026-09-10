'use strict';

const degrees = Number(process.argv[2] ?? 180);
const radians = degrees * Math.PI / 180;
console.log(`${degrees}° = ${radians.toFixed(4)} radians.`);
console.log(`In terms of π: ${degrees / 180} × π radians.`);
