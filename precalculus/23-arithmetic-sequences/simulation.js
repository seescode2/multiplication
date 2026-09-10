'use strict';

const first=4,difference=3;
const term=n=>first+(n-1)*difference;
for(let n=1;n<=10;n++) console.log({n,term:term(n)});
