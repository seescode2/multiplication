'use strict';

const r=Number(process.argv[2]??3),a=Math.PI*r*r; console.log(`A = π × ${r} × ${r}`); console.log(`A ≈ ${a.toFixed(2)} square units`); console.log(`The radius square is ${r*r}.`);
