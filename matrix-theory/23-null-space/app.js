"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 23: Null Space");
const A=[[1,2],[2,4]];
console.log("Testing multiples of [-2,1]");
for(const t of [-2,-1,0,1,2]) { const v=[-2*t,t]; console.log(`${v} -> ${matVec(A,v)}`); }
