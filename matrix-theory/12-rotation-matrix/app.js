"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 12: Rotation Matrix");
for (const degrees of [0, 45, 90, 180]) {
 const t = degrees * Math.PI / 180; const R=[[Math.cos(t),-Math.sin(t)],[Math.sin(t),Math.cos(t)]];
 const v=matVec(R,[1,0]); console.log(`${degrees}°: ${v.map(round)}; length ${round(norm(v))}`); }
