"use strict";

const multiplesOf2 = new Set([1,2,3,4,5,6,7,8,9,10].filter(x => x % 2 === 0));
const multiplesOf3 = new Set([1,2,3,4,5,6,7,8,9,10].filter(x => x % 3 === 0));
const overlap = [...multiplesOf2].filter(x => multiplesOf3.has(x));
console.log("Multiples of 2:", [...multiplesOf2]);
console.log("Multiples of 3:", [...multiplesOf3]);
console.log(`${multiplesOf2.size} + ${multiplesOf3.size} - ${overlap.length} = ${multiplesOf2.size + multiplesOf3.size - overlap.length} numbers total`);
