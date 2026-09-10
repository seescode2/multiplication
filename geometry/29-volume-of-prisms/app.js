'use strict';

const l=Math.floor(Number(process.argv[2]??4)),w=Math.floor(Number(process.argv[3]??3)),h=Math.floor(Number(process.argv[4]??2)); console.log(`One layer has ${l} × ${w} = ${l*w} cubes.`); for(let i=1;i<=h;i++)console.log(`Layer ${i}: ${'■'.repeat(Math.max(0,l*w))}`); console.log(`Volume = ${l} × ${w} × ${h} = ${l*w*h} cubic units`);
