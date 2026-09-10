'use strict';

const r=Number(process.argv[2]??5),c=2*Math.PI*r; console.log(`C = 2 × π × radius`); console.log(`C = 2 × π × ${r} ≈ ${c.toFixed(2)} units`); console.log(`One trip around is a little more than ${Math.floor(c)} units.`);
