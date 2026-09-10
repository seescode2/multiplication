"use strict";

const number = Math.max(0, Math.floor(Number(process.argv[2]) || 13));
const binary = number.toString(2);
console.log(`${number} in binary is ${binary}`);
let total = 0;
[...binary].reverse().forEach((bit, place) => {
  const value = Number(bit) * 2 ** place; total += value;
  console.log(`${bit} * 2^${place} = ${value}`);
});
console.log("Total:", total);
