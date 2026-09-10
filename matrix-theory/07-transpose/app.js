"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 7: Transpose");
const A = [[1, 2, 3], [4, 5, 6]];
show("A", A); show("transpose(A)", transpose(A)); show("transpose twice", transpose(transpose(A)));
