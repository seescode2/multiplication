"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 10: Inverse Matrix");
const A = [[2, 1], [1, 1]];
const inv = inverse2(A);
show("A", A); show("inverse(A)", inv); show("A × inverse(A)", multiply(A, inv));
