'use strict';

const angle = Number(process.argv[2] ?? 30);
const radians = angle * Math.PI / 180;
console.log(`Angle: ${angle}°`);
console.log(`sin ≈ ${Math.sin(radians).toFixed(6)}`);
console.log(`cos ≈ ${Math.cos(radians).toFixed(6)}`);
console.log(`tan ≈ ${Math.abs(Math.cos(radians)) < 1e-12 ? 'undefined' : Math.tan(radians).toFixed(6)}`);
