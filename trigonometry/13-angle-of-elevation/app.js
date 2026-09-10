'use strict';

const height = Number(process.argv[2] ?? 10);
const distance = Number(process.argv[3] ?? 20);
const angle = Math.atan2(height, distance) * 180 / Math.PI;
console.log(`You look ${height} units up across ${distance} ground units.`);
console.log(`Angle of elevation ≈ ${angle.toFixed(2)}°`);
