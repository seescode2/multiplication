'use strict';

const inputs = [-4,-1,0,1,4,9,16];
const allowed = x => x >= 0;
const domain = inputs.filter(allowed);
const range = domain.map(Math.sqrt);
console.log('Rule: y = sqrt(x)');
console.log('Allowed domain samples:', domain);
console.log('Resulting range samples:', range);
