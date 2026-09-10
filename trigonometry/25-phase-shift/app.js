'use strict';

const angle = Number(process.argv[2] ?? 60);
const shift = Number(process.argv[3] ?? 60);
const before = Math.sin(angle * Math.PI / 180);
const after = Math.sin((angle - shift) * Math.PI / 180);
console.log(`At x = ${angle}°, ordinary sine is ${before.toFixed(3)}.`);
console.log(`sin(x − ${shift}°) uses ${angle - shift}° and equals ${after.toFixed(3)}.`);
