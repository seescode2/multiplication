"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 5: Identity Matrix");
const A = [[3, 1], [2, 4]];
const I = identity(2);
show("A", A); show("I", I); show("A × I", multiply(A, I));
