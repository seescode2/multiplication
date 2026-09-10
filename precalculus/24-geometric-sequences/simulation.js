'use strict';

const first=5,ratio=2;
const term=n=>first*ratio**(n-1);
for(let n=1;n<=10;n++) console.log({n,term:term(n)});
