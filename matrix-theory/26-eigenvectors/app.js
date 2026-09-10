"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 26: Eigenvectors");
const A=[[3,0],[0,2]];
for(const v of [[1,0],[0,1],[1,1]]) { const out=matVec(A,v); console.log(`${v} -> ${out}; same direction? ${parallel(v,out)}`); }
