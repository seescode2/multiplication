"use strict";

const n = Math.max(1, Number(process.argv[2]) || 8);
let sum = 0;
for (let k = 1; k <= n; k++) {
  sum += k;
  const formula = k * (k + 1) / 2;
  console.log(`n=${k}: direct sum=${sum}, formula=${formula}, match=${sum === formula}`);
}
console.log("Each step adds the next number, matching the formula's next value.");
