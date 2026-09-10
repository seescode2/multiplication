'use strict';

const terms=10, nth=n=>n*n+1;
for(let n=1;n<=terms;n++) console.log({position:n,term:nth(n)});
