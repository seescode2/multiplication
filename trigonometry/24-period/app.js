'use strict';

const b = Number(process.argv[2] ?? 2);
const period = 360 / Math.abs(b);
console.log(`For y = sin(${b}x):`);
console.log(`Period = 360 ÷ |${b}| = ${period}°.`);
console.log(`The wave completes ${Math.abs(b)} cycle(s) from 0° to 360°.`);
