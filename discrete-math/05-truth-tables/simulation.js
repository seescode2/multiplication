"use strict";

console.log("p     q     p AND q   p OR q");
for (const p of [true, false]) {
  for (const q of [true, false]) {
    console.log(String(p).padEnd(6), String(q).padEnd(6), String(p && q).padEnd(9), p || q);
  }
}
