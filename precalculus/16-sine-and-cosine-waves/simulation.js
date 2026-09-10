'use strict';

const steps=16;
for(let i=0;i<=steps;i++){const x=2*Math.PI*i/steps; console.log({radians:+x.toFixed(3),sin:+Math.sin(x).toFixed(3),cos:+Math.cos(x).toFixed(3)});}
