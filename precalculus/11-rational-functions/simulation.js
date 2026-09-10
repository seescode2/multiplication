'use strict';

const center=2, f=x=>1/(x-center);
for(const distance of [1,.5,.1,.01]) console.log({left:f(center-distance),right:f(center+distance)});
console.log(`x = ${center} is not allowed (division by zero).`);
