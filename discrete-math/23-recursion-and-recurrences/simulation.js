"use strict";

const n = Math.max(0, Number(process.argv[2]) || 10);
const values = [0, 1];
for (let i = 2; i <= n; i++) values[i] = values[i - 1] + values[i - 2];
console.log(`F(0) through F(${n}):`, values.slice(0, n + 1));
for (let i = 2; i <= n; i++) console.log(`F(${i}) = ${values[i-1]} + ${values[i-2]} = ${values[i]}`);
