"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 15: Reflection Matrix");
const v=[3,2];
const mirrors={"x-axis":[[1,0],[0,-1]], "y-axis":[[-1,0],[0,1]], "line y=x":[[0,1],[1,0]]};
for (const [name,M] of Object.entries(mirrors)) console.log(`${name}: ${v} -> ${matVec(M,v)}`);
