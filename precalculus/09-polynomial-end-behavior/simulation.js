'use strict';

const full=x=>2*x**3-5*x**2+x-7, leading=x=>2*x**3;
for(const x of [-100,-10,-2,2,10,100]) console.log({x,full:full(x),leading:leading(x),ratio:full(x)/leading(x)});
