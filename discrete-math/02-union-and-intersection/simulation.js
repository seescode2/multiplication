"use strict";

const A = new Set([1, 2, 3, 4]);
const B = new Set([3, 4, 5]);
const union = new Set([...A, ...B]);
const intersection = new Set([...A].filter(x => B.has(x)));
console.log("A =", [...A], "B =", [...B]);
console.log("A union B =", [...union]);
console.log("A intersection B =", [...intersection]);
