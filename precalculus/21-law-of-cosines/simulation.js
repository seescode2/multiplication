'use strict';

const a=5,b=8,angleC=60;
const c=Math.sqrt(a*a+b*b-2*a*b*Math.cos(angleC*Math.PI/180));
console.log({a,b,angleC,c:+c.toFixed(3)});
