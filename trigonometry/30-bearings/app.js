'use strict';

const distance = Number(process.argv[2] ?? 10);
const bearing = Number(process.argv[3] ?? 30);
const radians = bearing * Math.PI / 180;
const east = distance * Math.sin(radians), north = distance * Math.cos(radians);
console.log(`Travel ${distance} units on bearing ${bearing}°.`);
console.log(`East movement: ${east.toFixed(3)}`);
console.log(`North movement: ${north.toFixed(3)}`);
