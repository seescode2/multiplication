'use strict';

const n=process.argv.slice(2,6).map(Number),[x1,y1,x2,y2]=n.length===4?n:[2,1,8,5]; const x=(x1+x2)/2,y=(y1+y2)/2; console.log(`Endpoints: (${x1},${y1}) and (${x2},${y2})`); console.log(`Midpoint = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${x},${y})`);
