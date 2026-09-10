"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 25: Row Operations");
let A=[[1,2,5],[3,4,11]]; show("augmented matrix",A);
A=[A[0],A[1].map((x,j)=>x-3*A[0][j])]; show("R2 ← R2 - 3R1",A);
A=[A[0],A[1].map(x=>x/-2)]; show("R2 ← R2 ÷ -2",A);
A=[A[0].map((x,j)=>x-2*A[1][j]),A[1]]; show("R1 ← R1 - 2R2",A);
