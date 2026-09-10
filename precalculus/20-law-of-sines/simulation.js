'use strict';

const sideA=10, angleA=40, angleB=65;
const sin=d=>Math.sin(d*Math.PI/180);
const sideB=sideA*sin(angleB)/sin(angleA);
console.log({sideA,angleA,angleB,sideB:+sideB.toFixed(3),angleC:180-angleA-angleB});
