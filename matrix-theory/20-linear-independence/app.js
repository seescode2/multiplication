"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 20: Linear Independence");
for (const [a,b] of [[[1,0],[0,1]], [[1,2],[2,4]], [[1,1],[-1,1]]]) {
 const d=determinant2([[a[0],b[0]],[a[1],b[1]]]); console.log(`${a} and ${b}: det=${d}, independent=${d!==0}`); }
