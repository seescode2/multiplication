'use strict';

const original = Number(process.argv[2] ?? 210);
const angle = ((original % 360) + 360) % 360;
const reference = angle <= 90 ? angle : angle <= 180 ? 180 - angle : angle <= 270 ? angle - 180 : 360 - angle;
console.log(`${original}° lands at ${angle}° after full turns are removed.`);
console.log(`Its reference angle is ${reference}°.`);
