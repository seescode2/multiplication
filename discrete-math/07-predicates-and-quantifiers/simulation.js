"use strict";

const args = process.argv.slice(2).map(Number);
const numbers = args.length ? args : [2, 4, 7];
const isEven = n => n % 2 === 0;
console.log("Numbers:", numbers);
console.log("Every number is even:", numbers.every(isEven));
console.log("Some number is even:", numbers.some(isEven));
console.log("Witnesses for 'some':", numbers.filter(isEven));
