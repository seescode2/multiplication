'use strict';

const w=Math.max(1,Math.floor(Number(process.argv[2]??5))),h=Math.max(1,Math.floor(Number(process.argv[3]??3))); for(let y=0;y<h;y++)console.log('□ '.repeat(w)); console.log(`${w} columns × ${h} rows = ${w*h} square units`);
