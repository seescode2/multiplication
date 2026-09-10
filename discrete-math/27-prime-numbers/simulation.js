"use strict";

const limit = Math.max(2, Number(process.argv[2]) || 50);
const prime = Array(limit + 1).fill(true); prime[0] = prime[1] = false;
for (let p = 2; p * p <= limit; p++) if (prime[p]) {
  for (let multiple = p * p; multiple <= limit; multiple += p) prime[multiple] = false;
}
console.log(`Primes up to ${limit}:`);
console.log(prime.map((yes, n) => yes ? n : null).filter(n => n !== null));
