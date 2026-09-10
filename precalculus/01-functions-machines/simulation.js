'use strict';

const inputs = [-2,-1,0,1,2];
const rule = x => 2*x+3;
console.log('Rule: f(x) = 2x + 3');
for (const x of inputs) console.log(`f(${x}) = ${rule(x)}`);
