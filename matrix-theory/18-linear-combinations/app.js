"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 18: Linear Combinations");
const columns=[[1,2],[3,1]], weights=[2,-1];
const result=columns[0].map((_,i)=>weights[0]*columns[0][i]+weights[1]*columns[1][i]);
console.log(`${weights[0]} × ${columns[0]} + ${weights[1]} × ${columns[1]} = ${result}`);
