'use strict';

const [a, b, c] = process.argv.slice(2, 5).map(Number).length === 3 ? process.argv.slice(2, 5).map(Number) : [3, 4, 5];
const isRight = Math.abs(a * a + b * b - c * c) < 1e-9;
console.log(`Legs: ${a}, ${b}; hypotenuse: ${c}`);
console.log(`${a}² + ${b}² ${isRight ? '=' : '≠'} ${c}², so this ${isRight ? 'is' : 'is not'} a right triangle.`);
