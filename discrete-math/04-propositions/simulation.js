"use strict";

const parse = (x, fallback) => x === undefined ? fallback : x === "true";
const p = parse(process.argv[2], true);
const q = parse(process.argv[3], false);
console.log({p, q});
console.log("NOT p:", !p);
console.log("p AND q:", p && q);
console.log("p OR q:", p || q);
