'use strict';

const slope=3, intercept=-2;
for(let x=0;x<=5;x++) console.log({x,y:slope*x+intercept});
console.log('Each step changes y by',slope);
