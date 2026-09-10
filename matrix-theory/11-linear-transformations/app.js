"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 11: Linear Transformations");
const A = [[2, 1], [0, 1]];
const points = [[0,0], [1,0], [1,1], [0,1]];
console.log("point -> transformed point");
for (const p of points) console.log(`${p} -> ${matVec(A,p)}`);
