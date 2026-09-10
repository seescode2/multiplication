"use strict";
const {show, zeros, identity, add, scale, transpose, multiply, matVec, equal, determinant2, inverse2, norm, round, power, rank, parallel} = require("../shared");

console.log("Lab 29: Markov Matrices");
const M=[[0.8,0.3],[0.2,0.7]]; let state=[1,0];
for(let day=0;day<=8;day++){ console.log(`day ${day}:`,state.map(round),"sum",round(state.reduce((a,b)=>a+b,0))); state=matVec(M,state); }
