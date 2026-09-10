'use strict';

const given=process.argv.slice(2).map(Number), sides=given.length?given:[4,6,4,6]; const p=sides.reduce((a,b)=>a+b,0); console.log(`Sides: ${sides.join(' + ')}`); console.log(`Perimeter = ${p} units`);
