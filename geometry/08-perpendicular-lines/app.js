'use strict';

const a=Number(process.argv[2]??2),b=Number(process.argv[3]??-.5), product=a*b; console.log(`Slopes: ${a} and ${b}`); console.log(Math.abs(product+1)<1e-9?'Product is -1 → perpendicular.':'Product is not -1 → not perpendicular.'); console.log('Perpendicular lines meet at 90°.');
