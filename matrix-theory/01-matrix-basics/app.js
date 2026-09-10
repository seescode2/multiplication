"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 1: Matrix Basics");
const A = [[2, 5, 1], [4, 0, 3]];
show("A", A);
console.log(`A has ${A.length} rows and ${A[0].length} columns.`);
console.log("Entry in row 2, column 3:", A[1][2]);
