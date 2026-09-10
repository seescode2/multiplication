'use strict';

const degrees=[0,30,45,60,90,180,270,360];
for(const d of degrees) console.log(`${d} degrees = ${(d*Math.PI/180).toFixed(4)} radians = ${d}/180 * pi`);
