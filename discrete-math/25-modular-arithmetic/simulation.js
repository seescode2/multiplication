"use strict";

const value = Number(process.argv[2]) || 17;
const modulus = Math.max(1, Number(process.argv[3]) || 5);
const remainder = ((value % modulus) + modulus) % modulus;
console.log(`${value} mod ${modulus} = ${remainder}`);
console.log("Numbers in the same remainder class:");
console.log(Array.from({length: 7}, (_, i) => remainder + (i - 3) * modulus));
