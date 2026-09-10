"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 9: Determinant");
for (const A of [[[2,0],[0,3]], [[1,2],[2,4]], [[0,-1],[1,0]]]) {
  show("Matrix", A); console.log("determinant =", determinant2(A), "| area scale =", Math.abs(determinant2(A))); }
