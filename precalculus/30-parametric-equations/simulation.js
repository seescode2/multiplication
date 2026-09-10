'use strict';

const x=t=>3*Math.cos(t), y=t=>2*Math.sin(t);
for(let i=0;i<=12;i++){const t=2*Math.PI*i/12; console.log({t:+t.toFixed(2),x:+x(t).toFixed(2),y:+y(t).toFixed(2)});}
