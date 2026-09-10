"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 28: Matrix Powers");
const A=[[1,1],[0,1]], v=[0,1];
for(let n=0;n<=5;n++){ const P=power(A,n); console.log(`A^${n} × ${v} = ${matVec(P,v)}`); }
