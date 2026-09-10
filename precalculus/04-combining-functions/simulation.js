'use strict';

const x=4, f=x=>x+1, g=x=>2*x;
console.log({x, f:f(x), g:g(x), add:f(x)+g(x), subtract:f(x)-g(x), multiply:f(x)*g(x), divide:f(x)/g(x)});
