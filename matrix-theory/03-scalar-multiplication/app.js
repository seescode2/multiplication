"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 3: Scalar Multiplication");
const A = [[1, -2], [3, 0]];
for (const k of [2, -1, 0.5]) show(`${k} × A`, scale(k, A));
