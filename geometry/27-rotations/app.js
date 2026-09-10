'use strict';

let x=Number(process.argv[2]??3),y=Number(process.argv[3]??1),deg=((Number(process.argv[4]??90)%360)+360)%360; let out=deg===90?[-y,x]:deg===180?[-x,-y]:deg===270?[y,-x]:[x,y]; console.log(`Rotate (${x}, ${y}) ${deg}° counterclockwise.`); console.log(`Image: (${out[0]}, ${out[1]})`);
