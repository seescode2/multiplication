"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 6: Zero Matrix");
const A = [[3, -1], [2, 5]];
const Z = zeros(2, 2);
show("A + Z", add(A, Z)); show("A × Z", multiply(A, Z));
