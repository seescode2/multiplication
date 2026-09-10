'use strict';

const d=Number(process.argv[2]??65); const type=d===0?'zero':d<90?'acute':d===90?'right':d<180?'obtuse':d===180?'straight':d<360?'reflex':'full turn';
console.log(`∠A = ${d}°`); console.log(`This is a ${type} angle.`); console.log('0° ─ acute ─ 90° ─ obtuse ─ 180°');
