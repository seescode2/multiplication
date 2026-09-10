'use strict';

const last=10, term=n=>n*n;
let sum=0;
for(let n=1;n<=last;n++){sum+=term(n); console.log({n,added:term(n),runningTotal:sum});}
console.log(`Sigma from 1 to ${last} = ${sum}`);
