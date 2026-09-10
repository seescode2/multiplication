"use strict";

console.log("Checking De Morgan's law: NOT(p AND q) = (NOT p) OR (NOT q)");
for (const p of [true, false]) for (const q of [true, false]) {
  const left = !(p && q), right = !p || !q;
  console.log({p, q, left, right, equal: left === right});
}
console.log("The two expressions match in every row, so they are equivalent.");
