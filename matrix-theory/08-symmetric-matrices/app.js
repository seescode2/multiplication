"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 8: Symmetric Matrices");
const A = [[2, 3, -1], [3, 5, 4], [-1, 4, 0]];
show("A", A); show("transpose(A)", transpose(A));
console.log("Symmetric?", equal(A, transpose(A)));
