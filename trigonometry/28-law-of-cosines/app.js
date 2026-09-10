'use strict';

const a = Number(process.argv[2] ?? 5);
const b = Number(process.argv[3] ?? 7);
const angleC = Number(process.argv[4] ?? 60);
const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angleC * Math.PI / 180));
console.log(`c² = ${a}² + ${b}² − 2(${a})(${b})cos(${angleC}°)`);
console.log(`c ≈ ${c.toFixed(3)}`);
