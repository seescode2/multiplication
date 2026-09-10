"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 27: Eigenvalues");
const A=[[3,0],[0,2]];
for(const [name,v] of [["x direction",[1,0]],["y direction",[0,1]]]) { const out=matVec(A,v); const lambda=out.find((_,i)=>v[i]!==0)/v.find(x=>x!==0); console.log(`${name}: eigenvalue ${lambda}`); }
