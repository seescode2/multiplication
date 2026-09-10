'use strict';

const f=x=>(x-2)*(x+1)*(x-4);
for(let x=-3;x<=6;x++) console.log(`${x}: ${f(x)}${f(x)===0?'  <-- root':''}`);
