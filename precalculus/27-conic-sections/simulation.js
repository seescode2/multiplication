'use strict';

const shape='ellipse', points=[];
for(let i=0;i<8;i++){const t=2*Math.PI*i/8; if(shape==='circle') points.push([3*Math.cos(t),3*Math.sin(t)]); if(shape==='ellipse') points.push([5*Math.cos(t),2*Math.sin(t)]); if(shape==='hyperbola'){const x=1+i/2;points.push([x,Math.sqrt(x*x-1)]);}}
console.log(shape,points.map(([x,y])=>[+x.toFixed(2),+y.toFixed(2)]));
