'use strict';

const x=Number(process.argv[2]??3),y=Number(process.argv[3]??2),k=Number(process.argv[4]??2); console.log(`Point (${x}, ${y}), scale factor ${k}`); console.log(`Image: (${x*k}, ${y*k})`); console.log(k>1?'The point moved farther away.':k<1?'The point moved closer.':'The point did not move.');
