"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 19: Span");
const a=[1,0], b=[1,1];
for (let s=-1;s<=1;s++) for(let t=-1;t<=1;t++) console.log(`${s}a + ${t}b = [${s*a[0]+t*b[0]}, ${s*a[1]+t*b[1]}]`);
