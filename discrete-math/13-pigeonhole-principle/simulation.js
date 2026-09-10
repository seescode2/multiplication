"use strict";

const objects = Math.max(0, Number(process.argv[2]) || 10);
const boxes = Math.max(1, Number(process.argv[3]) || 3);
const counts = Array(boxes).fill(0);
for (let i = 0; i < objects; i++) counts[i % boxes]++;
console.log(`${objects} objects placed into ${boxes} boxes:`, counts);
console.log("Some box must contain at least", Math.ceil(objects / boxes), "object(s).");
