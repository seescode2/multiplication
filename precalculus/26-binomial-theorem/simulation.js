'use strict';

const power=5;
let row=[1];
for(let n=1;n<=power;n++){const next=[1]; for(let i=1;i<row.length;i++) next.push(row[i-1]+row[i]); next.push(1); row=next;}
console.log(`Coefficients of (a + b)^${power}:`,row);
