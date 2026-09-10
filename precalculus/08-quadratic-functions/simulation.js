'use strict';

const a=1,h=2,k=-3;
const f=x=>a*(x-h)**2+k;
console.log(`Vertex is (${h}, ${k})`);
for(let x=h-4;x<=h+4;x++) console.log({x,y:f(x)});
