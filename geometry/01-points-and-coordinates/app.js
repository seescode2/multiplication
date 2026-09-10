'use strict';

const x = Number(process.argv[2] ?? 3); const y = Number(process.argv[3] ?? 2);
console.log(`Point P is at (${x}, ${y}).`);
for (let row=5; row>=0; row--) console.log(Array.from({length:6},(_,col)=>col===x&&row===y?' P ':' · ').join(''));
console.log('Across first, then up: x comes before y.');
