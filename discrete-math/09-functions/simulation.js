"use strict";

const args = process.argv.slice(2).map(Number);
const inputs = args.length ? args : [-2, -1, 0, 1, 2];
const f = x => x * x;
console.log("Function: f(x) = x squared");
inputs.forEach(x => console.log(`${x} -> ${f(x)}`));
console.log("Different inputs may share an output, but each input gets one output.");
