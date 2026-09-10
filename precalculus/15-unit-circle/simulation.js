'use strict';

const degrees=[0,30,45,60,90,180,270,360];
for(const d of degrees){const r=d*Math.PI/180; console.log({degrees:d,x_cos:+Math.cos(r).toFixed(3),y_sin:+Math.sin(r).toFixed(3)});}
