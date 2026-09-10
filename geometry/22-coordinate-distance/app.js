'use strict';

const n=process.argv.slice(2,6).map(Number),[x1,y1,x2,y2]=n.length===4?n:[1,2,4,6]; const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy); console.log(`From (${x1},${y1}) to (${x2},${y2})`); console.log(`Change: ${dx} across, ${dy} up`); console.log(`Distance = √(${dx}² + ${dy}²) = ${Number(d.toFixed(3))}`);
