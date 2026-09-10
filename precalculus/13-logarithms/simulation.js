'use strict';

const base=2;
for(let exponent=0;exponent<=8;exponent++) { const value=base**exponent; console.log(`${base}^${exponent} = ${value}; log base ${base} of ${value} = ${Math.log(value)/Math.log(base)}`); }
