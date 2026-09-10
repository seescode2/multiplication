"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 22: Matrix Rank");
const matrices=[[[1,0],[0,1]],[[1,2],[2,4]],[[0,0],[0,0]]];
for(const A of matrices){ show("A",A); console.log("rank =",rank(A)); }
