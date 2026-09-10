'use strict';

const angle = Number(process.argv[2] ?? 37);
const radians = angle * Math.PI / 180;
const sine = Math.sin(radians), cosine = Math.cos(radians);
console.log(`sin²(${angle}°) + cos²(${angle}°)`);
console.log(`= ${sine.toFixed(4)}² + ${cosine.toFixed(4)}²`);
console.log(`= ${(sine * sine + cosine * cosine).toFixed(10)}`);
