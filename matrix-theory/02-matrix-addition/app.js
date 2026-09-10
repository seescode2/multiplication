"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 2: Matrix Addition");
const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];
show("A", A); show("B", B); show("A + B", add(A, B));
