'use strict';

const angle = ((Number(process.argv[2] ?? 140) % 360) + 360) % 360;
const quadrant = angle === 0 || angle === 90 || angle === 180 || angle === 270 ? 'on an axis' : angle < 90 ? 'I' : angle < 180 ? 'II' : angle < 270 ? 'III' : 'IV';
const sine = Math.sin(angle * Math.PI / 180), cosine = Math.cos(angle * Math.PI / 180);
const sign = value => Math.abs(value) < 1e-10 ? 'zero' : value > 0 ? 'positive' : 'negative';
console.log(`${angle}° is ${quadrant === 'on an axis' ? quadrant : `in Quadrant ${quadrant}`}.`);
console.log(`sine is ${sign(sine)}; cosine is ${sign(cosine)}.`);
