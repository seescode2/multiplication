'use strict';

const amplitude = Number(process.argv[2] ?? 2);
const angle = Number(process.argv[3] ?? 90);
const basic = Math.sin(angle * Math.PI / 180);
console.log(`Basic sine height at ${angle}°: ${basic.toFixed(3)}`);
console.log(`With amplitude ${amplitude}: ${amplitude} × ${basic.toFixed(3)} = ${(amplitude * basic).toFixed(3)}`);
