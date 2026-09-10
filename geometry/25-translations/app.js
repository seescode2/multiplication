'use strict';

const n=process.argv.slice(2,6).map(Number),[x,y,dx,dy]=n.length===4?n:[2,3,4,-1]; console.log(`Start: (${x}, ${y})`); console.log(`Slide by <${dx}, ${dy}>`); console.log(`Finish: (${x+dx}, ${y+dy})`);
