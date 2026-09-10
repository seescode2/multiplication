'use strict';

const degrees = Number(process.argv[2] ?? 90);
const turns = degrees / 360;
console.log(`${degrees}° is ${turns} of a full turn.`);
console.log(`That is ${degrees / 90} quarter-turn(s).`);
