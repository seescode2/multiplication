"use strict";

console.log("p     q     p -> q");
for (const p of [true, false]) {
  for (const q of [true, false]) {
    console.log(String(p).padEnd(6), String(q).padEnd(6), !p || q);
  }
}
