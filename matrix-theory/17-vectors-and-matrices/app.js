"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 17: Vectors and Matrices");
const A=[[2,1],[-1,3]], v=[4,2];
show("A",A); console.log("v =",v); console.log("A × v =",matVec(A,v));
console.log("first output = 2×4 + 1×2");
