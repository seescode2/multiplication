"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 21: Basis");
const basis=[[1,1],[1,-1]], v=[5,1];
const B=[[basis[0][0],basis[1][0]],[basis[0][1],basis[1][1]]];
const coords=matVec(inverse2(B),v); console.log("basis vectors:",basis); console.log(`${v} has basis coordinates`,coords.map(round));
console.log("reconstructed:",matVec(B,coords).map(round));
