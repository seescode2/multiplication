"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 4: Matrix Multiplication");
const A = [[1, 2, 3], [4, 5, 6]];
const B = [[1, 2], [0, 1], [2, 0]];
show("A", A); show("B", B); show("A × B", multiply(A, B));
console.log("First result entry = 1×1 + 2×0 + 3×2 =", multiply(A,B)[0][0]);
