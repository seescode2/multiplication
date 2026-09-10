"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 14: Shear Matrix");
const square=[[0,0],[1,0],[1,1],[0,1]];
for (const amount of [0, 0.5, 1]) {
 const H=[[1,amount],[0,1]]; console.log(`shear ${amount}:`, square.map(p=>matVec(H,p))); }
