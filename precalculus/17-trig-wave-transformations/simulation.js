'use strict';

const amplitude=2, period=4, midline=1;
const f=x=>amplitude*Math.sin(2*Math.PI*x/period)+midline;
for(let x=0;x<=period;x+=period/8) console.log({x,y:+f(x).toFixed(3)});
console.log({maximum:midline+Math.abs(amplitude),minimum:midline-Math.abs(amplitude)});
