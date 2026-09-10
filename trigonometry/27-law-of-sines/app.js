'use strict';

const sideA = Number(process.argv[2] ?? 8);
const angleA = Number(process.argv[3] ?? 40);
const angleB = Number(process.argv[4] ?? 65);
const sideB = sideA * Math.sin(angleB * Math.PI / 180) / Math.sin(angleA * Math.PI / 180);
console.log(`a/sin(A) = b/sin(B)`);
console.log(`${sideA}/sin(${angleA}°) = b/sin(${angleB}°)`);
console.log(`b ≈ ${sideB.toFixed(3)}`);
