'use strict';

const f=x=>3*x+6, inverse=y=>(y-6)/3;
for(const x of [-5,0,2,10]) console.log({x, after_f:f(x), undone:inverse(f(x))});
