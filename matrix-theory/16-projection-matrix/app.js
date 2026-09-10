"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 16: Projection Matrix");
const P=[[1,0],[0,0]];
for (const v of [[3,2],[-1,4],[0,5]]) {
 const once=matVec(P,v), twice=matVec(P,once); console.log(`${v} -> ${once} -> ${twice}`); }
