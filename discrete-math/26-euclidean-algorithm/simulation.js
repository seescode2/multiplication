"use strict";

let a = Math.abs(Number(process.argv[2]) || 84);
let b = Math.abs(Number(process.argv[3]) || 30);
while (b !== 0) {
  const remainder = a % b;
  console.log(`${a} = ${Math.floor(a/b)} * ${b} + ${remainder}`);
  [a, b] = [b, remainder];
}
console.log("Greatest common divisor:", a);
