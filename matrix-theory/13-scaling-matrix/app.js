"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 13: Scaling Matrix");
const point=[2,3];
for (const [sx,sy] of [[2,2],[2,0.5],[-1,1]]) {
 const S=[[sx,0],[0,sy]]; console.log(`scale (${sx},${sy}): ${point} -> ${matVec(S,point)}`); }
