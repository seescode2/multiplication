'use strict';

const height = Number(process.argv[2] ?? 12);
const distance = Number(process.argv[3] ?? 30);
const angle = Math.atan2(height, distance) * 180 / Math.PI;
console.log(`Viewpoint height: ${height}; horizontal distance: ${distance}`);
console.log(`Angle of depression ≈ ${angle.toFixed(2)}°`);
