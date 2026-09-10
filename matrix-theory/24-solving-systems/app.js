"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 24: Solving Linear Systems");
const A=[[2,1],[1,-1]], b=[7,2];
const x=matVec(inverse2(A),b); show("A",A); console.log("b =",b,"solution x =",x.map(round)); console.log("check Ax =",matVec(A,x).map(round));
