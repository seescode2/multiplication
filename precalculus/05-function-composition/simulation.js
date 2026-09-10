'use strict';

const x=3, f=x=>x+2, g=x=>x*x;
console.log(`x = ${x}`);
console.log('f(g(x)):',f(g(x)));
console.log('g(f(x)):',g(f(x)));
