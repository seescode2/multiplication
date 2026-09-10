"use strict";

const trials = Math.max(1, Number(process.argv[2]) || 10000);
let sixes = 0;
for (let i = 0; i < trials; i++) if (1 + Math.floor(Math.random() * 6) === 6) sixes++;
console.log(`Rolled a die ${trials} times.`);
console.log("Sixes:", sixes);
console.log("Experimental probability:", (sixes / trials).toFixed(4));
console.log("Expected probability:", (1 / 6).toFixed(4));
