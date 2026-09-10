"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 30: Graph Adjacency Matrices");
const A=[[0,1,1],[1,0,1],[1,1,0]];
show("connections",A); show("walks of length 2",power(A,2));
console.log("Length-2 walks from node 1 to node 1:",power(A,2)[0][0]);
